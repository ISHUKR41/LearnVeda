# EduQuest Implementation Status

This document tracks what is currently real in the repository and what remains before a public production rollout.

## Implemented Now

- Full-stack Next.js App Router application with route-local folders and CSS modules.
- Auth, dashboard, battle, community, events, leaderboard, profile, notifications, search, wallet, and settings routes.
- PostgreSQL migration runner under `src/lib/server/database/migrations`.
- Repository abstraction with JSON local adapter and PostgreSQL production adapter.
- Redis-ready rate limiter and runtime readiness endpoints.
- Self-hosted fonts through `@fontsource` packages.
- Dynamic loading on key interactive routes such as dashboard, battle, community, events, and leaderboard.
- Admin review console for event host applications with status updates and review notes.
- Strict production data mode now prevents static fallback counters/curriculum from being mistaken for live PostgreSQL data.
- Demo database seeding is blocked in production unless explicitly approved with `EDUQUEST_ALLOW_DEMO_SEED=true`.
- PostgreSQL performance/search indexes cover leaderboard, dashboard, notifications, community, battle history, host application review, and full-text search paths.
- Class 9–12 pages now use route-owned bitmap hero assets, and Class 10 reads subjects from the same database-backed curriculum path as Class 9.

## Fixed In This Pass

- Typecheck now passes after restoring Prisma client generation and adding the missing PostgreSQL pool compatibility helper.
- `/api/search` now queries the actual `eduquest_*` SQL columns from the migrations.
- `/api/notifications` now uses the real `type`, `message`, and `action_url` columns and patches `is_read` without a nonexistent `updated_at` column.
- `/api/profile` now aggregates the real daily stats and joins progress through subjects and chapters.
- `/api/events/host-application` now writes to a dedicated `eduquest_host_applications` table and mirrors the event into audit logs in one transaction.

## Remaining Production Work

- Add real-time battle rooms with a Socket.IO or managed WebSocket service.
- Add background workers for email, notification fanout, certificates, and event reminders.
- Add automated tests for API routes, repository adapters, accessibility, and browser flows.
- Add WebP/AVIF variants for the new route-owned PNG hero assets.
- Decide whether Prisma remains optional tooling or becomes the primary data-access layer.
