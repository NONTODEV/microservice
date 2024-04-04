import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { ordersInterface } from './interfaces/orders.interface';
import { UsersHistoryQueryDto } from './dto/users-history-query.dto';
import UsersOrderHistoryQueryEntity from './entities/users-order-history-query.entity';
import {
  ORDERS_CMD,
  REPORTS_CMD,
  RMQService,
  TCPService,
} from '../../constants';

@Injectable()
export class OrdersService {
  @Inject(RMQService.BOOKS) private readonly ordersServiceRMQ: ClientProxy;
  @Inject(TCPService.BOOKS) private readonly ordersServiceTCP: ClientProxy;

  createOrder(body: ordersInterface): Observable<ordersInterface> {
    return this.ordersServiceRMQ.emit(
      {
        cmd: ORDERS_CMD,
        method: 'create-order',
      },
      body,
    );
  }

  async getHistoryByOrderForUser(
    objectId: string,
    query: UsersHistoryQueryDto,
  ): Promise<UsersOrderHistoryQueryEntity> {
    return lastValueFrom(
      this.ordersServiceTCP.send(
        {
          cmd: REPORTS_CMD,
          method: 'getHistoryByOrderForUser',
        },
        {
          objectId,
          body: query,
        },
      ),
    );
  }
}
