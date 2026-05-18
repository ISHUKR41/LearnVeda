# Frontend Ownership

This folder documents the frontend boundary requested by the MCP plans. The live Next.js frontend code still lives in `src/app`, `src/components`, `src/styles`, `src/hooks`, and `src/store` so routing, imports, and build tooling remain standard for the current app.

## Owned Runtime Areas

- `src/app` owns route folders, page files, loading states, and route-local CSS modules.
- `src/components` owns reusable layout, UI, dashboard, learning, and gamification components.
- `src/styles` owns global design tokens, base typography, theme variables, and shared utilities.
- `src/hooks` and `src/store` own client-side state and reusable browser behavior.

## Rules

- Keep each page's CSS in that page folder when the style is route-specific.
- Keep browser-only logic in `"use client"` components and load heavy client surfaces dynamically.
- Use real images from `public/images` or optimized assets through `next/image`.
- Do not place database access, secrets, or server-only helpers in frontend folders.
