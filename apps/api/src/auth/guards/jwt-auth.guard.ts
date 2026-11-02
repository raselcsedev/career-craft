/*
 * JwtAuthGuard — Protects endpoints requiring authentication
 *
 * 🔑 NestJS Concept: Guard
 * Like Next.js middleware, a Guard runs BEFORE the route handler.
 * If the JWT is missing or invalid, it immediately returns 401 Unauthorized.
 * If valid, it lets the request continue and attaches user data to `req.user`.
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
