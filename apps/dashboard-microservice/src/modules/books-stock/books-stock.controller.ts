import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BooksStockService } from './books-stock.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBookStockDTO } from './dto/create-book-stock.dto';
import { createBooksStockValidationPipe } from './pipe/add-books-stock-validation.pipe';
import { addBooksInStockDto } from './dto/add-book-stock.dto';
import { addBooksStockValidationPipe } from './pipe/update-book-in-stock-validation.pipe';
import { BooksStockInterface } from './interfaces/books-stock.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BooksStockQueryDto } from './dto/books-stock-query.dto';
import BooksStockQueryEntity from './entities/books-stock-query.entity';
import { BooksCategoryUtil } from '../utils/books';
import { RunningOutQueryDto } from './dto/running-out-query.dto';
import { JwtRoleGuard } from '../auth/guards/jwt-role.guard';
import { UseRoles } from '@lib/commom/decorators/role.decorator';
import { RolesUserEnum } from '@lib/commom/enum/roles-user.enum';

@Controller('books-stock')
@ApiTags('books-stock')
export class BooksStockController {
  private readonly logger = new Logger(BooksStockController.name);

  constructor(private readonly booksStockService: BooksStockService) {}

  @Get('pagination')
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: BooksStockQueryEntity,
  })
  async getPagination(
    @Query() query: BooksStockQueryDto,
  ): Promise<BooksStockQueryEntity> {
    const { filter, category, kSort, bookName } = query;

    query.filter = BooksCategoryUtil.getQueryByCategory(category);

    query.sort = BooksCategoryUtil.sort(kSort);

    if (bookName) {
      filter.bookName = { $regex: `${bookName}` };
    }

    try {
      return this.booksStockService.getPagination(query);
    } catch (e) {
      this.logger.error(
        `catch on getPagination: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('all-books')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAllBooksInStock(): Promise<BooksStockInterface> {
    try {
      return await this.booksStockService.getAllBooksInStock();
    } catch (e) {
      this.logger.error(
        `catch on get-all-books: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Post('book')
  @ApiBody({
    type: CreateBookStockDTO,
  })
  @ApiBearerAuth()
  @UseRoles(RolesUserEnum.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  async createBookToStock(
    @Body(createBooksStockValidationPipe) body: CreateBookStockDTO,
  ): Promise<void> {
    try {
      await this.booksStockService.createBookToStock(body);
    } catch (e) {
      this.logger.error(
        `catch on add-book-to-stock: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Put(':bookId/')
  @ApiParam({
    type: String,
    name: 'bookId',
  })
  @ApiBody({
    type: addBooksInStockDto,
  })
  @ApiBearerAuth()
  @UseRoles(RolesUserEnum.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  async addBookInStock(
    @Param('bookId', addBooksStockValidationPipe) addStock: BooksStockInterface,
    @Body() body: addBooksInStockDto,
  ): Promise<void> {
    try {
      await this.booksStockService.addBookToStock(addStock, body.quantity);
    } catch (e) {
      this.logger.error(
        `catch on add-book-to-stock: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Delete(':bookId/')
  @ApiBearerAuth()
  @UseRoles(RolesUserEnum.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async deleteBookInStock(@Param('bookId') bookId: string): Promise<void> {
    try {
      await this.booksStockService.deleteBookToStock(bookId);
    } catch (e) {
      this.logger.error(
        `catch on delete-book-in-stock: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('running-out')
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getRunningOut(
    @Query() query: RunningOutQueryDto,
  ): Promise<BooksStockQueryEntity> {
    const { min = 20 } = query;

    query.filter = {
      $and: [{ quantity: { $gt: 0 } }, { quantity: { $lt: min } }],
    };

    try {
      return await this.booksStockService.getRunningOut(query);
    } catch (e) {
      this.logger.error(
        `catch on getPagination: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }
}
