import {
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
import { UsersOrderService } from '../users-order/users-order.service';
import { UsersOrderQueryDto } from './dto/users-order-query.dto';
import { JwtRoleGuard } from '../auth/guards/jwt-role.guard';
import { getUsersOrderInterface } from './interfaces/get-users-order.inteface';
import { topSellerInterface } from './interfaces/top-seller.interface';
import { topSellerByCategoryInterface } from './interfaces/top-seller-category.interface';
import { UseRoles } from '@lib/commom/decorators/role.decorator';
import { RolesUserEnum } from '@lib/commom/enum/roles-user.enum';

@Controller('user-orders')
@ApiTags('order')
@ApiBearerAuth()
@UseRoles(RolesUserEnum.ADMIN)
@UseGuards(JwtAuthGuard, JwtRoleGuard)
export class userOrderController {
  private readonly logger: LoggerService = new Logger(userOrderController.name);

  constructor(private readonly userOrderService: UsersOrderService) {}

  @Get('userOrder')
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getUsersOrder(
    @Query() query: UsersOrderQueryDto,
  ): Promise<getUsersOrderInterface> {
    try {
      return this.userOrderService.getUsersOrder(query);
    } catch (e) {
      this.logger.error(
        `catch on getUsersOrder: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('top-sale')
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async reportTopSale(): Promise<topSellerInterface> {
    try {
      return this.userOrderService.topSeller();
    } catch (e) {
      this.logger.error(
        `catch on top-sale: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('top-sale-category')
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getTopSaleByGenre(): Promise<topSellerByCategoryInterface> {
    try {
      return this.userOrderService.topSellerBycategory();
    } catch (e) {
      this.logger.error(
        `catch on top-sale: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }
}
