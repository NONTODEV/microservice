import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { BooksStockService } from '../books-stock/books-stock.service';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { UsersService } from '../users/users.service';
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
  controllers: [ReportsController],
  providers: [BooksStockService, ReportsService, UsersService],
})
export class ReportsModule {}
