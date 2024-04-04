import {
  Controller,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { getUserOrderBoughtInterface } from './interface/get-top-users-bought.interface';
import { userOrderBoughtInterface } from './interface/history-order-users.interface';
import { REPORTS_CMD } from '../../constants';
import {
  PaginationInterface,
  PaginationResponseInterface,
} from '../interfaces/pagination.interface';
import { FindOptionsInterface } from '../interfaces/find-options.interface';

@Controller('report')
export class ReportsController {
  private readonly logger = new Logger(ReportsController.name);
  constructor(private readonly reportsService: ReportsService) {}

  @MessagePattern({
    cmd: REPORTS_CMD,
    method: 'getHistoryByOrder',
  })
  async getHistoryByOrder(
    @Payload()
    payload: {
      body: PaginationInterface & FindOptionsInterface<Document>;
    },
  ): Promise<PaginationResponseInterface<userOrderBoughtInterface>> {
    const { body } = payload;
    const { page, perPage } = body;

    try {
      const [records, count] = await Promise.all([
        this.reportsService.getHistoryOrder({
          page,
          perPage,
        }),
        this.reportsService.countHistoryByOrder({
          page,
          perPage,
        }),
      ]);

      return {
        page,
        perPage,
        count,
        records,
      };
    } catch (e) {
      this.logger.error(
        `catch on getHistoryByOrder: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: REPORTS_CMD,
    method: 'getHistoryByOrderForUser',
  })
  async getHistoryByOrderForUser(
    @Payload()
    payload: {
      objectId: string;
      body: PaginationInterface & FindOptionsInterface<Document>;
    },
  ): Promise<PaginationResponseInterface<userOrderBoughtInterface>> {
    const { objectId, body } = payload;
    const { page, perPage } = body;

    try {
      const [records, count] = await Promise.all([
        this.reportsService.getHistoryOrderForUser(objectId, {
          page,
          perPage,
        }),
        this.reportsService.countHistoryByOrderForUser(objectId, {
          page,
          perPage,
        }),
      ]);

      return {
        page,
        perPage,
        count,
        records,
      };
    } catch (e) {
      this.logger.error(
        `catch on getHistoryByOrderForUsers: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: REPORTS_CMD,
    method: 'getTopUserBought',
  })
  async getTopUserBought(
    @Payload()
    payload: PaginationInterface & FindOptionsInterface<Document>,
  ): Promise<PaginationResponseInterface<getUserOrderBoughtInterface>> {
    const { page, perPage } = payload;
    try {
      const [records, count] = await Promise.all([
        this.reportsService.getTopUserBought({
          page,
          perPage,
        }),
        this.reportsService.countGetTopUserBought({
          page,
          perPage,
        }),
      ]);

      return {
        page,
        perPage,
        count,
        records,
      };
    } catch (e) {
      this.logger.error(
        `catch on getTopUserBought: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }
}
