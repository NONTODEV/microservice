import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { createOrderDTO } from '../../orders/dto/create-order.dto';
import { BooksService } from '../../books/books.service';
import { BooksStockService } from '../../books-stock/books-stock.service';
import { BooksStockInterface } from '../../books-stock/interfaces/books-stock.interface';
import { BooksInterface } from '../../books/interfaces/books.interface';

@Injectable()
export class createOrderBooksValidationPipe implements PipeTransform {
  private readonly logger = new Logger(createOrderBooksValidationPipe.name);

  constructor(
    private readonly booksService: BooksService,
    private readonly booksStockService: BooksStockService,
  ) {}

  async transform(body: createOrderDTO): Promise<createOrderDTO> {
    let bookStock: BooksStockInterface;
    let book: BooksInterface;
    try {
      bookStock = await this.booksStockService.getBookStockById(body.bookId);
    } catch (e) {
      this.logger.error(`catch on books: ${e?.message ?? JSON.stringify(e)}`);
      throw new BadRequestException({
        message: `${e?.message ?? e}`,
      });
    }

    if (!bookStock) {
      this.logger.error(`catch on books ${body.bookId} not found`);
      throw new BadRequestException({
        message: `${body.bookId} not found`,
      });
    }

    try {
      book = await this.booksService.getBookById(body.bookId);
    } catch (e) {
      this.logger.error(`catch on books: ${e?.message ?? JSON.stringify(e)}`);
      throw new BadRequestException({
        message: `${e?.message ?? e}`,
      });
    }

    if (!book) {
      this.logger.error(`catch on books ${body.bookId} not found`);
      throw new BadRequestException({
        message: `${body.bookId} not found`,
      });
    }

    if (bookStock.quantity < 1) {
      this.logger.error(`catch on books: ${bookStock.bookName} sold out`);
      throw new BadRequestException({
        message: `${bookStock.bookName} sold out`,
      });
    }
    if (bookStock.quantity < body.quantity) {
      this.logger.error(`catch on books: ${bookStock.bookName} not enough`);
      throw new BadRequestException({
        message: `${bookStock.bookName} not enough`,
      });
    }

    body.bookStock = bookStock;
    body.book = book;
    return body;
  }
}
