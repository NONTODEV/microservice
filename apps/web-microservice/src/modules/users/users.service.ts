import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { createUserDto } from './dto/create-users.dto';
import { Observable } from 'rxjs';
import { ChangePasswordEntyty } from './entities/change-password.entity';
import { updateUserDto } from './dto/update-user.dto';
import { usersInterface } from './interfaces/users.interface';
import { RMQService, USER_CMD } from '../../constants';

@Injectable()
export class UsersService {
  @Inject(RMQService.USERS) private readonly usersServiceRMQ: ClientProxy;

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

  updateUser(
    userId: string,
    update: updateUserDto,
  ): Observable<usersInterface> {
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
}
