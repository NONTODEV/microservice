import { BooksInterface } from '../../books/interfaces/books.interface';

export interface getUsersOrderInterface {
  userId: string;
  bookName: string;
  category: string;
  totalPrice: number;
  quantity: number;
  books: BooksInterface[];
  buyAt: Date;
}
