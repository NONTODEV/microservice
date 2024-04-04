import {
  Controller,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BooksInterface } from './interfaces/books.interface';
import { Books } from './books.schema';
import { BOOKS_CMD } from '../../constants';
import {
  PaginationInterface,
  PaginationResponseInterface,
} from '../interfaces/pagination.interface';
import { FindOptionsInterface } from '../interfaces/find-options.interface';

@Controller('books')
export class BooksMicroserive {
  private readonly logger = new Logger(BooksMicroserive.name);

  constructor(private readonly booksService: BooksService) {}

  @MessagePattern({
    cmd: BOOKS_CMD,
    method: 'create-book',
  })
  async createBooks(@Payload() payload: BooksInterface): Promise<void> {
    try {
      await this.booksService.getBooksModel().create(payload);
    } catch (e) {
      this.logger.error(
        `catch on create-book: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKS_CMD,
    method: 'get-book-by-id',
  })
  async getBookById(@Payload() bookId: string): Promise<Books> {
    try {
      return await this.booksService
        .getBooksModel()
        .findById({ bookId })
        .lean();
    } catch (e) {
      this.logger.error(
        `catch on get-book-by-id: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKS_CMD,
    method: 'get-by-bookName',
  })
  async getByBookName(@Payload() bookName: string): Promise<Books> {
    try {
      return this.booksService.getBooksModel().findOne({ bookName }).lean();
    } catch (e) {
      this.logger.error(
        `catch on get-by-bookName: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKS_CMD,
    method: 'get-all-books',
  })
  async getAllBooks(): Promise<Books> {
    try {
      return await this.booksService.getAllBooks();
    } catch (e) {
      this.logger.error(
        `catch on get-all-books: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKS_CMD,
    method: 'delete-book',
  })
  async deleteBook(@Payload() bookId: string): Promise<Books> {
    this.logger.log(bookId);
    try {
      return await this.booksService
        .getBooksModel()
        .deleteOne({
          bookId,
        })
        .lean();
    } catch (e) {
      this.logger.error(
        `catch on delete-book: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKS_CMD,
    method: 'getPagination',
  })
  async getPagination(
    @Payload()
    payload: PaginationInterface & FindOptionsInterface<Books>,
  ): Promise<PaginationResponseInterface<Books>> {
    const { filter, page, perPage, sort } = payload;

    try {
      const [records, count] = await this.booksService.getPagination(
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
}
