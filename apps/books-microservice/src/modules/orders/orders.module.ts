import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.microservice';
import { OrdersService } from './orders.service';
import { model } from '../models/model';
import { DB_CONNECTION_NAME } from '../../constants';

@Module({
  imports: [MongooseModule.forFeature(model, DB_CONNECTION_NAME)],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersModule],
})
export class OrdersModule {}
