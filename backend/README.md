# Backend Ownership

This folder documents the backend boundary requested by the MCP plans. The live backend code currently lives in `src/app/api` and `src/lib/server` so the Next.js App Router can serve API routes without a separate deployment package.

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
- Run `npm run db:migrate` before public traffic reaches a new database.
- Keep Prisma optional unless the repository layer is deliberately migrated to Prisma models.
