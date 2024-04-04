import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModule } from '../books/books.module';
import { BooksStockModule } from '../books-stock/books-stock.module';
import { OrdersModule } from '../orders/orders.module';
import { ReportsModule } from '../reports/reports.module';
import { mongooseModuleAsyncOptions } from '../../mongoose.providers';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
    BooksModule,
    BooksStockModule,
    OrdersModule,
    ReportsModule,
  ],
})
export class AppModule {}
