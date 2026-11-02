# CareerCraft — Progress Tracker

## Phase 0 — Inspect and Plan ✅
- [x] Inspected workspace (empty directory)
- [x] Verified Node.js v24.14.1
- [x] Verified npm v11.6.3
- [x] Verified Git v2.29.1
- [x] Verified MySQL (MariaDB 10.4.32 via XAMPP, root, no password)
- [x] Created `careercraft` database
- [x] Created implementation roadmap
- [x] Created .gitignore and root package.json

## Phase 1 — Project Setup & NestJS Fundamentals ✅
- [x] Create Next.js app (apps/web)
- [x] Create NestJS API (apps/api)
- [x] Configure TypeScript
- [x] Configure MySQL + Prisma
- [x] Health endpoint (GET /api/v1/health)
- [x] Frontend fetches health endpoint
- [x] NestJS concepts explained: Module, Controller, Service, DI
- [x] Initial git commit

## Phase 2 — Database & Authentication ✅
- [x] Install auth packages (bcryptjs, jwt, passport, cookie-parser)
- [x] Design Prisma schema (User, Profile, CvTemplate, Cv, PortfolioTemplate, Portfolio, PortfolioProject, Media)
- [x] Run Prisma migration
- [x] Seed dev templates (6 CV + 6 Portfolio templates + test user)
- [x] Implement PrismaService and UsersModule
- [x] Implement AuthModule (register, login, logout, me, JWT cookie strategy)
- [x] Add Auth Guard and CurrentUser decorator
- [x] Add Supertest E2E / Jest tests for Auth
- [x] Verify database persistence in MySQL

## Phase 3 — Application Shell & Dashboard 🔄
- [ ] Install TanStack Query, React Hook Form, Zod, and Lucide in frontend
- [ ] Set up API client and Auth context / hook with real cookie/session management
- [ ] Build Design System (Navbar, Footer, Button, Card, Input, Modal, Badge, Toast/Alert)
- [ ] Public marketing landing page with feature highlights and template previews
- [ ] Authentication screens: Register, Login, with form validation and server errors
- [ ] Protected Dashboard layout (Sidebar, Header, User Menu)
- [ ] User Profile Management page (edit personal info, headline, links, avatar)
- [ ] User Profiles Backend API (`GET /api/v1/users/me/profile`, `PATCH /api/v1/users/me/profile`)
- [ ] Test frontend authentication flows end-to-end

## Phase 4 — CV Builder
- [ ] CV CRUD + duplication API
- [ ] CV editor forms (all sections)
- [ ] Template gallery (6 templates)
- [ ] Shared CV rendering system
- [ ] Live preview
- [ ] Autosave with debounce
- [ ] PDF export
- [ ] Tests

## Phase 5 — Portfolio Builder
- [ ] Portfolio CRUD API
- [ ] Portfolio editor
- [ ] Project management + image uploads
- [ ] 6 portfolio templates
- [ ] Publish/unpublish with unique slugs
- [ ] Public portfolio pages
- [ ] Access control tests

## Phase 6 — Admin & Polish
- [ ] Admin area
- [ ] Responsive refinement
- [ ] Account settings + deletion
- [ ] Error/loading/empty states polish

## Phase 7 — Testing & Security
- [ ] Backend tests
- [ ] Frontend tests
- [ ] Lint + TypeScript checks
- [ ] Production builds
- [ ] Security audit

## Phase 8 — Final Release
- [ ] Complete documentation
- [ ] Deployment guide
- [ ] Final end-to-end verification
- [ ] Completion report
