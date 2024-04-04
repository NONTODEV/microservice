export interface bookTopUserInfoInterface {
  bookId: string;
  bookName: string;
  imageUrl: string;
  price: number;
  totalPrice: number;
  quantity: number;
}

export interface getUserOrderBoughtInterface {
  userId: string;
  totalPrice: number;
  quantity: number;
  books: bookTopUserInfoInterface[];
}
