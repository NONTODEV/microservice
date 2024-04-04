export interface bookInfoInterface {
  bookId: string;
  bookName: string;
  imageUrl: string;
  price: number;
  totalPrice: number;
  quantity: number;
}

export interface userOrderBoughtInterface {
  userId: string;
  totalPrice: number;
  quantity: number;
  books: bookInfoInterface[];
}
