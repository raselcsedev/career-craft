/*
 * @Roles(...) — Role Metadata Decorator
 *
 * 🔑 NestJS Concept: Custom Metadata Decorator
 * In NestJS, `SetMetadata` allows attaching custom metadata (such as required roles)
 * to route handlers.
 *
 * Usage:
 *   @Roles(Role.ADMIN)
 *   @Get('stats')
 *   getStats() { ... }
 */
import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
