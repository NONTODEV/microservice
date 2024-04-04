import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_CONNECTION_NAME } from '../../constants';
import { model } from '../models/model';

@Module({
  imports: [
    MongooseModule.forFeature(model, DB_CONNECTION_NAME),
    PassportModule,
  ],
  controllers: [],
  providers: [AuthService, JwtService, UsersService, ConfigService],
})
export class AuthModule {}
