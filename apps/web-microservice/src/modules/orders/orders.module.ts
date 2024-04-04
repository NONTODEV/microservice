import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { BooksStockService } from '../books-stock/books-stock.service';
import { BooksService } from '../books/books.service';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import registerCacheOptions from '../../cache.providers';
import { RMQService } from '../../constants';
import { ConnectRMQ } from '@lib/commom/makeservice.provider';

@Module({
  imports: [
    JwtModule,
    PassportModule,
    ConfigModule.forRoot(),
    CacheModule.registerAsync(registerCacheOptions),
    ClientsModule.register([
      ConnectRMQ(RMQService.USERS),
      ConnectRMQ(RMQService.BOOKS),
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, BooksStockService, BooksService],
})
export class OrdersModule {}
