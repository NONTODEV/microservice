import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BooksStockService } from './books-stock.service';
import { BooksStockController } from './books-stock.controller';
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
    ClientsModule.register([ConnectRMQ(RMQService.BOOKS)]),
  ],
  controllers: [BooksStockController],
  providers: [BooksStockService],
  exports: [BooksStockService],
})
export class BooksStockModule {}
