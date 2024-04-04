import {
  Controller,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ordersInterface } from './interfaces/orders.interfaces';
import { Document } from 'mongoose';
import { topSellerInterface } from './interfaces/top-seller.interface';
import { topSellerByCategoryInterface } from './interfaces/top-seller-category.interface';
import { getUsersOrderInterface } from './interfaces/get-users-order.inteface';
import { ORDERS_CMD } from '../../constants';
import {
  PaginationInterface,
  PaginationResponseInterface,
} from '../interfaces/pagination.interface';
import { FindOptionsInterface } from '../interfaces/find-options.interface';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({
    cmd: ORDERS_CMD,
    method: 'create-order',
  })
  async createOrder(@Payload() payload: ordersInterface): Promise<void> {
    try {
      await this.ordersService.getOrdersModel().create(payload);
    } catch (e) {
      this.logger.error(
        `catch on createOrder: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: ORDERS_CMD,
    method: 'getUsersOrder',
  })
  async getUserOrder(
    @Payload()
    payload: PaginationInterface & FindOptionsInterface<Document>,
  ): Promise<PaginationResponseInterface<getUsersOrderInterface>> {
    const { page, perPage } = payload;
    try {
      const [records, count] = await Promise.all([
        this.ordersService.getUserOrder({
          page,
          perPage,
        }),
        this.ordersService.countGetUsersOrder({
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
        `catch on getUserOrder: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: ORDERS_CMD,
    method: 'topSeller',
  })
  async topSeller(): Promise<topSellerInterface[]> {
    try {
      return this.ordersService.topSeller();
    } catch (e) {
      this.logger.error(
        `catch on createOrder: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: ORDERS_CMD,
    method: 'topSellerBycategory',
  })
  async topSellerBycategory(): Promise<topSellerByCategoryInterface[]> {
    try {
      return this.ordersService.topSellerByCategory();
    } catch (e) {
      this.logger.error(
        `catch on createOrder: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }
}
