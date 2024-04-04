import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateBooksDTO } from './dto/create-books.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { BooksInterface } from './interfaces/books.interface';
import { BooksQueryDto } from './dto/books-query.dto';
import { BooksEntity } from './entities/books.entity';
import { BOOKS_CMD, RMQService } from '../../constants';
import { TCPService } from 'apps/web-microservice/src/constants';
import { PaginationResponseInterface } from '../interfaces/pagination.interface';

@Injectable()
export class BooksService {
  constructor(
    @Inject(RMQService.BOOKS) private readonly booksServiceRMQ: ClientProxy,
    @Inject(TCPService.BOOKS) private readonly bookServiceTCP: ClientProxy,
  ) {}

  createBook(body: CreateBooksDTO): Observable<CreateBooksDTO> {
    return this.booksServiceRMQ.emit(
      {
        cmd: BOOKS_CMD,
        method: 'create-book',
      },
      body,
    );
  }

  getBookName(bookName: string): Promise<BooksInterface> {
    return lastValueFrom(
      this.bookServiceTCP.send(
        {
          cmd: BOOKS_CMD,
          method: 'get-by-bookName',
        },
        bookName,
      ),
    );
  }

  getBookById(bookId: string): Promise<BooksInterface> {
    return lastValueFrom(
      this.bookServiceTCP.send(
        {
          cmd: BOOKS_CMD,
          method: 'get-book-by-id',
        },
        bookId,
      ),
    );
  }

  getAllBooks(): Promise<BooksInterface> {
    return lastValueFrom(
      this.bookServiceTCP.send(
        {
          cmd: BOOKS_CMD,
          method: 'get-all-books',
        },
        {},
      ),
    );
  }

  deleteBook(bookId: string): Promise<BooksInterface> {
    return lastValueFrom(
      this.booksServiceRMQ.send(
        {
          cmd: BOOKS_CMD,
          method: 'delete-book',
        },
        bookId,
      ),
    );
  }

  async getPagination(
    query: BooksQueryDto,
  ): Promise<PaginationResponseInterface<BooksEntity>> {
    return lastValueFrom(
      this.bookServiceTCP.send(
        {
          cmd: BOOKS_CMD,
          method: 'getPagination',
        },
        query,
      ),
    );
  }
}
