# Readiness API Route

This folder owns the deployment readiness endpoint.

- `route.ts` returns a stricter backend readiness report than `/api/health`.
- Production monitors can use this endpoint to block release promotion when required adapters or secrets are still unresolved.

Keep release-gating logic here separate from ordinary liveness reporting.
