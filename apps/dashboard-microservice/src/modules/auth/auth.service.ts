import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { loginUserDto } from './dto/user-login.dto';
import { lastValueFrom } from 'rxjs';
import { usersInterface } from '../users/interfaces/users.interface';
import { UsersLoginEntity } from './entities/user-login-entity';
import { RMQService, USER_CMD } from '../../constants';
import { TCPService } from 'apps/web-microservice/src/constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  @Inject(RMQService.USERS) private readonly usersServiceRMQ: ClientProxy;
  @Inject(TCPService.USERS) private readonly usersServiceTCP: ClientProxy;

  async loginUser(email: string, password: string): Promise<UsersLoginEntity> {
    const body: loginUserDto = { email, password };
    return lastValueFrom(
      this.usersServiceRMQ.send(
        {
          cmd: USER_CMD,
          method: 'login',
        },
        body,
      ),
    );
  }

  async getByUserId(userId: string): Promise<usersInterface> {
    return lastValueFrom(
      this.usersServiceTCP.send(
        {
          cmd: USER_CMD,
          method: 'getByUserId',
        },
        userId,
      ),
    );
  }

  async getByEmail(email: string): Promise<usersInterface> {
    return lastValueFrom(
      this.usersServiceTCP.send(
        {
          cmd: USER_CMD,
          method: 'getByEmail',
        },
        email,
      ),
    );
  }

  async getByUsername(username: string): Promise<usersInterface> {
    return lastValueFrom(
      this.usersServiceTCP.send(
        {
          cmd: USER_CMD,
          method: 'getByUsername',
        },
        username,
      ),
    );
  }

  async getBlockUser(email: string): Promise<usersInterface> {
    return lastValueFrom(
      this.usersServiceTCP.send(
        {
          cmd: USER_CMD,
          method: 'getBlockUser',
        },
        email,
      ),
    );
  }
}
