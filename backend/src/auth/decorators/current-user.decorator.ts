import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getCurretUserByContext = (ctx: ExecutionContext) =>
  ctx.switchToHttp().getRequest().user;

export const currentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => getCurretUserByContext(ctx),
);
