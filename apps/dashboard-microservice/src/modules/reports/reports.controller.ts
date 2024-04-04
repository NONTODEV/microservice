import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  LoggerService,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';
import usersOrderHistoryQueryEntity from './entities/users-order-history-query.entity';
import { usersInterface } from '../users/interfaces/users.interface';
import { UsersTopSaleQueryDto } from '../users-order/dto/users-top-sale-query.dto';
import { UsersService } from '../users/users.service';
import { userLoginInterface } from '../users/interfaces/userlogin.interface';
import { JwtRoleGuard } from '../auth/guards/jwt-role.guard';
import { HistoryOrderDto } from '../users-order/dto/history-order.dto';
import { UseRoles } from '@lib/commom/decorators/role.decorator';
import { RolesUserEnum } from '@lib/commom/enum/roles-user.enum';
import { UsersQueryDto } from '../users/dto/users-query.dto';
import { UsersQueryEntity } from '../users/entities/users-query.entity';

@Controller('reports')
@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ReportsController {
  private readonly logger: LoggerService = new Logger(ReportsController.name);

  constructor(
    private readonly reportsservice: ReportsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('history')
  @ApiBearerAuth()
  @UseRoles(RolesUserEnum.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: usersOrderHistoryQueryEntity,
  })
  async getHistoryByOrder(
    @Query() query: HistoryOrderDto,
  ): Promise<HistoryOrderDto> {
    try {
      return this.reportsservice.getHistoryByOrder(query);
    } catch (e) {
      this.logger.error(
        `catch on top-sale: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('topSale-userOrder')
  @ApiBearerAuth()
  @UseRoles(RolesUserEnum.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getUserTopSale(
    @Query() query: UsersTopSaleQueryDto,
  ): Promise<UsersTopSaleQueryDto> {
    try {
      return this.reportsservice.getTopUserBought(query);
    } catch (e) {
      this.logger.error(
        `catch on top-sale: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('report-new-user')
  @ApiBearerAuth()
  @UseRoles(RolesUserEnum.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  async reportNewUser(): Promise<usersInterface> {
    try {
      const newUsers = await this.usersService.findNewUser();
      if (!Array.isArray(newUsers) || newUsers.length === 0) {
        throw new BadRequestException('No new users found');
      }
      return newUsers;
    } catch (e) {
      this.logger.error(
        `catch on report-new-user: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('report-login-user')
  @ApiBearerAuth()
  @UseRoles(RolesUserEnum.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  async findLoggedInUsers(): Promise<userLoginInterface> {
    try {
      const newUsers = await this.usersService.findLoggedInUsers();
      if (!Array.isArray(newUsers) || newUsers.length === 0) {
        throw new BadRequestException('No new users found');
      }
      return newUsers;
    } catch (e) {
      this.logger.error(
        `catch on report-new-user: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('pagination-users')
  @UseRoles(RolesUserEnum.ADMIN)
  @UseGuards(JwtRoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UsersQueryEntity,
  })
  async getPaginationUser(
    @Query() query: UsersQueryDto,
  ): Promise<UsersQueryEntity> {
    try {
      return this.usersService.getPaginationUsers(query);
    } catch (e) {
      this.logger.error(
        `catch on getPaginationUser: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }
}
