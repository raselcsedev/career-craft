/*
 * PrismaModule — Global Database Module
 *
 * 🔑 NestJS Concept: @Global() Module & Exports
 * - @Global(): Makes PrismaService accessible to EVERY module in the application
 *   without having to import PrismaModule into each one individually.
 * - exports: [PrismaService]: Anything listed in exports can be injected into
 *   other modules' controllers and services.
 */
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
