# EduQuest — Gamified Educational Platform

## Project Overview

EduQuest is a production-level gamified learning platform for Indian students (Class 9–12 + Engineering). Students follow structured day-wise study plans, compete in real-time quiz battles, earn XP, build streaks, and climb a global leaderboard.

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + CSS Modules
- **Styling**: Custom CSS design system (globals.css) — no Tailwind at runtime
- **Database**: PostgreSQL (Replit managed) — accessed via raw SQL (`pg` pool)
- **Fonts**: Inter, Sora, Space Grotesk, JetBrains Mono (all self-hosted via `@fontsource`)
- **Icons**: `lucide-react`
- **Auth**: Custom session-based auth with `httpOnly` cookies + argon2 hashing

## Architecture

```
src/
  app/                    # Next.js App Router pages (each has its own CSS Module)
    page.tsx              # Homepage
    pricing/              # Pricing page
    class-9/              # Class 9 tracks
    class-10/             # Class 10 board prep
    class-11/             # Class 11 stream selection (Science/Commerce/Arts)
    class-12/             # Class 12 board + entrance prep
    engineering/          # Engineering coding tracks (12 languages)
    battle/               # Real-time quiz battle arena
    community/            # Community forum with real DB posts
    events/               # Events & competitions (real DB data)
    leaderboard/          # Global + filtered leaderboard (real DB users)
    dashboard/            # Protected student dashboard
    test/                 # Test Center hub
    about/                # About page
    features/             # Features showcase
    contact/              # Contact page with FAQ
    sign-in/              # Authentication
    sign-up/              # Account registration
    api/                  # API routes (auth, community, events, leaderboard, battle)
  components/
    layout/Navbar/        # Navbar with dropdowns
    layout/Footer/        # Footer
  lib/
    server/
      auth/               # Session + authentication logic
      database/           # PostgreSQL pool + migrations
      repositories/       # Repository pattern (postgres + json adapters)
      data/               # Business logic (dashboard, platform-store)
  styles/
    globals.css           # Global CSS design system (135 CSS variables, dark mode)
  types/                  # TypeScript type definitions
```

## Database

All tables live in PostgreSQL with the `eduquest_` prefix:
- `eduquest_users` — students with XP, streak, level, track
- `eduquest_community_posts` — forum posts with likes/comments/views
- `eduquest_events` — competitions and assessments
- `eduquest_event_registrations` — who registered for what
- `eduquest_matchmaking_tickets` — battle queue
- `eduquest_audit_logs` — security audit trail
- `eduquest_background_jobs` — async job intents
- `eduquest_schema_migrations` — migration tracking

Run migrations: `npm run db:migrate`

## Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | Set by Replit | PostgreSQL connection |
| `EDUQUEST_PERSISTENCE_ADAPTER` | `postgres` | Forces PostgreSQL adapter (set in shared env) |
| `EDUQUEST_SESSION_SECRET` | Required in prod | Signs session cookies |

## Running the App

The app runs on port 5000 via the "Start application" workflow:
```
npm run dev -- -p 5000
```

## Design System

- `--max-content-width: 80rem` — consistent layout width
- Dark navy hero on homepage (`#0B1120` to `#141B2D`)
- Primary: `#2563EB` (blue), Accent: `#F59E0B` (amber), Success: `#10B981` (green)
- Each page has its own scoped CSS Module — no cross-page style bleed

## Key Patterns

1. **Page CSS Modules** — every page in `src/app/` has a matching `PageName.module.css`
2. **Repository pattern** — `getPlatformRepository()` returns the active adapter
3. **Dynamic imports** — `next/dynamic` used for all heavy client components
4. **Server components** — pages export `metadata` and render on server; interactive parts are `"use client"` components loaded dynamically
5. **Seeded demo data** — 10 leaderboard users, 10 community posts, 6 events in PostgreSQL

## User Preferences

- Detailed English comments in all files (file header + section comments + inline)
- Separate CSS module per page — never inline styles, never global classes
- All data must come from the real PostgreSQL database (no mocks in production)
- Minimalist, professional UI — no clutter, clean hierarchy
- Fully responsive — mobile-first breakpoints
