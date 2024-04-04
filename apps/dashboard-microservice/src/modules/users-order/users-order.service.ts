import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateOrderInterface } from './interfaces/create-order.interface';
import { RMQService, ORDERS_CMD } from '../../constants';
import { UsersOrderQueryDto } from './dto/users-order-query.dto';
import { getUsersOrderInterface } from './interfaces/get-users-order.inteface';
import { topSellerInterface } from './interfaces/top-seller.interface';
import { topSellerByCategoryInterface } from './interfaces/top-seller-category.interface';
import { TCPService } from 'apps/web-microservice/src/constants';

@Injectable()
export class UsersOrderService {
  @Inject(RMQService.BOOKS) private readonly usersOrderServiceRMQ: ClientProxy;
  @Inject(TCPService.BOOKS) private readonly userOrderServiceTCP: ClientProxy;

  async createOrder(body: CreateOrderInterface) {
    return this.usersOrderServiceRMQ.emit(
      {
        cmd: ORDERS_CMD,
        method: 'create-order',
      },
      body,
    );
  }

  async getUsersOrder(
    query: UsersOrderQueryDto,
  ): Promise<getUsersOrderInterface> {
    return lastValueFrom(
      this.userOrderServiceTCP.send(
        {
          cmd: ORDERS_CMD,
          method: 'getUsersOrder',
        },
        query,
      ),
    );
  }

  async topSeller(): Promise<topSellerInterface> {
    return lastValueFrom(
      this.userOrderServiceTCP.send(
        {
          cmd: ORDERS_CMD,
          method: 'topSeller',
        },
        {},
      ),
    );
  }

  async topSellerBycategory(): Promise<topSellerByCategoryInterface> {
    return lastValueFrom(
      this.userOrderServiceTCP.send(
        {
          cmd: ORDERS_CMD,
          method: 'topSellerBycategory',
        },
        {},
      ),
    );
  }
}
