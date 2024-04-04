import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_CONNECTION_NAME } from '../../constants';
import { ReportsController } from './reports.microservice';
import { ReportsService } from './reports.service';
import { model } from '../models/model';

@Module({
  imports: [MongooseModule.forFeature(model, DB_CONNECTION_NAME)],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
