# Mauritius Mall

Mauritius Mall is a headless e-commerce monorepo built for a modern, scalable shopping experience. It combines a Medusa-based commerce backend with a fast Next.js storefront, making it a strong foundation for a production-ready marketplace tailored to the Mauritius market.

## Why this project

- Headless architecture for flexibility and future growth
- API-first commerce engine with Medusa v2
- Fast, SEO-friendly storefront built with Next.js App Router
- Modular backend structure for workflows, subscribers, custom modules, and API routes
- Docker-based local infrastructure for PostgreSQL and Redis

## Tech stack

- Backend: Medusa v2, Node.js, TypeScript
- Frontend: Next.js 15, React 19, Tailwind CSS
- Data & infrastructure: PostgreSQL, Redis, Docker, pnpm workspaces

## Project structure

```text
apps/
  backend/   # Medusa API, admin, custom modules, workflows
  storefront/ # Next.js storefront UI
``` 

## Prerequisites

Make sure these are installed locally:

- Node.js 22.19 or newer
- pnpm 10+
- Docker Desktop
- Git

## Getting started

### 1. Clone the repository

```bash
git clone <your-github-repo-url>
cd mauritius-mall
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start local infrastructure

```bash
pnpm docker:up
```

This starts PostgreSQL and Redis through Docker.

### 4. Configure environment variables

Copy the backend and storefront environment templates and update them with your local values:

```bash
cp apps/backend/.env.template apps/backend/.env
cp apps/storefront/.env.template apps/storefront/.env.local
```

### 5. Run database migrations

```bash
pnpm db:migrate
```

### 6. Start the apps

Run the backend in one terminal:

```bash
pnpm dev:backend
```

Run the storefront in another terminal:

```bash
pnpm dev:storefront
```

The backend API and admin are available locally through the Medusa dev server, and the storefront runs on port 8000.

## Common scripts

```bash
pnpm dev:backend
pnpm dev:storefront
pnpm build:all
pnpm docker:up
pnpm docker:down
pnpm db:migrate
```

## Deployment notes

This monorepo is structured for scalable deployment. The backend and storefront can be deployed separately behind HTTPS, with environment variables managed securely in your hosting provider or secret manager.

Recommended production setup:

- Deploy the backend as a Node.js service
- Deploy the storefront as a Next.js application
- Use managed PostgreSQL and Redis services
- Set production CORS, JWT, and cookie secrets through environment variables

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before creating a pull request.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
