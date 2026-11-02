# CareerCraft

Full-stack CV Builder & Portfolio Platform built with Next.js, NestJS, MySQL, and Prisma.

## Quick Start

### Prerequisites
- Node.js ≥ 20
- MySQL (MariaDB 10.4+ via XAMPP or MySQL 8+)
- Git

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your database credentials

# 3. Run database migrations
npm run db:migrate

# 4. Seed development data
npm run db:seed

# 5. Start development servers
npm run dev:api   # Backend on http://localhost:3001
npm run dev:web   # Frontend on http://localhost:3000
```

### Project Structure

```
career-craft/
  apps/
    web/    → Next.js frontend
    api/    → NestJS backend API
  docs/     → Documentation
```

### Documentation

- [Setup Guide](docs/setup.md)
- [Architecture](docs/architecture.md)
- [Progress](docs/progress.md)

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev:web` | Start frontend dev server |
| `npm run dev:api` | Start backend dev server |
| `npm run build:web` | Build frontend for production |
| `npm run build:api` | Build backend for production |
| `npm run test:api` | Run backend tests |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed development data |
| `npm run db:studio` | Open Prisma Studio |

## License

Private project.
