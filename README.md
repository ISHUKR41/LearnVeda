<div align="center">

```
███████╗██████╗ ██╗   ██╗ ██████╗ ██╗   ██╗███████╗███████╗████████╗
██╔════╝██╔══██╗██║   ██║██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝
█████╗  ██║  ██║██║   ██║██║   ██║██║   ██║█████╗  ███████╗   ██║
██╔══╝  ██║  ██║██║   ██║██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║
███████╗██████╔╝╚██████╔╝╚██████╔╝╚██████╔╝███████╗███████║   ██║
╚══════╝╚═════╝  ╚═════╝  ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝
```

**India's Gamified Learning Platform — Class 9–12 & Engineering**

*Learn Smarter. Battle Harder. Level Up.*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)

[![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.3-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)
[![Clerk](https://img.shields.io/badge/Clerk-7.4.1-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[![Students](https://img.shields.io/badge/👥_Students-50%2C000+-22C55E?style=for-the-badge)](https://github.com)
[![Chapters](https://img.shields.io/badge/📚_CBSE_Chapters-500+-F59E0B?style=for-the-badge)](https://github.com)
[![Questions](https://img.shields.io/badge/❓_Questions-10%2C000+-6366F1?style=for-the-badge)](https://github.com)
[![Migrations](https://img.shields.io/badge/🗄️_DB_Migrations-21_Applied-8B5CF6?style=for-the-badge)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](LICENSE)

<br/>

[Overview](#-overview) · [Stats](#-platform-statistics) · [Features](#-live-features) · [Tech Stack](#-tech-stack) · [Project Structure](#-project-structure) · [Pages](#-pages--routes) · [Setup](#-getting-started) · [Environment](#-environment-variables) · [Database](#-database-schema) · [API](#-api-reference) · [Gamification](#-gamification-engine) · [Battle](#️-battle-system) · [Engineering](#-engineering-tracks) · [CBSE](#-cbse-curriculum) · [Security](#-security-architecture) · [Design](#-design-system) · [SEO](#-seo--performance) · [Docker](#-docker--deployment) · [Roadmap](#️-roadmap) · [Contributing](#-contributing)

</div>

---

## 📖 Overview

**EduQuest** is a production-grade full-stack gamified educational platform for Indian students in **Class 9–12** and aspiring engineers. It combines three proven engagement systems into one cohesive product:

```
 ┌──────────────────────────────────────────────────────────────────────────┐
 │                                                                          │
 │   LeetCode's day-wise    +   Duolingo's streak    +   BGMI's ranked     │
 │   structured plans           & habit loops            1v1 matchmaking   │
 │                                                                          │
 │                          ═══  ⚔️ EduQuest  ═══                          │
 │           "Learn Smarter. Battle Harder. Level Up."                      │
 │                                                                          │
 └──────────────────────────────────────────────────────────────────────────┘
```

### The Problem → Solution Map

| Student's Real Problem | EduQuest Solution |
|---|---|
| *"I don't know what to study today"* | Day-wise plans tell you exactly **"Day 14: Newton's Second Law"** |
| *"I lose motivation after 3 days"* | XP + streak resets publicly — social pressure is the best motivator |
| *"Physics is too abstract to understand"* | 25+ canvas physics sims — drag sliders, watch F=ma at 60fps |
| *"No one to compete with at my level"* | Elo matchmaking — always fighting someone ±3 levels from you |
| *"Engineering prep is scattered everywhere"* | 16 structured tracks — C to Rust, DSA to System Design |
| *"I study alone and get stuck for hours"* | Subject forums with mentor reply badges — help within hours |
| *"I can't tell if I'm actually improving"* | 52-week GitHub-style heatmap + Recharts analytics |

### What Students Say

> **"EduQuest changed how I study for boards. The streak system keeps me consistent and the battle mode is addictive. I went from 71% to 89% in Physics in just 4 weeks!"**
> — *Priya Sharma, Class 12, Jaipur · 14-day streak*

> **"I followed the 45-day Java plan end-to-end and got placed at a product startup. The DSA section alone is worth it for anyone prepping for SDE interviews."**
> — *Arjun Nair, Engineering, Kochi · Java & DSA track*

> **"The CBSE chapters are perfectly aligned with NCERT. I went from 65% to 82% in my unit test after just three weeks. The XP system keeps me motivated every day!"**
> — *Sneha Gupta, Class 10, Delhi · 21-day streak*

---

## 📊 Platform Statistics

Real-time counters pulled live from PostgreSQL on every page via ISR — no static numbers:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         PLATFORM AT A GLANCE                                 │
├─────────────┬─────────────┬─────────────┬─────────────┬──────────────────────┤
│  👥 50,000+ │  📚 500+    │  ❓ 10,000+ │  💻 16+     │  🔭 25+              │
│  Students   │  CBSE       │  Practice   │  Coding     │  Interactive         │
│  Registered │  Chapters   │  Questions  │  Tracks     │  Physics Sims        │
├─────────────┼─────────────┼─────────────┼─────────────┼──────────────────────┤
│  🎓 4       │  📖 22+     │  🏆 100     │  ⚔️ Real-Time│  💰 Stars            │
│  CBSE       │  Subjects   │  XP         │  1v1        │  Skill-Only          │
│  Classes    │  Covered    │  Levels     │  Battles    │  Economy             │
└─────────────┴─────────────┴─────────────┴─────────────┴──────────────────────┘
```

**Homepage Track Cards (exact in-app stats):**

| Track | Subjects | Chapters | Other |
|-------|:--------:|:--------:|-------|
| Class 9 | 6 | 75+ | 45-day plan |
| Class 10 | 6 | 80+ | 50-day plan |
| Class 11 | 3 streams | 18 per stream | 200+ chapters |
| Class 12 | 18 | — | 2,000+ questions · 15 mock tests |
| Engineering | 12 languages | — | 9 CS subjects · 60-day max |
| Battle Arena | All subjects | — | 500+ live players · 3× XP bonus |

---

## ✨ Live Features

<table>
<tr>
<td valign="top" width="50%">

### 🎓 CBSE Academic System
- ✅ NCERT 2025–26 aligned curriculum (Class 9–12)
- ✅ Day-wise structured plans (15–60 days per subject)
- ✅ Chapter-by-chapter progress + XP rewards
- ✅ ~20 MCQs per topic (CBSE standard + HOTS)
- ✅ Class 11 stream selection — Science / Commerce / Arts
- ✅ Class 12 Board + JEE / NEET strategy
- ✅ KaTeX math equation rendering throughout
- ✅ YouTube video lectures per topic (`youtubeUrl` on every `Topic` row)
- ✅ `hasSimulation` + `hasAnimation` flags on `Topic` model — drives physics sim injection

</td>
<td valign="top" width="50%">

### ⚔️ Battle Arena
- ✅ Real-time 1v1 matchmaking via Socket.IO rooms
- ✅ Elo: ±3 levels (Phase 1) → ±5 after 30s (Phase 2)
- ✅ 10 MCQs × 15s countdown per match
- ✅ Scoring: base + speed + streak multiplier + accuracy bonus
- ✅ Response < 500ms auto-flagged as suspicious
- ✅ `useAntiCheat` hook — blocks F12, Ctrl+Shift+I/J/C, right-click, copy-paste, window blur
- ✅ Emits `cheat_detected` via Socket.IO with `matchId` + violation `type`
- ✅ Stars wagering — 500⭐ max/match · 1,000⭐ daily cap
- ✅ Level 10+ gate for ranked wager battles

</td>
</tr>
<tr>
<td valign="top" width="50%">

### 🏆 Gamification Engine
- ✅ Quadratic XP: `100 × (Level−1)²` across 100 levels
- ✅ **10 tiers**: Bronze → Silver → Gold → Platinum → Sapphire → Emerald → Ruby → Diamond → Legend → Grandmaster
- ✅ **10 sub-titles per tier**: Learner → Explorer → Practitioner → Scholar → Achiever → Expert → Master → Champion → Legend → Grandmaster
- ✅ Level-up modal: 200 confetti pieces in 6 EduQuest brand colors
- ✅ 52-week CSS Grid heatmap — 5 green intensity levels
- ✅ XP Bar: dynamic color — Blue / Green (>80%) / Gold (max level)
- ✅ Named achievement badges with exact unlock conditions
- ✅ Stars economy — earned only through learning, never purchasable

</td>
<td valign="top" width="50%">

### 💻 Engineering (16 Tracks)
- ✅ 12 programming languages — C, C++, Java, Python, JS, TS, Rust, Kotlin, Swift, SQL, Dart, Ruby
- ✅ 4 CS subjects — DSA (60d), Web Dev (30d), System Design (25d), DBMS (20d)
- ✅ DSA: 6 phases × 10 days — Fundamentals → Core → Patterns → Practice → Mock → Revision
- ✅ `DailyLesson` model: `dayNumber`, `theoryContent`, `youtubeUrl`, `planId`
- ✅ `CodingProblem` with `starterCode`, `solutionCode`, `testCases`, `points`
- ✅ `CodingSubmission` tracks: `executionTime` (ms), `memoryUsed` (KB), `testsPassed`, `testsTotal`, `errorMessage`
- ✅ SDE interview catalog — IIT-professor-verified sheets
- ✅ BTech CSE semester survival guides (all 8 semesters)

</td>
</tr>
<tr>
<td valign="top" width="50%">

### 🔭 Physics Simulations (25+)
- ✅ Custom `ForceEngine.tsx` — Newtonian physics at 60fps Canvas
- ✅ `requestAnimationFrame` deterministic timestep
- ✅ Live telemetry: Velocity, Acceleration, Net Force, Kinetic Energy
- ✅ Sliders: Mass (0.5–10 kg), Force (±20N), Friction μ (0–1.0), Angle
- ✅ `Topic.hasSimulation` flag auto-injects sim components into chapter pages
- ✅ Framer Motion animations for physical entity movement
- ✅ 100% NCERT Class 9 Chapter 9 alignment

</td>
<td valign="top" width="50%">

### 💬 Community & Events
- ✅ Forums: 8 categories — All, General, Class 9–12, Engineering, Battles
- ✅ `CommunityPost` has: `likesCount`, `commentsCount`, `viewsCount`, `isPinned`, `isResolved`, `isFlagged`, `tags`
- ✅ Mentor reply badge (`isMentorReply` on `CommunityComment`)
- ✅ **6 live events**: Science Olympiad, DSA Code Sprint, Math Battle Royale, Hackathon, Board Mock, Python Championship
- ✅ Hackathon: 24h build, teams of 3–4, GitHub URL submission, live standings
- ✅ Admin console: Approve / Reject / Needs Info on host applications

</td>
</tr>
<tr>
<td valign="top" width="50%">

### 📊 Dashboard & Analytics
- ✅ XP Bar with dynamic coloring (3-state: Blue / Green / Gold)
- ✅ 52-week activity heatmap — pure CSS Grid, no SVG/Canvas
- ✅ Heatmap: 5 intensity levels (`#21262D` → `#7ee787`)
- ✅ `DashboardLoadingSkeleton.tsx` — shimmer placeholders
- ✅ IntersectionObserver animations — 200/400/600ms staggered
- ✅ Battle history widget — wins, losses, XP delta
- ✅ Quick Actions: Start Battle, Continue Plan, View Leaderboard

</td>
<td valign="top" width="50%">

### 🔐 Security & Auth
- ✅ Clerk RS256 JWT → HS256 fallback → 401
- ✅ Argon2 password hashing (memory-hard)
- ✅ Cookie: `eduquest_session` — `HttpOnly: true`, `SameSite: lax`, `MaxAge: 7 days`
- ✅ `Secure: true` in production or `EDUQUEST_COOKIE_SECURE != "false"`
- ✅ Validation middleware: HTML stripping, proto-pollution prevention (`__proto__`, `constructor`, `prototype` check)
- ✅ Platform-store atomic writes: temp file + OS-level `rename()`
- ✅ 10 HTTP security headers via Helmet
- ✅ P50/P95/P99 latency monitoring via Pino structured JSON logs

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

### 🖥️ Frontend

| Package | Version | Role |
|---------|---------|------|
| **Next.js** | `16.2.6` | App Router, SSR, ISR, API Routes, Turbopack |
| **React** | `19.2.4` | Server + client component model |
| **TypeScript** | `5.x` | Strict mode — `any` banned project-wide |
| **Tailwind CSS** | `4.x` | Utility-first layout + responsive breakpoints |
| **CSS Modules** | built-in | Per-page scoped styles — zero cross-page bleed |
| **Framer Motion** | `12.38.0` | Physics sim entity movement, modal transitions |
| **Zustand** | `5.0.13` | Global state — `authStore`, theme, battle session |
| **TanStack Query** | `5.100.10` | Server state, leaderboard caching, refetch |
| **Lucide React** | `1.14.0` | Icon system — tree-shaken via `optimizePackageImports` |
| **KaTeX** | `0.16.45` | Math equation rendering for Physics + Math chapters |
| **Recharts** | `3.8.1` | Weekly analytics charts (configured but some views use CSS) |
| **Howler.js** | `2.2.4` | In-battle audio — correct/wrong answer sounds |
| **React Confetti** | `6.4.0` | 200-piece level-up celebration — 6 brand colors |
| **React Hot Toast** | `2.6.0` | XP gain, streak warning, error toasts |
| **React Hook Form** | `7.75.0` | Sign-up, settings, host-application forms |
| **Zod** | `4.4.3` | Schema validation + type inference |
| **Socket.IO Client** | `4.8.3` | Battle WebSocket — `join_queue`, `submit_answer`, `match_found`, `match_end` |
| **date-fns** | `4.1.0` | 52-week heatmap generation, streak calc, relative timestamps |
| **Axios** | `1.16.1` | HTTP client in `"use client"` components |
| **next-themes** | `0.4.6` | Flicker-free dark/light mode |
| **clsx + tailwind-merge** | latest | Conditional className + Tailwind conflict resolution |

**Self-Hosted Fonts** (`@fontsource` — zero Google Fonts DNS round-trips):

| Font | `CSS Variable` | Used For |
|------|---------------|----------|
| **Sora** | `--font-heading` | Hero titles, headings, XP level display |
| **Inter** | `--font-body` | Body text, UI labels, nav, cards |
| **Space Grotesk** | `--font-data` | Stats counters, leaderboard numbers |
| **JetBrains Mono** | `--font-code` | Code blocks, engineering content, terminal |

---

### ⚙️ Backend (Express 5 + Socket.IO)

| Package | Version | Role |
|---------|---------|------|
| **Express** | `5.2.1` | REST API — auth, battle, wallet, hackathon, notifications |
| **Socket.IO** | `4.8.3` | Real-time battle rooms with UUID-based room IDs |
| **Prisma ORM** | `7.8.0` | Type-safe DB access + auto-generated TypeScript client |
| **node-postgres (pg)** | `8.20.0` | Raw Pool — migration runner + aggregation queries |
| **ioredis** | `5.10.1` | Redis client — rate limiting, session cache, pub/sub |
| **@socket.io/redis-adapter** | `8.3.0` | Socket.IO multi-instance state (PM2 cluster) |
| **Helmet** | `8.1.0` | 10 HTTP security headers |
| **compression** | `1.8.1` | Brotli/Gzip on responses > 1KB |
| **cors** | `2.8.6` | Allowlisted origins + credentials: true |
| **hpp** | `0.2.3` | HTTP Parameter Pollution blocking |
| **express-slow-down** | `3.1.0` | Progressive slowdown before hard rate-limit |
| **morgan** | `1.10.1` | Colorized (dev) / minimal (prod) HTTP logging |
| **multer** | `2.1.1` | Hackathon project file uploads |
| **pino** | `10.3.1` | Structured JSON logs — P50/P95/P99 tracking |
| **dotenv** | `17.4.2` | Env variable loading |
| **tsx** | `4.21.0` | TypeScript execution for migration runner |

**Request Middleware Order** (every backend request):

```
① Helmet         → 10 security headers
② CORS           → origin allowlisting
③ compression    → Brotli/Gzip
④ HPP            → parameter pollution guard
⑤ Response-Time  → X-Response-Time header
⑥ JSON parser    → 2MB body limit
⑦ Morgan         → HTTP access logging
⑧ Request-ID     → X-Request-ID distributed tracing header
⑨ Rate Limiter   → 100 req/60s per IP (Redis) — /health and /ready bypass
```

---

### 🗄️ Data Infrastructure

| Technology | Config | Purpose |
|-----------|--------|---------|
| **PostgreSQL 16** | `max_connections=200` · `shared_buffers=256MB` · `work_mem=4MB` · `effective_cache_size=768MB` · `random_page_cost=1.1` · slow-query log at 1,000ms | Primary data store |
| **Redis 7** | `maxmemory 256mb` · `allkeys-lru` · AOF `appendfsync everysec` · `save 300 10 / 60 1000` | Rate limiting, caching, Socket.IO pub/sub |
| **Prisma** | `7.8.0` + `@prisma/adapter-pg` | ORM sharing the raw `pg` pool |
| **PGLite** | `0.4.6` | In-process PostgreSQL for offline dev |
| **Docker Compose** | `version 3.9` | 4-service stack: postgres + redis + backend + frontend |
| **PM2** | cluster mode · `max` CPU instances · `max_memory_restart: "1G"` | Node.js process management |
| **Sharp** | `0.34.5` | AVIF/WebP image conversion pipeline |

**Redis Cache TTL Strategy:**

| Resource Type | TTL | Reasoning |
|--------------|-----|-----------|
| Static (class categories, subjects) | **30 min** | Changes only on migration |
| Content (chapters, topics) | **15 min** | Content editor updates |
| User profiles & settings | **5 min** | Balance freshness + load |
| Leaderboard | **2 min** | Near-real-time ranking |
| Realtime (matchmaking queues) | **30 sec** | Must reflect live state |
| Search results | **3 min** | Acceptable staleness |
| Default | **5 min** | Safe fallback |

---

### 🔐 Authentication System

| Layer | Technology | Details |
|-------|-----------|---------|
| **Primary** | Clerk `7.4.1` | Google · Microsoft · Email — managed JWT rotation |
| **Frontend SDK** | `@clerk/nextjs` | `<ClerkProvider>` in root layout, catch-all `[[...sign-in]]` / `[[...sign-up]]` |
| **Backend SDK** | `@clerk/express` | RS256 JWKS from `clerk.accounts.dev/.well-known/jwks.json` |
| **Fallback** | Custom HS256 JWT | `EDUQUEST_ENABLE_LEGACY_AUTH=true` enables when Clerk unreachable |
| **Password** | Argon2 | Memory-hard — vastly stronger than bcrypt |
| **Session Cookie** | `eduquest_session` | `HttpOnly: true` · `SameSite: lax` · `Secure: true` in prod · `MaxAge: 604,800s (7 days)` |
| **JIT Provisioning** | `current-user.ts` | First Clerk login auto-creates PostgreSQL row with `password_hash = 'clerk-' + clerkUserId` |

**JIT Provisioning Flow (4 steps):**

```
1. Get userId from Clerk auth()
2. Fast Path: Query eduquest_users WHERE password_hash = 'clerk-' + userId
3. Slow Path (if not found): Call Clerk's currentUser() for email + displayName
4. findOrCreateClerkUser():
   ├── Email exists, not linked → UPDATE password_hash = 'clerk-<clerkId>'
   └── No user → INSERT with track='class-9', role='student', level=1, xp=0
```

---

## 📂 Project Structure

```
eduquest/
│
├── 📱 frontend/                           # Next.js 16 Full-Stack Application
│   ├── src/
│   │   ├── app/                           # App Router — every folder = URL route
│   │   │   │
│   │   │   ├── 🏠 page.tsx                # Homepage: hero · live DB stats · track cards · testimonials · leaderboard preview
│   │   │   ├── layout.tsx                # Root: ClerkProvider · Navbar · Footer · QueryClientProvider
│   │   │   ├── HomeAnimations.tsx        # IntersectionObserver — threshold 0.1 — stagger 200/400/600ms
│   │   │   ├── HomePage.module.css       # Homepage-scoped styles
│   │   │   │
│   │   │   ├── 📚 class-9/               # 13 subjects — Math, Science, Social, English, Hindi, Sanskrit, IT, AI, CS, PE, Art, Work, Health
│   │   │   │   ├── page.tsx              #   Subject listing grid (ISR 1h)
│   │   │   │   └── [subject]/            #   Day-wise plan + chapter list
│   │   │   │       └── [chapter]/        #   Notes · ~20 MCQs · Physics sims (if hasSimulation=true)
│   │   │   ├── 📚 class-10/              # 6 board prep subjects
│   │   │   ├── 📚 class-11/              # Stream selection: Science (PCM/PCB) · Commerce · Arts
│   │   │   ├── 📚 class-12/              # Board + JEE/NEET
│   │   │   │
│   │   │   ├── 💻 engineering/           # 16 coding tracks
│   │   │   │   ├── page.tsx              #   Track cards with language colors (ISR 12h)
│   │   │   │   └── [slug]/               #   Day-wise lesson plan
│   │   │   │
│   │   │   ├── ⚔️  battle/               # Battle Arena
│   │   │   │   ├── page.tsx              #   Mode select — Casual / Ranked [ISR 300s]
│   │   │   │   ├── BattleClient.tsx      #   Full battle UI — dynamic import
│   │   │   │   ├── BattleLoadingSkeleton.tsx  # shimmer: loadingTitle · loadingMatchCard · loadingStatsGrid
│   │   │   │   ├── matchmaking/          #   Queue UI — radarPulse animation
│   │   │   │   └── [matchId]/            #   Live Socket.IO room — anti-cheat active
│   │   │   │
│   │   │   ├── 📊 dashboard/             # Protected — no ISR cache
│   │   │   │   ├── page.tsx              #   Server shell
│   │   │   │   ├── DashboardClient.tsx   #   ActivityHeatmap · XPBar · QuickActions
│   │   │   │   └── DashboardLoadingSkeleton.tsx  # Pulsing stat blocks
│   │   │   │
│   │   │   ├── 🏆 leaderboard/           # Global + class + engineering [ISR 300s]
│   │   │   ├── 💬 community/             # 8-category forums — dynamic import + CommunityLoadingSkeleton
│   │   │   ├── 🏛️  events/               # 6 live events [ISR 300s]
│   │   │   ├── 🔨 hackathons/            # All hackathons · [id] detail · GitHub submission
│   │   │   │
│   │   │   ├── 💰 wallet/                # Stars balance · earn methods · Level 10 gate
│   │   │   ├── 📝 test/                  # Test center — chapter tests + timed mock exams
│   │   │   ├── ❓  mcqs/                 # MCQ bank — filter: subject / class / difficulty
│   │   │   ├── 📓 notes/                 # Chapter study notes — C++, DBMS, OS, Polynomials
│   │   │   ├── 📅 semester/              # BTech CSE 8-semester survival guides + priority checklists
│   │   │   ├── 🎤 interviews/            # [slug] detail pages — C++ OOP · DBMS · OS interview Q&A
│   │   │   ├── 🔍 search/                # Full-text PostgreSQL search
│   │   │   │
│   │   │   ├── 👤 profile/               # Public profile — achievements · stats · streak record
│   │   │   ├── ⚙️  settings/             # Profile editor · password change · privacy
│   │   │   ├── 🔔 notifications/         # In-app center — auto-purge 14d read / 30d unread
│   │   │   ├── 🛡️  admin/                # Host application review: Approve / Reject / Needs Info
│   │   │   │
│   │   │   ├── ℹ️  about/                # Mission · pillars · live PostgreSQL counters [ISR 1h]
│   │   │   ├── ✨ features/              # Platform feature showcase [ISR 12h]
│   │   │   ├── 💳 pricing/               # Free / Student Pro / School Partner [ISR 12h]
│   │   │   ├── 📬 contact/               # Contact form + FAQ accordion [ISR 12h]
│   │   │   ├── ❓  faq/                  # Categorized FAQ [ISR 12h]
│   │   │   ├── 🔐 sign-in/[[...sign-in]] # Clerk catch-all sign-in page
│   │   │   ├── 🔐 sign-up/[[...sign-up]] # Clerk catch-all sign-up page
│   │   │   ├── 🔐 forgot-password/       # Email-based password reset
│   │   │   ├── 📜 terms/ · privacy/      # Legal pages [ISR 24h]
│   │   │   ├── 🗺️  sitemap.ts            # Dynamic XML sitemap — DB subjects + chapters + 500 posts + SEO nodes
│   │   │   └── 🤖 robots.ts              # Allows curriculum · Disallows /admin /dashboard /api/auth /api/progress /test
│   │   │
│   │   │   └── api/                      # Next.js Route Handlers
│   │   │       ├── auth/                 #   sign-in · sign-up · sign-out · me · change-password
│   │   │       ├── battle/               #   matchmaking POST/GET · history
│   │   │       ├── community/posts/      #   list · create · [id]: detail · comment · upvote
│   │   │       ├── events/               #   list · register · host-application (atomic DB + audit)
│   │   │       ├── leaderboard/          #   global · class-9/10/11/12 · engineering scope
│   │   │       ├── wallet/               #   GET balance + 20 transactions · POST transaction
│   │   │       ├── achievements/         #   named badges with unlock conditions
│   │   │       ├── notifications/        #   paginated · 14d/30d auto-purge
│   │   │       ├── questions/            #   MCQ bank — filter: subject · class · difficulty · chapter
│   │   │       ├── profile/              #   XP · streak · level · daily stats · battle win rate
│   │   │       ├── progress/             #   GET chapter status · POST mark-complete + XP
│   │   │       ├── subjects/             #   curriculum subjects by class or engineering track
│   │   │       ├── platform-stats/       #   live counters — real PostgreSQL SELECT COUNT(*) queries
│   │   │       ├── search/               #   full-text PostgreSQL search across curriculum
│   │   │       ├── activity/             #   364-day (52-week) heatmap data
│   │   │       ├── levels/               #   all 100 XP levels with tier names + sub-titles
│   │   │       ├── classes/              #   class category metadata
│   │   │       ├── admin/                #   admin-only host application management
│   │   │       ├── health/               #   GET uptime + version
│   │   │       └── readiness/            #   GET PostgreSQL + Redis probe
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar/               # Desktop: 3 dropdowns (Classes · Practice · Explore)
│   │   │   │   │                         # Mobile: side drawer + body-scroll lock + backdrop overlay
│   │   │   │   │                         # Auth states: [Sign In / Start Free] ↔ [displayName / Dashboard / Sign Out]
│   │   │   │   └── Footer/               # 3 columns: Learn · Platform · Company · Legal bottom bar
│   │   │   ├── gamification/
│   │   │   │   ├── XPBar.tsx             # Blue (normal) → Green (>80%) → Gold (max level) dynamic fill
│   │   │   │   ├── ActivityHeatmap.tsx   # 52-week pure CSS Grid · 5 intensity levels (#21262D → #7ee787)
│   │   │   │   ├── StreakCounter.tsx     # 7-day calendar with streak flame
│   │   │   │   └── LevelUpModal.tsx      # 200 confetti pieces · 6 colors · Zap or Star icon by tier
│   │   │   ├── simulations/              # 25+ Newtonian physics canvas components
│   │   │   ├── Home/                     # Hero · Stats · Feature grid · Testimonials · Leaderboard preview
│   │   │   ├── dashboard/                # Chart widgets · activity feed
│   │   │   ├── learningproviders/        # QueryClient + auth context providers
│   │   │   └── seoui/                    # JSON-LD injection + meta tag helpers
│   │   │
│   │   ├── lib/
│   │   │   ├── server/
│   │   │   │   ├── auth/
│   │   │   │   │   └── current-user.ts   # 4-step JIT Clerk → PostgreSQL provisioning
│   │   │   │   ├── database/
│   │   │   │   │   ├── migrations/       # 21 ordered SQL files (001–021)
│   │   │   │   │   ├── postgres.ts       # Singleton pg Pool (max:10, idleTimeoutMs:30s)
│   │   │   │   │   ├── prisma.ts         # Prisma client singleton (global guard)
│   │   │   │   │   └── seed.ts           # Demo data seeder
│   │   │   │   ├── repositories/
│   │   │   │   │   └── platform-repository.ts  # Interface + Postgres/JSON adapters
│   │   │   │   ├── data/
│   │   │   │   │   ├── platform-store.ts # Atomic JSON: Promise queue + temp file + OS rename()
│   │   │   │   │   └── subject-plans.ts  # Day-wise plan generation logic
│   │   │   │   ├── env.ts                # Feature flag helpers (EDUQUEST_*)
│   │   │   │   └── seo/
│   │   │   │       ├── schema-generators.ts  # Course · FAQPage · TechArticle · BreadcrumbList · HowTo
│   │   │   │       └── programmatic-data.ts  # Content DB for Notes · MCQs · Interviews · Semester guides
│   │   │   ├── constants.ts              # NAV_LINKS · CLASSES_SIMPLE · ENGINEERING_LANGUAGES · ENGINEERING_SKILLS
│   │   │   ├── content/                  # Class 9 Science deeply-nested topic data (Force, Matter, Motion)
│   │   │   ├── curriculum/
│   │   │   │   ├── learning-catalog.ts   # All class + engineering track definitions
│   │   │   │   ├── cbse-catalog.ts       # CBSE-specific catalog
│   │   │   │   └── force-laws-of-motion/ # Physics simulation content + question bank
│   │   │   ├── events/
│   │   │   │   └── event-catalog.ts      # 6 events: Olympiad · Code Sprint · Math Battle · Hackathon · Mock · Python
│   │   │   └── validation/               # Zod schemas for all API request/response shapes
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css               # 135 CSS variables · 8-pt grid · 4-tier shadow · animation library
│   │   └── types/                        # Global TypeScript interfaces
│   │
│   ├── prisma/
│   │   └── schema.prisma                 # 12+ model domains — see Database section
│   ├── public/images/                    # Route hero images (PNG → AVIF/WebP pipeline)
│   ├── next.config.ts                    # ISR · Turbopack · image CDN · security headers · compression
│   └── package.json
│
├── ⚙️  backend/                           # Express 5 + Socket.IO API Server
│   ├── src/
│   │   ├── index.ts                      # Bootstrap → 6-step graceful shutdown (30s timeout)
│   │   ├── config/
│   │   │   ├── database.ts               # pg pool config
│   │   │   ├── redis.ts                  # ioredis singleton
│   │   │   └── cache.ts                  # TTL strategy by resource type
│   │   ├── routes/
│   │   │   ├── auth.ts                   # POST /register · /login · /refresh · /logout · GET /me
│   │   │   ├── battle.ts                 # POST /queue · DELETE /queue · GET /matches/:id · POST /matches/:id/answer · /complete
│   │   │   ├── users.ts                  # GET /:id (cached) · GET /:id/stats (cached) · PUT /:id/profile
│   │   │   ├── coding.ts                 # Problem CRUD + test-case submission validation
│   │   │   ├── wallet.ts                 # Stars earn/spend transactions
│   │   │   ├── hackathons.ts             # CRUD + standings + GitHub submission
│   │   │   ├── notifications.ts          # Dispatch + 14d/30d auto-purge
│   │   │   ├── audit.ts                  # GET / · GET /stats — tamper-proof event trail
│   │   │   └── content.ts                # Curriculum content endpoints
│   │   ├── services/
│   │   │   ├── socket.service.ts         # Received: join_queue · leave_queue · submit_answer · ping
│   │   │   │                             # Emitted:  match_found · question_start · opponent_answered · match_end · error
│   │   │   ├── notification.service.ts   # Dispatch + auto-purge
│   │   │   └── audit.service.ts          # Buffered immutable event writer
│   │   └── middlewares/
│   │       ├── auth.middleware.ts        # HS256 → RS256 Clerk chain
│   │       ├── rateLimiter.ts            # 100 req/60s, Redis-backed
│   │       └── validation.ts             # stripHtml() · isSafeObject() · sanitizeString()
│   └── package.json
│
├── docs/
│   ├── IMPLEMENTATION_STATUS.md          # Live vs. planned (canonical source of truth)
│   └── PRODUCTION_DEPLOYMENT.md
├── EduBattle_Master_Plan.md              # V3.0 — 60-chapter product specification
├── docker-compose.yml                    # 4-service orchestration
├── ecosystem.config.js                   # PM2 cluster config
└── README.md                             # ← You are here
```

---

## 📄 Pages & Routes

### 🌐 Public Pages

| Route | SEO Title | ISR | JSON-LD Schemas |
|-------|-----------|-----|----------------|
| `/` | "EduQuest — Learn Smarter. Battle Harder. Level Up." | 600s | WebSite, Organization |
| `/features` | Feature showcase | 12h | ItemList |
| `/pricing` | Tier comparison | 12h | — |
| `/about` | "About EduQuest — Our Mission & Vision" | 1h | Organization |
| `/contact` | Contact + FAQ | 12h | FAQPage |
| `/faq` | Categorized FAQ | 12h | FAQPage |
| `/terms` · `/privacy` | Legal | 24h | — |

### 🎓 Academic Track Pages

| Route | Data Source | ISR | Special |
|-------|-------------|-----|---------|
| `/class-9` | `getTrackSubjects("class-9")` | 1h | 13 subjects |
| `/class-9/[subject]` | `getSubjectPlanForRoute` | Dynamic | Day-wise plan |
| `/class-9/[subject]/[chapter]` | `chapter-registry` | Dynamic | Notes + MCQs + Physics sims |
| `/class-10` · `/class-10/[subject]` | PostgreSQL | 1h / Dynamic | Board prep |
| `/class-11` · `/class-12` | Static catalog | 12h | Stream-based |
| `/engineering` | `ENGINEERING_LANGUAGES` constant | 12h | 16 track cards |
| `/engineering/[slug]` | `learning-catalog.ts` | Dynamic | Day-wise coding plan |
| `/semester` | `programmaticSemesterCatalog` | Static | BTech CSE 8 semesters |
| `/interviews/[slug]` | `programmaticInterviewsCatalog` | Static | C++ · DBMS · OS guides |
| `/notes` · `/mcqs` · `/test` | PostgreSQL / static | Dynamic | Practice tools |

### ⚔️ Battle Arena

| Route | Description |
|-------|-------------|
| `/battle` | Mode select — Casual (free, all levels) / Ranked (Level 10+, Stars wager) |
| `/battle/matchmaking` | Elo queue — ±3 levels · `radarPulse` animation · widens to ±5 at 30s |
| `/battle/[matchId]` | Live Socket.IO room — 10 MCQs · 15s each · anti-cheat hooks active |

### 📊 Protected Student Zone

| Route | Auth Required | Description |
|-------|:------------:|-------------|
| `/dashboard` | ✅ | XP bar · 52-week heatmap · battle history · quick actions |
| `/profile` | ❌ (public) | Achievements · stats · highest streak |
| `/wallet` | ✅ | Stars balance · earn methods · Level 10 gate · transaction ledger |
| `/notifications` | ✅ | In-app center · auto-purge: 14d read / 30d unread |
| `/settings` | ✅ | Profile editor · password change · privacy controls |
| `/admin` | ✅ ADMIN | Host application console: Approve / Reject / Needs Info |

### 🏆 Community & Competitions

| Route | Description |
|-------|-------------|
| `/leaderboard` | Global · class-filtered · engineering scope [ISR 300s] |
| `/community` | 8-category forums: All · General · Class 9–12 · Engineering · Battles |
| `/events` | 6 live events: Science Olympiad · Code Sprint · Math Battle · Hackathon · Board Mock · Python Championship |
| `/hackathons` | All hackathons with registration |
| `/hackathons/[id]` | 24h build · team 3–4 · GitHub URL submission · live standings |

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Minimum | Why |
|-------------|---------|-----|
| **Node.js** | `v20.x` | ES2022 + `crypto.subtle` API |
| **npm** | `v10.x` | Workspaces + `--legacy-peer-deps` |
| **PostgreSQL** | `v14+` | JSONB, full-text search, generated columns |
| **Redis** | `v6+` | Sorted sets, streams, pub/sub |

---

### ⚡ 3-Command Quickstart

```bash
git clone https://github.com/yourusername/eduquest.git && cd eduquest
cd frontend && npm install --legacy-peer-deps
npm run db:migrate && npm run dev
```
> App runs at **http://localhost:5000** ✅

---

### Full Step-by-Step Setup

**1 — Clone**
```bash
git clone https://github.com/yourusername/eduquest.git
cd eduquest
```

**2 — Frontend dependencies**
```bash
cd frontend
npm install --legacy-peer-deps
# ⚠️ --legacy-peer-deps is required: React 19 has peer dep conflicts with some packages
```

**3 — Backend dependencies** *(only needed for real-time battle rooms)*
```bash
cd ../backend
npm install
```

**4 — Configure environment**
```bash
cd ../frontend
cp .env.example .env.local
# Fill in values — full list in Environment Variables section below
```

**5 — Start PostgreSQL + Redis** *(via Docker — recommended)*
```bash
# From project root
docker-compose up -d postgres redis

# PostgreSQL boots with production performance tuning:
#   max_connections=200  shared_buffers=256MB  work_mem=4MB
#   effective_cache_size=768MB  random_page_cost=1.1
#   Logs all queries slower than 1,000ms
#
# Redis boots with:
#   maxmemory 256mb  allkeys-lru eviction
#   AOF persistence (appendfsync everysec)
#   Snapshot: save 300 10 / save 60 1000
```

**6 — Run all 21 migrations**
```bash
npm run db:migrate
```
```
✓ 001_initial_platform.sql
✓ 002_event_catalog_audit_jobs.sql
...
✓ 021_chapter_milestones.sql
Applied 21 EduQuest migration(s) successfully.
```

**7 — Seed demo data** *(optional — recommended for first run)*
```bash
npm run db:seed
# Seeds: 10 leaderboard users · 10 community posts · 6 events
#        CBSE curriculum structure · 100 XP level thresholds · achievement badges
# ⚠️ Blocked in production unless EDUQUEST_ALLOW_DEMO_SEED=true
```

**8 — Start the frontend dev server**
```bash
npm run dev
# ✓ Next.js 16.2.6 (Turbopack) ready at http://localhost:5000
```

**9 — Start the battle backend** *(separate terminal, only for battle features)*
```bash
cd ../backend
npm run dev
# Express 5 + Socket.IO listening on http://localhost:4000
```

---

### 📋 All Scripts

| Script | Directory | Description |
|--------|-----------|-------------|
| `npm run dev` | `frontend/` | Next.js Turbopack server — port 5000, HMR |
| `npm run build` | `frontend/` | Production Next.js build |
| `npm run start` | `frontend/` | Start compiled production server |
| `npm run db:migrate` | `frontend/` | Apply pending SQL migrations in order |
| `npm run db:seed` | `frontend/` | Seed demo data (blocked in prod) |
| `npm run typecheck` | `frontend/` | TypeScript strict — zero errors required |
| `npm run lint` | `frontend/` | ESLint 9 — must be clean before PR |
| `npm run dev` | `backend/` | Express + Socket.IO dev server — port 4000 |
| `npm run build` | `backend/` | Compile TypeScript → `dist/` |
| `npm run start` | `backend/` | Start production backend |
| `docker-compose up -d` | root | Full 4-service stack |
| `docker-compose down -v` | root | ⚠️ Teardown including volumes |

---

## 🔐 Environment Variables

### Frontend — `frontend/.env.local`

```env
# ── Database ──────────────────────────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@localhost:5432/eduquest

# ── Adapter & Data Mode ───────────────────────────────────────────────────────
EDUQUEST_PERSISTENCE_ADAPTER=postgres        # "postgres" = full production mode
EDUQUEST_ALLOW_STATIC_FALLBACKS=true         # Show versioned catalog if DB unreachable
EDUQUEST_STRICT_DATA_MODE=false              # true = disable ALL local fallback data
EDUQUEST_ALLOW_DEMO_SEED=false               # Must be "true" to run db:seed in production

# ── Clerk Authentication ───────────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# ── Legacy Auth Fallback ───────────────────────────────────────────────────────
EDUQUEST_ENABLE_LEGACY_AUTH=true             # Enable HS256 JWT fallback session
EDUQUEST_SESSION_SECRET=your-32+-char-cryptographically-secure-secret
EDUQUEST_COOKIE_SECURE=false                 # Set "true" in production (HTTPS required)

# ── Redis (optional in dev) ────────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ── Application ───────────────────────────────────────────────────────────────
NODE_ENV=development
PORT=5000
NEXT_PUBLIC_API_URL=                         # Empty = same-origin; set to backend URL if separate
```

### Backend — `backend/.env`

```env
DATABASE_URL=postgresql://user:password@localhost:5432/eduquest
REDIS_URL=redis://localhost:6379
CLERK_SECRET_KEY=sk_test_...
CLERK_JWKS_URL=https://your-instance.clerk.accounts.dev/.well-known/jwks.json
JWT_SECRET=your-hs256-signing-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
FRONTEND_URL=http://localhost:5000
CORS_ORIGINS=http://localhost:5000
PORT=4000
NODE_ENV=development
```

### Feature Flags Summary

| Flag | Default | Effect |
|------|---------|--------|
| `EDUQUEST_PERSISTENCE_ADAPTER` | `json` | `postgres` → production DB mode |
| `EDUQUEST_ENABLE_LEGACY_AUTH` | `false` | `true` → HS256 JWT fallback enabled |
| `EDUQUEST_STRICT_DATA_MODE` | `false` | `true` → disables ALL static fallbacks |
| `EDUQUEST_ALLOW_STATIC_FALLBACKS` | `false` | `true` → shows catalog even if DB down |
| `EDUQUEST_ALLOW_DEMO_SEED` | `false` | `true` → allows `db:seed` in production |
| `EDUQUEST_COOKIE_SECURE` | `false` | `true` → cookie requires HTTPS (set in prod) |

---

## 🗄️ Database Schema

### Architecture Diagram

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                        EDUQUEST DATA DOMAINS                                 ║
╠═══════════════════════╦══════════════════════════════════════════════════════╣
║ 👤 Identity           ║ User · StudentProfile · UserSession                  ║
║ 🎓 Curriculum         ║ ClassCategory · Stream · Subject · Chapter · Topic   ║
║                       ║ UserProgress · MockTest · TestScore · Question        ║
║ 💻 Engineering        ║ CodingLanguage · LearningPlan · DailyLesson          ║
║                       ║ CodingProblem · CodingSubmission                     ║
║ ⚔️  Battle            ║ Match · MatchParticipant · MatchmakingTicket         ║
║ 🏆 Gamification       ║ UserAchievement · Wallet · WalletTransaction         ║
║ 💬 Community          ║ CommunityCategory · CommunityPost · CommunityComment ║
║ 🏛️  Events            ║ Event · EventRegistration · HostApplication          ║
║ 🔔 Notifications      ║ Notification (in-app + email-queued)                 ║
║ 📊 Infrastructure     ║ AuditLog · BackgroundJob · SchemaMigration · SeoCache║
╚═══════════════════════╩══════════════════════════════════════════════════════╝
```

### Key Model Definitions

<details>
<summary><strong>👤 User — Core Identity</strong></summary>

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  phone         String?   @unique
  passwordHash  String?
  avatar        String?
  role          String    @default("STUDENT")
  // GUEST | STUDENT | ENG_LEARNER | ORGANIZER | TEACHER | PARENT | ADMIN | MODERATOR | PROCTOR

  // Gamification — denormalized for O(1) dashboard reads (no hot-path joins)
  points        Int       @default(0)
  xp            Int       @default(0)
  currentLevel  Int       @default(1)
  currentStreak Int       @default(0)
  highestStreak Int       @default(0)
  lastActive    DateTime  @default(now())

  // Minors & Safety
  isMinor       Boolean   @default(false)
  parentEmail   String?

  isActive      Boolean   @default(true)
  isVerified    Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model StudentProfile {
  userId              String    @unique
  classId             String?
  stream              String?               // "Science" | "Commerce" | "Arts / Humanities"
  board               String    @default("CBSE")
  targetExams         String?               // "JEE,NEET"
  skillLevel          String    @default("beginner")
  languagePreference  String    @default("english")
  institution         String?
  xpMultiplier        Float     @default(1.0)
  // + phone, parentPhone, totalPoints, currentStreak, longestStreak
}
```
</details>

<details>
<summary><strong>🎓 Curriculum Models</strong></summary>

```prisma
model ClassCategory {
  id          String    @id @default(cuid())
  name        String    // "Class 9" | "Class 10" | "Class 11" | "Class 12" | "Engineering"
  slug        String    @unique
  description String?
  icon        String?
  color       String?
  orderIndex  Int
  isActive    Boolean   @default(true)
}

model Subject {
  id          String    @id @default(cuid())
  name        String    // "Mathematics", "Physics", "Computer Science"
  slug        String    @unique
  description String?
  icon        String?
  color       String?
  classId     String
  streamId    String?   // Null for Class 9/10 (no stream)
  orderIndex  Int
  isActive    Boolean   @default(true)
}

model Chapter {
  id                String    @id @default(cuid())
  title             String
  slug              String    @unique
  description       String?
  orderIndex        Int
  subjectId         String
  estimatedMinutes  Int?
  difficulty        String?   // "EASY" | "MEDIUM" | "HARD"
}

model Topic {
  id            String    @id @default(cuid())
  title         String
  slug          String    @unique
  content       String?   // Markdown / rich text
  youtubeUrl    String?   // Video lecture link
  orderIndex    Int
  chapterId     String
  hasAnimation  Boolean   @default(false)
  hasSimulation Boolean   @default(false)   // Injects physics sim component when true
}

model UserProgress {
  userId      String
  chapterId   String
  completed   Boolean   @default(false)
  score       Int?
  answers     String?   // JSON — selected option per question
  @@unique([userId, chapterId])
}
```
</details>

<details>
<summary><strong>💻 Engineering & Coding Models</strong></summary>

```prisma
model CodingLanguage {
  id          String    @id @default(cuid())
  name        String    // "Python", "Java", "Rust"
  slug        String    @unique
  description String?
  icon        String?
  color       String?
  difficulty  String?   // "beginner" | "intermediate" | "advanced"
  isActive    Boolean   @default(true)
  orderIndex  Int
}

model DailyLesson {
  id            String    @id @default(cuid())
  dayNumber     Int
  title         String
  description   String?
  theoryContent String?   // Full lesson content (Markdown)
  youtubeUrl    String?
  planId        String
  languageId    String
}

model CodingSubmission {
  id            String    @id @default(cuid())
  userId        String
  problemId     String
  code          String
  language      String
  status        String    // PASSED | FAILED | ERROR
  executionTime Int?      // milliseconds
  memoryUsed    Int?      // kilobytes
  testsPassed   Int?
  testsTotal    Int?
  errorMessage  String?
  submittedAt   DateTime  @default(now())
}
```
</details>

<details>
<summary><strong>⚔️ Battle Models</strong></summary>

```prisma
model Match {
  id               String    @id @default(cuid())
  subjectId        String
  status           String    // WAITING | ACTIVE | COMPLETED | CANCELLED
  mode             String?   // "casual" | "ranked"
  questionsCount   Int       @default(10)
  timePerQuestion  Int       @default(15)   // seconds
  wager            Int       @default(0)    // Stars wagered
  startTime        DateTime  @default(now())
  endTime          DateTime?
  participants     MatchParticipant[]
}

model MatchParticipant {
  id              String    @id @default(cuid())
  matchId         String
  userId          String
  score           Int       @default(0)
  correctAnswers  Int       @default(0)
  wrongAnswers    Int       @default(0)
  avgResponseTime Float?    // milliseconds average
  isWinner        Boolean   @default(false)
  xpEarned        Int       @default(0)
}
```
</details>

<details>
<summary><strong>💬 Community Models</strong></summary>

```prisma
model CommunityPost {
  id            String    @id @default(cuid())
  title         String
  content       String
  authorId      String
  categoryId    String
  likesCount    Int       @default(0)
  commentsCount Int       @default(0)
  viewsCount    Int       @default(0)
  isPinned      Boolean   @default(false)
  isResolved    Boolean   @default(false)
  isFlagged     Boolean   @default(false)
  tags          String?   // JSON array of tag strings
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model CommunityComment {
  id            String    @id @default(cuid())
  content       String
  postId        String
  authorId      String
  parentId      String?   // For nested replies
  isMentorReply Boolean   @default(false)
  likesCount    Int       @default(0)
  createdAt     DateTime  @default(now())
}
```
</details>

### Migration History

| # | File | What It Creates |
|---|------|----------------|
| `001` | `initial_platform.sql` | Users, subjects, chapters, sessions |
| `002` | `event_catalog_audit_jobs.sql` | Events, audit logs, background jobs |
| `003` | `subjects_chapters_progress.sql` | UserProgress tracking |
| `004` | `event_host_applications.sql` | Organizer application workflow |
| `005` | `achievements_battle_history.sql` | Achievement badges + battle records |
| `006` | `cbse_subjects_chapters.sql` | Full NCERT Class 9–12 curriculum |
| `007` | `production_indexes_and_search.sql` | 14 targeted performance indexes |
| `008` | `sessions.sql` | HTTPOnly session management |
| `009` | `questions_levels_wallet.sql` | MCQ bank + 100 XP level thresholds + Stars wallet |
| `010` | `seed_levels_questions.sql` | XP thresholds + sample MCQs |
| `011` | `seed_demo_users_posts.sql` | 10 demo users + 10 community posts |
| `012` | `seed_gamification_data.sql` | Streak records + achievement seeds |
| `013` | `analytics_notifications_audit.sql` | Analytics + notification tables |
| `014` | `production_performance_indexes.sql` | EXPLAIN-driven compound indexes |
| `015` | `engineering_subjects_chapters.sql` | 16 engineering track content |
| `016` | `audit_logs_seo_cache.sql` | Audit trail + SEO response cache |
| `017` | `production_performance_tuning.sql` | Advanced index refinements |
| `018` | `massive_seed_data.sql` | Large-scale realistic demo dataset |
| `019` | `more_events_and_posts.sql` | Additional events + community posts |
| `020` | `seed_notifications_and_improvements.sql` | Notification seed data |
| `021` | `chapter_milestones.sql` | Chapter completion milestone XP rewards |

---

## 🌐 API Reference

### 🔐 Auth

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/api/auth/sign-in` | ❌ | Argon2 verify → sets `eduquest_session` HTTPOnly cookie |
| `POST` | `/api/auth/sign-up` | ❌ | Creates user with Argon2-hashed password |
| `POST` | `/api/auth/sign-out` | ✅ | Revokes session cookie |
| `GET` | `/api/auth/me` | ✅ | User data + JIT provisions Clerk users into PostgreSQL |
| `POST` | `/api/auth/change-password` | ✅ | Verifies current → updates Argon2 hash |

### 📊 Profile & Progress

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/api/profile` | ✅ | XP + streak + level + daily stats + battle win rate |
| `GET` | `/api/progress` | ✅ | Chapter completion status across all subjects |
| `POST` | `/api/progress` | ✅ | Mark chapter complete → award XP → check milestone |
| `GET` | `/api/activity` | ✅ | 364-day (52-week) heatmap data |
| `GET` | `/api/achievements` | ✅ | All user achievement badges with award dates |
| `GET` | `/api/levels` | ❌ | All 100 XP levels — thresholds, tier names, sub-titles |

### ⚔️ Battle

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/api/battle/matchmaking` | ✅ | Enter Elo queue — validates Level 10+ for ranked |
| `GET` | `/api/battle/matchmaking` | ✅ | Poll: `matchId` if found · `null` if still waiting |
| `GET` | `/api/battle/history` | ✅ | Paginated match records with scores + XP delta |

### 🏆 Leaderboard

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/api/leaderboard?scope=global` | ❌ | All-time XP ranking |
| `GET` | `/api/leaderboard?scope=class-9` | ❌ | Class-filtered ranking |
| `GET` | `/api/leaderboard?scope=engineering` | ❌ | Engineering track ranking |

### 💬 Community

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/api/community/posts` | ❌ | Paginated posts, filter by category slug |
| `POST` | `/api/community/posts` | ✅ | Create post |
| `GET` | `/api/community/posts/[id]` | ❌ | Post + nested comment thread |
| `POST` | `/api/community/posts/[id]` | ✅ | Comment or toggle upvote |

### 🏛️ Events, Wallet, Content

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/api/events` | ❌ | All 6 events — Olympiad · Sprint · Battle · Hackathon · Mock · Python |
| `POST` | `/api/events/register` | ✅ | Register for event |
| `POST` | `/api/events/host-application` | ✅ | Organizer apply — atomic DB + audit log transaction |
| `GET` | `/api/wallet` | ✅ | Stars balance + last 20 transactions |
| `POST` | `/api/wallet` | ✅ | Earn or spend Stars with typed reason |
| `GET` | `/api/platform-stats` | ❌ | Live counters — real `SELECT COUNT(*)` from PostgreSQL |
| `GET` | `/api/search?q=newton` | ❌ | Full-text search across curriculum |
| `GET` | `/api/notifications` | ✅ | Paginated — auto-purge 14d read / 30d unread |
| `GET` | `/api/health` | ❌ | Uptime + version |
| `GET` | `/api/readiness` | ❌ | PostgreSQL + Redis probe |

---

## 🏆 Gamification Engine

### XP Level System — Quadratic Curve

```
Formula:  XP_to_reach_level = 100 × (Level − 1)²

Level  1  →        0 XP    Bronze Learner
Level  2  →      100 XP    Bronze Explorer       (+100)
Level  3  →      400 XP    Bronze Practitioner   (+300)
Level  4  →      900 XP    Bronze Scholar        (+500)
Level  5  →    1,600 XP    Bronze Achiever       (+700)
Level  7  →    3,600 XP    Bronze Master         (+1,100)
Level 10  →    8,100 XP    Silver Learner        (+1,700)
Level 13  →   14,400 XP    Silver Explorer       (+2,300)
Level 20  →   36,100 XP    Gold Learner
Level 30  →   88,200 XP    Platinum Learner
Level 40  →  156,100 XP    Sapphire Learner
Level 50  →  240,100 XP    Emerald Learner
Level 60  →  340,100 XP    Ruby Learner
Level 70  →  456,100 XP    Diamond Learner
Level 72  →  515,800 XP    Ruby Master
Level 80  →  624,100 XP    Legend Learner
Level 100 →  980,100 XP    Grandmaster
```

**10 Tiers:** Bronze · Silver · Gold · Platinum · Sapphire · Emerald · Ruby · Diamond · Legend · **Grandmaster**

**10 Sub-titles (cycle within each tier):** Learner · Explorer · Practitioner · Scholar · Achiever · Expert · Master · Champion · Legend · Grandmaster

**XP Sources:**

| Activity | XP |
|----------|-----|
| Correct MCQ answer | 15–35 XP |
| First chapter completion | +50 XP bonus |
| Battle win | **90 XP** (3× base of 30) |
| Battle loss | **30 XP** (participation reward) |
| Battle draw | 30 XP each |
| Achievement unlocked | 25–200 XP (by badge tier) |
| Daily login | 10 XP |
| Streak multiplier | ×1.0 (no streak) → **×3.0** (30+ days) |

---

### Achievement Badge System

| Badge | Condition | XP Bonus |
|-------|-----------|----------|
| 🟢 **First Login** | Account created | 25 XP |
| 🟢 **First XP** | XP ≥ 10 | 25 XP |
| 🟡 **Century** | XP ≥ 100 | 50 XP |
| 🟡 **Rising Star** | XP ≥ 500 | 50 XP |
| 🟠 **Knowledge Seeker** | XP ≥ 1,000 | 100 XP |
| 🔴 **Scholar Elite** | XP ≥ 2,500 | 200 XP |
| 🔵 **Practitioner** | Reach Level 3 | 50 XP |
| 🔵 **Achiever** | Reach Level 5 | 100 XP |
| 🔵 **Master** | Reach Level 7 | 150 XP |
| 🔥 **Consistent** | 3-day streak | 50 XP |
| 🔥 **Week Warrior** | 7-day streak | 100 XP |
| 🔥 **Iron Will** | 30-day streak | 200 XP |
| ⚔️ **First Blood** | First battle win | 50 XP |
| ⚔️ **10-Win Club** | 10 cumulative wins | 100 XP |
| 📚 **Chapter Master** | Complete a full subject | 150 XP |

---

### Stars Virtual Economy

> Stars are EduQuest's **non-purchasable** currency — earned only through studying and competing. The platform is 100% skill-based, never pay-to-win.

| Action | Stars |
|--------|-------|
| New user signup | +100 ⭐ |
| Complete daily study questions | up to +50 ⭐ |
| Win casual battle | +50 ⭐ |
| Win ranked battle (with wager) | +50 to +200 ⭐ |
| Lose ranked battle | −wager amount |
| Ranked entry fee | −25 ⭐ |
| Draw | Both refunded |
| **Max wager per match** | **500 ⭐** |
| **Daily wager cap** | **1,000 ⭐** (anti-gambling) |
| **Ranked access gate** | **Level 10+ required** |

---

### 52-Week Activity Heatmap

```
Implementation : Pure CSS Grid — no SVG, no Canvas
Data window    : 364 days of daily activity
Intensity scale: 5 levels based on question count

  ██ #21262D  Level 0 — Empty (no questions that day)
  ██ #0e4c1e  Level 1 — Light (1–2 questions)
  ██ #196b2e  Level 2 — Moderate (3–5 questions)
  ██ #2ea04e  Level 3 — Active (6–10 questions)
  ██ #7ee787  Level 4 — Highly active (11+ questions)

Grid layout: 52 columns (weeks) × 7 rows (Mon–Sun)
Each cell: tooltip on hover showing exact count + date
```

### Level-Up Celebration Modal

```
react-confetti → 200 pieces
Colors: #2563EB (primary) · #F59E0B (accent) · #10B981 (success)
        #7C3AED (purple) · #F97316 (orange) · #EC4899 (pink)
Icon:   Zap (standard levels) · Star (Level 100 / Grandmaster)
Trigger: Zustand useLevelStore.showLevelUpModal
```

---

## ⚔️ Battle System

### Complete Battle Flow

```
/battle — Mode Selection
    │
    ├── Casual   — Free, all levels, no Stars at risk
    ├── Ranked   — Level 10+, Stars wager (25–500⭐)
    └── Subject  — Specific subject matchmaking
          │
          ▼
    Socket.IO Matchmaking Queue
    ──────────────────────────────────────────────────────────────────────
    Phase 1 (0–30s)  Find opponent within ±3 levels (Elo-based)
    Phase 2 (30s+)   Widen search to ±5 levels
    ──────────────────────────────────────────────────────────────────────
          │ Opponent found
          ▼
    UUID Battle Room  (match:{matchId})
    ──────────────────────────────────────────────────────────────────────
    Socket Events RECEIVED:  join_queue · leave_queue · submit_answer · ping
    Socket Events EMITTED:   match_found · question_start · opponent_answered · match_end · error
    ──────────────────────────────────────────────────────────────────────
    Both players join and send "ready"
          │
          ▼ ×10 rounds
    Question served to both players simultaneously
    15-second countdown begins
    ──────────────────────────────────────────────────────────────────────
    Per-question scoring:
      Correct answer        + 10 base points
      Speed bonus           + 1 to +5 (faster = more)
      Consecutive streak    × 1.0 to ×3.0 multiplier
      ≥80% accuracy bonus   + 5 points
      Response < 500ms      − 5 points + server flag
    ──────────────────────────────────────────────────────────────────────
          │ 10 rounds complete
          ▼
    Winner → 90 XP + Stars payout
    Loser  → 30 XP + Stars deducted
    Draw   → 30 XP each + Stars refunded
    Both   → MatchParticipant row: xpEarned · correctAnswers · avgResponseTime
```

### `useAntiCheat` Hook — Full Protection Matrix

| Threat Vector | Detection Method | Effect |
|---------------|-----------------|--------|
| **Right-click** | `contextmenu` → `e.preventDefault()` | Silently blocked |
| **Copy / Cut / Paste** | `copy` · `cut` · `paste` listeners | Silently blocked |
| **DevTools (F12)** | `keydown` F12 block | Silently blocked |
| **DevTools (keyboard)** | `Ctrl+Shift+I/J/C/K` | Silently blocked |
| **View source** | `Ctrl+U` | Silently blocked |
| **Save / Print** | `Ctrl+S` · `Ctrl+P` | Silently blocked |
| **Tab switch** | `window` blur listener | Strike issued |
| **Instant answer** | Response timestamp < 500ms | −5 pts + server flagged |
| **3 violations** | Strike counter | Auto-forfeit + Stars deducted |
| **Report to server** | `socket.emit("cheat_detected", { matchId, type })` | Audit log entry |

---

## 💻 Engineering Tracks

### 12 Programming Languages

| Language | Slug | Days | Level | Color |
|----------|------|:----:|:-----:|:-----:|
| ![C](https://img.shields.io/badge/C-A8B9CC?style=flat-square&logo=c&logoColor=black) **C Language** | `c-language` | 30 | Beginner | `#A8B9CC` |
| ![C++](https://img.shields.io/badge/C++-00599C?style=flat-square&logo=cplusplus&logoColor=white) **C++** | `cpp` | 30 | Intermediate | `#00599C` |
| ![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white) **Java** | `java` | 45 | Intermediate | `#ED8B00` |
| ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) **Python** | `python` | 45 | Beginner | `#3776AB` |
| ![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) **JavaScript** | `javascript` | 30 | Beginner | `#F7DF1E` |
| ![TS](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) **TypeScript** | `typescript` | 25 | Intermediate | `#3178C6` |
| ![Rust](https://img.shields.io/badge/Rust-CE412B?style=flat-square&logo=rust&logoColor=white) **Rust** | `rust` | 40 | Advanced | `#CE412B` |
| ![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=flat-square&logo=kotlin&logoColor=white) **Kotlin** | `kotlin` | 30 | Intermediate | `#7F52FF` |
| ![Swift](https://img.shields.io/badge/Swift-FA7343?style=flat-square&logo=swift&logoColor=white) **Swift** | `swift` | 30 | Intermediate | `#FA7343` |
| ![SQL](https://img.shields.io/badge/SQL-4479A1?style=flat-square&logo=mysql&logoColor=white) **SQL** | `sql` | 20 | Beginner | `#4479A1` |
| ![Dart](https://img.shields.io/badge/Dart-0175C2?style=flat-square&logo=dart&logoColor=white) **Dart** | `dart` | 25 | Beginner | `#0175C2` |
| ![Ruby](https://img.shields.io/badge/Ruby-CC342D?style=flat-square&logo=ruby&logoColor=white) **Ruby** | `ruby` | 25 | Beginner | `#CC342D` |

### 4 CS Core Subject Tracks

| Subject | Slug | Days | Structure |
|---------|------|:----:|-----------|
| **DSA** | `dsa` | 60 | 6 phases × 10 days |
| **Web Development** | `web-dev` | 30 | HTML/CSS → JS → React → Full-stack |
| **System Design** | `system-design` | 25 | HLD → LLD → CAP → Real systems |
| **DBMS** | `dbms` | 20 | Relational → SQL → Normalization → ACID → Indexing |

### DSA 60-Day Plan (6 Phases × 10 Days)

```
Phase 1 — Fundamentals (Day 01–10)
  Arrays · Strings · Big-O complexity · Two Pointers · Sliding Window

Phase 2 — Core Concepts (Day 11–20)
  Linked Lists · Stacks · Queues · Binary Search · Hash Maps

Phase 3 — Patterns (Day 21–30)
  Trees · BST · BFS/DFS · Merge Intervals · Fast/Slow Pointers

Phase 4 — Practice Set (Day 31–40)
  FAANG-difficulty LeetCode-style problems — timed sessions

Phase 5 — Mock Challenge (Day 41–50)
  90-minute timed mock interviews with scoring rubric

Phase 6 — Revision (Day 51–60)
  Weak-area focus · Final mock · Top-150 FAANG problem list
```

### Bonus Learning Resources

| Resource | URL | Content |
|----------|-----|---------|
| **Semester Guides** | `/semester` | BTech CSE 8 semesters — CPU scheduling, 3NF/BCNF, Banker's Algorithm, Gantt charts |
| **Interview Catalog** | `/interviews/[slug]` | C++ OOP (virtual functions, diamond problem), DBMS (B-Trees, ACID), OS (scheduling, deadlocks) |
| **Study Notes** | `/notes` | C++, DBMS, OS, Class 9 Polynomials — E-E-A-T verified content |
| **MCQ Practice** | `/mcqs` | 10,000+ questions filterable by subject, class, difficulty |

---

## 📚 CBSE Curriculum (Class 9–12)

### Class 9 — Foundation Year (13 Subjects)

| Subject | Chapters | Notable Feature |
|---------|:--------:|----------------|
| **Mathematics** | 15 | Number Systems, Polynomials, Coordinate Geometry, Statistics |
| **Science** | 14 | ⚡ 25+ Physics simulations on Force chapter |
| **Social Science** | 20 | French Revolution, Indian Geography, Democratic Politics |
| **English** | 12 | Beehive + Moments literature |
| **Hindi** | 12 | Kshitij, Sparsh, Sanchayan |
| **Sanskrit** | 10 | Shemushi + Vyakaranavithi |
| **Information Technology** | 8 | Basic IT, digital tools |
| **Artificial Intelligence** | 8 | AI concepts, Python basics, ML intro |
| **Computer Applications** | 8 | Python, HTML, digital literacy |
| **Physical Education** | 6 | Sports theory, health |
| **Art Education** | 5 | Visual arts theory |
| **Work Education** | 5 | Vocational skills |
| **Health & Physical Activity** | 5 | Nutrition, fitness, hygiene |

### Class 10 — Board Prep (6 Subjects)

| Subject | Chapters | Board Focus |
|---------|:--------:|------------|
| **Maths Standard** | 15 | Real Numbers · Triangles · Trigonometry · Probability |
| **Maths Basic** | 15 | Simplified version for non-science students |
| **Science** | 16 | Chemical Reactions · Life Processes · Electricity · Light |
| **Social Science** | 20 | Resources · Development · Money · Democracy |
| **English** | 12 | First Flight + Footprints · Board writing formats |
| **Hindi** | 12 | Kshitij · Kritika · Sparsh · Sanchayan |

### Class 11 — Stream Specialization

| Stream | Subjects |
|--------|---------|
| **Science (PCM)** | Physics · Chemistry · Mathematics · English · CS / IP |
| **Science (PCB)** | Physics · Chemistry · Biology · English · Physical Ed. |
| **Commerce** | Accountancy · Business Studies · Economics · Maths (opt) · English |
| **Arts / Humanities** | History · Geography · Political Science · Psychology · Sociology · English |

### Class 12 — Board + Entrance

| Track | Strategy |
|-------|---------|
| **CBSE Board** | Full NCERT + 10-year question paper pattern analysis |
| **JEE Mains** | PCM at JEE-level difficulty (Medium–Hard problem sets) |
| **NEET** | PCB with NEET-specific objective MCQs + time management |

---

## 🏛️ Live Events

Six events in the catalog (`/lib/events/event-catalog.ts`):

| ID | Title | Status | Date | Location | Registered |
|----|-------|:------:|------|----------|:----------:|
| `science-olympiad-2026` | **Science Olympiad 2026** | 🟡 Upcoming | May 24, 2026 | Online | 1,250 |
| `code-sprint-dsa` | **Code Sprint — DSA Challenge** | 🔴 Live | May 12, 2026 | Online | 890 |
| `math-battle-royale` | **Math Battle Royale** | 🟡 Upcoming | Jun 2, 2026 | Online | 650 |
| `inter-college-hackathon` | **Inter-College Hackathon** | 🟡 Upcoming | Jun 20, 2026 | Delhi NCR | 420 |
| `class-10-board-mock` | **Board Exam Mock Test — Class 10** | ✅ Completed | Apr 28, 2026 | Online | 2,100 |
| `python-championship` | **Python Championship** | 🟡 Upcoming | Jul 5, 2026 | Online | 780 |

> Code Sprint prizes: **Premium subscriptions + certificates**. Hackathon format: **24h build, teams of 3–4, GitHub URL submission, live evaluation scores**.

---

## 🔐 Security Architecture

### 10-Layer Defense Stack

```
Incoming Request
       │
       ▼ Layer 1  HTTPS/TLS — enforced in production
       ▼ Layer 2  Helmet.js — 10 security headers:
       │            X-DNS-Prefetch-Control: on
       │            X-Frame-Options: SAMEORIGIN
       │            X-Content-Type-Options: nosniff
       │            Referrer-Policy: strict-origin-when-cross-origin
       │            Permissions-Policy: camera=(), microphone=(), geolocation=()
       │            Strict-Transport-Security (HSTS)
       ▼ Layer 3  Rate Limiting — 100 req/60s per IP (Redis sliding window)
       │            Bypass: /health · /ready (monitoring probes)
       ▼ Layer 4  HPP — blocks array-based query parameter injection
       ▼ Layer 5  CORS — strict allowlist, credentials: true
       ▼ Layer 6  Authentication:
       │            Clerk RS256 JWKS → HS256 JWT fallback → 401
       ▼ Layer 7  Zod + validation middleware:
       │            stripHtml(): replace(/<[^>]*>/g, "").trim()
       │            isSafeObject(): blocks __proto__ · constructor · prototype
       │            sanitizeString(): strip + normalize spaces
       ▼ Layer 8  Parameterized SQL — $1/$2 placeholders only
       ▼ Layer 9  RBAC — 8-tier role check per endpoint
       ▼ Layer 10 Audit Trail — every security event written to PostgreSQL
       │
       ▼ Response
```

### Role Permission Matrix

| Feature | GUEST | STUDENT | ENG_LEARNER | TEACHER | ORGANIZER | PARENT | MOD | ADMIN |
|---------|:-----:|:-------:|:-----------:|:-------:|:---------:|:------:|:---:|:-----:|
| Public pages | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CBSE curriculum | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dashboard + Battles | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Engineering tracks | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Ranked battles | ❌ | Lv 10+ | Lv 10+ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Create events | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| View student progress | ❌ | Self | Self | All | ❌ | Child | ❌ | ✅ |
| Moderate community | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Admin console | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### Performance Monitoring

| Metric | Threshold | Action |
|--------|-----------|--------|
| Request time | > 1,000ms | ⚠️ Warning logged |
| Request time | > 5,000ms | 🔴 Error logged |
| Heap usage | > 85% | 🚨 Alert |
| DB pool | > 80% | 🚨 Scale warning |
| CPU load avg | > 0.8 | 🚨 Alert |

---

## 🎨 Design System

### Core Palette (135 CSS Custom Properties)

| Token | Value | Used For |
|-------|-------|---------|
| `--primary` | `#2563EB` | Buttons, links, focus rings, active nav |
| `--primary-hover` | `#1D4ED8` | Button hover state |
| `--accent` | `#D97706` | Streak flame, achievement badges, rewards |
| `--success` | `#10B981` | Correct answers, active streak, XP gain toast |
| `--destructive` | `#EF4444` | Errors, wrong answers, battle loss |
| `--battle` | `#8B5CF6` | Battle arena — exclusive purple accent |
| `--engineering` | `#06B6D4` | Engineering track cyan |
| `--bg-hero` | `#0B1120 → #141B2D` | Homepage dark navy gradient |
| `--card-bg` | `rgba(255,255,255,0.04)` | Glassmorphism cards `backdrop-filter: blur(12px)` |
| `--text-primary` | `#F8FAFC` | Body text (dark mode) |
| `--text-muted` | `#94A3B8` | Labels, timestamps, captions |
| `--border-subtle` | `rgba(255,255,255,0.08)` | Card borders, dividers |

### Typography Scale

| Role | Font | Size |
|------|------|------|
| Display | Sora | 56px |
| Heading 1 | Sora | 40px |
| Heading 2 | Space Grotesk | 32px |
| Body | Inter | 16px |
| Small | Inter | 14px |
| Code | JetBrains Mono | 14px |
| XSmall | Inter | 12px |

### Layout Tokens

```css
--max-content-width: 80rem;   /* 1280px page container */
--nav-height:        64px;    /* Fixed sticky Navbar */
--section-padding:   5rem;    /* Vertical section rhythm */
--card-radius:       12px;    /* Standard card corners */
--card-padding:      1.5rem;  /* Inner card spacing */
```

### Global Animation Library

| Animation | Used On |
|-----------|---------|
| `fadeInUp` | Hero section, card entry |
| `float` | Decorative orbs, homepage hero image |
| `shimmer` | All skeleton loaders (1.5s infinite) |
| `pulseGlow` | XP level indicator on dashboard |
| `pulseZap` | Dashboard level indicator |
| `radarPulse` | Matchmaking queue expanding circle |
| `orbFloat` | Homepage hero background orbs |
| `heroZoom` | Subtle hero background scale-in |

### Navbar Structure

```
Desktop:
  [EduQuest Logo]  [Classes ▾]  [Practice ▾]  [Explore ▾]  ...  [Sign In]  [Start Free]
                        │              │             │
                   ┌────┘         ┌───┘         ┌──┘
                   Class 9–12     Test Center   Community
                                  Battle Arena  Events
                                               Leaderboard

Mobile (≤768px):
  [Logo] ────────────── [☰]
  ↓ Hamburger opens:
  Side drawer (slides in from right)
  Full nav links + auth buttons
  Backdrop overlay + body scroll disabled
```

---

## 🔍 SEO & Performance

### SEO Architecture

| Feature | Implementation |
|---------|---------------|
| **Dynamic Sitemap** | `/sitemap.ts` — all subjects + all chapters + 500 community posts + `topical-authority-map.json` nodes |
| **Robots.txt** | Allows: `/class-*/` · `/engineering/` · `/community/` · `/events/`. Disallows: `/admin/` · `/dashboard/` · `/settings/` · `/api/auth/` · `/api/progress/` · `/test/` |
| **JSON-LD Schemas** | `Course` (subject/chapter pages) · `FAQPage` (MCQ banks) · `TechArticle` (deep-research notes) · `BreadcrumbList` (all curriculum) · `HowTo` (step-by-step content) |
| **Programmatic SEO** | C++ Hub: notes · mcqs · interviews · `/engineering/cpp`. DBMS Hub: notes · mcqs · interviews. OS Hub: notes · mcqs · interviews. Polynomials Hub: notes · mcqs · `/class-9/mathematics` |
| **E-E-A-T Signals** | `TechArticle` schema includes `author` (IIT-affiliation) + `citation` (academic references) |
| **ISR Tiers** | Homepage: 600s · Community: 300s · About: 1h · Marketing: 12h · Legal: 24h · User data: no cache |

### `next.config.ts` — Key Config

```typescript
poweredByHeader: false                       // Don't expose Next.js version
compress: true                               // Brotli/Gzip on all responses
experimental.optimizePackageImports: ["lucide-react"]  // Tree-shake ~70% of icon bundle

images.formats: ["image/avif", "image/webp"] // AVIF ~50% smaller than WebP
images.minimumCacheTTL: 604800               // 7-day image cache
images.deviceSizes: [390, 640, 768, 1024, 1280, 1536, 1920]
images.imageSizes:  [16, 32, 48, 64, 96, 128, 256, 384]
images.remotePatterns: [images.unsplash.com, plus.unsplash.com, source.unsplash.com]

// HTTP Cache Headers applied via headers()
"/_next/static/*"  → Cache-Control: public, max-age=31536000, immutable
"/images/*"        → Cache-Control: public, max-age=604800, stale-while-revalidate=86400
```

### Performance Architecture

| Decision | Implementation |
|----------|---------------|
| Server components by default | `"use client"` added only when needed (state, events, WebSocket) |
| Dynamic imports | Battle · Dashboard · Community · Leaderboard all lazy-loaded |
| Denormalized XP | `xp` + `currentStreak` on `User` row → O(1) reads, no joins |
| 14 PostgreSQL indexes | Covering leaderboard · search · dashboard · notifications · battle history |
| pg Pool singleton | `max: 10 connections`, `idleTimeoutMs: 30s` — shared per process |
| Redis TTL strategy | 30s (realtime) → 2min (leaderboard) → 5min (user) → 30min (static) |
| Self-hosted fonts | `@fontsource` — zero Google DNS requests |
| Redis pub/sub | Socket.IO scales across PM2 cluster (max CPU cores) |

---

## 🐳 Docker & Deployment

### Docker Compose Stack

```yaml
# 4 services — all health-checked with dependency ordering

postgres (16-alpine):
  Performance tuning:
    -c max_connections=200
    -c shared_buffers=256MB
    -c work_mem=4MB
    -c maintenance_work_mem=64MB
    -c effective_cache_size=768MB
    -c wal_buffers=16MB
    -c checkpoint_completion_target=0.9
    -c max_wal_size=1GB
    -c random_page_cost=1.1
    -c effective_io_concurrency=200
    -c log_min_duration_statement=1000
  Healthcheck: pg_isready every 10s, 5 retries

redis (7-alpine):
  --maxmemory 256mb
  --maxmemory-policy allkeys-lru
  --appendonly yes
  --appendfsync everysec
  --save 300 10 / --save 60 1000
  Healthcheck: redis-cli ping every 10s

backend (Express 5):
  depends_on: postgres (healthy), redis (healthy)
  Healthcheck: GET /health every 30s, 15s start period, 3 retries
  Volume: upload_data:/app/uploads

frontend (Next.js 16):
  depends_on: backend (healthy)
  Healthcheck: GET / every 30s, 20s start period, 3 retries
```

### Production Deployment (PM2)

```javascript
// ecosystem.config.js
{
  name: "eduquest-backend",
  script: "dist/index.js",
  instances: "max",            // 1 process per CPU core
  exec_mode: "cluster",        // PM2 cluster + Redis pub/sub = horizontal scaling
  max_memory_restart: "1G",   // Restart if heap exceeds 1GB
}
```

### Graceful Shutdown Sequence

SIGTERM/SIGINT received:
```
Step 1 → server.close()           — stop accepting new HTTP connections
Step 2 → stopScheduler()          — halt job scheduler
Step 3 → stopAnalyticsFlushTimer()— flush analytics buffer
Step 4 → stopAuditFlushTimer()    — flush pending audit log entries
Step 5 → closeDatabasePool()      — drain PostgreSQL connection pool
Step 6 → closeRedisClient()       — disconnect Redis
Step 7 → process.exit(0)

Timeout: 30 seconds → SIGKILL if graceful exit hangs
```

### Pre-Deploy Checklist

```bash
# Frontend — must all pass before deploy
npm run typecheck   # ✓ Zero TypeScript errors
npm run lint        # ✓ Zero ESLint warnings
npm run build       # ✓ Next.js build succeeds

# Backend
npx tsc --noEmit    # ✓ Zero TypeScript errors
npm run build       # ✓ Compiles to dist/

# Production env vars that must be set
NODE_ENV=production
EDUQUEST_PERSISTENCE_ADAPTER=postgres
EDUQUEST_COOKIE_SECURE=true
EDUQUEST_SESSION_SECRET=<32+ char secret>
DATABASE_URL=<production postgres URL>
REDIS_URL=<managed redis URL>
CLERK_SECRET_KEY=<production sk_, not test sk_test_>
```

---

## 💳 Pricing

| Feature | 🆓 Free | ⭐ Student Pro | 🏫 School Partner |
|---------|:-------:|:-------------:|:-----------------:|
| CBSE curriculum (Class 9–12) | ✅ | ✅ | ✅ |
| Day-wise study plans | ✅ | ✅ | ✅ |
| XP · streaks · leaderboard | ✅ | ✅ | ✅ |
| Community forums (8 categories) | ✅ | ✅ | ✅ |
| Physics simulations (25+) | ✅ | ✅ | ✅ |
| Casual battle mode | ✅ | ✅ | ✅ |
| Public events + hackathons | ✅ | ✅ | ✅ |
| Ranked battle (Stars wager) | ❌ | ✅ | ✅ |
| All 16 engineering tracks | ❌ | ✅ | ✅ |
| Mock tests + timed assessments | ❌ | ✅ | ✅ |
| Dashboard analytics | ❌ | ✅ | ✅ |
| Priority Elo matchmaking | ❌ | ✅ | ✅ |
| Teacher batch management | ❌ | ❌ | ✅ |
| School leaderboard | ❌ | ❌ | ✅ |
| Parent progress reports | ❌ | ❌ | ✅ |
| Custom event hosting | ❌ | ❌ | ✅ |
| **Price** | **₹0/month** | **Coming Soon** | **Contact Us** |

---

## 🗺️ Roadmap

### 🔴 Actively In Progress

- [ ] Complete Socket.IO live battle room — sub-100ms answer sync + Redis reconnection
- [ ] Battle post-match results screen — animated XP delta + streak status
- [ ] Disconnect recovery — rejoin within `timePerQuestion` window without forfeit

### 🟡 Q3 2026

- [ ] **Real Code Execution** — Judge0 / Piston API (replace simulated runner)
- [ ] **Background Workers** — BullMQ for email, PDF certificates, notification fanout
- [ ] **Push Notifications** — Firebase Cloud Messaging + Web Push API
- [ ] **Automated Tests** — Jest API route tests + Playwright E2E (zero tests currently)
- [ ] **WebP/AVIF Hero Images** — Convert all PNG heroes via Sharp pipeline
- [ ] **Full-Text Search v2** — Autocomplete + relevance-ranked results

### 🟢 Q4 2026 – Q1 2027

- [ ] **AI Tutor** — LLM doubt explanation + personalized topic recommendations
- [ ] **Mobile Apps** — React Native / Expo (Android + iOS)
- [ ] **Safe Exam Browser** — OS-level lockdown for proctored contests
- [ ] **Teacher Dashboard** — Batch management + custom test builder
- [ ] **Parent Portal** — Weekly reports + streak summaries
- [ ] **Group Study Rooms** — Up to 6 students on same chapter simultaneously
- [ ] **Internationalization** — Hindi, Tamil, Telugu UI translations
- [ ] **Certificate Generator** — Auto-PDF for event and hackathon winners
- [ ] **Referral System** — Earn Stars for referring friends

### 🔵 Long-Term Vision

- [ ] **National EduQuest Olympiad** — annual platform-wide competition
- [ ] **College Partnership API** — white-label deployment for institutions
- [ ] **Adaptive Learning Engine** — ML weak-area detection + next-topic recommendations
- [ ] **Live Teacher Classes** — integrated video into day-wise plans
- [ ] **Offline Mode (PWA)** — complete lessons offline, sync on reconnect

---

## 🤝 Contributing

### Quick Setup

```bash
# 1. Fork on GitHub
git clone https://github.com/YOUR_USERNAME/eduquest.git
cd eduquest/frontend
npm install --legacy-peer-deps

# 2. Branch
git checkout -b feature/your-feature-name

# 3. Validate before committing
npm run typecheck   # Must be ✓ clean
npm run lint        # Must be ✓ clean

# 4. PR
git commit -m "feat: add [your feature]"
git push origin feature/your-feature-name
# → Open PR on GitHub
```

### Code Conventions (Non-Negotiable)

| Rule | Requirement |
|------|-------------|
| **TypeScript** | Strict mode — no `any`, no untyped assertions |
| **Server-first** | Pages are server components; add `"use client"` only for state/events |
| **CSS Modules** | Every page gets its own `PageName.module.css` — no inline styles |
| **Repository pattern** | All DB via `getPlatformRepository()` — no raw SQL in pages |
| **File headers** | `FILE:` · `PURPOSE:` · `USED BY:` · `LAST UPDATED:` on every file |
| **Production data** | No mock returns — all data from real PostgreSQL |
| **Parameterized SQL** | Always `$1`, `$2` — never string-interpolated values |

### Where to Contribute

| Priority | Area | Current State |
|----------|------|--------------|
| 🔴 **Critical** | Battle room (Socket.IO) | Foundation exists, full implementation needed |
| 🔴 **Critical** | Test suite | Zero tests — Jest + Playwright needed |
| 🟡 **Important** | Code execution (Judge0) | Currently simulated |
| 🟡 **Important** | Push notifications | Architecture designed, not implemented |
| 🟢 **Welcome** | Hindi/Tamil i18n | Strings not yet extracted |
| 🟢 **Welcome** | Accessibility (ARIA) | Partial coverage |
| 🟢 **Welcome** | New engineering tracks | OS · Computer Networks · Compiler Design |

---

## 📜 License

```
MIT License — Copyright © 2026 EduQuest

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgements

| Contributor | Role |
|------------|------|
| **NCERT India** | Open curriculum that powers all Class 9–12 content |
| **Clerk** | Making production auth simple and developer-friendly |
| **Vercel + Next.js team** | The App Router genuinely changed how we think about full-stack |
| **Prisma** | TypeScript + PostgreSQL with this DX is something special |
| **Socket.IO + Redis** | Made horizontal battle scaling elegant |
| **Indian students** | Every feature was shaped by real learning struggles |

---

<div align="center">

---

### Built with ❤️ in India, for India's next generation of learners

*"EduQuest is not just another EdTech app. It is a gamified OS for studying — where knowledge is your weapon and your level is your rank."*
— EduBattle Master Plan v3.0

<br/>

**[⬆ Back to Top](#eduquest)**

<br/>

<a href="https://github.com/yourusername/eduquest/issues/new?labels=bug">🐛 Report Bug</a>
&nbsp;&nbsp;·&nbsp;&nbsp;
<a href="https://github.com/yourusername/eduquest/issues/new?labels=enhancement">💡 Request Feature</a>
&nbsp;&nbsp;·&nbsp;&nbsp;
<a href="https://github.com/yourusername/eduquest/discussions">💬 Discussions</a>
&nbsp;&nbsp;·&nbsp;&nbsp;
<a href="https://github.com/yourusername/eduquest/fork">🍴 Fork</a>

<br/><br/>

[![Star this repo](https://img.shields.io/github/stars/yourusername/eduquest?style=for-the-badge&logo=github&color=F59E0B&logoColor=white&label=⭐%20Star%20EduQuest)](https://github.com/yourusername/eduquest)
[![Follow](https://img.shields.io/github/followers/yourusername?style=for-the-badge&logo=github&color=6366F1&logoColor=white&label=Follow)](https://github.com/yourusername)

</div>
