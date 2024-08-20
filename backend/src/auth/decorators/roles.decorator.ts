import { SetMetadata } from '@nestjs/common';

export enum Role {
  Admin = 'admin',
  Guest = 'guest',
  Owner = 'owner',
  Assistant = 'assistant',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
