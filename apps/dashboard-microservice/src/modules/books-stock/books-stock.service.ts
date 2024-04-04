import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BooksStockInterface } from './interfaces/books-stock.interface';
import { Observable, lastValueFrom } from 'rxjs';
import { CreateBookStockDTO } from './dto/create-book-stock.dto';
import { BooksStockQueryDto } from './dto/books-stock-query.dto';
import { BooksStockEntity } from './entities/books-stock.entity';
import { RunningOutQueryDto } from './dto/running-out-query.dto';
import { BOOKS_STOCK_CMD, RMQService } from '../../constants';
import { TCPService } from 'apps/web-microservice/src/constants';
import { PaginationResponseInterface } from '../interfaces/pagination.interface';

@Injectable()
export class BooksStockService {
  constructor(
    @Inject(RMQService.BOOKS) private readonly stockServiceRMQ: ClientProxy,
    @Inject(TCPService.BOOKS) private readonly stockServiceTCP: ClientProxy,
  ) {}

  getAllBooksInStock(): Promise<BooksStockInterface> {
    return lastValueFrom(
      this.stockServiceTCP.send(
        {
          cmd: BOOKS_STOCK_CMD,
          method: 'get-all-books-in-stock',
        },
        {},
      ),
    );
  }

  getBookStockById(bookId: string): Promise<BooksStockInterface> {
    return lastValueFrom(
      this.stockServiceTCP.send(
        {
          cmd: BOOKS_STOCK_CMD,
          method: 'get-book-stock-by-id',
        },
        bookId,
      ),
    );
  }

  createBookToStock(body: CreateBookStockDTO): Observable<CreateBookStockDTO> {
    return this.stockServiceRMQ.emit(
      {
        cmd: BOOKS_STOCK_CMD,
        method: 'create-book-to-stock',
      },
      {
        bookId: body.bookId,
        bookName: body.book.bookName,
        category: body.book.category,
        quantity: body.quantity,
      },
    );
  }

  addBookToStock(
    addStock: BooksStockInterface,
    quantity: number,
  ): Observable<BooksStockInterface> {
    return this.stockServiceRMQ.emit(
      {
        cmd: BOOKS_STOCK_CMD,
        method: 'add-book-in-stock',
      },
      {
        addStock,
        quantity,
      },
    );
  }

  deleteBookToStock(bookId: string): Promise<BooksStockInterface> {
    return lastValueFrom(
      this.stockServiceRMQ.send(
        {
          cmd: BOOKS_STOCK_CMD,
          method: 'delete-book-in-stock',
        },
        bookId,
      ),
    );
  }

  async getPagination(
    query: BooksStockQueryDto,
  ): Promise<PaginationResponseInterface<BooksStockEntity>> {
    return lastValueFrom(
      this.stockServiceTCP.send(
        {
          cmd: BOOKS_STOCK_CMD,
          method: 'getPagination',
        },
        query,
      ),
    );
  }

  async getRunningOut(query: RunningOutQueryDto) {
    return lastValueFrom(
      this.stockServiceTCP.send(
        {
          cmd: BOOKS_STOCK_CMD,
          method: 'getRunningOut',
        },
        query,
      ),
    );
  }
}
