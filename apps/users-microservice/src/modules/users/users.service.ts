import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './users.schema';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import dayjs from 'dayjs';
import { userLoginInterface } from './interface/userlogin.interface';
import { DB_CONNECTION_NAME } from '../../constants';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  @InjectModel(Users.name, DB_CONNECTION_NAME)
  private readonly usersModel: Model<Users>;

  constructor() {}

  getUserModel(): Model<Users> {
    return this.usersModel;
  }

  async findNewAllUser(): Promise<Users> {
    const startOfWeek = dayjs().startOf('week');
    const endOfWeek = dayjs().endOf('week');

    return this.usersModel
      .find(
        {
          createdAt: {
            $gte: startOfWeek.toDate(),
            $lte: endOfWeek.toDate(),
          },
        },
        {
          email: 1,
          username: 1,
          firstname: 1,
          lastname: 1,
          userId: 1,
          status: 1,
          roles: 1,
          latestLogin: 1,
          createdAt: 1,
          updatedAt: 1,
        },
        {
          _id: 0,
        },
      )
      .lean();
  }

  async findLatestLoggedInUsers(): Promise<userLoginInterface> {
    const startOfWeek = dayjs().startOf('week');
    const endOfWeek = dayjs().endOf('week');

    return this.usersModel
      .find(
        {
          createdAt: {
            $gte: startOfWeek.toDate(),
            $lte: endOfWeek.toDate(),
          },
        },
        {
          email: 1,
          username: 1,
          firstname: 1,
          lastname: 1,
          latestLogin: 1,
        },
      )
      .sort({ latestLogin: -1 })
      .lean();
  }

  async getPaginationUser(
    conditions: FilterQuery<Users>,
    pagination?: { page: number; perPage: number },
    sort: { [key: string]: SortOrder } | string = { _id: 1 },
    select = { _id: 0 },
  ): Promise<[Users[], number]> {
    const { page = 1, perPage = 20 } = pagination;

    return Promise.all([
      this.usersModel
        .find(conditions)
        .select(select)
        .sort(sort)
        .skip((page - 1) * +perPage)
        .limit(+perPage)
        .lean(),
      this.usersModel.countDocuments(conditions),
    ]);
  }
}
