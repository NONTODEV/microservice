import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Orders } from './orders.schema';
import { Model, PipelineStage } from 'mongoose';
import { topSellerInterface } from './interfaces/top-seller.interface';
import { topSellerByCategoryInterface } from './interfaces/top-seller-category.interface';
import { getUsersOrderInterface } from './interfaces/get-users-order.inteface';
import { DB_CONNECTION_NAME } from '../../constants';

@Injectable()
export class OrdersService {
  @InjectModel(Orders.name, DB_CONNECTION_NAME)
  private readonly ordersModel: Model<Orders>;

  getOrdersModel(): Model<Orders> {
    return this.ordersModel;
  }

  async getUserOrder(pagination?: {
    page: number;
    perPage: number;
  }): Promise<getUsersOrderInterface[]> {
    const { page, perPage } = pagination;
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'books-stock',
          localField: 'bookStockId',
          foreignField: 'bookId',
          as: 'bookStock',
        },
      },
      {
        $unwind: '$bookStock',
      },
      {
        $lookup: {
          from: 'books',
          localField: 'bookStock.bookId',
          foreignField: 'bookId',
          as: 'book',
        },
      },
      {
        $unwind: '$book',
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          bookName: '$book.bookName',
          category: '$book.category',
          totalPrice: 1,
          quantity: 1,
          books: 1,
          buyAt: '$createdAt',
        },
      },
      {
        $sort: { buyAt: -1 },
      },
      {
        $skip: (page - 1) * +perPage,
      },
      {
        $limit: +perPage,
      },
    ];
    const result =
      await this.ordersModel.aggregate<getUsersOrderInterface>(pipeline);
    return result;
  }

  async countGetUsersOrder(pagination?: {
    page: number;
    perPage: number;
  }): Promise<number> {
    return (await this.getUserOrder(pagination)).length;
  }

  async topSeller(): Promise<topSellerInterface[]> {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'books-stock',
          localField: 'bookStockId',
          foreignField: 'bookId',
          as: 'bookStock',
        },
      },
      {
        $unwind: '$bookStock',
      },
      {
        $lookup: {
          from: 'books',
          localField: 'bookStock.bookId',
          foreignField: 'bookId',
          as: 'book',
        },
      },
      {
        $unwind: '$book',
      },
      {
        $group: {
          _id: {
            userId: '$userId',
            bookId: '$book.bookId',
            bookName: '$book.bookName',
          },
          category: {
            $first: '$book.category',
          },
          imageUrl: {
            $first: '$book.imageUrl',
          },
          price: {
            $first: '$book.price',
          },
          totalPrice: {
            $sum: '$totalPrice',
          },
          quantity: {
            $sum: '$quantity',
          },
        },
      },
      {
        $project: {
          userId: '$_id',
          totalPrice: 1,
          quantity: 1,
          books: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          quantity: -1,
        },
      },
      { $limit: 10 },
    ];
    const result =
      await this.ordersModel.aggregate<topSellerInterface>(pipeline);
    return result;
  }

  async topSellerByCategory(): Promise<topSellerByCategoryInterface[]> {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'books-stock',
          localField: 'bookStockId',
          foreignField: 'bookId',
          as: 'bookStock',
        },
      },
      {
        $unwind: '$bookStock',
      },
      {
        $lookup: {
          from: 'books',
          localField: 'bookStock.bookId',
          foreignField: 'bookId',
          as: 'book',
        },
      },
      {
        $unwind: '$book',
      },
      {
        $group: {
          _id: {
            category: '$book.category',
            bookId: '$book.bookId',
            bookName: '$book.bookName',
          },
          category: {
            $first: '$book.category',
          },
          imageUrl: {
            $first: '$book.imageUrl',
          },
          price: {
            $first: '$book.price',
          },
          quantity: {
            $sum: '$quantity',
          },
          totalPrice: {
            $sum: '$totalPrice',
          },
        },
      },
      {
        $project: {
          category: 1,
          quantity: 1,
          totalPrice: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          quantity: -1,
        },
      },
      { $limit: 5 },
    ];
    const result =
      await this.ordersModel.aggregate<topSellerByCategoryInterface>(pipeline);
    return result;
  }
}
