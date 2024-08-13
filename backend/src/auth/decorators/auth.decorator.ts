// composition of decorators for auth

import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from './roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { AuthGuard } from '../guards/auth.guard';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
  );
}
