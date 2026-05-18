# Server Library

This folder owns backend-only logic.

- `auth` handles current-user lookup, password helpers, and signed session cookies.
- `data` owns repository-style storage access.
- `repositories` declares storage contracts and exposes the active repository adapter.
- `services` owns backend business orchestration so route handlers stay small.
- `security` owns abuse prevention helpers such as rate limiting.
- `utils` owns backend response helpers.
- `observability` owns runtime health and production-readiness reporting.

Nothing inside this folder should be imported by a client component.
