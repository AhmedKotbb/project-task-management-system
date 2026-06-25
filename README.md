# Project Task Management System

A REST API for managing projects, tasks, and team members. Admins create projects and tasks, assign work to members, and manage users. Members can view assigned work and update task status. Authentication uses JWT access tokens with refresh tokens stored in HTTP-only cookies.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express 5 |
| Database | PostgreSQL 16 |
| ORM | Sequelize |
| Auth | Passport (Bearer + custom refresh strategy), JWT, bcrypt |
| Validation | Joi |
| API Docs | Swagger UI (OpenAPI) |
| Email | Nodemailer |
| Testing | Jest, Supertest |

## Folder Architecture

```
project-task-management-system/
├── src/
│   ├── app.ts                 # Express app setup
│   ├── server.ts              # Entry point — connects DB and starts server
│   ├── config/                # Environment configuration (singleton)
│   ├── routes/                # Root router — mounts all module routes under /api
│   ├── modules/
│   │   ├── auth/              # Login, refresh token, logout
│   │   ├── users/             # User CRUD, password change
│   │   ├── projects/          # Project CRUD
│   │   └── tasks/             # Task CRUD, assignment, status updates
│   ├── middleware/            # Auth, admin guard, validation, error handling
│   ├── database/
│   │   ├── config/            # Sequelize CLI database config
│   │   ├── models/            # Sequelize models (User, Project, Task)
│   │   ├── migrations/        # Schema migrations
│   │   └── seeders/           # Demo data
│   ├── docs/                  # Swagger / OpenAPI spec
│   ├── shared/                # API response helpers, custom errors
│   └── utilities/             # Token, hash, cookie, mail services
├── tests/
│   ├── unit/                  # Unit tests per module
│   └── integration/           # API integration tests
├── docker-compose.yml         # Local PostgreSQL
├── .env.example               # Environment variable template
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Docker (optional, for PostgreSQL)

### 1. Clone and install

```bash
git clone https://github.com/AhmedKotbb/project-task-management-system.git
cd project-task-management-system
npm install
```

### 2. Configure environment

Copy the example env file and adjust values as needed:

```bash
cp .env.example .env
```

See [.env.example](.env.example) for all required variables. Database credentials should match your PostgreSQL instance (defaults align with `docker-compose.yml`).

### 3. Start PostgreSQL

```bash
docker compose up -d
```

### 4. Run migrations and seed demo data

```bash
npm run db:migrate
npm run db:seed
```

To reset the database (undo all migrations, re-migrate, and re-seed):

```bash
npm run db:reset
```

### 5. Start the server

**Development** (with hot reload):

```bash
npm run dev
```

**Production**:

```bash
npm run build
npm start
```

The API runs at `http://localhost:3000`. Interactive API docs are at `http://localhost:3000/docs`.

### Demo accounts (after seeding)

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | Password123! | admin |
| jane@example.com | Password123! | member |
| john@example.com | Password123! | member |

### Running tests

```bash
npm test
npm run test:coverage
```

## Authentication

- **Access token**: Send as `Authorization: Bearer <token>` on protected routes.
- **Refresh token**: Set in an HTTP-only cookie (`refreshToken`) on login. Use `POST /api/auth/refresh-token` to get a new access token.
- **Roles**: `admin` — full management access. `member` — read access plus task status updates on assigned tasks.

## API Overview

Base URL: `/api`

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/login` | Public | Authenticate with email and password. Returns access token and sets refresh token cookie. |
| POST | `/refresh-token` | Refresh cookie | Issue a new access/refresh token pair using the stored refresh token. |
| POST | `/logout` | Bearer | Invalidate the refresh token and clear the cookie. |

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create` | Admin | Create a new user. A random password is emailed to them. |
| GET | `/details/:id` | Bearer | Get a single user's details by ID. |
| GET | `/list` | Bearer | List users with pagination, sorting, and search. |
| PATCH | `/change-password` | Bearer | Change the authenticated user's password. |

### Projects — `/api/projects`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create` | Admin | Create a new project. |
| GET | `/details/:id` | Bearer | Get project details including related tasks. |
| GET | `/list` | Bearer | List projects with pagination, sorting, and search. |
| PATCH | `/update` | Admin | Update project title, description, or status (`pending` / `in_progress` / `completed`). |
| DELETE | `/delete/:id` | Admin | Soft-delete a project. |

### Tasks — `/api/tasks`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create` | Admin | Create a task under a project (optional assignee). |
| GET | `/details/:id` | Bearer | Get task details including creator and assignee. |
| GET | `/list` | Bearer | List tasks with pagination, filters (status, priority, assignee), and search. |
| PATCH | `/update` | Admin | Update task title, description, status, priority, or due date. |
| PATCH | `/assign` | Admin | Assign a task to a user. |
| PATCH | `/update-status` | Bearer | Update task status (`pending` → `in_progress` → `done`). Assignee or admin only. |
| DELETE | `/delete/:id` | Admin | Soft-delete a task. |

For request/response schemas and to try endpoints interactively, use the [Swagger docs](http://localhost:3000/docs) after starting the server.
