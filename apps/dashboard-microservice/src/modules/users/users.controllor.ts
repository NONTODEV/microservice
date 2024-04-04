import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { createUserDto } from './dto/create-users.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { userEntyty } from './entities/user.entity';
import { usersInterface } from './interfaces/users.interface';
import { changePasswordDto } from './dto/change-password.dto';
import { ChangePasswordUserValidationPipe } from './pipes/change-password-user-validation.pipe';
import { ChangePasswordEntyty } from './entities/change-password.entity';
import { updateUserDto } from './dto/update-user.dto';
import { updateUserEntyty } from './entities/update-user.entity';
import { registerUserValidationPipe } from './pipes/register-user-validation.pipe';
import { JwtRoleGuard } from '../auth/guards/jwt-role.guard';
import { UseRoles } from '@lib/commom/decorators/role.decorator';
import { RolesUserEnum } from '@lib/commom/enum/roles-user.enum';
import ReqUser from '@lib/commom/decorators/req-user.decorator';

@Controller('users')
@ApiTags('user')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiBody({
    type: createUserDto,
  })
  async createUser(
    @Body(registerUserValidationPipe) body: createUserDto,
  ): Promise<void> {
    try {
      await this.usersService.registerUser(body);
      this.logger.log([body]);
    } catch (e) {
      this.logger.error(
        `catch on changePassword: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Get('me')
  @ApiBearerAuth()
  @UseRoles(RolesUserEnum.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  async getMe(@ReqUser() user: usersInterface): Promise<userEntyty> {
    return user;
  }

  @Put('update')
  @ApiBody({
    type: updateUserDto,
  })
  @ApiBearerAuth()
  @UseRoles(RolesUserEnum.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @ApiResponse({
    status: 200,
    type: updateUserEntyty,
  })
  async updateUser(
    @ReqUser() user: usersInterface,
    @Body() update: updateUserDto,
  ): Promise<void> {
    try {
      await this.usersService.updateUser(user.userId, update);
    } catch (e) {
      this.logger.error(
        `catch on changePassword: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Put('change-password')
  @ApiBody({
    type: changePasswordDto,
  })
  @ApiBearerAuth()
  @UseRoles(RolesUserEnum.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @ApiResponse({
    status: 200,
    type: ChangePasswordEntyty,
  })
  async changePassword(
    @ReqUser() user: usersInterface,
    @Body(ChangePasswordUserValidationPipe) body: changePasswordDto,
  ): Promise<void> {
    try {
      await this.usersService.changePasswordUser(
        user.userId,
        body.hashPassword,
      );
    } catch (e) {
      this.logger.error(
        `catch on changePassword: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Put(':userId/banned')
  @ApiBearerAuth()
  @UseRoles(RolesUserEnum.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async banUser(@Param('userId') userId: string): Promise<void> {
    try {
      const user = await this.usersService.banUser(userId);
      if (!user) {
        throw new BadRequestException('User Id Not found');
      }

      return;
    } catch (e) {
      this.logger.error(
        `catch on ban-user: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @Put(':userId/un-ban-user')
  @ApiBearerAuth()
  @UseRoles(RolesUserEnum.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async unBanUser(@Param('userId') userId: string): Promise<void> {
    try {
      const user = await this.usersService.unBanUser(userId);
      if (!user) {
        throw new BadRequestException('User Id Not found');
      }
      return;
    } catch (e) {
      this.logger.error(
        `catch on un-ban-user: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }
}
