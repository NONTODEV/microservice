import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags, ApiResponse } from '@nestjs/swagger';
import { loginUserDto } from '../auth/dto/user-login.dto';
import { AuthService } from '../auth/auth.service';
import { SkipThrottle } from '@nestjs/throttler';
import { LoginAuthGuard } from './guards/login-auth.guard';
import { UsersLoginEntity } from './entities/user-login-entity';

@Controller('users')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LoginAuthGuard)
  @SkipThrottle({ value: true })
  @ApiBody({
    type: loginUserDto,
  })
  @ApiResponse({
    status: 200,
    type: UsersLoginEntity,
  })
  async loginUser(@Body() body: loginUserDto) {
    const { email, password } = body;
    try {
      return await this.authService.loginUser(email, password);
    } catch (e) {
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }
}
