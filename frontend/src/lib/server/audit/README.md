# Backend Audit

This folder owns production audit logging rules for EduQuest.

- `audit-log.ts` defines the safe event shape that backend services write.
- Audit records must never store passwords, raw session tokens, or full request bodies.
- Use short metadata fields that explain what happened without exposing student secrets.
- PostgreSQL is the production target; the JSON adapter keeps the same contract for local development.
