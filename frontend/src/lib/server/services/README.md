# Server Services

This folder keeps backend business orchestration separate from HTTP route handlers.

- `auth-service.ts` owns credential sign-in and student account creation.
- `battle-service.ts` owns battle queue ticket creation.
- `community-service.ts` owns community feed reads and post publishing.
- `events-service.ts` owns event catalog snapshots and registration writes.

Route handlers should stay small: validate the request, call one service, then return a normalized API response.
That separation makes the current JSON-backed MVP easier to migrate later to PostgreSQL, Redis, queues, and external workers.
