# App Routes

This folder contains the Next.js App Router pages, route states, and route-local CSS modules.

- Page folders own their own `page.tsx` and CSS modules where the route needs distinct styling.
- API route handlers live under `api`.
- Shared page shells such as `loading.tsx`, `error.tsx`, and `not-found.tsx` stay at this level because they belong to the app boundary.
- Route-local ownership folders now include the MCP-required `test` area alongside classes, community, dashboard, events, battle, and leaderboard.
