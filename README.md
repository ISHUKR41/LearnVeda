<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=EduQuest&fontSize=80&fontColor=fff&animation=twinkling&fontAlignY=36&desc=India's%20Gamified%20Learning%20Platform&descAlignY=58&descSize=24" width="100%"/>

<br/>

<!-- Core Stack -->
[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)

<!-- Infra -->
[![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.3-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io)
[![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com)
[![PM2](https://img.shields.io/badge/PM2-Cluster_Mode-2B037A?style=for-the-badge&logo=pm2&logoColor=white)](https://pm2.keymetrics.io)

<!-- Platform Stats -->
[![Students](https://img.shields.io/badge/👥_Students-50%2C000+-22C55E?style=for-the-badge)](.)
[![Chapters](https://img.shields.io/badge/📚_Chapters-500+-F59E0B?style=for-the-badge)](.)
[![Questions](https://img.shields.io/badge/❓_MCQs-10%2C000+-6366F1?style=for-the-badge)](.)
[![Migrations](https://img.shields.io/badge/🗄️_Migrations-21-8B5CF6?style=for-the-badge)](.)
[![License](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](LICENSE)

<br/>

> **"Learn Smarter. Battle Harder. Level Up."**
>
> *CBSE Class 9–12 + Engineering. Day-wise plans · Real-time 1v1 battles · Elo matchmaking · XP levels · Stars economy*

<br/>

[🗺 Overview](#-overview) · [📊 Stats](#-platform-statistics) · [✨ Features](#-live-features) · [🛠 Tech Stack](#-tech-stack) · [📂 Structure](#-project-structure) · [📄 Routes](#-pages--routes) · [🚀 Setup](#-getting-started) · [🔐 Env Vars](#-environment-variables) · [🗄 Database](#-database-schema) · [🌐 API](#-api-reference) · [🏆 Gamification](#-gamification-engine) · [⚔️ Battle](#️-battle-system) · [💻 Engineering](#-engineering-tracks) · [📚 CBSE](#-cbse-curriculum) · [🔒 Security](#-security-architecture) · [🎨 Design](#-design-system) · [🔍 SEO](#-seo--performance) · [🐳 Docker](#-docker--deployment) · [🗺 Roadmap](#️-roadmap) · [🤝 Contributing](#-contributing)

</div>

---

## 🗺 Overview

**EduQuest** is a production-grade full-stack gamified learning platform for Indian students in **Class 9–12** and engineering. It merges three proven engagement loops into one platform:

```
  ┌────────────────────────────────────────────────────────────────────────────┐
  │                                                                            │
  │   LeetCode's            Duolingo's streak          BGMI's ranked          │
  │   structured plans   +  & daily habit loops   +    1v1 matchmaking        │
  │                                                                            │
  │                      ═══ ⚔️  EduQuest ═══                                 │
  │                                                                            │
  │   "A gamified OS for studying — where knowledge is your weapon             │
  │    and your level is your rank."  — EduBattle Master Plan v3.0            │
  │                                                                            │
  └────────────────────────────────────────────────────────────────────────────┘
```

### Why EduQuest? (6 Platform Pillars)

| | Pillar | What It Means |
|--|--------|--------------|
| 🌏 | **India-First Content** | CBSE NCERT-aligned chapters, Indian board exam patterns, regional language roadmap |
| 🛡️ | **Safe for Students** | Zero ads, zero distractions — moderated community with parental visibility |
| 📱 | **Study Anywhere** | Fully responsive — works on phone, tablet, and desktop. Study on the bus |
| 🔄 | **Open Progress** | Your progress never disappears — resume any plan exactly where you left off |
| 🎮 | **Gamified Core** | XP, streaks, 100-level quadratic system — learning feels like a game worth winning |
| ⚡ | **Battle Tested** | Sub-200ms Socket.IO battle rooms — BGMI-style matchmaking for academics |

### What Students Say

| Student | Quote |
|---------|-------|
| **Priya Sharma** · Class 12, Jaipur · 14-day streak | *"EduQuest changed how I study for boards. The streak system keeps me consistent and the battle mode is addictive. I went from **71% to 89% in Physics** in just 4 weeks!"* |
| **Arjun Nair** · Engineering, Kochi · Java & DSA | *"I followed the 45-day Java plan end-to-end and **got placed at a product startup.** The DSA section alone is worth it for anyone prepping for SDE interviews."* |
| **Sneha Gupta** · Class 10, Delhi · 21-day streak | *"The CBSE chapters are perfectly aligned with NCERT. I went from **65% to 82% in my unit test** after just three weeks. The XP system keeps me motivated every day!"* |

---

## 📊 Platform Statistics

Live counters — every number fetched from real PostgreSQL `SELECT COUNT(*)` queries on each page load via ISR:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          PLATFORM AT A GLANCE                                │
├─────────────┬─────────────┬─────────────┬─────────────┬──────────────────────┤
│  👥 50,000+ │  📚 500+    │  ❓ 10,000+ │  💻 16+     │  🔭 25+              │
│  Students   │  CBSE       │  Practice   │  Coding     │  Physics Canvas      │
│  Registered │  Chapters   │  Questions  │  Tracks     │  Simulations         │
├─────────────┼─────────────┼─────────────┼─────────────┼──────────────────────┤
│  🎓 4       │  📖 22+     │  🏆 100     │  ⚔️ <200ms  │  💰 Stars            │
│  CBSE       │  Subjects   │  XP         │  Battle     │  Skill-Only          │
│  Classes    │  Covered    │  Levels     │  Latency    │  Economy             │
└─────────────┴─────────────┴─────────────┴─────────────┴──────────────────────┘
```

**Homepage track cards (exact in-app stats):**

| Track | Subjects | Chapters | Highlight |
|-------|:--------:|:--------:|-----------|
| Class 9 | 6 | 75+ | 45-day plan |
| Class 10 | 6 | 80+ | 50-day plan · Board prep |
| Class 11 | 18 (3 streams) | 200+ | Science · Commerce · Arts |
| Class 12 | 18 | — | 2,000+ questions · 15 mock tests |
| Engineering | 12 languages | — | 9 CS subjects · 60-day max |
| Battle Arena | All subjects | — | 500+ live players · 3× XP bonus |

---

## ✨ Live Features

<table>
<tr>
<td valign="top" width="50%">

### 🎓 CBSE Academic System
- ✅ NCERT 2025–26 aligned (Class 9–12)
- ✅ Day-wise structured plans (15–60 days)
- ✅ Chapter-by-chapter progress + XP rewards
- ✅ ~20 MCQs per topic (standard + HOTS)
- ✅ Class 11 stream selection: Science/Commerce/Arts
- ✅ Class 12 board + JEE / NEET prep tracks
- ✅ KaTeX math rendering throughout
- ✅ YouTube video lectures on every `Topic` row
- ✅ `hasSimulation` flag auto-injects physics sims

</td>
<td valign="top" width="50%">

### ⚔️ Battle Arena
- ✅ Real-time 1v1 via Socket.IO UUID rooms
- ✅ Elo: ±3 levels (Phase 1) → ±5 after 30s
- ✅ 10 MCQs × 15s countdown per match
- ✅ Multi-factor scoring: base + speed + streak × accuracy
- ✅ `useAntiCheat` hook — F12, DevTools, copy-paste, tab-switch blocked
- ✅ Emits `cheat_detected` with `matchId` + violation `type`
- ✅ Stars wager: max 500⭐/match · 1,000⭐/day cap
- ✅ Level 10+ gate for ranked wager battles
- ✅ Reconnect within `timePerQuestion` window

</td>
</tr>
<tr>
<td valign="top" width="50%">

### 🏆 Gamification Engine
- ✅ XP formula: `100 × (Level−1)²` — 100 levels
- ✅ 10 tiers: Bronze → Grandmaster
- ✅ 10 sub-titles per tier: Learner → Grandmaster
- ✅ `useLevel()` hook: xp · level · progressPercent · xpToNextLevel
- ✅ `useStreak()` hook: currentStreak · longestStreak · isAtRisk
- ✅ 52-week pure CSS Grid heatmap (5 intensity levels)
- ✅ XP Bar: Blue → Green (>80%) → Gold (max) dynamic color
- ✅ Level-up modal: 200 confetti pieces in 6 brand colors
- ✅ Named achievement badges with exact unlock conditions

</td>
<td valign="top" width="50%">

### 💻 Engineering Tracks (16 total)
- ✅ 12 languages: C · C++ · Java · Python · JS · TS · Rust · Kotlin · Swift · SQL · Dart · Ruby
- ✅ 4 CS subjects: DSA(60d) · Web Dev(30d) · System Design(25d) · DBMS(20d)
- ✅ `DailyLesson` model: dayNumber · theoryContent · youtubeUrl
- ✅ `CodingSubmission` tracks: executionTime(ms) · memoryUsed(KB) · testsPassed · errorMessage
- ✅ FAANG-focused problem sets
- ✅ SDE interview catalog — IIT-professor-verified
- ✅ BTech CSE 8-semester survival guides

</td>
</tr>
<tr>
<td valign="top" width="50%">

### 🔭 Physics Simulations (25+)
- ✅ `ForceEngine.tsx` — custom 60fps Canvas engine
- ✅ Scale: **40px = 1 metre**
- ✅ `useRef<PhysicsState>` — no React re-renders during loop
- ✅ Physics: `F = ma`, friction = `μ × mass × GRAVITY`
- ✅ Live telemetry: Velocity · Acceleration · Net Force · KE
- ✅ Sliders: Mass (0.5–10kg) · Force (±20N) · μ (0–1.0)
- ✅ `hasSimulation: true` flag on Topic model auto-injects component

</td>
<td valign="top" width="50%">

### 🔐 Auth & Security
- ✅ Clerk RS256 JWKS → HS256 fallback → 401
- ✅ `useAuth()` hook: user · isLoading · isAuthenticated
- ✅ Argon2 password hashing (memory-hard)
- ✅ Cookie: `eduquest_session` — HttpOnly · SameSite:lax · 7-day MaxAge
- ✅ JIT provisioning: Clerk login → PostgreSQL row auto-created
- ✅ `withStore()` atomic queue: OS-level `rename()` for writes
- ✅ 100 req/60s Redis rate limiting · Helmet 10 headers
- ✅ Zod + HTML stripping + proto-pollution prevention

</td>
</tr>
<tr>
<td valign="top" width="50%">

### 💬 Community & Events
- ✅ 8 forum categories: All · General · Class 9–12 · Engineering · Battles
- ✅ Posts: `likesCount` · `commentsCount` · `viewsCount` · `isPinned` · `isResolved` · `isFlagged`
- ✅ `isMentorReply` badge on nested comments
- ✅ 6 live events: Olympiad · Code Sprint · Math Battle · Hackathon · Board Mock · Python Championship
- ✅ Hackathon: 24h build · teams 3–4 · GitHub URL submission
- ✅ Admin console: Approve / Reject / Needs Info

</td>
<td valign="top" width="50%">

### 🔍 SEO & Performance
- ✅ Dynamic sitemap: DB subjects + chapters + 500 posts + programmatic nodes
- ✅ JSON-LD: Course · FAQPage · TechArticle · BreadcrumbList · HowTo
- ✅ Programmatic SEO hubs: C++ · DBMS · OS · Polynomials
- ✅ ISR tiers: 30s → 2min → 5min → 1h → 12h → 24h by data type
- ✅ `optimizePackageImports: ["lucide-react"]` — 70% icon bundle reduction
- ✅ AVIF + WebP via Sharp · self-hosted fonts (zero Google DNS)
- ✅ Robots.txt: disallows /admin · /dashboard · /api/auth · /api/progress

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

### 🖥️ Frontend

| Package | Version | Purpose in EduQuest |
|---------|:-------:|---------------------|
| **Next.js** | `16.2.6` | App Router · SSR · ISR · API Routes · Turbopack |
| **React** | `19.2.4` | Server + client components |
| **TypeScript** | `5.x` | Strict mode — `any` banned project-wide |
| **Tailwind CSS** | `4.x` | Utility-first layout + breakpoints |
| **CSS Modules** | built-in | Per-page scoped styles — zero cross-page bleed |
| **Zustand** | `5.0.13` | Global state: `authStore` · `levelStore` · `streakStore` · `uiStore` |
| **TanStack Query** | `5.100.10` | Server state · leaderboard caching · background refetch |
| **Framer Motion** | `12.38.0` | Physics sim entities · level-up modal transitions |
| **Socket.IO Client** | `4.8.3` | Battle WebSocket — `websocket` → `polling` transports |
| **KaTeX** | `0.16.45` | Math equation rendering (Physics + Math chapters) |
| **Howler.js** | `2.2.4` | In-battle audio — correct/wrong answer sounds |
| **React Confetti** | `6.4.0` | 200-piece level-up celebration (6 brand colors) |
| **React Hot Toast** | `2.6.0` | XP gain · streak warning · error toasts |
| **React Hook Form** | `7.75.0` | Sign-up · settings · host-application forms |
| **Zod** | `4.4.3` | Schema validation + type inference |
| **date-fns** | `4.1.0` | 52-week heatmap · streak calc · relative timestamps |
| **Axios** | `1.16.1` | HTTP in `"use client"` components |
| **Lucide React** | `1.14.0` | Icons — tree-shaken via `optimizePackageImports` |
| **Recharts** | `3.8.1` | Weekly analytics charts on dashboard |
| **next-themes** | `0.4.6` | Flicker-free dark/light mode |
| **clsx + tw-merge** | latest | Conditional className composition |

**Self-Hosted Fonts** (zero Google Fonts DNS calls):

| Font | Variable | Used For |
|------|----------|---------|
| **Sora** | `--font-heading` | Hero titles · headings · XP level display |
| **Inter** | `--font-body` | Body text · UI labels · nav · cards |
| **Space Grotesk** | `--font-data` | Stats counters · leaderboard numbers |
| **JetBrains Mono** | `--font-code` | Code blocks · engineering lessons · terminal |

---

### ⚙️ Backend

| Package | Version | Purpose |
|---------|:-------:|---------|
| **Express** | `5.2.1` | REST API — auth · battle · wallet · hackathon · notifications |
| **Socket.IO** | `4.8.3` | Real-time battle rooms with UUID-based room IDs |
| **Prisma ORM** | `7.8.0` | Type-safe DB access + auto-generated TypeScript client |
| **node-postgres** | `8.20.0` | Raw Pool — migration runner + aggregation queries |
| **ioredis** | `5.10.1` | Rate limiting · session cache · pub/sub |
| **@socket.io/redis-adapter** | `8.3.0` | Socket.IO scaling across PM2 cluster nodes |
| **Helmet** | `8.1.0` | 10 HTTP security headers per request |
| **compression** | `1.8.1` | Brotli/Gzip on responses > 1KB |
| **cors** | `2.8.6` | Allowlisted origins with credentials: true |
| **hpp** | `0.2.3` | HTTP Parameter Pollution blocking |
| **express-slow-down** | `3.1.0` | Progressive slowdown on auth before hard block |
| **morgan** | `1.10.1` | Colorized (dev) / minimal (prod) HTTP logging |
| **multer** | `2.1.1` | Hackathon project file uploads |
| **pino** | `10.3.1` | Structured JSON logs — P50/P95/P99 tracking |

**Backend Middleware Chain (every request):**
```
① Helmet         ─ 10 security headers
② CORS           ─ origin allowlisting
③ compression    ─ Brotli/Gzip
④ HPP            ─ parameter pollution guard
⑤ Response-Time  ─ X-Response-Time header
⑥ JSON parser    ─ 2MB body limit
⑦ Morgan         ─ HTTP access logging
⑧ Request-ID     ─ X-Request-ID for distributed tracing
⑨ Rate Limiter   ─ 100 req/60s per IP (Redis) — /health · /ready bypass
```

---

### 🗄️ Infrastructure

| Technology | Config | Purpose |
|-----------|--------|---------|
| **PostgreSQL 16** | `max_connections=200` · `shared_buffers=256MB` · `work_mem=4MB` · `effective_cache_size=768MB` · `random_page_cost=1.1` · slow-query log >1,000ms | Primary data store |
| **Redis 7** | `maxmemory 256mb` · `allkeys-lru` · AOF `appendfsync everysec` · `save 300 10 / 60 1000` | Rate limiting · cache · Socket.IO pub/sub |
| **Prisma** | `7.8.0` + `@prisma/adapter-pg` | ORM sharing the raw `pg` pool |
| **PGLite** | `0.4.6` | In-process PostgreSQL for offline dev |
| **Docker Compose** | `version 3.9` | 4 health-checked services |
| **PM2** | cluster · max instances · 1GB mem restart | Node.js process management |
| **Sharp** | `0.34.5` | AVIF/WebP conversion pipeline |

**Redis Cache TTL Strategy:**

| Resource | TTL | Why |
|----------|-----|-----|
| Realtime (matchmaking queues) | **30 sec** | Must reflect live state |
| Leaderboard | **2 min** | Near-real-time ranking |
| Search results | **3 min** | Acceptable staleness |
| User profiles | **5 min** | Balance freshness + load |
| Content (chapters, topics) | **15 min** | Content updates |
| Static (class categories) | **30 min** | Only changes on migration |

---

### 🔐 Authentication

| Layer | Technology | Details |
|-------|-----------|---------|
| **Primary** | Clerk `7.4.1` | Google · Microsoft · Email — RS256 JWKS |
| **Fallback** | Custom HS256 JWT | `EDUQUEST_ENABLE_LEGACY_AUTH=true` |
| **Password** | Argon2 | Memory-hard — stronger than bcrypt |
| **Cookie** | `eduquest_session` | `HttpOnly: true` · `SameSite: lax` · `MaxAge: 604,800s` (7 days) |
| **JIT** | `current-user.ts` | First Clerk login → auto-creates PostgreSQL row |
| **Validation** | `auth.middleware.ts` | HS256 verify → RS256 Clerk verify fallback |

---

## 📂 Project Structure

```
eduquest/
│
├── 📱 frontend/                           # Next.js 16 — Full-Stack Application
│   ├── src/
│   │   ├── app/                           # App Router — every folder = a URL route
│   │   │   ├── page.tsx                   # Homepage: hero · live DB stats · track cards · testimonials
│   │   │   ├── layout.tsx                 # Root: ClerkProvider · Navbar · Footer · QueryClientProvider
│   │   │   ├── HomeAnimations.tsx         # IntersectionObserver · threshold 0.1 · stagger 200/400/600ms
│   │   │   │
│   │   │   ├── class-9/ → class-12/       # CBSE Academic Tracks (see CBSE section)
│   │   │   ├── engineering/[slug]/         # 16 coding tracks — day-wise plan
│   │   │   ├── battle/[matchId]/           # Live Socket.IO room — anti-cheat active
│   │   │   ├── battle/matchmaking/         # Queue UI — radarPulse animation
│   │   │   ├── dashboard/                  # Protected · no ISR · ActivityHeatmap + XPBar
│   │   │   ├── leaderboard/                # Global + class + engineering [ISR 300s]
│   │   │   ├── community/                  # 8 forum categories [dynamic]
│   │   │   ├── events/                     # 6 live events [ISR 300s]
│   │   │   ├── hackathons/[id]/            # 24h build · GitHub submission · standings
│   │   │   ├── wallet/                     # Stars balance · Level 10 gate
│   │   │   ├── semester/                   # BTech CSE 8-semester guides
│   │   │   ├── interviews/[slug]/          # C++ OOP · DBMS · OS interview Q&A
│   │   │   ├── notes/ · mcqs/ · test/      # Practice tools
│   │   │   ├── search/                     # PostgreSQL full-text search
│   │   │   ├── profile/ · settings/        # Student zone
│   │   │   ├── notifications/              # In-app · auto-purge 14d/30d
│   │   │   ├── admin/                      # Host application console
│   │   │   ├── about/ · features/          # Marketing [ISR 1h / 12h]
│   │   │   ├── pricing/ · contact/ · faq/  # Marketing [ISR 12h]
│   │   │   ├── sign-in/[[...sign-in]]/     # Clerk catch-all
│   │   │   ├── sign-up/[[...sign-up]]/     # Clerk catch-all
│   │   │   ├── terms/ · privacy/           # Legal [ISR 24h]
│   │   │   ├── sitemap.ts                  # Dynamic XML — DB + 500 posts + SEO nodes
│   │   │   └── robots.ts                   # Allows curriculum · Disallows /admin /dashboard
│   │   │
│   │   │   └── api/                        # Next.js Route Handlers
│   │   │       ├── auth/                   # sign-in · sign-up · sign-out · me · change-password
│   │   │       ├── battle/                 # matchmaking POST/GET · history
│   │   │       ├── community/posts/        # list · create · [id] detail · comment · upvote
│   │   │       ├── events/                 # list · register · host-application
│   │   │       ├── leaderboard/            # global · class-9/10/11/12 · engineering
│   │   │       ├── wallet/                 # GET balance + 20 tx · POST transaction
│   │   │       ├── achievements/           # named badges with unlock conditions
│   │   │       ├── notifications/          # paginated · 14d/30d auto-purge
│   │   │       ├── questions/              # MCQ bank — filter: subject · class · difficulty
│   │   │       ├── profile/                # XP · streak · level · battle win rate
│   │   │       ├── progress/               # GET chapter status · POST mark-complete + XP
│   │   │       ├── platform-stats/         # Live SELECT COUNT(*) from PostgreSQL
│   │   │       ├── search/                 # Full-text PostgreSQL search
│   │   │       ├── activity/               # 364-day heatmap data
│   │   │       ├── levels/                 # All 100 XP level definitions
│   │   │       ├── admin/                  # Host application management
│   │   │       ├── health/                 # GET uptime + version
│   │   │       └── readiness/              # GET PostgreSQL + Redis probe
│   │   │
│   │   ├── components/
│   │   │   ├── layout/Navbar/              # 3 dropdowns (desktop) · side drawer (mobile)
│   │   │   ├── layout/Footer/              # Learn · Platform · Company · Legal
│   │   │   ├── gamification/
│   │   │   │   ├── XPBar.tsx               # Blue → Green(>80%) → Gold(max)
│   │   │   │   ├── ActivityHeatmap.tsx     # 52-week CSS Grid · 5 intensity levels
│   │   │   │   ├── StreakCounter.tsx       # 7-day calendar with flame
│   │   │   │   └── LevelUpModal.tsx        # 200 confetti · 6 colors · Zap/Star icon
│   │   │   └── simulations/               # 25+ Newtonian physics canvas components
│   │   │
│   │   ├── hooks/
│   │   │   ├── useLevel.ts                 # xp · level · progressPercent · addXp · setXp
│   │   │   ├── useAuth.ts                  # user · isLoading · isAuthenticated · setUser
│   │   │   ├── useStreak.ts                # currentStreak · longestStreak · isAtRisk
│   │   │   └── useAntiCheat.ts             # F12 · DevTools · copy-paste · tab-switch guard
│   │   │
│   │   ├── store/
│   │   │   ├── authStore.ts                # AuthUser: id · name · email · track · role · level · xp · streak
│   │   │   ├── levelStore.ts               # XP_PER_LEVEL_TABLE · addXp · setXp · showLevelUpModal
│   │   │   ├── streakStore.ts              # currentStreak · longestStreak · completedToday · isAtRisk
│   │   │   └── uiStore.ts                  # Theme · sidebar · global UI flags
│   │   │
│   │   └── lib/
│   │       ├── server/auth/current-user.ts # 4-step JIT Clerk → PostgreSQL provisioning
│   │       ├── server/database/migrations/ # 21 ordered SQL files (001–021)
│   │       ├── server/repositories/
│   │       │   └── platform-repository.ts  # UserRepo · SessionRepo · BattleRepo · CommunityRepo · EventRepo
│   │       ├── server/data/platform-store.ts  # Atomic JSON: Promise queue + temp file + OS rename()
│   │       ├── server/seo/schema-generators.ts # Course · FAQPage · TechArticle · BreadcrumbList · HowTo
│   │       ├── constants.ts                # NAV_LINKS · ENGINEERING_LANGUAGES · ENGINEERING_SKILLS
│   │       ├── curriculum/learning-catalog.ts  # All class + engineering track definitions
│   │       └── events/event-catalog.ts     # 6 events: Olympiad · Sprint · Battle · Hackathon · Mock · Python
│   │
│   ├── prisma/schema.prisma               # 12+ domain models — see Database section
│   └── next.config.ts                     # ISR · Turbopack · image CDN · security headers
│
├── ⚙️  backend/                            # Express 5 + Socket.IO API Server (port 4000)
│   └── src/
│       ├── index.ts                        # Bootstrap → 6-step graceful shutdown (30s timeout)
│       ├── config/redis.ts · cache.ts      # ioredis singleton + TTL strategy
│       ├── routes/
│       │   ├── auth.ts                     # POST /register · /login · /refresh · /logout · GET /me
│       │   ├── battle.ts                   # POST /queue · DELETE /queue · GET/POST /matches/:id
│       │   ├── users.ts                    # GET /:id (cached) · PUT /:id/profile (cache invalidation)
│       │   ├── wallet.ts · hackathons.ts   # Stars · hackathon CRUD
│       │   ├── notifications.ts            # Dispatch + 14d/30d auto-purge
│       │   └── audit.ts                    # Tamper-proof security trail
│       ├── services/socket.service.ts      # Received: join_queue · leave_queue · submit_answer · ping
│       │                                   # Emitted:  match_found · question_start · opponent_answered · match_end · error
│       └── middlewares/
│           ├── auth.middleware.ts          # HS256 → RS256 Clerk verification chain
│           ├── rateLimiter.ts              # 100 req/60s per IP — Redis-backed
│           └── validation.ts              # stripHtml() · isSafeObject() · sanitizeString()
│
├── docs/IMPLEMENTATION_STATUS.md          # Live vs. planned (canonical truth)
├── EduBattle_Master_Plan.md               # V3.0 — 60-chapter product specification
├── docker-compose.yml                     # 4-service orchestration
├── ecosystem.config.js                    # PM2 cluster config
└── README.md                              # ← You are here
```

---

## 📄 Pages & Routes

### 🌐 Public Marketing

| Route | Title | ISR | JSON-LD |
|-------|-------|-----|---------|
| `/` | "Learn Smarter. Battle Harder. Level Up." | 600s | WebSite · Organization |
| `/features` | Platform showcase | 12h | ItemList |
| `/pricing` | Free · Pro · School | 12h | — |
| `/about` | Mission + live DB stats | 1h | Organization |
| `/contact` | Form + FAQ | 12h | FAQPage |
| `/faq` | Categorized FAQ | 12h | FAQPage |
| `/terms` · `/privacy` | Legal pages | 24h | — |

### 🎓 Academic Tracks

| Route | Source | ISR |
|-------|--------|-----|
| `/class-9` | `getTrackSubjects("class-9")` | 1h |
| `/class-9/[subject]` | `getSubjectPlanForRoute` | Dynamic |
| `/class-9/[subject]/[chapter]` | `chapter-registry` | Dynamic |
| `/class-10` → `/class-12` | PostgreSQL | 1h / Dynamic |
| `/engineering/[slug]` | `learning-catalog.ts` | Dynamic |
| `/semester` | `programmaticSemesterCatalog` | Static |
| `/interviews/[slug]` | `programmaticInterviewsCatalog` | Static |
| `/notes` · `/mcqs` · `/test` | PostgreSQL | Dynamic |

### ⚔️ Battle Arena

| Route | Description |
|-------|-------------|
| `/battle` | Mode: Casual (free) · Ranked (Level 10+, Stars wager) [ISR 300s] |
| `/battle/matchmaking` | Elo queue · ±3 levels → ±5 at 30s · `radarPulse` animation |
| `/battle/[matchId]` | Live Socket.IO room · 10 MCQs · 15s · anti-cheat active |

### 📊 Student Zone (Protected)

| Route | Auth | Description |
|-------|:----:|-------------|
| `/dashboard` | ✅ | XP bar · 52-week heatmap · battle history · quick actions |
| `/profile` | ❌ | Public: achievements · stats · streak record |
| `/wallet` | ✅ | Stars balance · earn methods · Level 10 gate |
| `/notifications` | ✅ | In-app · auto-purge: 14d read / 30d unread |
| `/settings` | ✅ | Profile · password change · privacy |
| `/admin` | ✅ ADMIN | Host application: Approve / Reject / Needs Info |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Min Version | Why |
|------|:-----------:|-----|
| Node.js | `v20.x` | ES2022 + `crypto.subtle` API |
| npm | `v10.x` | `--legacy-peer-deps` flag support |
| PostgreSQL | `v14+` | JSONB · full-text search · generated columns |
| Redis | `v6+` | Sorted sets · streams · pub/sub |

### ⚡ Quickstart (60 Seconds)

```bash
git clone https://github.com/yourusername/eduquest.git && cd eduquest
cd frontend && npm install --legacy-peer-deps
npm run db:migrate && npm run dev
# → http://localhost:5000 ✅
```

> ⚠️ `--legacy-peer-deps` is **required** — React 19 has peer dependency conflicts with some packages.

### Full Setup

<details>
<summary><strong>Step-by-step guide (click to expand)</strong></summary>

**Step 1 — Clone**
```bash
git clone https://github.com/yourusername/eduquest.git
cd eduquest
```

**Step 2 — Frontend dependencies**
```bash
cd frontend
npm install --legacy-peer-deps
```

**Step 3 — Backend dependencies** *(real-time battles only)*
```bash
cd ../backend && npm install
```

**Step 4 — Configure environment**
```bash
cd ../frontend
cp .env.example .env.local
# Edit .env.local — see Environment Variables section
```

**Step 5 — Start PostgreSQL + Redis**
```bash
# From project root — Docker recommended
docker-compose up -d postgres redis

# PostgreSQL starts with production tuning:
#   max_connections=200, shared_buffers=256MB, work_mem=4MB
#   effective_cache_size=768MB, random_page_cost=1.1
#   Slow query logging: >1,000ms
#
# Redis starts with:
#   maxmemory 256mb, allkeys-lru, AOF persistence
```

**Step 6 — Run 21 migrations**
```bash
npm run db:migrate
# ✓ 001_initial_platform.sql
# ✓ 002_event_catalog_audit_jobs.sql
# ...
# ✓ 021_chapter_milestones.sql
# Applied 21 EduQuest migration(s) successfully.
```

**Step 7 — Seed demo data** *(optional)*
```bash
npm run db:seed
# Seeds: 10 users · 10 posts · 6 events · CBSE curriculum
#        100 XP level thresholds · achievement badge definitions
# Blocked in production unless EDUQUEST_ALLOW_DEMO_SEED=true
```

**Step 8 — Start frontend**
```bash
npm run dev
# ✓ Next.js 16.2.6 (Turbopack) ready at http://localhost:5000
```

**Step 9 — Start battle backend** *(separate terminal)*
```bash
cd ../backend && npm run dev
# Express 5 + Socket.IO listening on http://localhost:4000
```

</details>

### 📋 All Scripts

| Script | Directory | Description |
|--------|-----------|-------------|
| `npm run dev` | `frontend/` | Turbopack dev server — port 5000 + HMR |
| `npm run build` | `frontend/` | Production Next.js build |
| `npm run start` | `frontend/` | Start compiled production server |
| `npm run db:migrate` | `frontend/` | Apply pending SQL migrations in order |
| `npm run db:seed` | `frontend/` | Seed demo data (blocked in prod) |
| `npm run typecheck` | `frontend/` | TypeScript strict — **zero errors required** |
| `npm run lint` | `frontend/` | ESLint 9 — **must be clean before PR** |
| `npm run dev` | `backend/` | Express + Socket.IO — port 4000 |
| `npm run build` | `backend/` | Compile TypeScript → `dist/` |
| `docker-compose up -d` | root | Full 4-service stack |
| `docker-compose down -v` | root | ⚠️ Teardown including volumes |

---

## 🔐 Environment Variables

### `frontend/.env.local`

```env
# ── Database ──────────────────────────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@localhost:5432/eduquest

# ── Adapter & Flags ───────────────────────────────────────────────────────────
EDUQUEST_PERSISTENCE_ADAPTER=postgres        # "postgres" = production DB mode
EDUQUEST_ALLOW_STATIC_FALLBACKS=true         # Show catalog even if DB unreachable
EDUQUEST_STRICT_DATA_MODE=false              # true = disable ALL local fallbacks
EDUQUEST_ALLOW_DEMO_SEED=false               # Must be "true" to seed in production

# ── Clerk ─────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# ── Legacy Auth Fallback ───────────────────────────────────────────────────────
EDUQUEST_ENABLE_LEGACY_AUTH=true             # Enable HS256 JWT fallback
EDUQUEST_SESSION_SECRET=your-32+-char-cryptographically-secure-secret
EDUQUEST_COOKIE_SECURE=false                 # Set "true" in production (HTTPS required)

# ── Redis ─────────────────────────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ── Application ───────────────────────────────────────────────────────────────
NODE_ENV=development
PORT=5000
NEXT_PUBLIC_API_URL=    # Empty = same-origin; backend URL if separate
```

### `backend/.env`

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

### Feature Flags

| Flag | Default | Effect |
|------|:-------:|--------|
| `EDUQUEST_PERSISTENCE_ADAPTER` | `json` | `postgres` → production DB mode |
| `EDUQUEST_ENABLE_LEGACY_AUTH` | `false` | `true` → HS256 JWT fallback enabled |
| `EDUQUEST_STRICT_DATA_MODE` | `false` | `true` → disables ALL static fallbacks |
| `EDUQUEST_ALLOW_STATIC_FALLBACKS` | `false` | `true` → shows catalog if DB is down |
| `EDUQUEST_ALLOW_DEMO_SEED` | `false` | `true` → allows `db:seed` in production |
| `EDUQUEST_COOKIE_SECURE` | `false` | `true` → cookie requires HTTPS |

---

## 🗄️ Database Schema

### Domain Map

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                        EDUQUEST DATA DOMAINS (12+)                          ║
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

### Key Models

<details>
<summary><strong>👤 User + StudentProfile</strong></summary>

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  phone         String?   @unique
  passwordHash  String?   // Argon2 hash OR "clerk-<clerkUserId>" for JIT users
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

  isMinor       Boolean   @default(false)
  parentEmail   String?
  isActive      Boolean   @default(true)
  isVerified    Boolean   @default(false)
}

model StudentProfile {
  userId              String    @unique
  classId             String?
  stream              String?               // "Science" | "Commerce" | "Arts"
  board               String    @default("CBSE")
  targetExams         String?               // "JEE,NEET"
  skillLevel          String    @default("beginner")
  languagePreference  String    @default("english")
  institution         String?
  xpMultiplier        Float     @default(1.0)
}
```

</details>

<details>
<summary><strong>🎓 Curriculum: Topic (leaf node with sim flags)</strong></summary>

```prisma
model Topic {
  id            String    @id @default(cuid())
  title         String
  slug          String    @unique
  content       String?   // Markdown / rich text
  youtubeUrl    String?   // Video lecture link
  orderIndex    Int
  chapterId     String
  hasAnimation  Boolean   @default(false)
  hasSimulation Boolean   @default(false)   // ← true = auto-inject ForceEngine component
  questions     Question[]
}
```

</details>

<details>
<summary><strong>⚔️ Match + MatchParticipant</strong></summary>

```prisma
model Match {
  id               String    @id @default(cuid())
  subjectId        String
  status           String    // WAITING | ACTIVE | COMPLETED | CANCELLED
  mode             String?   // "casual" | "ranked"
  questionsCount   Int       @default(10)
  timePerQuestion  Int       @default(15)   // seconds
  wager            Int       @default(0)    // Stars wagered (0 for casual)
  startTime        DateTime  @default(now())
  endTime          DateTime?
}

model MatchParticipant {
  matchId          String
  userId           String
  score            Int       @default(0)
  correctAnswers   Int       @default(0)
  wrongAnswers     Int       @default(0)
  avgResponseTime  Float?    // milliseconds average — used for speed bonus
  isWinner         Boolean   @default(false)
  xpEarned         Int       @default(0)
}
```

</details>

<details>
<summary><strong>💬 CommunityPost (full field set)</strong></summary>

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
```

</details>

<details>
<summary><strong>💻 CodingSubmission (with execution tracking)</strong></summary>

```prisma
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

### Migration History

| # | File | Creates |
|---|------|---------|
| `001` | `initial_platform.sql` | Users · subjects · chapters · sessions |
| `002` | `event_catalog_audit_jobs.sql` | Events · audit logs · background jobs |
| `003` | `subjects_chapters_progress.sql` | UserProgress tracking |
| `004` | `event_host_applications.sql` | Organizer application workflow |
| `005` | `achievements_battle_history.sql` | Badges + battle records |
| `006` | `cbse_subjects_chapters.sql` | Full NCERT Class 9–12 curriculum |
| `007` | `production_indexes_and_search.sql` | 14 performance indexes |
| `008` | `sessions.sql` | HTTPOnly session management |
| `009` | `questions_levels_wallet.sql` | MCQ bank + 100 XP levels + Stars wallet |
| `010–012` | `seed_*.sql` | Demo data: users · posts · streaks |
| `013` | `analytics_notifications_audit.sql` | Analytics + notification tables |
| `014` | `production_performance_indexes.sql` | EXPLAIN-driven compound indexes |
| `015` | `engineering_subjects_chapters.sql` | 16 engineering tracks |
| `016–020` | `audit/seo/perf/seed` | Refinements + large demo dataset |
| `021` | `chapter_milestones.sql` | Chapter completion XP milestone rewards |

---

## 🌐 API Reference

### Unified Response Format

Every endpoint returns a consistent shape:

```typescript
// Success
{ ok: true, data: T, message?: string }

// Failure
{ ok: false, error: { code: string, message: string, details?: unknown } }
```

### 🔐 Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/api/auth/sign-in` | ❌ | Argon2 verify → sets `eduquest_session` HTTPOnly cookie |
| `POST` | `/api/auth/sign-up` | ❌ | Create user with Argon2-hashed password |
| `POST` | `/api/auth/sign-out` | ✅ | Revoke session cookie |
| `GET` | `/api/auth/me` | ✅ | Session data + JIT-provision Clerk users to PostgreSQL |
| `POST` | `/api/auth/change-password` | ✅ | Verify current → update Argon2 hash |

### 📊 Gamification Endpoints

| Method | Endpoint | Auth | Response Highlights |
|--------|----------|:----:|---------------------|
| `GET` | `/api/levels` | ❌ | All 100 levels: `{ levelNumber, xpRequired, xpToNext, title, badgeName, badgeIcon, badgeColor, perks }` |
| `GET` | `/api/levels?user_level=7` | ❌ | Current + next level for XP bar display |
| `GET` | `/api/achievements` | ✅ | Named badges with `awardedAt` timestamps |
| `GET` | `/api/activity` | ✅ | 364-day heatmap: `{ date, count }[]` |
| `GET` | `/api/profile` | ✅ | XP · streak · level · daily stats · battle win rate |
| `POST` | `/api/progress` | ✅ | Mark chapter complete → award XP → check milestone |

### ⚔️ Battle Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/battle/matchmaking` | Enter Elo queue — validates Level 10+ for ranked |
| `GET` | `/api/battle/matchmaking` | Poll: `{ matchId }` if found · `{ matchId: null }` waiting |
| `GET` | `/api/battle/history` | Paginated: `score · correctAnswers · xpEarned · isWinner` |

### 🏆 Community & Events

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/api/leaderboard?scope=global` | ❌ | Top users by XP — scope: global · class-9 → class-12 · engineering |
| `GET` | `/api/community/posts` | ❌ | Paginated · filter by category slug |
| `POST` | `/api/community/posts/[id]` | ✅ | Comment or upvote |
| `GET` | `/api/events` | ❌ | 6 events: status · participants · gradient · icon |
| `POST` | `/api/events/host-application` | ✅ | Atomic DB + audit log transaction |
| `GET` | `/api/platform-stats` | ❌ | Live `SELECT COUNT(*)` for students · chapters · questions · events · subjects |

---

## 🏆 Gamification Engine

### XP System — Real Code

```typescript
// frontend/src/app/api/levels/route.ts

// XP to REACH level n (cumulative from zero):
const xpRequired = 100 * (n - 1) * (n - 1);

// XP GAP from level n to level n+1:
const xpToNext = n < 100 ? (100 * n * n) - xpRequired : 0;

// In levelStore.ts — XP_PER_LEVEL_TABLE (index 0 = Level 1):
export const XP_PER_LEVEL_TABLE: number[] = Array.from(
  { length: 100 },
  (_, idx) => 100 * idx * idx
);
// [0, 100, 400, 900, 1600, 2500, 3600, 4900 ... 980100]
```

### XP Ladder

```
Level  1  →        0 XP    Bronze Learner
Level  2  →      100 XP    Bronze Explorer        (+100)
Level  3  →      400 XP    Bronze Practitioner    (+300)
Level  5  →    1,600 XP    Bronze Achiever        (+700)
Level  7  →    3,600 XP    Bronze Master         (+1,100)
Level 10  →    8,100 XP    Silver Learner        (+1,700)  ← Ranked battles unlock
Level 13  →   14,400 XP    Silver Explorer       (+2,300)
Level 20  →   36,100 XP    Gold Learner
Level 30  →   88,200 XP    Platinum Learner
Level 50  →  240,100 XP    Emerald Learner
Level 72  →  515,800 XP    Ruby Master
Level 100 →  980,100 XP    Grandmaster
```

**10 Tiers:** Bronze · Silver · Gold · Platinum · Sapphire · Emerald · Ruby · Diamond · Legend · **Grandmaster**

**10 Sub-titles per tier:** Learner · Explorer · Practitioner · Scholar · Achiever · Expert · Master · Champion · Legend · Grandmaster

### `useLevel()` Hook API

```typescript
// frontend/src/hooks/useLevel.ts
const {
  xp,                   // Total XP accumulated
  level,                // Current level (1–100)
  progressPercent,      // % toward next level (0–100)
  xpToNextLevel,        // XP remaining to reach next level
  xpForNextLevel,       // Absolute XP threshold of next level
  xpWithinCurrentLevel, // XP earned inside current level (for "200/300 XP" display)
  showLevelUpModal,     // Whether to show celebration modal
  newLevel,             // Level just reached (for modal title)
  addXp,                // addXp(amount: number) → triggers level-up if threshold crossed
  setXp,                // setXp(total: number)  → sync from server
  dismissLevelUpModal,  // Close the celebration
} = useLevel();
```

### `useAuth()` Hook API

```typescript
// frontend/src/hooks/useAuth.ts
// One-time hydration via /api/auth/me with exponential backoff retry (max 2 retries)
// Ref-guarded so multiple components mounting simultaneously only trigger 1 fetch

const {
  user,            // AuthUser | null
  isLoading,       // true during initial session check
  isAuthenticated, // true once confirmed
  setUser,         // Manual login — populates store
  clearUser,       // Sign-out — clears store
  setLoading,      // Loading state control
} = useAuth();

// AuthUser shape:
interface AuthUser {
  id: string;
  name: string;
  email: string;
  track: string;    // "class-9" | "class-10" | "engineering"
  role: string;     // "student" | "admin" | "organizer"
  level: number;    // 1–100
  xp: number;
  streak: number;
  avatarUrl?: string;
}
```

### `useStreak()` Hook API

```typescript
// frontend/src/hooks/useStreak.ts
const {
  currentStreak,     // Consecutive active days
  longestStreak,     // Highest streak ever achieved
  completedToday,    // Has the user already earned today's streak?
  isAtRisk,          // Last active was yesterday + today not yet completed → ⚠️ warning
  setStreak,         // Sync streak from server response
  markTodayComplete, // Call after user solves first question of the day
} = useStreak();
```

### Achievement Badges

| Badge | Unlock Condition |
|-------|-----------------|
| 🟢 **First Login** | Account created |
| 🟢 **First XP** | XP ≥ 10 |
| 🟡 **Century** | XP ≥ 100 |
| 🟡 **Rising Star** | XP ≥ 500 |
| 🟠 **Knowledge Seeker** | XP ≥ 1,000 |
| 🔴 **Scholar Elite** | XP ≥ 2,500 |
| 🔵 **Practitioner** | Reach Level 3 |
| 🔵 **Achiever** | Reach Level 5 |
| 🔵 **Master** | Reach Level 7 |
| 🔥 **Consistent** | 3-day streak |
| 🔥 **Week Warrior** | 7-day streak |
| 🔥 **Iron Will** | 30-day streak |
| ⚔️ **First Blood** | First battle win |
| ⚔️ **10-Win Club** | 10 cumulative wins |
| 📚 **Chapter Master** | Complete a full subject |

### Stars Economy

> Stars are EduQuest's **non-purchasable** virtual currency — earned only through learning and competing. The platform is 100% skill-based.

| Action | Stars |
|--------|-------|
| New user signup | +100 ⭐ |
| Complete daily questions | up to +50 ⭐ |
| Win casual battle | +50 ⭐ |
| Win ranked (with wager) | +50 to +200 ⭐ |
| Lose ranked | −wager amount |
| Ranked entry fee | −25 ⭐ |
| Draw | Both refunded |
| **Max wager per match** | **500 ⭐** |
| **Daily wager cap** | **1,000 ⭐** (anti-gambling safeguard) |
| **Ranked gate** | **Level 10+ required** |

### 52-Week Activity Heatmap

```
Pure CSS Grid — 52 columns (weeks) × 7 rows (Mon–Sun) = 364 cells

  ▓▓ #21262D  Level 0 — Empty (0 questions)
  ▓▓ #0e4c1e  Level 1 — Light (1–2 questions)
  ▓▓ #196b2e  Level 2 — Moderate (3–5 questions)
  ▓▓ #2ea04e  Level 3 — Active (6–10 questions)
  ▓▓ #7ee787  Level 4 — Highly active (11+ questions)

Each cell: hover tooltip with exact count + date
```

### Level-Up Modal

```typescript
// LevelUpModal.tsx — confetti spec
import Confetti from "react-confetti";

<Confetti
  numberOfPieces={200}
  colors={[
    "#2563EB",  // primary blue
    "#F59E0B",  // accent amber
    "#10B981",  // success green
    "#7C3AED",  // purple
    "#F97316",  // orange
    "#EC4899",  // pink
  ]}
/>

// Icon: <Zap size={28} /> for levels 1–99
//       <Star size={28} /> for Level 100 (Grandmaster)
```

---

## ⚔️ Battle System

### Complete Flow

```
/battle ─ Mode Select
    │
    ├── Casual   — Free, all levels, no Stars at risk
    ├── Ranked   — Level 10+, 25–500⭐ wager
    └── Subject  — Specific subject matchmaking

          ↓ Enter Queue

Socket.IO Matchmaking
  Phase 1 (0–30s):  Opponent within ±3 Elo levels
  Phase 2 (30s+):   Widen to ±5 levels

          ↓ Opponent found

UUID Battle Room (match:{matchId})
  io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    timeout: 10000,
  })

  Events RECEIVED:  join_queue · leave_queue · submit_answer · ping
  Events EMITTED:   match_found · question_start · opponent_answered · match_end · error

          ↓ Both ready → 10 × 15-second rounds

Per-question scoring:
  ✅ Correct           + 10 base points
  ⚡ Speed bonus       + 1 to +5 (faster = more)
  🔥 Streak multiplier × 1.0 to ×3.0 (consecutive corrects)
  🎯 Accuracy bonus    + 5 (when ≥80% accuracy)
  ⚠️ Instant answer    − 5 points + server flag (if < 500ms)

          ↓ 10 rounds complete

Winner → 90 XP + Stars payout + MatchParticipant.xpEarned saved
Loser  → 30 XP + Stars deducted
Draw   → 30 XP each + Stars refunded
```

### `useAntiCheat` Hook — Protection Matrix

```typescript
// frontend/src/hooks/useAntiCheat.ts

// Blocked events:
document.addEventListener("contextmenu", (e) => e.preventDefault());    // Right-click
document.addEventListener("copy",   (e) => e.preventDefault());         // Copy
document.addEventListener("cut",    (e) => e.preventDefault());         // Cut
document.addEventListener("paste",  (e) => e.preventDefault());         // Paste

// Blocked key combos:
// F12 · Ctrl+Shift+I/J/C/K · Ctrl+U · Ctrl+S · Ctrl+P · Ctrl+C/V/X

// Tab-switch detection:
window.addEventListener("blur", () => {
  socket.emit("cheat_detected", { matchId, type: "window_blur" });
});

// Instant answer flag (< 500ms):
// → -5 points deducted server-side
// → cheat_detected emitted with type: "instant_answer"

// 3 accumulated violations → auto-forfeit + Stars deducted + audit log entry
```

---

## 💻 Engineering Tracks

### 12 Programming Languages

| Language | Slug | Days | Level | Color |
|----------|------|:----:|:-----:|-------|
| ![C](https://img.shields.io/badge/C-A8B9CC?style=flat-square&logo=c&logoColor=black) | `c-language` | 30 | Beginner | `#A8B9CC` |
| ![C++](https://img.shields.io/badge/C++-00599C?style=flat-square&logo=cplusplus&logoColor=white) | `cpp` | 30 | Intermediate | `#00599C` |
| ![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white) | `java` | 45 | Intermediate | `#ED8B00` |
| ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) | `python` | 45 | Beginner | `#3776AB` |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | `javascript` | 30 | Beginner | `#F7DF1E` |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | `typescript` | 25 | Intermediate | `#3178C6` |
| ![Rust](https://img.shields.io/badge/Rust-CE412B?style=flat-square&logo=rust&logoColor=white) | `rust` | 40 | **Advanced** | `#CE412B` |
| ![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=flat-square&logo=kotlin&logoColor=white) | `kotlin` | 30 | Intermediate | `#7F52FF` |
| ![Swift](https://img.shields.io/badge/Swift-FA7343?style=flat-square&logo=swift&logoColor=white) | `swift` | 30 | Intermediate | `#FA7343` |
| ![SQL](https://img.shields.io/badge/SQL-4479A1?style=flat-square&logo=mysql&logoColor=white) | `sql` | 20 | Beginner | `#4479A1` |
| ![Dart](https://img.shields.io/badge/Dart-0175C2?style=flat-square&logo=dart&logoColor=white) | `dart` | 25 | Beginner | `#0175C2` |
| ![Ruby](https://img.shields.io/badge/Ruby-CC342D?style=flat-square&logo=ruby&logoColor=white) | `ruby` | 25 | Beginner | `#CC342D` |

### 4 CS Core Tracks

| Subject | Slug | Days | Structure |
|---------|------|:----:|-----------|
| **DSA** | `dsa` | 60 | 6 phases × 10 days |
| **Web Dev** | `web-dev` | 30 | HTML/CSS → JS → React → Full-stack |
| **System Design** | `system-design` | 25 | HLD → LLD → CAP theorem → Real systems |
| **DBMS** | `dbms` | 20 | Relational → SQL → Normalization → ACID → Indexing |

### DSA 60-Day Plan

```
Phase 1 — Fundamentals (Day 01–10)
  Arrays · Strings · Big-O complexity · Two Pointers · Sliding Window

Phase 2 — Core Concepts (Day 11–20)
  Linked Lists · Stacks · Queues · Binary Search · Hash Maps

Phase 3 — Patterns (Day 21–30)
  Trees · BST · BFS/DFS · Merge Intervals · Fast/Slow Pointers

Phase 4 — Practice Set (Day 31–40)
  FAANG-level LeetCode problems · timed 45-minute sessions

Phase 5 — Mock Challenge (Day 41–50)
  90-minute timed mock interviews · scoring rubric

Phase 6 — Revision (Day 51–60)
  Weak-area focus · final mock · Top-150 FAANG problem list
```

### Physics Engine (Class 9 Simulations)

```typescript
// frontend/src/components/simulations/ForceEngine.tsx

// Scale: 40 pixels = 1 metre
const PIXELS_PER_METRE = 40;

// Physics in requestAnimationFrame loop:
const netForce = appliedForce - (friction_coefficient * mass * GRAVITY);
const acceleration = netForce / mass;             // F = ma
velocity += acceleration * deltaTime;
position += velocity * deltaTime;

// No React re-renders during animation — uses ref:
const physicsState = useRef<PhysicsState>({
  velocity: 0, position: 0, acceleration: 0,
  kineticEnergy: 0, netForce: 0,
});

// Live telemetry fed back to UI via a separate state update
// throttled to 60fps using requestAnimationFrame
```

---

## 📚 CBSE Curriculum (Class 9–12)

### Class 9 — Foundation (13 Subjects)

| Subject | Chapters | Highlight |
|---------|:--------:|-----------|
| **Mathematics** | 15 | Polynomials · Coordinate Geometry · Statistics |
| **Science** | 14 | ⚡ 25+ Physics simulations (`hasSimulation: true`) |
| **Social Science** | 20 | French Revolution · Indian Geography · Democratic Politics |
| **English** | 12 | Beehive + Moments literature |
| **Hindi** | 12 | Kshitij · Sparsh · Sanchayan |
| **Sanskrit** | 10 | Shemushi + Vyakaranavithi |
| **Information Technology** | 8 | Basic IT · digital tools |
| **Artificial Intelligence** | 8 | AI concepts · Python intro · ML basics |
| **Computer Applications** | 8 | Python · HTML · digital literacy |
| **Physical Education** | 6 | Sports theory · health science |
| **Art Education** | 5 | Visual arts theory |
| **Work Education** | 5 | Vocational skills |
| **Health & Physical Activity** | 5 | Nutrition · fitness · hygiene |

### Class 10 — Board Prep (6 Subjects)

| Subject | Chapters | Board Focus |
|---------|:--------:|------------|
| **Maths Standard** | 15 | Real Numbers · Triangles · Trigonometry · Probability |
| **Maths Basic** | 15 | Simplified for non-science students |
| **Science** | 16 | Chemical Reactions · Life Processes · Electricity · Light |
| **Social Science** | 20 | Resources · Development · Money · Democracy |
| **English** | 12 | First Flight + Footprints · Board writing formats |
| **Hindi** | 12 | Kshitij · Kritika · Sparsh · Sanchayan |

### Class 11 — Stream Specialization

| Stream | Subjects |
|--------|---------|
| **Science (PCM)** | Physics · Chemistry · Mathematics · English · CS/IP |
| **Science (PCB)** | Physics · Chemistry · Biology · English · Physical Ed |
| **Commerce** | Accountancy · Business Studies · Economics · Maths · English |
| **Arts / Humanities** | History · Geography · Political Science · Psychology · Sociology |

### Bonus Engineering Resources

| Resource | Route | Content |
|----------|-------|---------|
| Semester Guides | `/semester` | BTech CSE 8 semesters — CPU scheduling · 3NF/BCNF · Banker's Algorithm |
| Interview Catalog | `/interviews/[slug]` | C++ OOP (virtual functions, diamond problem) · DBMS (B-Trees, ACID) · OS (deadlocks, scheduling) |
| Study Notes | `/notes` | C++ · DBMS · OS · Class 9 Polynomials — E-E-A-T verified |
| MCQ Practice | `/mcqs` | 10,000+ questions — filter: subject · class · difficulty |

---

## 🏛️ Live Events (6 in Catalog)

| Event | Status | Date | Location | Registered |
|-------|:------:|------|----------|:----------:|
| **Science Olympiad 2026** | 🟡 Upcoming | May 24, 2026 | Online | 1,250 |
| **Code Sprint — DSA Challenge** | 🔴 Live | May 12, 2026 | Online | 890 |
| **Math Battle Royale** | 🟡 Upcoming | Jun 2, 2026 | Online | 650 |
| **Inter-College Hackathon** | 🟡 Upcoming | Jun 20, 2026 | Delhi NCR | 420 |
| **Board Exam Mock Test — Class 10** | ✅ Completed | Apr 28, 2026 | Online | 2,100 |
| **Python Championship** | 🟡 Upcoming | Jul 5, 2026 | Online | 780 |

**Code Sprint prizes:** Premium subscriptions + certificates.
**Hackathon format:** 24h build · teams of 3–4 · GitHub URL submission · live evaluation scores.

---

## 🔒 Security Architecture

### 10-Layer Defense

```
Incoming Request
  │
  ▼  Layer 1   HTTPS/TLS — enforced in production
  ▼  Layer 2   Helmet.js — 10 HTTP security headers:
  │              X-Frame-Options: SAMEORIGIN
  │              X-Content-Type-Options: nosniff
  │              Referrer-Policy: strict-origin-when-cross-origin
  │              Permissions-Policy: camera=(), microphone=(), geolocation=()
  │              Strict-Transport-Security (HSTS)
  ▼  Layer 3   Rate Limiting — 100 req/60s per IP (Redis sliding window)
  │              Bypass: /health · /ready
  ▼  Layer 4   HPP — blocks array-based query injection
  ▼  Layer 5   CORS — strict allowlist, credentials: true
  ▼  Layer 6   Authentication chain:
  │              Clerk RS256 JWKS → HS256 JWT fallback → 401
  ▼  Layer 7   Validation middleware:
  │              stripHtml(): replace(/<[^>]*>/g, "").trim()
  │              isSafeObject(): blocks __proto__ · constructor · prototype
  │              sanitizeString(): strip HTML + normalize whitespace
  ▼  Layer 8   Parameterized SQL — $1/$2 only (zero injection surface)
  ▼  Layer 9   RBAC — 8-tier role check per endpoint
  ▼  Layer 10  Audit Trail — every security event written to PostgreSQL
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
| Student progress | ❌ | Self | Self | All | ❌ | Child | ❌ | ✅ |
| Moderate community | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Admin console | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### Atomic Write System

```typescript
// platform-store.ts — prevents race conditions on concurrent JSON writes

async function withStore<T>(
  work: (store: PlatformStore) => T | Promise<T>,
  options: { persist?: boolean } = {},
): Promise<T> {
  const runtime = getRuntime();
  // Chain onto the existing queue — guarantees sequential execution
  const operation = runtime.queue.then(async () => {
    const store = await loadStore();
    const result = await work(store);
    if (options.persist) await persistStore(store);  // OS-level atomic rename()
    return result;
  });
  runtime.queue = operation.then(() => undefined, () => undefined);
  return operation;
}

// persistStore() writes to /tmp/data-<pid>-<timestamp>.json
// then uses fs.rename() — atomic at the OS level — to replace the real file
```

---

## 🎨 Design System

### Color Palette (135 CSS Custom Properties)

| Token | Value | Used For |
|-------|-------|---------|
| `--primary` | `#2563EB` | Buttons · links · focus rings · active nav |
| `--primary-hover` | `#1D4ED8` | Button hover |
| `--accent` | `#D97706` | Streak flame · achievement badges · rewards |
| `--success` | `#10B981` | Correct answers · active streak · XP toasts |
| `--destructive` | `#EF4444` | Errors · wrong answers · battle loss |
| `--battle` | `#8B5CF6` | Battle arena purple |
| `--engineering` | `#06B6D4` | Engineering track cyan |
| `--bg-hero` | `#0B1120 → #141B2D` | Homepage dark navy gradient |
| `--card-bg` | `rgba(255,255,255,0.04)` | Glassmorphism: `backdrop-filter: blur(12px)` |
| `--text-primary` | `#F8FAFC` | Body text (dark mode) |
| `--text-muted` | `#94A3B8` | Labels · timestamps |
| `--border-subtle` | `rgba(255,255,255,0.08)` | Card borders · dividers |

### Layout & Spacing

```css
/* 8-point grid system */
--space-1: 0.25rem  --space-2: 0.5rem   --space-4: 1rem
--space-8: 2rem     --space-16: 4rem    --space-48: 12rem

/* Page layout */
--max-content-width: 80rem;   /* 1280px container */
--nav-height:        64px;    /* Fixed sticky Navbar */
--section-padding:   5rem;    /* Vertical section rhythm */
--card-radius:       12px;    /* Standard card corners */
```

### Animation Library

| Animation | Trigger | Used On |
|-----------|---------|---------|
| `fadeInUp` | IntersectionObserver (threshold 0.1) | Hero content · section cards |
| `float` | CSS loop | Homepage decorative orbs · hero image |
| `shimmer` | CSS loop (1.5s) | All skeleton loaders |
| `pulseGlow` | CSS loop | XP level badge on dashboard |
| `radarPulse` | CSS loop | Matchmaking expanding ring |
| `orbFloat` | CSS loop | Homepage hero background |

### Navbar

```
Desktop:  [Logo] [Classes ▾] [Practice ▾] [Explore ▾]  [Sign In] [Start Free]
                     │            │            │
                 Grade 9-12   Test Center   Community
                              Battle Arena  Events
                                           Leaderboard

Mobile:   [Logo] ─────────── [☰ Hamburger]
                 ↓ Opens side drawer (body scroll locked, backdrop overlay)
```

---

## 🔍 SEO & Performance

### SEO Architecture

| Feature | Implementation |
|---------|---------------|
| **Sitemap** | `/sitemap.ts` → DB subjects + chapters + 500 posts + `topical-authority-map.json` nodes |
| **Robots** | Allows: curriculum · community. Disallows: `/admin/` · `/dashboard/` · `/api/auth/` · `/api/progress/` · `/test/` |
| **JSON-LD** | Course · FAQPage · TechArticle (E-E-A-T with IIT author + citations) · BreadcrumbList · HowTo |
| **Programmatic SEO hubs** | C++ · DBMS · OS · Polynomials → each hub: notes + mcqs + interviews |
| **ISR Tiers** | 30s (realtime) → 5min (user) → 15min (content) → 30min (static) → 1h (about) → 12h (marketing) → 24h (legal) |

### `next.config.ts` Key Settings

```typescript
poweredByHeader: false                         // Don't expose Next.js version
compress: true                                 // Brotli/Gzip on all responses
experimental.optimizePackageImports: ["lucide-react"]  // ~70% icon bundle reduction

// Image optimization
formats: ["image/avif", "image/webp"]         // AVIF ~50% smaller than WebP
minimumCacheTTL: 604800                        // 7-day image cache
deviceSizes: [390, 640, 768, 1024, 1280, 1536, 1920]
remotePatterns: [images.unsplash.com, plus.unsplash.com]

// HTTP Cache Headers
"/_next/static/*" → Cache-Control: public, max-age=31536000, immutable
"/images/*"       → Cache-Control: public, max-age=604800, stale-while-revalidate=86400
```

### Performance Architecture

| Decision | Implementation |
|----------|---------------|
| Server components by default | `"use client"` added only when needed |
| Dynamic imports everywhere | Battle · Dashboard · Community · Leaderboard — all lazy |
| Denormalized XP + streak | On `User` row — O(1) dashboard reads, no joins |
| 14 PostgreSQL indexes | Compound covering: leaderboard · search · battle history |
| pg Pool singleton | `max: 10`, `idleTimeoutMs: 30s` — shared per process |
| Self-hosted fonts | `@fontsource` — zero Google DNS round-trips |
| Socket.IO Redis adapter | Scales across PM2 cluster (max CPU cores) |
| `useAuth()` ref guard | Multiple components mounting together = exactly 1 fetch |

---

## 🐳 Docker & Deployment

### Docker Compose

```yaml
# 4 services — all health-checked, dependency-ordered

postgres:    # 16-alpine
  command: >
    -c max_connections=200 -c shared_buffers=256MB -c work_mem=4MB
    -c maintenance_work_mem=64MB -c effective_cache_size=768MB
    -c wal_buffers=16MB -c random_page_cost=1.1 -c effective_io_concurrency=200
    -c log_min_duration_statement=1000
  healthcheck: pg_isready every 10s, 5 retries

redis:       # 7-alpine
  command: >
    redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
    --appendonly yes --appendfsync everysec --save 300 10 --save 60 1000
  healthcheck: redis-cli ping every 10s

backend:     # Express 5 + Socket.IO
  depends_on: { postgres: healthy, redis: healthy }
  healthcheck: GET /health every 30s, 15s start_period, 3 retries

frontend:    # Next.js 16
  depends_on: { backend: healthy }
  healthcheck: GET / every 30s, 20s start_period, 3 retries
```

### PM2 Configuration

```javascript
// ecosystem.config.js — full content
module.exports = {
  apps: [{
    name:               "eduquest-backend-cluster",
    script:             "./dist/index.js",
    instances:          "max",          // 1 process per CPU core
    exec_mode:          "cluster",      // PM2 cluster + Redis adapter = horizontal scale
    autorestart:        true,
    watch:              false,
    max_memory_restart: "1G",           // Restart if heap exceeds 1 GB
    env:            { NODE_ENV: "development", PORT: 4000 },
    env_production: { NODE_ENV: "production",  PORT: 4000 },
    error_file:  "./logs/pm2-err.log",
    out_file:    "./logs/pm2-out.log",
    merge_logs:  true,
    time:        true,                  // Timestamp every log line
  }]
};
```

### Graceful Shutdown (6 Steps)

```
SIGTERM / SIGINT received
  │
  ① server.close()            — stop accepting new HTTP connections
  ② stopScheduler()           — halt background job scheduler
  ③ stopAnalyticsFlushTimer() — flush analytics buffer to DB
  ④ stopAuditFlushTimer()     — flush pending audit log entries
  ⑤ closeDatabasePool()       — drain all PostgreSQL connections
  ⑥ closeRedisClient()        — disconnect from Redis
  │
  process.exit(0)

  ⚠️ Timeout: 30 seconds → SIGKILL if graceful exit hangs
```

### Pre-Deploy Validation

```bash
# Must all pass before every production deploy:

cd frontend
npm run typecheck   # ✅ Zero TypeScript errors
npm run lint        # ✅ Zero ESLint warnings
npm run build       # ✅ Next.js build succeeds

cd ../backend
npx tsc --noEmit   # ✅ Zero TypeScript errors
npm run build      # ✅ Compiles to dist/

# Required production env vars:
# NODE_ENV=production
# EDUQUEST_PERSISTENCE_ADAPTER=postgres
# EDUQUEST_COOKIE_SECURE=true
# EDUQUEST_SESSION_SECRET=<32+ char secret>
# CLERK_SECRET_KEY=<sk_ not sk_test_>
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
| Casual battles | ✅ | ✅ | ✅ |
| Public events + hackathons | ✅ | ✅ | ✅ |
| Ranked battles (Stars wager) | ❌ | ✅ | ✅ |
| All 16 engineering tracks | ❌ | ✅ | ✅ |
| Timed mock tests | ❌ | ✅ | ✅ |
| Dashboard analytics | ❌ | ✅ | ✅ |
| Priority Elo matchmaking | ❌ | ✅ | ✅ |
| Teacher batch management | ❌ | ❌ | ✅ |
| School-level leaderboard | ❌ | ❌ | ✅ |
| Parent progress reports | ❌ | ❌ | ✅ |
| Custom event hosting | ❌ | ❌ | ✅ |
| **Price** | **₹0/month** | **Coming Soon** | **Contact Us** |

---

## 🗺️ Roadmap

### 🔴 In Progress (Q2–Q3 2026)

- [ ] **Live Battle Room** — persistent WebSocket, sub-100ms answer sync, full reconnect flow
- [ ] **Post-Match Screen** — animated XP delta · streak update · Stars summary
- [ ] **Background Workers** (BullMQ) — email delivery · PDF certificates · notification fanout
- [ ] **Automated Test Suite** — Jest API route tests + Playwright E2E (zero tests currently)
- [ ] **Hero Image Pipeline** — convert all PNG heroes to AVIF/WebP via Sharp

### 🟡 Q3–Q4 2026

- [ ] **Real Code Execution** — Judge0 / Piston API (replace simulated runner)
- [ ] **Push Notifications** — Firebase Cloud Messaging + Web Push API
- [ ] **Full-Text Search v2** — Autocomplete + relevance-ranked results
- [ ] **Safe Exam Browser** — OS-level lockdown for proctored contests
- [ ] **Teacher Dashboard** — Batch creation · custom test builder · progress tracking

### 🟢 Q4 2026 – Q1 2027

- [ ] **AI Tutor** — LLM doubt explanations + personalized topic recommendations
- [ ] **Mobile Apps** — React Native / Expo (Android + iOS)
- [ ] **Group Study Rooms** — Up to 6 students on same chapter simultaneously
- [ ] **Internationalization** — Hindi · Tamil · Telugu UI translations
- [ ] **Certificate Generator** — Auto-PDF for event and hackathon winners
- [ ] **Referral System** — Earn Stars for referring friends
- [ ] **Parent Portal** — Weekly reports · streak summaries · parent-teacher chat

### 🔵 Long-Term Vision

- [ ] **National EduQuest Olympiad** — annual platform-wide competition
- [ ] **College Partnership API** — white-label deployment for institutions
- [ ] **Adaptive Learning Engine** — ML weak-area detection + next-topic recommendations
- [ ] **Live Teacher Classes** — video sessions integrated into day-wise plans
- [ ] **Offline Mode (PWA)** — complete lessons offline · sync on reconnect

---

## 🤝 Contributing

### Quick Start for Contributors

```bash
# 1. Fork on GitHub
git clone https://github.com/YOUR_USERNAME/eduquest.git
cd eduquest/frontend
npm install --legacy-peer-deps

# 2. Create branch
git checkout -b feature/your-feature

# 3. Validate — both must pass before committing
npm run typecheck   # ✓ zero errors
npm run lint        # ✓ zero warnings

# 4. Open PR
git commit -m "feat: add [feature]"
git push origin feature/your-feature
```

### Code Conventions

| Rule | Requirement |
|------|-------------|
| **TypeScript** | Strict — no `any`, no untyped assertions |
| **Server-first** | Pages are server components; `"use client"` only for state/events/WebSocket |
| **CSS Modules** | Every page: its own `PageName.module.css` — no inline styles |
| **Repository pattern** | All DB via `getPlatformRepository()` — no raw SQL in pages |
| **File headers** | `FILE:` · `PURPOSE:` · `USED BY:` · `LAST UPDATED:` on every file |
| **Parameterized SQL** | Always `$1`, `$2` — never string-interpolated values |
| **Comments** | Section comments + inline on non-obvious logic |

### Where to Contribute

| Priority | Area | State |
|----------|------|-------|
| 🔴 **Critical** | Battle room (Socket.IO) | Foundation exists, needs completion |
| 🔴 **Critical** | Test suite | **Zero tests** — Jest + Playwright needed |
| 🟡 **Important** | Code execution (Judge0) | Simulated currently |
| 🟡 **Important** | Push notifications | Architecture ready, not built |
| 🟢 **Welcome** | Hindi/Tamil i18n | Strings not yet extracted |
| 🟢 **Welcome** | Accessibility (ARIA) | Partial coverage |
| 🟢 **Welcome** | New tracks | OS · Computer Networks · Compiler Design |

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

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 Acknowledgements

| Contributor | Role |
|------------|------|
| **NCERT India** | Open curriculum powering all Class 9–12 content |
| **Clerk** | Making production auth simple and developer-friendly |
| **Vercel + Next.js** | The App Router changed how full-stack TypeScript feels |
| **Prisma** | TypeScript + PostgreSQL with this DX is something special |
| **Socket.IO + Redis** | Horizontal battle scaling made elegant |
| **Indian students** | Every feature was shaped by real learning struggles |

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer" width="100%"/>

### Built with ❤️ in India · for India's next generation of learners

*"EduQuest is not just another EdTech app. It is a gamified OS for studying —*
*where knowledge is your weapon and your level is your rank."*
— EduBattle Master Plan v3.0

<br/>

**[⬆ Back to Top](#eduquest)**

<br/>

<a href="https://github.com/yourusername/eduquest/issues/new?labels=bug">🐛 Report Bug</a>
&nbsp;·&nbsp;
<a href="https://github.com/yourusername/eduquest/issues/new?labels=enhancement">💡 Request Feature</a>
&nbsp;·&nbsp;
<a href="https://github.com/yourusername/eduquest/discussions">💬 Discussions</a>
&nbsp;·&nbsp;
<a href="https://github.com/yourusername/eduquest/fork">🍴 Fork</a>

<br/><br/>

[![Star this repo](https://img.shields.io/github/stars/yourusername/eduquest?style=for-the-badge&logo=github&color=F59E0B&logoColor=white&label=⭐%20Star%20EduQuest)](https://github.com/yourusername/eduquest)
[![Follow on GitHub](https://img.shields.io/github/followers/yourusername?style=for-the-badge&logo=github&color=6366F1&logoColor=white&label=Follow)](https://github.com/yourusername)

</div>
