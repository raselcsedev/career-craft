# CareerCraft — Architecture

## Overview

CareerCraft is a monorepo containing two applications:

```
careercraft/
  apps/
    web/    → Next.js 15 frontend (App Router, TypeScript, Tailwind CSS)
    api/    → NestJS backend (TypeScript, Prisma, MySQL)
  docs/     → Project documentation
```

## Tech Stack

| Layer          | Technology                                |
|----------------|-------------------------------------------|
| Frontend       | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Forms          | React Hook Form + Zod                     |
| Data Fetching  | TanStack Query                            |
| Icons          | Lucide React                              |
| Backend        | NestJS, TypeScript                        |
| Database       | MySQL (MariaDB 10.4 via XAMPP)            |
| ORM            | Prisma                                    |
| Auth           | JWT (access + refresh tokens, HTTP-only cookies) |
| PDF            | @react-pdf/renderer                       |
| API Docs       | Swagger                                   |
| Testing        | Jest, Supertest                           |

## Communication

- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:3001`
- Frontend calls backend APIs at `/api/v1/*`
- CORS configured for dev origins

## Authentication Flow

1. User submits login form → POST `/api/v1/auth/login`
2. Backend validates credentials, returns JWT in HTTP-only cookie
3. Frontend reads user from GET `/api/v1/auth/me` (cookie sent automatically)
4. Protected pages redirect to login if no valid session

## Database

MySQL database `careercraft` with Prisma ORM.
Migrations tracked in `apps/api/prisma/migrations/`.

See [database.md](./database.md) for schema details.
