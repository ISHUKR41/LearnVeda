# API Routes

This folder contains HTTP route handlers that expose backend behavior to the frontend.

- Route handlers validate input before calling server services and utilities.
- Sensitive logic must stay in `src/lib/server`, not inside the UI tree.
- Responses should use the shared helpers in `src/lib/server/utils/api-response.ts`.
- `/api/health` reports liveness plus a safe backend snapshot.
- `/api/readiness` is the stricter release gate and can return `503` in production when required adapters or secrets are missing.
