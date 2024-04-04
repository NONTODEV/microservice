export interface topSellerInterface {
  userId: string;
  totalPrice: number;
  quantity: number;
  books: topSellerBookInterface[];
}

export interface topSellerBookInterface {
  userId: string;
  bookId: string;
  bookName: string;
  category: string;
  imageUrl: string;
  price: number;
}
