/*
 * JwtStrategy — Passport strategy for JWT authentication
 *
 * 🔑 NestJS Concept: Passport Strategy
 * When a request arrives at a protected route:
 * 1. Passport extracts the token (from HTTP-only cookie OR Authorization header)
 * 2. It verifies the signature using JWT_ACCESS_SECRET
 * 3. It runs `validate(payload)` below
 * 4. Whatever `validate` returns is automatically attached to `req.user`!
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1. First attempt to read from HTTP-only cookie
        (request: Request) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['access_token'];
          }
          return token;
        },
        // 2. Fallback to Authorization: Bearer <token>
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET', 'dev-access-secret-change-in-production'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User account no longer exists');
    }
    // Omit passwordHash before attaching to request
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
