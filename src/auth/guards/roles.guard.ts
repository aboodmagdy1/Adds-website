import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLES_KEY } from '../decorators/roles.decorator';
import { UserRepository } from 'src/users/user.repository';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRepository: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      // if no roles are required, then allow access
      return true;
    }
    const reqest = context.switchToHttp().getRequest();
    const user = await this.userRepository.findOne({ _id: reqest.user });
    console.log(user);
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
