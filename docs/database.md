# CareerCraft — Database Design

## Overview

The database is powered by **MySQL** (MariaDB 10.4+ in local development via XAMPP) managed through **Prisma ORM**.

## Entity Relationship Summary

```
[User] 1 ──── 1 [Profile]
  │
  ├── 1 ──── * [Cv] * ──── 1 [CvTemplate]
  │
  ├── 1 ──── * [Portfolio] * ──── 1 [PortfolioTemplate]
  │              │
  │              └── 1 ──── * [PortfolioProject]
  │
  └── 1 ──── * [Media]
```

## Tables & Models

### 1. `users`
Core user credentials and authorization roles.
- `id` (VARCHAR(36), PK): UUID identifier.
- `email` (VARCHAR(191), UNIQUE): Registered login email.
- `passwordHash` (VARCHAR(191)): bcrypt hash of password.
- `role` (ENUM('USER', 'ADMIN')): Authorization level.
- `createdAt` (DATETIME): Registration timestamp.
- `updatedAt` (DATETIME): Last update timestamp.

### 2. `profiles`
Single reusable user profile providing common personal data for multiple CVs and portfolios.
- `id` (VARCHAR(36), PK): UUID.
- `userId` (VARCHAR(36), UNIQUE, FK -> users.id ON DELETE CASCADE).
- `firstName`, `lastName`: Personal names.
- `headline`: Professional title or tag line.
- `bio` (TEXT): Overview summary.
- `phone`, `address`, `city`, `country`, `postalCode`: Contact location.
- `website`, `github`, `linkedin`, `twitter`: Social links.
- `avatarUrl`: Profile photo path.
- `createdAt`, `updatedAt`: Timestamps.

### 3. `cv_templates`
System-defined and admin-managed CV templates.
- `id` (VARCHAR(36), PK): UUID.
- `slug` (VARCHAR(191), UNIQUE): Template identifier (e.g., `classic-professional`, `minimal`).
- `name` (VARCHAR(191)): Display title.
- `description` (TEXT): Description and best-use guidance.
- `thumbnail` (VARCHAR(191)): Preview screenshot path.
- `layout` (VARCHAR(191)): Layout structure identifier.
- `isActive` (BOOLEAN): Template availability status.
- `createdAt`, `updatedAt`: Timestamps.

### 4. `cvs`
User-owned CV documents referencing a template.
- `id` (VARCHAR(36), PK): UUID.
- `userId` (VARCHAR(36), FK -> users.id ON DELETE CASCADE).
- `templateId` (VARCHAR(36), FK -> cv_templates.id ON DELETE RESTRICT).
- `title` (VARCHAR(191)): Name given by user (e.g. "Senior React Developer Resume").
- `slug` (VARCHAR(191), optional): URL-safe slug.
- `content` (JSON): Structured content (experience, education, skills, projects, certifications, languages, custom sections).
- `styling` (JSON, optional): User customization (colors, fonts, spacing, section ordering).
- `createdAt`, `updatedAt`: Timestamps.

### 5. `portfolio_templates`
Pre-designed personal portfolio layouts.
- `id` (VARCHAR(36), PK): UUID.
- `slug` (VARCHAR(191), UNIQUE): e.g., `minimal-developer`, `dark-creative`.
- `name`, `description`, `thumbnail`, `layout`, `isActive`.
- `createdAt`, `updatedAt`: Timestamps.

### 6. `portfolios`
User personal websites with public publishing capabilities.
- `id` (VARCHAR(36), PK): UUID.
- `userId` (VARCHAR(36), FK -> users.id ON DELETE CASCADE).
- `templateId` (VARCHAR(36), FK -> portfolio_templates.id ON DELETE RESTRICT).
- `title` (VARCHAR(191)): Display title.
- `slug` (VARCHAR(191), UNIQUE): Public URL slug (`/p/[slug]`).
- `bio` (TEXT, optional): Headline / introduction text.
- `themeConfig` (JSON, optional): Custom colors, typography, section order and visibility.
- `isPublished` (BOOLEAN): Controls public accessibility.
- `publishedAt` (DATETIME, optional): Timestamp when made public.
- `createdAt`, `updatedAt`: Timestamps.

### 7. `portfolio_projects`
Projects showcased in a portfolio.
- `id` (VARCHAR(36), PK): UUID.
- `portfolioId` (VARCHAR(36), FK -> portfolios.id ON DELETE CASCADE).
- `title` (VARCHAR(191)): Project name.
- `description` (TEXT): Case study or feature summary.
- `technologies` (JSON): Array of technology tags.
- `projectUrl`, `repoUrl`, `imageUrl`: External links.
- `displayOrder` (INT): Sort priority.
- `isFeatured` (BOOLEAN): Highlight status.
- `createdAt`, `updatedAt`: Timestamps.

### 8. `media`
Upload file metadata.
- `id` (VARCHAR(36), PK): UUID.
- `userId` (VARCHAR(36), FK -> users.id ON DELETE CASCADE).
- `filename`, `originalName`, `mimeType`, `size`, `url`.
- `createdAt` (DATETIME): Upload timestamp.

## Migrations

Prisma migrations are tracked in `apps/api/prisma/migrations`.
Applied via:
```bash
npm run db:migrate
```
Seed data applied via:
```bash
npm run db:seed
```
