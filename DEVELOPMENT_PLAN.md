# Project Blueprint: Mauritius Mall (Headless E-Commerce Monorepo)

## 1. System Core Tech Stack
*   **Package Manager:** pnpm (Workspace Monorepo structure)
*   **Backend Core Engine:** MedusaJS v2 (Latest stable release)
*   **Frontend UI Layer:** Next.js (Latest stable App Router version)
*   **Database Engine:** PostgreSQL 18-alpine (Running via Docker Container on local port 5433)
*   **Cache & Event Queue:** Redis 7-alpine (Running via Docker Container on local port 6379)
*   **Target Deployment Environment:** Hetzner Cloud (Ubuntu 24.04 LTS managed via Coolify)

---

## 2. Intended Target Workspace Directory Tree

Ensure the local storage directories match this schema layout cleanly:
```text
E:/projects/mauritius-mall/
├── pnpm-workspace.yaml      # Manages multi-package workspaces
├── package.json             # Root orchestrator task scripts
├── DEVELOPMENT_PLAN.md      # This master blueprint document
├── apps/
│   ├── backend/             # Custom Medusa v2 API engine & Admin dashboard
│   └── storefront/          # High-performance Next.js web application
├── docker-compose.yml       # Postgres (5433) + Redis (6379)
├── .npmrc                   # pnpm hoisting for Medusa packages
└── pnpm-lock.yaml           # Single lockfile for the monorepo
```

---

## 3. Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | >= 22.19.0 | `node -v` |
| pnpm | v10+ | `pnpm -v` |
| Docker Desktop | running | `docker ps` |
| Git | any recent | `git --version` |

Use **PowerShell** on Windows for deletes and installs. Git Bash can hang on large `node_modules` operations.

---

## 4. First-Time Setup

### 4.1 Start infrastructure

```powershell
cd E:\projects\mauritius-mall
pnpm docker:up
docker compose ps
```

Postgres listens on **localhost:5433** (`postgres` / `postgres`, database `medusa_local`).
Redis listens on **localhost:6379**.

### 4.2 Install dependencies

```powershell
pnpm install
```

### 4.3 Configure backend environment

Copy and edit [`apps/backend/.env`](apps/backend/.env) if needed:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5433/medusa_local
REDIS_URL=redis://localhost:6379
STORE_CORS=http://localhost:8000,http://localhost:3000
ADMIN_CORS=http://localhost:9000,http://localhost:5173
AUTH_CORS=http://localhost:9000,http://localhost:5173,http://localhost:8000
JWT_SECRET=<random-32+-chars>
COOKIE_SECRET=<random-32+-chars>
```

### 4.4 Database migrations and admin user

```powershell
pnpm db:migrate
pnpm --filter backend exec medusa user -e admin@mauritius-mall.local -p supersecret
pnpm --filter backend exec medusa exec ./src/scripts/add-mauritius-region.ts
```

### 4.5 Configure storefront environment

Copy [`apps/storefront/.env.template`](apps/storefront/.env.template) to `apps/storefront/.env.local` and set:

```env
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<from Admin → Settings → Publishable API Keys>
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_DEFAULT_REGION=mu
NEXT_PUBLIC_BASE_URL=http://localhost:8000
```

Retrieve the publishable key from the admin dashboard or Postgres:

```powershell
docker exec medusa-postgres psql -U postgres -d medusa_local -t -c "SELECT token FROM api_key WHERE type = 'publishable' LIMIT 1;"
```

---

## 5. Daily Development Workflow

```powershell
# Terminal 1 — infrastructure (once per session)
pnpm docker:up

# Terminal 2 — Medusa backend + admin
pnpm dev:backend
# API:  http://localhost:9000/health
# Admin: http://localhost:9000/app

# Terminal 3 — Next.js storefront
pnpm dev:storefront
# Store: http://localhost:8000/mu
```

**Admin login:** `admin@mauritius-mall.local` / `supersecret`

---

## 6. Clean Reinstall (Backend)

If the backend folder becomes corrupted (nested turbo monorepo, wrong package manager):

```powershell
cd E:\projects\mauritius-mall
Remove-Item -Recurse -Force .\apps\backend
cmd /c "echo N| pnpm dlx create-medusa-app@latest backend --directory-path apps/backend --use-pnpm --skip-db --no-browser --verbose"
```

Then flatten if the CLI nests files under `apps/backend/backend/apps/backend`:

```powershell
Move-Item .\apps\backend\backend\apps\backend .\apps\backend-medusa
pnpm dlx rimraf .\apps\backend
Move-Item .\apps\backend-medusa .\apps\backend
```

Set `"name": "backend"` in `apps/backend/package.json`, configure `.env`, and re-run migrations (Section 4.4).

**Tip:** Pipe `N` to skip the interactive Next.js storefront prompt when scaffolding backend only.

---

## 7. Root Scripts Reference

| Script | Command |
|--------|---------|
| `pnpm dev:backend` | Start Medusa API + admin |
| `pnpm dev:storefront` | Start Next.js storefront on port 8000 |
| `pnpm docker:up` | Start Postgres + Redis containers |
| `pnpm docker:down` | Stop containers |
| `pnpm db:migrate` | Run Medusa database migrations |
| `pnpm build:all` | Build backend and storefront |

---

## 8. Deployment Notes (Hetzner + Coolify)

- Deploy `apps/backend` as a Node.js service with `pnpm build` then `pnpm start`.
- Deploy `apps/storefront` as a Next.js service with `pnpm build` then `pnpm start`.
- Provision managed Postgres and Redis (or containerized equivalents) in Coolify.
- Set production env vars: `DATABASE_URL`, `REDIS_URL`, CORS origins, JWT/COOKIE secrets, and storefront `NEXT_PUBLIC_*` values pointing to the production backend URL.
- Use Coolify's reverse proxy for HTTPS termination on both services.

---

## 9. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `m: command not found` | Use `Remove-Item -Recurse -Force` in PowerShell, not `m -rf` |
| CLI hangs during scaffold | Pipe `N` for storefront prompt; add `--skip-db --no-browser --verbose` |
| `pnpm --filter backend` fails | Ensure `"name": "backend"` in `apps/backend/package.json` |
| Migration connection refused | Run `pnpm docker:up` and confirm port 5433 |
| Medusa module resolution errors | Verify root `.npmrc` Medusa hoist patterns |
| Storefront region error | Confirm Mauritius region exists; run `add-mauritius-region.ts` script |