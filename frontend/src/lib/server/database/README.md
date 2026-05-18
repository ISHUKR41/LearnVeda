# Server Database Folder

This folder contains database-only backend infrastructure for EduQuest.

## What This Folder Contains

- PostgreSQL connection helpers.
- SQL migration files.
- Migration runner scripts.
- Database notes for future backend contributors.

## Owner

Backend platform engineers own this folder because every file here affects data durability, production reliability, and deployment readiness.

## What Should Not Be Placed Here

- React components.
- Page CSS modules.
- Browser-only helpers.
- Feature-specific business rules that belong in `src/lib/server/services`.

## Production Note

The live application still works locally with the JSON adapter when PostgreSQL is not configured. Production should set `EDUQUEST_PERSISTENCE_ADAPTER=postgres`, configure `DATABASE_URL`, and run the migrations in `src/lib/server/database/migrations` before public traffic is sent to the app.
