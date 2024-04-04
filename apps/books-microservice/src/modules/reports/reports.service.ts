import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Orders } from '../orders/orders.schema';
import { Aggregate, Model, PipelineStage } from 'mongoose';
import { getUserOrderBoughtInterface } from './interface/get-top-users-bought.interface';
import { userOrderBoughtInterface } from './interface/history-order-users.interface';
import { DB_CONNECTION_NAME } from '../../constants';

@Injectable()
export class ReportsService {
  @InjectModel(Orders.name, DB_CONNECTION_NAME)
  private readonly ordersModel: Model<Orders>;

  async getHistoryOrder(pagination?: {
    page: number;
    perPage: number;
  }): Promise<Aggregate<userOrderBoughtInterface[]>> {
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
          bookName: '$book.bookName',
          category: '$book.category',
          quantity: '$quantity',
          total: '$totalPrice',
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

    return this.ordersModel.aggregate(pipeline);
  }

  async countHistoryByOrder(pagination?: {
    page: number;
    perPage: number;
  }): Promise<number> {
    return (await this.getHistoryOrder(pagination)).length;
  }

  async getTopUserBought(pagination?: {
    page: number;
    perPage: number;
  }): Promise<Aggregate<getUserOrderBoughtInterface[]>> {
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
        $group: {
          _id: {
            category: '$book.catagory',
            userId: '$userId',
            bookId: '$book.bookId',
            bookName: '$book.bookName',
          },
          imageUrl: { $first: '$book.imageUrl' },
          price: { $first: '$book.price' },
          totalPrice: { $sum: '$totalPrice' },
          quantity: { $sum: '$quantity' },
        },
      },
      {
        $group: {
          _id: {
            category: '$_id.category',
            userId: '$_id.userId',
          },
          quantity: { $sum: '$quantity' },
          totalPrice: { $sum: '$totalPrice' },
          books: {
            $addToSet: {
              bookId: '$_id.bookId',
              bookName: '$_id.bookName',
              imageUrl: '$imageUrl',
              price: '$price',
              totalPrice: '$totalPrice',
              quantity: '$quantity',
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id.userId',
          totalPrice: { $sum: '$totalPrice' },
          quantity: { $sum: '$quantity' },
          books: {
            $addToSet: {
              category: '$_id.category',
              books: '$books',
            },
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
      { $sort: { quantity: -1 } },
      {
        $skip: (page - 1) * +perPage,
      },
      {
        $limit: +perPage,
      },
    ];
    return this.ordersModel.aggregate(pipeline);
  }

  async countGetTopUserBought(pagination?: {
    page: number;
    perPage: number;
  }): Promise<number> {
    const results = await this.getTopUserBought(pagination);
    const count = results.length;
    return count;
  }

  async getHistoryOrderForUser(
    objectId: string,
    pagination?: { page: number; perPage: number },
  ): Promise<Aggregate<userOrderBoughtInterface[]>> {
    const { page, perPage } = pagination;
    const pipeline: PipelineStage[] = [
      {
        $match: { userId: objectId },
      },
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
          bookName: '$book.bookName',
          category: '$book.category',
          quantity: '$quantity',
          total: '$totalPrice',
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

    return this.ordersModel.aggregate(pipeline);
  }

  async countHistoryByOrderForUser(
    objectId: string,
    pagination?: { page: number; perPage: number },
  ): Promise<number> {
    return (await this.getHistoryOrderForUser(objectId, pagination)).length;
  }
}
