/*
 * PrismaService — Database Connection Management
 *
 * 🔑 NestJS Concept: Service & Lifecycle Hooks
 * In Next.js, you might instantiate PrismaClient in a global variable (e.g. lib/prisma.ts).
 * In NestJS, a Service is a class marked with @Injectable().
 * Nest's dependency injection system creates a single instance (singleton) and shares it.
 *
 * OnModuleInit and OnModuleDestroy are Lifecycle Hooks:
 * - onModuleInit: called when the app starts, so we connect to MySQL.
 * - onModuleDestroy: called when the app shuts down gracefully.
 */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
