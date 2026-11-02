/*
 * RolesGuard — Role-Based Authorization Guard (RBAC)
 *
 * 🔑 NestJS Concept: Reflector & Authorization Guards
 * While JwtAuthGuard verifies "who you are" (Authentication),
 * RolesGuard verifies "what you are allowed to do" (Authorization).
 *
 * It uses Reflector to retrieve required roles from the @Roles() decorator
 * and verifies `req.user.role` matches.
 */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No specific role required
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException('Access denied: insufficient administrative privileges');
    }

    return true;
  }
}
