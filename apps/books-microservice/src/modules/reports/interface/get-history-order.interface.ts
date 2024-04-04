export interface getOrderHistoryInterface {
  userId: string;
  totalPrice: number;
  quantity: number;
  books: bookHistoryInterface[];
}

export interface bookHistoryInterface {
  category: string;
  bookId: string;
  bookName: string;
  imageUrl: string;
  price: number;
  totalPrice: number;
  quantity: number;
}
