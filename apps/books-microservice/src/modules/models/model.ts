import {
  BooksStock,
  BooksStockSchema,
} from '../books-stock/books-stock.schema';
import { Books, BooksSchema } from '../books/books.schema';
import { Orders, OrdersSchema } from '../orders/orders.schema';

export const model = [
  {
    name: Books.name,
    schema: BooksSchema,
  },
  {
    name: BooksStock.name,
    schema: BooksStockSchema,
  },
  {
    name: Orders.name,
    schema: OrdersSchema,
  },
];
