/*
 * @CurrentUser() — Custom Parameter Decorator
 *
 * 🔑 NestJS Concept: Param Decorator
 * Instead of accessing the raw Express request object `req.user`,
 * NestJS lets us create custom decorators to cleanly extract data.
 *
 * Usage in a controller:
 *   @Get('me')
 *   getMe(@CurrentUser() user: SafeUser) { return user; }
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
