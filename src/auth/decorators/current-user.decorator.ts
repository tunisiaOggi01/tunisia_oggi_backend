import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** Injects the authenticated user (set on the request by JwtAuthGuard) into a handler parameter. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
