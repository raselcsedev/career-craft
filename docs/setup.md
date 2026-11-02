# CareerCraft — Setup Guide

## Prerequisites

- **Node.js** ≥ 20 (tested with v24.14.1)
- **npm** ≥ 10 (tested with v11.6.3)
- **MySQL** (MariaDB 10.4+ via XAMPP, or MySQL 8+)
- **Git**

## 1. Clone and Install

```bash
git clone <repository-url>
cd career-craft
npm install
```

## 2. Database Setup

1. Start MySQL (e.g., start XAMPP MySQL service)
2. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS careercraft CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Copy the backend environment file:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
4. Edit `apps/api/.env` with your database credentials

## 3. Run Migrations & Seed

```bash
npm run db:migrate
npm run db:seed
```

## 4. Start Development Servers

In two terminals:

```bash
# Terminal 1 — Backend API (port 3001)
npm run dev:api

# Terminal 2 — Frontend (port 3000)
npm run dev:web
```

## 5. Open the App

- Frontend: http://localhost:3000
- API Swagger: http://localhost:3001/api/docs
- API Health: http://localhost:3001/api/v1/health

## Environment Variables

See `.env.example` files in each app for required variables.
