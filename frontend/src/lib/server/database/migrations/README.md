# Database Migrations

This folder stores PostgreSQL migration files for EduQuest.

## Naming Rule

Use numeric prefixes so migrations run in the same order everywhere:

`001_initial_platform.sql`

## How To Run

Set `DATABASE_URL`, then run:

```bash
npm run db:migrate
```

## Safety Rule

Migrations should be additive whenever possible. Avoid destructive schema changes without a backup and a rollback plan because production student progress, registrations, and community posts are valuable data.

## Current Production Tables

- `eduquest_events` stores the public event catalog shown on the Events page.
- `eduquest_audit_logs` stores security, operational, and workflow audit events.
- `eduquest_background_jobs` stores durable job intents for future workers.
- `eduquest_host_applications` stores institution event-hosting applications for admin review.
