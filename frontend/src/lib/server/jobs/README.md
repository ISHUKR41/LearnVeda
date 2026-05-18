# Backend Jobs

This folder owns durable background-work intent records for EduQuest.

- `job-intents.ts` defines notification, certificate, battle, and event job shapes.
- API routes should not send emails or certificates directly during user requests.
- Services create job intent rows, and a worker can later claim and process them.
- The JSON adapter keeps local development working; PostgreSQL is the production queue source.
