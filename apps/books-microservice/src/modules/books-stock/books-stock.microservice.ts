import {
  Controller,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BooksStockService } from './books-stock.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BooksStock } from './books-stock.schema';
import { addBookStock } from './interfaces/add-book-stock.interface';
import { updateBooksStockInterface } from './interfaces/update-books-stock.interface';
import { BOOKSSTOCK_CMD } from '../../constants';
import {
  PaginationInterface,
  PaginationResponseInterface,
} from '../interfaces/pagination.interface';
import { FindOptionsInterface } from '../interfaces/find-options.interface';

@Controller('books-stock')
export class BooksStockMicroservice {
  private readonly logger = new Logger(BooksStockMicroservice.name);

  constructor(private readonly booksStockService: BooksStockService) {}

  @MessagePattern({
    cmd: BOOKSSTOCK_CMD,
    method: 'get-book-stock-by-id',
  })
  async getBookStockById(@Payload() bookId: string): Promise<BooksStock> {
    try {
      return this.booksStockService.getBookById(bookId);
    } catch (e) {
      this.logger.error(
        `catch on get-book-stock-by-id: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKSSTOCK_CMD,
    method: 'get-all-books-in-stock',
  })
  async getAllBooksInStock(): Promise<BooksStock> {
    try {
      return this.booksStockService.getAllBookInStock();
    } catch (e) {
      this.logger.error(
        `catch on get-all-books-in-stock: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKSSTOCK_CMD,
    method: 'create-book-to-stock',
  })
  async createBookToStock(@Payload() payload: addBookStock): Promise<void> {
    const { quantity } = payload;
    try {
      await this.booksStockService.getBooksStockModel().create({
        ...payload,
        totalQuantity: quantity,
      });
    } catch (e) {
      this.logger.error(
        `catch on create-book-to-stock: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKSSTOCK_CMD,
    method: 'add-book-in-stock',
  })
  async addBookInStock(
    @Payload() payload: { addStock: BooksStock; quantity: number },
  ): Promise<void> {
    const { addStock, quantity } = payload;
    try {
      await this.booksStockService.getBooksStockModel().updateOne(
        {
          bookId: addStock.bookId,
        },
        {
          quantity: addStock.quantity + quantity,
          totalQuantity: addStock.totalQuantity + quantity,
          quantityUpdateAt: new Date(),
        },
      );
    } catch (e) {
      this.logger.error(
        `catch on add-book-in-stock: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKSSTOCK_CMD,
    method: 'delete-book-in-stock',
  })
  async deleteBookInStock(@Payload() bookId: string): Promise<void> {
    try {
      await this.booksStockService.getBooksStockModel().deleteOne({ bookId });
    } catch (e) {
      this.logger.error(
        `catch on delete-book-in-stock: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKSSTOCK_CMD,
    method: 'getPagination',
  })
  async getPagination(
    @Payload()
    payload: PaginationInterface & FindOptionsInterface<BooksStock>,
  ): Promise<PaginationResponseInterface<BooksStock>> {
    const { filter, page, perPage, sort } = payload;

    try {
      const [records, count] = await this.booksStockService.getPagination(
        filter,
        { page, perPage },
        sort,
      );

      return {
        page,
        perPage,
        count,
        records,
      };
    } catch (e) {
      this.logger.error(
        `catch on getPagination: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKSSTOCK_CMD,
    method: 'update-stock',
  })
  async updateStock(
    @Payload() payload: { bookId: string; body: updateBooksStockInterface },
  ): Promise<void> {
    const { bookId, body } = payload;
    try {
      await this.booksStockService.getBooksStockModel().updateOne(
        { bookId },
        {
          quantity: body.quantity,
          quantityBought: body.quantityBought,
          totalOrder: body.totalOrder,
          lastOrderAt: new Date(),
        },
      );
    } catch (e) {
      this.logger.error(
        `catch on updateStock: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKSSTOCK_CMD,
    method: 'getRunningOut',
  })
  async getRunningOut(
    @Payload()
    payload: PaginationInterface & FindOptionsInterface<BooksStock>,
  ): Promise<PaginationResponseInterface<BooksStock>> {
    if (!('page' in payload) || !('perPage' in payload)) {
      throw new Error('Page and perPage properties are required in payload.');
    }
    const { filter, page, perPage, sort } = payload;
    try {
      const [records, count] = await this.booksStockService.getRunningOut(
        filter,
        { page, perPage },
        sort,
      );

      return {
        page,
        perPage,
        count,
        records,
      };
    } catch (e) {
      this.logger.error(
        `catch on getRunningOut: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }
}
