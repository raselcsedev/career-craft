<div align="center">

# 🚀 CareerCraft

**Professional CV Builder & Portfolio Platform**

Build stunning CVs and publish your personal portfolio site — all from one place.

[![Live API](https://img.shields.io/badge/API-Live%20on%20Render-46e3b7?logo=render)](https://careercraft-api-ou4j.onrender.com/api/docs)
[![Frontend](https://img.shields.io/badge/Frontend-Live%20on%20Vercel-black?logo=vercel)](https://career-craft.vercel.app)
[![Tests](https://img.shields.io/badge/Tests-42%20passed-brightgreen?logo=jest)](./apps/api)
[![License](https://img.shields.io/badge/License-Private-red)](#)

</div>

---

## 📌 Table of Contents

- [What is CareerCraft?](#-what-is-careercraft)
- [Live Deployment](#-live-deployment)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Database Schema](#-database-schema)
- [User Roles](#-user-roles)
- [Feature Walkthrough](#-feature-walkthrough)
  - [Authentication](#1-authentication)
  - [CV Builder](#2-cv-builder)
  - [Portfolio Builder](#3-portfolio-builder)
  - [Profile Management](#4-profile-management)
  - [Admin Panel](#5-admin-panel)
- [API Reference](#-api-reference)
- [CV Templates](#-cv-templates)
- [Portfolio Templates](#-portfolio-templates)
- [Security Model](#-security-model)
- [Benefits](#-benefits)
- [Local Development](#-local-development)
- [Production Deployment](#-production-deployment)
- [Commands Reference](#-commands-reference)

---

## 💡 What is CareerCraft?

CareerCraft is a **full-stack SaaS platform** where professionals, developers, and students can:

- ✍️ **Build professional CVs** using beautiful, customisable templates
- 🌐 **Publish a personal portfolio site** with a unique public URL (`/p/your-name`)
- 📄 **Export CV as a print-ready A4 PDF** directly from the browser
- 📥 **Import an existing CV** by uploading a PDF or DOCX file (auto-parsed)
- 🎨 **Switch themes** (dark / light) and customise colours & typography per document
- 👤 **Maintain a reusable profile** that auto-seeds every new CV you create

---

## 🌐 Live Deployment

| Service | URL |
|---------|-----|
| Frontend (Vercel) | `https://career-craft.vercel.app` |
| Backend API (Render) | `https://careercraft-api-ou4j.onrender.com` |
| Swagger Docs | `https://careercraft-api-ou4j.onrender.com/api/docs` |
| Database | TiDB Cloud Serverless (MySQL-compatible) |

**Demo account:**
```
Email:    demo@careercraft.com
Password: Password123!
```

---

## 🛠 Tech Stack

### Frontend (`apps/web`)
| Technology | Purpose |
|-----------|---------|
| **Next.js 14** (App Router) | SSR / CSR hybrid React framework |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **React Context API** | Auth & theme state management |
| Custom UI Components | Reusable Button, Input, Card, Badge, Alert |

### Backend (`apps/api`)
| Technology | Purpose |
|-----------|---------|
| **NestJS** | Modular Node.js backend framework |
| **TypeScript** | Strict type safety (`noImplicitAny`) |
| **Prisma ORM** | Type-safe database access with migrations |
| **JWT + HTTP-only Cookies** | Secure stateless authentication |
| **bcryptjs** | Password hashing (10 salt rounds) |
| **Passport.js** | JWT strategy for auth guards |
| **Multer** | PDF/DOCX file upload handling |
| **Swagger / OpenAPI** | Auto-generated API documentation |
| **Jest** | Unit testing (42 tests, 8 suites) |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting with automatic GitHub deploys |
| **Render** | Backend hosting (auto-deploys on `git push`) |
| **TiDB Cloud Serverless** | Free MySQL-compatible database (AWS ap-northeast-1) |
| **GitHub** | Source control + CI trigger for both platforms |

---

## 🏗 Architecture Overview

```
Browser (Next.js on Vercel)
        │
        │  HTTPS + credentials: 'include'
        │  (HTTP-only JWT cookie on all requests)
        ▼
NestJS REST API (Render)
        │  api/v1/*
        │
  ┌─────┴──────────────────────────────────────┐
  │           NestJS Modules                    │
  │                                             │
  │  AuthModule  ──── JWT Strategy              │
  │  UsersModule ──── Profile CRUD              │
  │  CvsModule   ──── CV CRUD + PDF + Parser    │
  │  PortfoliosModule ─ Portfolio CRUD + Publish│
  │  AdminModule ──── Stats + Template mgmt     │
  │  CvTemplatesModule ─ Template listing       │
  │  PortfolioTemplatesModule                   │
  │  HealthModule ─── Uptime check              │
  └─────────────┬───────────────────────────────┘
                │  Prisma Client
                ▼
      TiDB Cloud (MySQL 8-compatible)
      ┌──────────────────────────────┐
      │  users  profiles  cvs        │
      │  cv_templates  portfolios    │
      │  portfolio_templates         │
      │  portfolio_projects  media   │
      └──────────────────────────────┘
```

---

## 🗄 Database Schema

```
User ──1:1── Profile
 │
 ├──1:N── Cv ──────────── CvTemplate
 │
 ├──1:N── Portfolio ───── PortfolioTemplate
 │             │
 │             └──1:N── PortfolioProject
 │
 └──1:N── Media
```

| Model | Key Fields |
|-------|-----------|
| `User` | `id`, `email` (unique), `passwordHash`, `role` (USER/ADMIN), timestamps |
| `Profile` | `firstName`, `lastName`, `headline`, `bio`, `phone`, `city`, `country`, `website`, `github`, `linkedin`, `twitter`, `avatarUrl` |
| `CvTemplate` | `slug`, `name`, `description`, `layout`, `isActive`, `thumbnail` |
| `Cv` | `userId`, `templateId`, `title`, `content` (JSON), `styling` (JSON) |
| `PortfolioTemplate` | `slug`, `name`, `description`, `layout`, `isActive`, `thumbnail` |
| `Portfolio` | `userId`, `templateId`, `title`, `slug` (unique, public URL), `bio`, `themeConfig` (JSON), `isPublished`, `publishedAt` |
| `PortfolioProject` | `portfolioId`, `title`, `description`, `technologies` (JSON), `projectUrl`, `repoUrl`, `imageUrl`, `displayOrder`, `isFeatured` |
| `Media` | `userId`, `filename`, `mimeType`, `size`, `url` |

---

## 👤 User Roles

CareerCraft has **two roles** enforced at the API level via JWT claims + `RolesGuard`.

### 🙋 USER (default for all registrations)

| What they can do | How |
|-----------------|-----|
| Register & login | `POST /api/v1/auth/register` / `/login` |
| Update their profile | `PATCH /api/v1/users/profile` |
| Change their password | `PATCH /api/v1/users/change-password` |
| Delete their account | `DELETE /api/v1/users/me` |
| Create CVs | `POST /api/v1/cvs` |
| View their own CVs | `GET /api/v1/cvs` |
| Edit a CV | `PATCH /api/v1/cvs/:id` |
| Duplicate a CV | `POST /api/v1/cvs/:id/duplicate` |
| Delete a CV | `DELETE /api/v1/cvs/:id` |
| Upload & parse a PDF/DOCX | `POST /api/v1/cvs/parse-document` |
| Create portfolios | `POST /api/v1/portfolios` |
| Edit a portfolio | `PATCH /api/v1/portfolios/:id` |
| Add/edit/remove projects | `POST/PATCH/DELETE /api/v1/portfolios/:id/projects/:pid` |
| Publish / unpublish | `POST /api/v1/portfolios/:id/publish` or `/unpublish` |
| Browse available templates | `GET /api/v1/cv-templates` / `/portfolio-templates` |

> **Ownership enforcement**: every CV and Portfolio endpoint verifies `cv.userId === JWT.sub` before any read/write. You can never access another user's data by guessing an ID.

---

### 🛡 ADMIN (manually promoted in the database)

Admins get everything a USER can do, **plus**:

| What they can do | How |
|-----------------|-----|
| View system-wide statistics | `GET /api/v1/admin/stats` (total users, CVs, portfolios, templates) |
| List all CV & portfolio templates | `GET /api/v1/admin/templates` |
| Activate / deactivate a CV template | `PATCH /api/v1/admin/cv-templates/:id/status` |
| Activate / deactivate a portfolio template | `PATCH /api/v1/admin/portfolio-templates/:id/status` |
| See admin dashboard in the UI | `/dashboard/admin` route (hidden from regular users) |

> Deactivating a template means new CVs/portfolios cannot use it; existing documents are not affected.

---

## 🔍 Feature Walkthrough

### 1. Authentication

**How it works:**

1. User submits email + password to `/api/v1/auth/register` or `/login`
2. Server validates credentials and hashes the password with **bcrypt** (10 rounds)
3. On success, server signs a **JWT** (`sub: userId, email, role`) and sets an **HTTP-only cookie** (`access_token`) that expires in 7 days
4. Every subsequent request automatically sends the cookie; the `JwtAuthGuard` validates it
5. Logout hits `/api/v1/auth/logout` which clears the cookie server-side

**Cookie config (production):**
```
httpOnly: true    ← JavaScript cannot read it (XSS protection)
secure:   true    ← HTTPS only
sameSite: 'none'  ← cross-domain allowed (Vercel ↔ Render)
maxAge:   7 days
```

---

### 2. CV Builder

**Full lifecycle of a CV document:**

```
User clicks "New CV"
    │
    ├─ Chooses a template (6 available)
    │
    ├─ System auto-seeds content from the user's saved Profile
    │   (name, email, headline, bio, phone, location, socials)
    │
    └─ Opens the CV Editor with tabs:
        ├── Personal Info  → name, headline, email, phone, city, website, GitHub, LinkedIn
        ├── Summary        → professional bio paragraph
        ├── Experience     → multiple jobs (company, role, dates, description)
        ├── Education      → multiple degrees (institution, degree, field, dates, grade)
        ├── Skills         → skill name + category (Technical / Soft / Other)
        ├── Projects       → title, description, technologies, URL
        ├── Certifications → name, issuer, date
        ├── Languages      → language + proficiency level
        └── Design         → primary colour, font family, font size, spacing, section order
```

**Key capabilities:**
- 📥 **Import from PDF/DOCX** — upload an existing CV file; the backend extracts text and returns structured JSON pre-filling all fields
- 📄 **A4 PDF Export** — browser-native `window.print()` with a custom `@media print` stylesheet that hides all UI chrome and renders a clean A4 page
- 🔄 **Duplicate CV** — one-click clones a CV (title gets `(Copy)` suffix) for creating variants
- 🎨 **Live Preview** — the right panel renders the chosen template in real-time as you type
- 🔀 **Switch Template** — pick a different template without losing your content
- 💾 **Auto-save** — changes are persisted to the database on every form update

**CV content is stored as a single `JSON` column** in the database, making it schema-flexible for future fields without migrations.

---

### 3. Portfolio Builder

**Full lifecycle of a portfolio:**

```
User clicks "New Portfolio"
    │
    ├─ Enters title, unique slug (e.g. "john-doe"), and chooses a template
    │
    ├─ Bio is auto-filled from the user's Profile headline/bio
    │
    └─ Opens the Portfolio Editor:
        ├── Details tab  → title, slug, bio, theme colour, dark mode toggle
        ├── Projects tab → add/edit/reorder/delete projects
        │     Each project: title, description, technologies (tags),
        │                   live URL, GitHub repo URL, cover image URL,
        │                   featured flag, display order
        └── Publish / Unpublish toggle
```

**Public portfolio URL:** `https://career-craft.vercel.app/p/your-slug`

**How publishing works:**
1. Portfolio starts as `isPublished: false` — invisible to the public
2. User clicks **Publish** → API sets `isPublished: true` + `publishedAt: now()`
3. The public route `/p/[slug]` fetches the portfolio only if published; otherwise returns 404
4. User can **unpublish** at any time to hide it again without deleting data

**Slug safety rules enforced by the API:**
- Must be unique across all portfolios globally
- Reserved words are blocked: `api`, `admin`, `dashboard`, `login`, `register`, `auth`, `p`, `portfolio`, `docs`, `settings`, `profile`, `public`, `health`, `static`

---

### 4. Profile Management

The **Profile** is a reusable store of your personal information:

| Field | Shown on |
|-------|---------|
| First / Last name | CV personal info, Portfolio owner card |
| Headline | CV header, Portfolio bio |
| Bio | CV summary seed, Portfolio bio |
| Phone | CV personal info |
| City / Country | CV personal info |
| Website | CV links |
| GitHub | CV links |
| LinkedIn | CV links |
| Twitter | Portfolio social links |
| Avatar URL | Portfolio owner card |

**Why it matters:** When you create a new CV or portfolio, the system automatically pulls from your Profile to pre-fill content. You update your profile once, and every new document starts with accurate information.

Users can also:
- **Change password** — requires current password + new password (min 8 chars)
- **Delete account** — cascades and permanently removes all CVs, portfolios, projects, and media

---

### 5. Admin Panel

Accessible at `/dashboard/admin` for `ADMIN` role users only.

| Section | What it shows |
|---------|--------------|
| **System Stats** | Total users, CVs, portfolios, CV templates, portfolio templates |
| **CV Templates** | Full list with active/inactive toggle |
| **Portfolio Templates** | Full list with active/inactive toggle |

Deactivating a template prevents it from being selected for new documents. Existing documents that already use it are not affected.

---

## 📡 API Reference

Base URL: `https://careercraft-api-ou4j.onrender.com/api/v1`

Interactive docs: [Swagger UI](https://careercraft-api-ou4j.onrender.com/api/docs)

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | ❌ | Create account + set auth cookie |
| `POST` | `/auth/login` | ❌ | Login + set auth cookie |
| `POST` | `/auth/logout` | ✅ | Clear auth cookie |
| `GET` | `/auth/me` | ✅ | Get current authenticated user |

### Users / Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/users/profile` | ✅ | Get my profile |
| `PATCH` | `/users/profile` | ✅ | Update my profile |
| `PATCH` | `/users/change-password` | ✅ | Change password |
| `DELETE` | `/users/me` | ✅ | Delete account (cascade) |

### CVs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/cvs` | ✅ | List my CVs |
| `POST` | `/cvs` | ✅ | Create a new CV |
| `GET` | `/cvs/:id` | ✅ | Get a specific CV |
| `PATCH` | `/cvs/:id` | ✅ | Update CV content/style |
| `POST` | `/cvs/:id/duplicate` | ✅ | Duplicate a CV |
| `DELETE` | `/cvs/:id` | ✅ | Delete a CV |
| `POST` | `/cvs/parse-document` | ✅ | Upload PDF/DOCX → extract CV data |

### Portfolios
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/portfolios` | ✅ | List my portfolios |
| `POST` | `/portfolios` | ✅ | Create a portfolio |
| `GET` | `/portfolios/:id` | ✅ | Get a portfolio (private) |
| `PATCH` | `/portfolios/:id` | ✅ | Update portfolio |
| `DELETE` | `/portfolios/:id` | ✅ | Delete portfolio |
| `POST` | `/portfolios/:id/publish` | ✅ | Publish portfolio |
| `POST` | `/portfolios/:id/unpublish` | ✅ | Unpublish portfolio |
| `POST` | `/portfolios/:id/projects` | ✅ | Add project |
| `PATCH` | `/portfolios/:id/projects/:pid` | ✅ | Update project |
| `DELETE` | `/portfolios/:id/projects/:pid` | ✅ | Delete project |
| `GET` | `/p/:slug` | ❌ | Public portfolio page (published only) |

### Templates
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/cv-templates` | ❌ | List active CV templates |
| `GET` | `/portfolio-templates` | ❌ | List active portfolio templates |

### Admin
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| `GET` | `/admin/stats` | ✅ | ADMIN |
| `GET` | `/admin/templates` | ✅ | ADMIN |
| `PATCH` | `/admin/cv-templates/:id/status` | ✅ | ADMIN |
| `PATCH` | `/admin/portfolio-templates/:id/status` | ✅ | ADMIN |

### System
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | ❌ | Uptime check → `{ status: "ok" }` |

---

## 🎨 CV Templates

6 built-in templates, each designed for a different career context:

| Template Slug | Name | Layout | Best for |
|--------------|------|--------|----------|
| `classic-professional` | Classic Professional | Single column | Traditional industries (finance, law) |
| `modern-corporate` | Modern Corporate | Two column | Business & management roles |
| `minimal-clean` | Minimal Clean | Single column | Minimalist aesthetic, all industries |
| `creative-accent` | Creative Accent | Sidebar accent | Design, marketing, creative fields |
| `developer-technical` | Developer Technical | Tech-focused | Software engineers, DevOps |
| `student-graduate` | Student Graduate | Single column | Students & recent graduates |

All templates support:
- Custom primary colour (hex picker)
- Font family selection (Inter, Georgia, Roboto, Mono)
- Font size (compact / normal / large)
- Spacing (compact / normal / relaxed)
- Drag-to-reorder sections

---

## 🖼 Portfolio Templates

6 built-in portfolio site templates:

| Template Slug | Name | Best for |
|--------------|------|---------|
| `minimal-developer` | Minimal Developer | Clean, code-focused portfolios |
| `modern-personal-brand` | Modern Personal Brand | Personal branding & marketing |
| `dark-creative` | Dark Creative | Designers, artists, creative technologists |
| `professional-corporate` | Professional Corporate | Business professionals |
| `designer-visual` | Designer Visual | UI/UX and visual designers |
| `student-portfolio` | Student Portfolio | Students showcasing academic projects |

Each portfolio template supports per-portfolio:
- Primary colour theming
- Dark mode / light mode toggle
- Section visibility (about, skills, projects, contact)

---

## 🔒 Security Model

| Concern | Implementation |
|---------|---------------|
| **Password storage** | bcrypt with 10 salt rounds — never stored in plaintext |
| **Session management** | HTTP-only, `secure`, `sameSite: none` JWT cookie — unreadable by JavaScript |
| **JWT validation** | Every protected route uses `JwtAuthGuard` + Passport JWT strategy |
| **Ownership enforcement** | Every CV/portfolio operation cross-checks `resource.userId === JWT.sub` |
| **Role enforcement** | `RolesGuard` + `@Roles('ADMIN')` decorator on all admin endpoints |
| **Public data minimization** | Public portfolio endpoint strips `passwordHash` and all private fields |
| **Slug reservation** | Reserved system keywords (`api`, `admin`, `login`, etc.) cannot be used as portfolio slugs |
| **Input validation** | `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true` — extra fields are rejected |
| **CORS** | Allows `*.vercel.app`, configured `CORS_ORIGIN`, and localhost; all others blocked |
| **Secrets** | `DATABASE_URL`, `JWT_SECRET` are environment variables only — never committed to git |

---

## ✨ Benefits

### For Users
- 🆓 **Completely free** — hosted on free tiers (Vercel, Render, TiDB Cloud)
- ⚡ **Instant setup** — register and have a professional CV in under 5 minutes
- 📱 **Responsive** — works on desktop, tablet, and mobile
- 🌙 **Dark / Light mode** — system preference + manual toggle
- 📥 **Import your existing CV** — upload a PDF or DOCX and get structured data instantly
- 📄 **PDF export** — clean A4 print layout without any watermarks or paid plans
- 🌐 **Free public portfolio URL** — share `yourname.vercel.app/p/your-slug` on LinkedIn
- 🔒 **Secure** — HTTP-only cookies protect against XSS; server-side ownership checks prevent data leaks
- 🔄 **Reusable profile** — update once, your info flows into every new document

### For Developers / Contributors
- 🏗 **Monorepo structure** — frontend and backend in one repo, easy to run together
- 📝 **Full TypeScript** — end-to-end type safety with strict settings
- 🧪 **Test coverage** — 42 unit tests covering all services and controllers
- 📖 **Swagger docs** — auto-generated, always up-to-date API documentation
- 🔁 **Auto-deploy** — push to `master` → Render & Vercel automatically rebuild and deploy
- 🗃 **Prisma migrations** — reproducible, version-controlled database schema
- 🧩 **Modular NestJS** — each feature (auth, CVs, portfolios, admin) is an isolated module

---

## 💻 Local Development

### Prerequisites
- Node.js ≥ 20
- MySQL 8+ or MariaDB 10.4+ (via XAMPP, Docker, or cloud)
- Git

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/raselcsedev/career-craft.git
cd career-craft

# 2. Install all dependencies (root + workspaces)
npm install

# 3. Configure the API environment
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env — set DATABASE_URL, JWT_SECRET, etc.
```

**`apps/api/.env` template:**
```env
DATABASE_URL="mysql://root:password@localhost:3306/careercraft"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
NODE_ENV="development"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

```bash
# 4. Run database migrations
npm run db:migrate

# 5. Seed demo data (templates + demo user)
npm run db:seed

# 6. Start both servers in parallel
npm run dev:api   # → http://localhost:3001  (NestJS)
npm run dev:web   # → http://localhost:3000  (Next.js)
```

**Swagger UI (local):** http://localhost:3001/api/docs

---

## 🚀 Production Deployment

### Frontend → Vercel

1. Push your repo to GitHub
2. Import the repo in [vercel.com](https://vercel.com) → select `./apps/web` as the root directory
3. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL = https://careercraft-api-ou4j.onrender.com
   ```
4. Deploy — Vercel auto-rebuilds on every `git push`

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com) → connect your GitHub repo
2. Settings:
   ```
   Root Directory:  apps/api
   Build Command:   npm install --include=dev && npx prisma generate --schema=prisma/schema.prisma && npx prisma migrate deploy --schema=prisma/schema.prisma && npm run build
   Start Command:   node dist/src/main
   ```
3. Set environment variables in the Render dashboard:
   ```
   DATABASE_URL  = mysql://user:pass@host:4000/dbname?sslaccept=strict
   JWT_SECRET    = <your-secret>
   NODE_ENV      = production
   CORS_ORIGIN   = https://your-vercel-app.vercel.app
   PORT          = 3001
   ```
4. Deploy — Render auto-redeploys on every `git push`

### Database → TiDB Cloud Serverless (Free)

1. Sign up at [tidbcloud.com](https://tidbcloud.com) → create a free Serverless cluster
2. Copy the connection string (use database name `test`, not `sys`)
3. Set it as `DATABASE_URL` in Render environment variables
4. Migrations run automatically during Render's build command

> **Note:** TiDB Cloud Serverless free tier includes 5 GB storage, 50M row-reads/month, and 5M row-writes/month — sufficient for most personal and small team projects.

---

## 📋 Commands Reference

### Root (run from `career-craft/`)
| Command | Description |
|---------|-------------|
| `npm run dev:web` | Start Next.js frontend dev server (port 3000) |
| `npm run dev:api` | Start NestJS backend dev server (port 3001) |
| `npm run build:web` | Build frontend for production |
| `npm run build:api` | Build backend for production |
| `npm run test:api` | Run all 42 backend unit tests |
| `npm run db:migrate` | Run Prisma migrations (applies new schema changes) |
| `npm run db:seed` | Seed development data (templates + demo user) |
| `npm run db:studio` | Open Prisma Studio (visual database browser) |

### API only (run from `apps/api/`)
| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript → `dist/` |
| `npm test` | Run Jest unit tests |
| `npm run test:watch` | Watch mode for TDD |
| `npx prisma generate` | Regenerate Prisma Client after schema changes |
| `npx prisma migrate dev` | Create + apply a new migration |
| `npx prisma migrate deploy` | Apply pending migrations (production) |
| `npx prisma studio` | Visual DB browser on http://localhost:5555 |

---

## 📁 Project Structure

```
career-craft/
├── apps/
│   ├── api/                        ← NestJS backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma       ← Database schema
│   │   │   ├── migrations/         ← Migration history
│   │   │   └── seed.ts             ← Demo data seeder
│   │   └── src/
│   │       ├── main.ts             ← App entry point (CORS, Swagger, port)
│   │       ├── app.module.ts       ← Root module
│   │       ├── auth/               ← Login, register, JWT, cookies
│   │       ├── users/              ← Profile, password, account deletion
│   │       ├── cvs/                ← CV CRUD, duplicate, PDF parse
│   │       ├── cv-templates/       ← Template listing
│   │       ├── portfolios/         ← Portfolio CRUD, projects, publish
│   │       ├── portfolio-templates/
│   │       ├── admin/              ← Stats + template activation
│   │       ├── health/             ← Uptime endpoint
│   │       └── prisma/             ← Prisma service wrapper
│   │
│   └── web/                        ← Next.js frontend
│       └── src/
│           ├── app/
│           │   ├── page.tsx              ← Landing page
│           │   ├── (auth)/
│           │   │   ├── login/page.tsx
│           │   │   └── register/page.tsx
│           │   ├── (dashboard)/
│           │   │   ├── layout.tsx        ← Dashboard shell + sidebar
│           │   │   └── dashboard/
│           │   │       ├── page.tsx      ← Overview
│           │   │       ├── cvs/          ← CV list + editor
│           │   │       ├── portfolios/   ← Portfolio list + editor
│           │   │       ├── profile/      ← Profile form
│           │   │       ├── settings/     ← Password + account deletion
│           │   │       └── admin/        ← Admin panel (ADMIN only)
│           │   └── p/[slug]/page.tsx     ← Public portfolio viewer
│           ├── components/
│           │   ├── cv-editor/            ← 8 section forms + template picker
│           │   ├── cv-templates/         ← 6 CV renderers
│           │   ├── portfolio-templates/  ← 6 portfolio renderers
│           │   ├── layout/               ← Navbar, Footer
│           │   └── ui/                   ← Button, Input, Card, Badge, Alert
│           └── lib/
│               ├── api.ts                ← Typed fetch wrapper
│               ├── auth-context.tsx      ← Auth state provider
│               └── theme-context.tsx     ← Dark/light mode provider
│
├── docs/                           ← Architecture & setup documentation
├── package.json                    ← Monorepo root (workspaces)
└── README.md                       ← This file
```

---

## 🤝 Contributing

1. Fork the repo and create a feature branch: `git checkout -b feat/my-feature`
2. Make changes — run `npm test:api` to ensure all 42 tests still pass
3. Commit with a conventional commit message: `feat(cvs): add language proficiency levels`
4. Push and open a Pull Request against `master`

**Git commit convention:**
```
feat(scope):     new feature
fix(scope):      bug fix
refactor(scope): code improvement (no behaviour change)
docs(scope):     documentation only
test(scope):     test additions or corrections
```

---

## 📄 License

Private project — © 2026 Md Rasel. All rights reserved.
