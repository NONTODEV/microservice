import { SetMetadata } from '@nestjs/common';
import { RolesUserEnum } from '@lib/commom/enum/roles-user.enum';

export const UseRoles = (...roles: RolesUserEnum[]) =>
  SetMetadata('roles', roles);
