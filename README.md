# EduQuest

EduQuest is currently implemented as a production-oriented full-stack Next.js application.

## Frontend And Backend Folders

- Frontend runtime code lives in:
  - `src/app`
  - `src/components`
  - `src/styles`
- Backend runtime code lives in:
  - `src/app/api`
  - `src/lib/server`

The repository also now includes top-level `frontend` and `backend` folders with README files that document the ownership boundary requested by the MCP plans.

See `docs/IMPLEMENTATION_STATUS.md` for the current architecture status and the next backend scaling steps.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the landing page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Typography

The app self-hosts fonts with `@fontsource` packages so pages do not depend on external font requests in production.

- Body text: Inter
- Headings: Sora
- Code and metrics: JetBrains Mono

## Environment

Use `.env.example` as the production configuration checklist.

- `EDUQUEST_SESSION_SECRET` is required in production.
- `EDUQUEST_PERSISTENCE_ADAPTER=postgres` enables the production PostgreSQL adapter.
- `DATABASE_URL` points the PostgreSQL adapter at the production database.
- `EDUQUEST_RATE_LIMIT_ADAPTER=redis` enables distributed rate limiting.
- `REDIS_URL` supports distributed rate limits, future queue state, and live matchmaking support.

Run database migrations before production traffic:

```bash
npm run db:migrate
```

## Deployment Direction

The current application already builds successfully as a deployable Next.js app. Production traffic should use the PostgreSQL and Redis adapters documented in `docs/PRODUCTION_DEPLOYMENT.md`.

See:

- `docs/IMPLEMENTATION_STATUS.md`
- `docs/PRODUCTION_DEPLOYMENT.md`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The app is ready for a Vercel deployment once production environment variables are configured and the backend migration path is approved. The deployment checklist lives in `docs/PRODUCTION_DEPLOYMENT.md`.
# eduquest
