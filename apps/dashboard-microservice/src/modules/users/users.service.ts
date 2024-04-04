import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { createUserDto } from './dto/create-users.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { ChangePasswordEntyty } from './entities/change-password.entity';
import { updateUserDto } from './dto/update-user.dto';
import { usersInterface } from './interfaces/users.interface';
import { userLoginInterface } from './interfaces/userlogin.interface';
import { RMQService, USER_CMD } from '../../constants';
import { TCPService } from 'apps/web-microservice/src/constants';
import { PaginationResponseInterface } from '../interfaces/pagination.interface';
import { userEntyty } from './entities/user.entity';
import { UsersQueryDto } from './dto/users-query.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  @Inject(RMQService.USERS) private readonly usersServiceRMQ: ClientProxy;
  @Inject(TCPService.USERS) private readonly userServiceTCP: ClientProxy;

  registerUser(body: createUserDto): Observable<createUserDto> {
    return this.usersServiceRMQ.emit(
      {
        cmd: USER_CMD,
        method: 'register',
      },
      body,
    );
  }

  changePasswordUser(
    userId: string,
    hashPassword: string,
  ): Observable<ChangePasswordEntyty> {
    return this.usersServiceRMQ.emit(
      {
        cmd: USER_CMD,
        method: 'changePassword',
      },
      {
        userId,
        hashPassword,
      },
    );
  }

  updateUser(userId: string, update: updateUserDto): Observable<updateUserDto> {
    return this.usersServiceRMQ.emit(
      {
        cmd: USER_CMD,
        method: 'updateUser',
      },
      {
        userId,
        update,
      },
    );
  }

  findNewUser(): Promise<usersInterface> {
    return lastValueFrom(
      this.userServiceTCP.send(
        {
          cmd: USER_CMD,
          method: 'find-new-user',
        },
        {},
      ),
    );
  }

  findLoggedInUsers(): Promise<userLoginInterface> {
    return lastValueFrom(
      this.userServiceTCP.send(
        {
          cmd: USER_CMD,
          method: 'find-login-user',
        },
        {},
      ),
    );
  }

  banUser(userId: string): Observable<usersInterface> {
    return this.usersServiceRMQ.emit(
      {
        cmd: USER_CMD,
        method: 'ban-user',
      },
      userId,
    );
  }

  unBanUser(userId: string): Observable<usersInterface> {
    return this.usersServiceRMQ.emit(
      {
        cmd: USER_CMD,
        method: 'un-ban-user',
      },
      userId,
    );
  }

  async getPaginationUsers(
    query: UsersQueryDto,
  ): Promise<PaginationResponseInterface<userEntyty>> {
    return lastValueFrom(
      this.userServiceTCP.send(
        {
          cmd: USER_CMD,
          method: 'getPaginationUsers',
        },
        query,
      ),
    );
  }
}
