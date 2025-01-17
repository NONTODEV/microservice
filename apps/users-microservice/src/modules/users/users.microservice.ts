import {
  Controller,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { playloadCreateUserInterface } from './interface/payload-create-user.interface';
import { AuthService } from '../auth/auth.service';
import { loginInterface } from '../auth/interface/login.interface';
import { Users } from './users.schema';
import { payloadUpdateUserInterface } from './interface/payload-update-user.interface';
import { StatusUser } from './enum/status-user.enum';
import { userLoginInterface } from './interface/userlogin.interface';
import { USER_CMD } from '../../constants';
import {
  PaginationInterface,
  PaginationResponseInterface,
} from '../interfaces/pagination.interface';
import { FindOptionsInterface } from '../interfaces/find-options.interface';

@Controller('users')
export class UsersMicroserviec {
  private readonly logger = new Logger();
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern({
    cmd: USER_CMD,
    method: 'login',
  })
  async login(@Payload() payload: { email: string }): Promise<loginInterface> {
    const { email } = payload;

    let jwtSign: loginInterface;
    try {
      jwtSign = await this.authService.createTokens(email);
    } catch (e) {
      this.logger.error(
        `catch on login-createTokens: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }

    const update = {
      token: jwtSign.accessToken,
      latestLogin: Date.now(),
    };

    try {
      await this.usersService
        .getUserModel()
        .updateOne({ email }, { ...update });
    } catch (e) {
      this.logger.error(
        `catch on login-update: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
    return {
      accessToken: jwtSign.accessToken,
      refreshToken: jwtSign.refreshToken,
    };
  }

  @MessagePattern({
    cmd: USER_CMD,
    method: 'register',
  })
  async register(
    @Payload() payload: playloadCreateUserInterface,
  ): Promise<void> {
    this.logger.log([payload]);
    try {
      await this.usersService
        .getUserModel()
        .create({ ...payload, password: payload.hashPassword });
    } catch (error) {
      this.logger.error(
        `catch on createUser: ${error?.message ?? JSON.stringify(error)}`,
      );
      throw new InternalServerErrorException({
        message: error?.message ?? error,
      });
    }
  }

  @MessagePattern({
    cmd: USER_CMD,
    method: 'getByUserId',
  })
  async getByUserId(@Payload() userId: string): Promise<Users> {
    try {
      return this.usersService.getUserModel().findOne({ userId }).lean();
    } catch (error) {
      this.logger.error(
        `catch on getByUserId: ${error?.message ?? JSON.stringify(error)}`,
      );
      throw new InternalServerErrorException({
        message: error?.message ?? error,
      });
    }
  }

  @MessagePattern({
    cmd: USER_CMD,
    method: 'getByEmail',
  })
  async getByEmail(@Payload() email: string): Promise<Users> {
    try {
      return this.usersService.getUserModel().findOne({ email }).lean();
    } catch (error) {
      this.logger.error(
        `catch on getByEmail: ${error?.message ?? JSON.stringify(error)}`,
      );
      throw new InternalServerErrorException({
        message: error?.message ?? error,
      });
    }
  }

  @MessagePattern({
    cmd: USER_CMD,
    method: 'getByUsername',
  })
  async getByUsername(@Payload() username: string): Promise<Users> {
    try {
      return this.usersService.getUserModel().findOne({ username }).lean();
    } catch (error) {
      this.logger.error(
        `catch on getByUsername: ${error?.message ?? JSON.stringify(error)}`,
      );
      throw new InternalServerErrorException({
        message: error?.message ?? error,
      });
    }
  }

  @MessagePattern({
    cmd: USER_CMD,
    method: 'getBlockUser',
  })
  async getBlockUser(email: string): Promise<Users> {
    try {
      return this.authService.blockUser(email);
    } catch (error) {
      this.logger.error(
        `catch on getBlockUser: ${error?.message ?? JSON.stringify(error)}`,
      );
      throw new InternalServerErrorException({
        message: error?.message ?? error,
      });
    }
  }

  @MessagePattern({
    cmd: USER_CMD,
    method: 'changePassword',
  })
  async changePasswordUser(payload: {
    userId: string;
    hashPassword;
  }): Promise<void> {
    const { userId, hashPassword } = payload;
    try {
      await this.usersService
        .getUserModel()
        .updateOne({ userId }, { password: hashPassword });
    } catch (e) {
      this.logger.error(
        `catch on changePassword: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: USER_CMD,
    method: 'updateUser',
  })
  async updateUser(
    @Payload() payload: { userId: string; update: payloadUpdateUserInterface },
  ): Promise<void> {
    const { userId, update } = payload;
    try {
      await this.usersService
        .getUserModel()
        .updateOne({ userId }, { ...update });
    } catch (e) {
      this.logger.error(
        `catch on updateUser: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: USER_CMD,
    method: 'deleteUser',
  })
  async deleteUser(@Payload() userId: string): Promise<void> {
    try {
      await this.usersService.getUserModel().findByIdAndDelete({ userId });
    } catch (e) {
      this.logger.error(
        `catch on deleteUser: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: USER_CMD,
    method: 'find-new-user',
  })
  async findNewUser(): Promise<Users> {
    try {
      return await this.usersService.findNewAllUser();
    } catch (e) {
      this.logger.error(
        `catch on find-new-user: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: USER_CMD,
    method: 'ban-user',
  })
  async banUser(@Payload() userId: string): Promise<void> {
    try {
      await this.usersService.getUserModel().updateOne(
        {
          userId,
        },
        {
          status: StatusUser.INACTIVE,
        },
      );
    } catch (e) {
      this.logger.error(
        `catch on ban-user: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: USER_CMD,
    method: 'un-ban-user',
  })
  async unBanUser(@Payload() userId: string): Promise<void> {
    try {
      await this.usersService.getUserModel().updateOne(
        {
          userId,
        },
        {
          status: StatusUser.ACTIVE,
        },
      );
    } catch (e) {
      this.logger.error(
        `catch on ban-user: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: USER_CMD,
    method: 'find-login-user',
  })
  async findLatestLoggedInUsers(): Promise<userLoginInterface> {
    try {
      return await this.usersService.findLatestLoggedInUsers();
    } catch (e) {
      this.logger.error(
        `catch on find-new-user: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: USER_CMD,
    method: 'getPaginationUsers',
  })
  async getPagination(
    @Payload()
    payload: PaginationInterface & FindOptionsInterface<Users>,
  ): Promise<PaginationResponseInterface<Users>> {
    const { filter, page, perPage, sort } = payload;

    try {
      const [records, count] = await this.usersService.getPaginationUser(
        filter,
        { page, perPage },
        sort,
      );

      return {
        page,
        perPage,
        count,
        records,
      };
    } catch (e) {
      this.logger.error(
        `catch on getPagination: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }
}
