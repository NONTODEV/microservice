import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Users } from '../users/users.schema';
import { UsersService } from '../users/users.service';
import { StatusUser } from '../users/enum/status-user.enum';
import { loginInterface } from './interface/login.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createTokens(email: string): Promise<loginInterface> {
    const jwtOption: JwtSignOptions = {
      expiresIn: '2day',
      secret: this.configService.get<string>('authentication.secret'),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          email,
        },
        jwtOption,
      ),
      this.jwtService.signAsync(
        {
          email,
        },
        jwtOption,
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  blockUser(email: string): Promise<Users> {
    return this.usersService
      .getUserModel()
      .findOne({
        email,
        status: StatusUser.INACTIVE,
      })
      .lean();
  }
}
