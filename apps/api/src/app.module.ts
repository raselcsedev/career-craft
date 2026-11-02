/*
 * AppModule — The Root Module
 *
 * 🔑 NestJS Concept: Module
 * A Module is like a folder that groups related code together.
 * Think of it like a Next.js route group — it organizes controllers
 * (route handlers) and services (business logic) into logical units.
 *
 * AppModule is the ROOT module. NestJS starts here and discovers
 * everything your app needs by following the module imports.
 *
 * - `imports`: other modules this module depends on
 * - `controllers`: route handlers (like Next.js API route files)
 * - `providers`: services (reusable business logic classes)
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    // ConfigModule loads .env variables so we can use them anywhere
    // isGlobal: true means we don't need to import it in every module
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
