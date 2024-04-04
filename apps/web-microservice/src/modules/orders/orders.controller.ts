import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { createOrderBooksValidationPipe } from './pipe/buy-books-validation.pipe';
import { createOrderDTO } from './dto/create-order.dto';
import { usersInterface } from '../users/interfaces/users.interface';
import { BooksStockService } from '../books-stock/books-stock.service';
import usersOrderHistoryQueryEntity from './entities/users-order-history-query.entity';
import { UsersHistoryQueryDto } from './dto/users-history-query.dto';
import { JwtRoleGuard } from '../auth/guards/jwt-role.guard';
import { UseRoles } from '@lib/commom/decorators/role.decorator';
import { RolesUserEnum } from '@lib/commom/enum/roles-user.enum';
import ReqUser from '@lib/commom/decorators/req-user.decorator';

@Controller('orders')
@ApiTags('user')
@ApiBearerAuth()
@UseRoles(RolesUserEnum.USER, RolesUserEnum.ADMIN)
@UseGuards(JwtAuthGuard, JwtRoleGuard)
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);
  constructor(
    private readonly ordersService: OrdersService,
    private readonly booksStockService: BooksStockService,
  ) {}

  @Post('buy-book')
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async buyBook(
    @Body(createOrderBooksValidationPipe) body: createOrderDTO,
    @ReqUser() user: usersInterface,
  ): Promise<{ message: string }> {
    const { book, bookStock, quantity } = body;
    try {
      await this.ordersService.createOrder({
        userId: user.userId,
        bookStockId: bookStock.bookId,
        quantity: body.quantity,
        totalPrice: book.price * body.quantity,
      });

      await this.booksStockService.updateStock(body.bookStock.bookId, {
        quantity: bookStock.quantity - quantity,
        quantityBought: bookStock.quantityBought + quantity,
        totalOrder: bookStock.totalOrder + 1,
      });

      return {
        message: `( Successfully bought : ${quantity} )( BookName : ${book.bookName} )( total price : ${book.price * quantity} )`,
      };
    } catch (e) {
      this.logger.error(`catch on buyBook: ${e?.message ?? JSON.stringify(e)}`);
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('history')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: usersOrderHistoryQueryEntity,
  })
  async getHistoryByOrderForUser(
    @ReqUser() user: usersInterface,
    @Query() query: UsersHistoryQueryDto,
  ): Promise<usersOrderHistoryQueryEntity> {
    try {
      return this.ordersService.getHistoryByOrderForUser(user.userId, query);
    } catch (e) {
      this.logger.error(`catch on history: ${e?.message ?? JSON.stringify(e)}`);
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }
}
