# CareerCraft — REST API Documentation

All API endpoints are prefixed with `/api/v1` and served by the NestJS backend at `http://localhost:3001`.
Interactive Swagger documentation is available at `http://localhost:3001/api/docs`.

---

## 1. Authentication (`/api/v1/auth`)

### `POST /api/v1/auth/register`
Creates a new user account, provisions an initial profile in MySQL, and sets the `access_token` HTTP-only cookie.

- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!",
    "firstName": "Alex",
    "lastName": "Morgan"
  }
  ```
- **Responses**:
  - `201 Created`: Returns safe user object & accessToken. Sets `access_token` cookie.
  - `400 Bad Request`: Input validation errors (invalid email, password < 6 chars).
  - `409 Conflict`: Email already registered.

### `POST /api/v1/auth/login`
Authenticates existing credentials, sets `access_token` cookie.

- **Request Body**:
  ```json
  {
    "email": "demo@careercraft.com",
    "password": "Password123!"
  }
  ```
- **Responses**:
  - `200 OK`: Returns safe user object & accessToken. Sets `access_token` cookie.
  - `401 Unauthorized`: Invalid credentials.

### `POST /api/v1/auth/logout`
Clears the `access_token` cookie.

- **Responses**:
  - `200 OK`: `{ "message": "Logged out successfully" }`

### `GET /api/v1/auth/me`
*Protected via `JwtAuthGuard`.*
Extracts user from HTTP-only cookie or `Authorization: Bearer <token>`.

- **Responses**:
  - `200 OK`: Returns current authenticated user record with attached profile.
  - `401 Unauthorized`: Token missing or expired.

---

## 2. User Profiles (`/api/v1/users`)

### `GET /api/v1/users/me/profile`
*Protected via `JwtAuthGuard`.*
Retrieves the reusable profile data for the authenticated user.

- **Responses**:
  - `200 OK`: Returns profile object (`firstName`, `lastName`, `headline`, `bio`, `phone`, `city`, `country`, `website`, `github`, `linkedin`, `twitter`, `avatarUrl`).

### `PATCH /api/v1/users/me/profile`
*Protected via `JwtAuthGuard`.*
Updates reusable profile details. Changes automatically sync to all CVs and portfolios.

- **Request Body** (all fields optional):
  ```json
  {
    "firstName": "Alexander",
    "headline": "Senior Full-Stack Engineer",
    "city": "San Francisco",
    "github": "https://github.com/alex"
  }
  ```
- **Responses**:
  - `200 OK`: `{ "message": "Profile updated successfully", "profile": { ... } }`

### `PATCH /api/v1/users/me/password`
*Protected via `JwtAuthGuard`.*
Changes user password with bcrypt verification.

- **Request Body**:
  ```json
  {
    "currentPassword": "Password123!",
    "newPassword": "NewSecurePassword456!"
  }
  ```
- **Responses**:
  - `200 OK`: `{ "message": "Password updated successfully" }`
  - `400 Bad Request`: Current password incorrect.

### `DELETE /api/v1/users/me`
*Protected via `JwtAuthGuard`.*
Permanently deletes user account and cascade deletes all CV documents, portfolios, projects, and media. Clears cookies.

---

## 3. CV Templates (`/api/v1/cv-templates`)

### `GET /api/v1/cv-templates`
*Public.*
Returns all active CV templates sorted by display order.

- **Templates seeded**:
  - `classic-professional`: Single-column corporate & ATS layout.
  - `modern-corporate`: Two-column layout with credential sidebar.
  - `minimal`: Typographic simplicity with generous whitespace.
  - `creative`: Dynamic accents and bold visual headers.
  - `developer`: Tech monospace tags and project chips.
  - `student-graduate`: Education-first layout.

---

## 4. CV Documents (`/api/v1/cvs`)

### `GET /api/v1/cvs`
*Protected via `JwtAuthGuard`.*
Returns all CVs owned by the authenticated user.

### `POST /api/v1/cvs`
*Protected via `JwtAuthGuard`.*
Creates a new CV. If `content` is omitted, auto-populates from the user's reusable `Profile`.

- **Request Body**:
  ```json
  {
    "title": "Senior Frontend Engineer Resume",
    "templateId": "classic-professional"
  }
  ```

### `GET /api/v1/cvs/:id`
*Protected via `JwtAuthGuard`.*
Retrieves single CV document with template. Strictly enforces ownership: returns 404 if accessed by non-owner.

### `PATCH /api/v1/cvs/:id`
*Protected via `JwtAuthGuard`.*
Updates CV title, template selection, JSON content, or JSON styling with debounced autosave.

### `POST /api/v1/cvs/:id/duplicate`
*Protected via `JwtAuthGuard`.*
Clones CV with title `<Original Title> (Copy)`.

### `DELETE /api/v1/cvs/:id`
*Protected via `JwtAuthGuard`.*
Deletes CV with ownership check.

---

## 5. Portfolio Templates (`/api/v1/portfolio-templates`)

### `GET /api/v1/portfolio-templates`
*Public.*
Returns all active portfolio templates.

- **Templates seeded**:
  - `minimal-developer`: Terminal-inspired dark/light portfolio.
  - `dark-creative`: Spotlight high-contrast visuals.
  - `professional-corporate`: Executive timeline.
  - `designer-visual`: Masonry case-study gallery.
  - `student-portfolio`: Academic coursework & milestone showcase.
  - `modern-personal-brand`: Narrative personal story.

---

## 6. Portfolio Websites (`/api/v1/portfolios`)

### `GET /api/v1/portfolios`
*Protected via `JwtAuthGuard`.*
Lists all portfolios owned by the current user with project counts.

### `POST /api/v1/portfolios`
*Protected via `JwtAuthGuard`.*
Creates a new portfolio website with unique public slug.
- Rejects reserved words (`api`, `admin`, `dashboard`, `login`, `register`, `p`, etc.).
- Enforces unique constraint in MySQL.

### `GET /api/v1/portfolios/:id`
*Protected via `JwtAuthGuard`.*
Retrieves portfolio with all projects sorted by display order.

### `PATCH /api/v1/portfolios/:id`
*Protected via `JwtAuthGuard`.*
Updates title, bio, theme config, or slug.

### `POST /api/v1/portfolios/:id/publish`
*Protected via `JwtAuthGuard`.*
Publishes portfolio (`isPublished = true`, `publishedAt = new Date()`), making it accessible publicly.

### `POST /api/v1/portfolios/:id/unpublish`
*Protected via `JwtAuthGuard`.*
Unpublishes portfolio (`isPublished = false`), immediately hiding it from the public.

### `DELETE /api/v1/portfolios/:id`
*Protected via `JwtAuthGuard`.*
Deletes portfolio and cascade deletes all child projects.

---

## 7. Portfolio Projects (`/api/v1/portfolios/:id/projects`)

### `POST /api/v1/portfolios/:id/projects`
Adds a project with title, description, technologies array, demo URL, and repo URL.

### `PATCH /api/v1/portfolios/:id/projects/:projectId`
Updates project details.

### `DELETE /api/v1/portfolios/:id/projects/:projectId`
Removes project from the portfolio.

---

## 8. Public Portfolios (`/api/v1/public/portfolios/:slug`)

### `GET /api/v1/public/portfolios/:slug`
*Public — Accessible without authentication.*
- Strictly checks `isPublished: true`.
- If unpublished or not found, returns `404 Not Found`.
- Sanitizes user profile to eliminate sensitive credentials (`passwordHash` is never returned).

---

## 9. Administrative Control (`/api/v1/admin`)

*Protected via `JwtAuthGuard` AND `RolesGuard` (`@Roles(Role.ADMIN)`).*

### `GET /api/v1/admin/stats`
Returns system metrics: total users, CVs, portfolios, and templates.

### `GET /api/v1/admin/templates`
Returns all CV and portfolio templates including inactive ones.

### `PATCH /api/v1/admin/cv-templates/:id`
Toggles CV template availability (`isActive: boolean`).

### `PATCH /api/v1/admin/portfolio-templates/:id`
Toggles Portfolio template availability (`isActive: boolean`).
