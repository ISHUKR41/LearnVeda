# Server Cache Folder

This folder contains cache and distributed-state infrastructure.

## What This Folder Contains

- Redis connection helpers.
- Health probes for cache availability.
- Shared cache utilities that can later support matchmaking queues, leaderboard rankings, and background jobs.

## Owner

Backend platform engineers own this folder because cache behavior affects rate limiting, live battles, queues, and production scale.

## What Should Not Be Placed Here

- Page components.
- CSS modules.
- Static event or curriculum content.
- Business decisions that belong inside `src/lib/server/services`.

## Production Note

Set `REDIS_URL` and `EDUQUEST_RATE_LIMIT_ADAPTER=redis` before running multiple app instances. Without Redis, each instance has its own local rate-limit memory and students can accidentally bypass protection by hitting a different instance.
