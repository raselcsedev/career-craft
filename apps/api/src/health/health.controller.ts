/*
 * HealthController — A Simple API Endpoint
 *
 * 🔑 NestJS Concept: Controller
 * A Controller handles incoming HTTP requests and returns responses.
 * It's like a Next.js API route file (e.g., app/api/health/route.ts),
 * but instead of exporting GET/POST functions, you use decorators.
 *
 * Decorators are the @-prefixed annotations:
 *   @Controller('health') → sets the route prefix to /health
 *   @Get()               → handles GET requests to this route
 *
 * Combined with the global prefix 'api/v1', this responds at:
 *   GET /api/v1/health
 *
 * 🔑 NestJS Concept: Dependency Injection (DI)
 * In Next.js, you import and call functions directly.
 * In NestJS, you "inject" services through the constructor.
 * NestJS automatically creates and passes the service instance.
 * We'll see this in action when we add our first service.
 */
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check API health status' })
  check() {
    return {
      status: 'CareerCraft API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
