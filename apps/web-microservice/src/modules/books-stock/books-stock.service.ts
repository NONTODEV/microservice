import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { BooksStockInterface } from './interfaces/books-stock.interface';
import { BooksStockQueryDto } from './dto/books-stock-query.dto';
import { BooksStockEntity } from './entities/books-stock.entity';
import { updateBooksStockInterface } from './interfaces/update-books-stock.interface';
import { BOOKS_STOCK_CMD, RMQService, TCPService } from '../../constants';
import { PaginationResponseInterface } from '../interfaces/pagination.interface';

@Injectable()
export class BooksStockService {
  @Inject(RMQService.BOOKS) private readonly booksStockServiceRMQ: ClientProxy;
  @Inject(TCPService.BOOKS) private readonly bookStockServiceTCP: ClientProxy;

  getBookStockById(bookId: string): Promise<BooksStockInterface> {
    return lastValueFrom(
      this.bookStockServiceTCP.send(
        {
          cmd: BOOKS_STOCK_CMD,
          method: 'get-book-stock-by-id',
        },
        bookId,
      ),
    );
  }

  updateStock(
    bookId: string,
    body: updateBooksStockInterface,
  ): Observable<updateBooksStockInterface> {
    return this.booksStockServiceRMQ.emit(
      {
        cmd: BOOKS_STOCK_CMD,
        method: 'update-stock',
      },
      {
        bookId,
        body,
      },
    );
  }

  async getPagination(
    query: BooksStockQueryDto,
  ): Promise<PaginationResponseInterface<BooksStockEntity>> {
    return lastValueFrom(
      this.bookStockServiceTCP.send(
        {
          cmd: BOOKS_STOCK_CMD,
          method: 'getPagination',
        },
        query,
      ),
    );
  }
}
