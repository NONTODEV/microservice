import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksStockService } from './books-stock.service';
import { BooksStockMicroservice } from './books-stock.microservice';
import { DB_CONNECTION_NAME } from '../../constants';
import { model } from '../models/model';

@Module({
  imports: [MongooseModule.forFeature(model, DB_CONNECTION_NAME)],
  controllers: [BooksStockMicroservice],
  providers: [BooksStockService],
  exports: [BooksStockService],
})
export class BooksStockModule {}
