import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { REPORTS_CMD, USER_CMD } from '../../constants';
import { UsersTopSaleQueryDto } from '../users-order/dto/users-top-sale-query.dto';
import { HistoryOrderDto } from '../users-order/dto/history-order.dto';
import { TCPService } from 'apps/web-microservice/src/constants';
import { createUserDto } from '../users/dto/create-users.dto';

@Injectable()
export class ReportsService {
  @Inject(TCPService.BOOKS) private readonly reportsServiceTCP: ClientProxy;

  async getHistoryByOrder(query: HistoryOrderDto): Promise<HistoryOrderDto> {
    return lastValueFrom(
      this.reportsServiceTCP.send(
        {
          cmd: REPORTS_CMD,
          method: 'getHistoryByOrder',
        },
        {
          body: query,
        },
      ),
    );
  }

  async getTopUserBought(
    query: UsersTopSaleQueryDto,
  ): Promise<UsersTopSaleQueryDto> {
    return lastValueFrom(
      this.reportsServiceTCP.send(
        {
          cmd: REPORTS_CMD,
          method: 'getTopUserBought',
        },
        query,
      ),
    );
  }

  async getAmouthUsers(query: createUserDto): Promise<number> {
    return lastValueFrom(
      this.reportsServiceTCP.send(
        {
          cmd: USER_CMD,
          method: 'amouth-users',
        },
        query,
      ),
    );
  }
}
