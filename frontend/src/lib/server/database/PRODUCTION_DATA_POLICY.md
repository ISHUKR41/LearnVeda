# Production Data Policy

This folder is the production database authority for the live EduQuest Next.js backend.

## Source Of Truth

- Runtime database code lives in `src/lib/server/database`.
- Runtime persistence contracts live in `src/lib/server/repositories`.
- Production schema changes must be added as numbered SQL files in `src/lib/server/database/migrations`.
- Production deployments must run `npm run db:migrate` before public traffic reaches the app.

## Do Not Use For Production Schema

- `frontend/prisma` is optional tooling and is not the live production schema today.
- The top-level `backend` package is not the active production backend. It is documentation/legacy scaffolding unless it is explicitly reconciled with the `eduquest_*` SQL schema.
- Local JSON persistence is allowed only for local development and single-machine previews.
- Static fallback curriculum and summary counters are allowed only for local preview mode. Strict production uses PostgreSQL data only and should expose empty/degraded data rather than pretending fallback data is real.
- `npm run db:seed` inserts demo learners and is blocked in production unless `EDUQUEST_ALLOW_DEMO_SEED=true` is explicitly set for an approved staging/demo database.
- The versioned SQL files in `src/lib/server/database/migrations` are the production schema authority. Prisma schemas are optional tooling until the repository layer is intentionally migrated to Prisma.

## Release Rules

- Set `EDUQUEST_PERSISTENCE_ADAPTER=postgres` for production.
- Set `EDUQUEST_RATE_LIMIT_ADAPTER=redis` for production.
- Set a strong `EDUQUEST_SESSION_SECRET` before deployment.
- Confirm `/api/readiness` reports `ready` before opening the site to real learners.
- Do not edit an applied migration file. Create a new migration so checksum validation stays meaningful.
