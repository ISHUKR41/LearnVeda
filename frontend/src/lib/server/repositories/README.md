# Server Repositories

This folder defines the storage boundary for the backend.

- `platform-repository.ts` declares the contracts the services need.
- `json-platform-repository.ts` adapts the current JSON-backed MVP store to those contracts.
- `get-platform-repository.ts` exposes one backend storage entry point.

This separation matters because services should not care whether records come from a JSON file today, PostgreSQL tomorrow, or a fully tested migration adapter during rollout.
