/*
 * UsersService — User and Profile Query Service
 *
 * 🔑 NestJS Concept: Dependency Injection (DI)
 * Look at the constructor:
 *   constructor(private prisma: PrismaService) {}
 *
 * We don't do `new PrismaService()`. NestJS automatically injects the single
 * PrismaService instance when UsersService is initialized!
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  async create(data: { email: string; passwordHash: string; firstName?: string; lastName?: string }) {
    return this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        profile: {
          create: {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
          },
        },
      },
      include: { profile: true },
    });
  }
}
