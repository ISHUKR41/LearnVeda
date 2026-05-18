# Production Deployment

Use this checklist before sending real learners or event participants to EduQuest.

## Required Environment

- `NODE_ENV=production`
- `EDUQUEST_SESSION_SECRET` set to a strong 32+ character secret.
- `EDUQUEST_PERSISTENCE_ADAPTER=postgres`
- `DATABASE_URL` configured for a managed PostgreSQL database.
- `EDUQUEST_RATE_LIMIT_ADAPTER=redis`
- `REDIS_URL` configured for a managed Redis-compatible service.

## Database Release Steps

1. Configure `DATABASE_URL`.
2. Run `npm run db:migrate`.
3. Confirm `/api/readiness` returns a ready status in the target environment.
4. Smoke test sign-up, sign-in, dashboard, events, community, search, notifications, and profile.

## Scaling Notes

- PostgreSQL is the durable source of truth for users, progress, events, community, audit logs, and jobs.
- Redis is required for distributed rate limiting today and should later own matchmaking queues, live counters, and worker queues.
- Keep the JSON adapter only for local development because it is not safe for multi-instance production traffic.

## Release Gates

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- API smoke tests for `/api/health` and `/api/readiness`
- Browser smoke tests on mobile, tablet, and desktop viewports
