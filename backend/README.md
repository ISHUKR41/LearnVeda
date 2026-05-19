# Backend Ownership

This folder documents the backend boundary requested by the MCP plans.

Important production note: the live deployable backend currently lives inside
the `frontend` Next.js application, specifically `src/app/api` and
`src/lib/server`. The Express files in this top-level `backend` package are a
legacy/scaffolding workspace and must not be treated as the production API
server until their routes, auth, database schema, and deployment scripts are
deliberately reconciled with the SQL migrations used by the app.

## Owned Runtime Areas

- `src/app/api` owns HTTP route handlers and request/response validation.
- `src/lib/server/auth` owns session signing, password hashing, and current-user lookup.
- `src/lib/server/database` owns PostgreSQL pools, migrations, and migration execution.
- `src/lib/server/repositories` owns storage contracts plus JSON and PostgreSQL adapters.
- `src/lib/server/services` owns business workflows that should not sit inside route handlers.
- `src/lib/server/cache`, `security`, `audit`, `jobs`, and `observability` own production-scale support systems.

## Production Rules

- Use `EDUQUEST_PERSISTENCE_ADAPTER=postgres` for production.
- Use `EDUQUEST_RATE_LIMIT_ADAPTER=redis` when multiple app instances can receive traffic.
- Run `npm run db:migrate` from the `frontend` package before public traffic reaches a new database.
- Treat `frontend/src/lib/server/database/migrations/*.sql` as the production schema authority.
- Keep Prisma optional unless the repository layer is deliberately migrated to Prisma models.
- Do not deploy the top-level Express package as the public backend without first replacing placeholder auth and aligning its queries with the `eduquest_*` SQL schema.
