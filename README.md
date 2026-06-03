<div align="center">

# 🎓 EduQuest

### Learn Smarter. Battle Harder. Level Up.

EduQuest is a production-oriented, gamified education platform for **CBSE Class 9-12 students** and **engineering learners**. It combines structured chapter-wise learning, progress analytics, XP/streak mechanics, community discussions, college events, and quiz-battle experiences inside one modern full-stack web app.

<br />

![Next.js](https://img.shields.io/badge/Next.js-16.2.6-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=111111)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Ready-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Clerk](https://img.shields.io/badge/Auth-Clerk_+_Sessions-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-Optional_Tooling-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Battle_Rooms-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

<br />

**Status:** Active full-stack implementation<br />
**Primary runtime:** Next.js App Router + route handlers<br />
**Production schema authority:** SQL migrations in `frontend/src/lib/server/database/migrations`

</div>

---

## 📌 Table Of Contents

- [Overview](#-overview)
- [Project Links](#-project-links)
- [Visual Preview](#-visual-preview)
- [5-Minute Quick Start](#-5-minute-quick-start)
- [What Is Implemented Now](#-what-is-implemented-now)
- [Status Legend](#-status-legend)
- [Core Features](#-core-features)
- [User Journeys](#-user-journeys)
- [Try These Flows](#-try-these-flows)
- [Content Coverage Snapshot](#-content-coverage-snapshot)
- [Product Routes](#-product-routes)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Repository Structure](#-repository-structure)
- [Developer Source Map](#-developer-source-map)
- [API Surface](#-api-surface)
- [Data And Persistence](#-data-and-persistence)
- [Authentication](#-authentication)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)
- [Configuration Profiles](#-configuration-profiles)
- [Useful Scripts](#-useful-scripts)
- [Testing And Quality Gates](#-testing-and-quality-gates)
- [Security Performance And Accessibility](#-security-performance-and-accessibility)
- [Deployment Options](#-deployment-options)
- [Production Checklist](#-production-checklist)
- [Release Readiness Matrix](#-release-readiness-matrix)
- [Troubleshooting](#-troubleshooting)
- [Current Notes](#-current-notes)
- [Documentation Map](#-documentation-map)
- [Future Work](#-future-work)

---

## 🚀 Overview

EduQuest is built as an India-first learning platform where students can:

- Study CBSE subjects through class-wise and chapter-wise learning paths.
- Practice questions and chapter tests with scoring, explanations, and progress persistence.
- Track XP, levels, streaks, achievements, activity graphs, wallet balance, and rank.
- Join competitive quiz battles and prepare for real-time 1v1 battle rooms.
- Use community discussions to ask questions, share notes, and learn together.
- Register for academic competitions, coding events, olympiads, mock tests, and hackathons.
- Explore engineering learning tracks for programming languages, DSA, system design, DBMS, OS, CN, Git/GitHub, and interview preparation.

The project is not just a UI mockup. It includes real Next.js route handlers, PostgreSQL migration infrastructure, auth flows, runtime health checks, production data guards, and a DB-first repository layer with local fallback support for development.

---

## 🔗 Project Links

| Link | Status |
| --- | --- |
| Production app | Add the deployed URL here after public deployment. |
| Local app | `http://localhost:3000` after `cd frontend && npm run dev`. |
| Replit/local preview port | `http://localhost:5000` after `cd frontend && npm run dev -- --port 5000`. |
| Health check | `/api/health` on the active app host. |
| Readiness check | `/api/readiness` on the active app host. |
| Optional Socket.IO backend | `http://localhost:4000` when `backend/` is running locally. |
| Production guide | `docs/PRODUCTION_DEPLOYMENT.md`. |
| Implementation status | `docs/IMPLEMENTATION_STATUS.md`. |

No public demo credentials are documented in this repository. For local exploration, create a Clerk development account or seed an approved local/staging database.

---

## 🖼️ Visual Preview

These assets already live in the repository and can be used in GitHub, documentation, launch posts, or deployment pages.

<table>
  <tr>
    <td width="50%">
      <img src="frontend/public/images/eduquest-home-hero.png" alt="EduQuest home hero" />
      <br />
      <strong>Home Experience</strong>
    </td>
    <td width="50%">
      <img src="frontend/public/images/engineering-hero.png" alt="EduQuest engineering hero" />
      <br />
      <strong>Engineering Track</strong>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="frontend/public/images/community-events-hero.png" alt="EduQuest community and events hero" />
      <br />
      <strong>Community And Events</strong>
    </td>
    <td width="50%">
      <img src="frontend/public/images/class-9-hero.png" alt="EduQuest Class 9 hero" />
      <br />
      <strong>CBSE Learning Path</strong>
    </td>
  </tr>
</table>

> Tip: add real page screenshots later under `docs/screenshots/` when the production UI is finalized. The current image assets are route-owned hero assets, not full-page screenshots.

---

## ⚡ 5-Minute Quick Start

Use this when you want the fastest possible local preview.

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

Then open:

```txt
http://localhost:3000
```

Replace the generated `.env.local` values with a local-friendly profile:

```env
NODE_ENV=development
EDUQUEST_PERSISTENCE_ADAPTER=json
EDUQUEST_RATE_LIMIT_ADAPTER=memory
EDUQUEST_ALLOW_STATIC_FALLBACKS=true
EDUQUEST_SESSION_SECRET=local-development-secret-change-before-production-12345
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_from_your_clerk_project
CLERK_SECRET_KEY=sk_test_from_your_clerk_project
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

On macOS/Linux, replace `Copy-Item .env.example .env.local` with:

```bash
cp .env.example .env.local
```

For production-like local development, switch to PostgreSQL mode and run `npm run db:migrate`.

---

## ✅ What Is Implemented Now

| Area | Current Implementation |
| --- | --- |
| 🏠 Home | Marketing/product home page with class tracks, platform features, battle preview, testimonials, DB-backed stats, leaderboard preview, and community highlights. |
| 🎒 Classes | Class 9, 10, 11, and 12 route families with subject pages, chapter pages, stream-aware senior secondary routing, and route-owned CSS modules. |
| 🧪 Class 9 Science Deep Content | Dedicated topic-study pages, chapter study routes, practice pages, physics simulations, motion/matter/force content modules, and visual topic assets. |
| 💻 Engineering | Programming language and CS skill plans including C, C++, Java, Python, JavaScript, TypeScript, SQL, Rust, Kotlin, Swift, Dart, Ruby, DSA, web dev, system design, DBMS, OS, CN, competitive programming, and interview prep. |
| 🧠 Practice / MCQs | MCQ catalog and dynamic MCQ pages with client-side interaction and route-specific styling. |
| 🧾 Programmatic Study Content | Notes, MCQs, interviews, and semester guides with static params, JSON-LD schema, metadata, internal links, interactive scoring, accordions, and checklist-style study pages. |
| 🧪 Test Center | Assessment hub with subject lanes, upcoming assessments, trust signals, quick access cards, and a foundation for future full mock-test execution. |
| ⚔️ Battle | Battle lobby, subject selector, Stars wager selector, level-10 wager gate, battle history, wallet integration, REST matchmaking ticket API, battle-room client/server scaffold, timer UI, answer submission UI, result overlay, and anti-cheat hook. |
| 📊 Dashboard | Protected learner dashboard with XP, streaks, battle tickets, rank, level progress, Stars wallet, quick actions, recent activity, 12-week activity graph, and achievements grid. |
| 🏆 Leaderboard | Ranking page with loading skeleton and backend-connected client filtering. |
| 👥 Community | Student discussion feed, category filters, search, create-post flow, post detail route, likes/comments/views display, and protected posting API. |
| 🗓️ Events | Events page with event filters, registration flow, live/upcoming/completed states, event-host application form, and admin review console for host applications. |
| 🧑‍💼 Admin | Host-application review area with status updates and internal notes. |
| 🔔 Notifications | Notifications route and API backed by production SQL columns. |
| 🔎 Search | Search route and API for platform-wide discovery. |
| 👤 Account | Clerk-based sign-in/sign-up pages, profile, settings, wallet, forgot-password placeholder, and legacy email/password API support. |
| 📈 Observability | `/api/health` and `/api/readiness` endpoints with non-secret runtime health, migration status, adapter status, and production blockers. |
| 🔐 Security | Same-origin guards, rate limiting, secure cookies, production fallback guards, Next.js security headers, Clerk middleware, and audit-log contracts. |
| 🗄️ Database | Numbered SQL migrations `001` through `021`, migration runner, checksum tracking, PostgreSQL pool helpers, JSON fallback adapter, and production data policy. |
| 🧭 SEO | Metadata, sitemap route, robots route, Open Graph defaults, schema helpers, topical authority map, internal linker, and route hero assets. |

---

## 🏷️ Status Legend

EduQuest has many modules, and not every module is at the same production maturity level. This legend keeps the README honest and easy to scan.

| Status | Meaning |
| --- | --- |
| ✅ Implemented | Built in the active Next.js app and available through current routes/API handlers. |
| 🧪 Scaffolded | Code exists and is useful for development, but production deployment/hardening is still required. |
| 🚧 In Progress | Partially implemented or dependent on production data/services before public launch. |
| 🗺️ Roadmap | Planned future work, not production-ready today. |

### Module Maturity Snapshot

| Module | Status | Notes |
| --- | --- | --- |
| Home, layout, navigation, footer | ✅ Implemented | Active App Router UI with metadata, global layout, and route-owned assets. |
| Class 9-12 learning routes | ✅ Implemented | Route families exist; DB-first plans with local fallback support. |
| Class 9 deep science content | ✅ Implemented | Rich topic content, practice, and simulations are present for selected science chapters. |
| Engineering tracks | ✅ Implemented | Static curated plan data with dynamic route rendering. |
| Dashboard and gamification UI | ✅ Implemented | Protected dashboard, XP, levels, streaks, wallet, activity graph, achievements UI. |
| Community and events | ✅ Implemented | Backend-connected feed, posting, event listing, registration, and host applications. |
| Programmatic SEO pages | ✅ Implemented | Notes, MCQs, interviews, semester guides, schemas, and internal links. |
| Battle lobby and ticket API | ✅ Implemented | REST-first lobby and matchmaking ticket flow. |
| Live Socket.IO battle rooms | 🧪 Scaffolded | Client page and optional Express Socket.IO service exist; production orchestration is roadmap. |
| Redis matchmaking queues | 🗺️ Roadmap | Redis is ready for rate limits today and planned for battle queues/live counters. |
| Email, workers, certificates | 🗺️ Roadmap | Job intent foundations exist; dedicated workers still need production implementation. |
| Automated tests | 🚧 In Progress | Typecheck/lint/build gates exist; full API/browser test suites are planned. |

---

## ✨ Core Features

### 🎯 Structured Learning

- CBSE Class 9 and Class 10 subject hubs.
- Class 11 and Class 12 stream-based learning paths for Science, Commerce, and Humanities.
- Subject detail pages with chapter cards, difficulty, day counts, and question counts.
- Chapter practice routes with DB-first questions and local fallback questions for development previews.
- Class 9 science deep-study content with rich topic pages and physics simulations.
- Engineering learning plans for programming languages and core computer-science skills.

### 🎮 Gamification

- XP point system for questions, day completion, streaks, battles, and chapter tests.
- Level progress UI with current and next level thresholds.
- Daily streak tracking and streak calendar.
- Achievements badge grid with earned/locked states.
- Stars wallet for battle wagers and reward loops.
- Answer submissions can award variable XP, Stars, wallet transactions, daily streak updates, chapter progress, and milestone-based level bonuses.
- Leaderboard previews and full leaderboard route.
- GitHub-style activity graph for learning consistency.

### ⚔️ Battle Arena

- Subject-based battle lobby.
- Free and Stars-based wager tiers.
- Wagers above `0` require Level 10+.
- Wallet balance validation before battle entry.
- Battle matchmaking ticket endpoint at `/api/battle/matchmaking`.
- Socket.IO battle-room client page at `/battle/[matchId]`.
- Optional Express/Socket.IO server scaffold for live-room transport experiments.
- 30-second question timer UI.
- Real-time score panel, answer status, result reveal, and match-end overlay.
- Anti-cheat hook for suspicious browser behavior.
- Production Redis-backed matchmaking queues and hardened live-room orchestration are still roadmap work.

### 👥 Community

- Community feed with category filters.
- Search across post title, body, and author.
- Auth-protected post creation.
- Tag support.
- Post detail route.
- Engagement display: likes, comments, and views.

### 🗓️ Events And Hackathons

- Event catalog with live/upcoming/completed filters.
- Student event registration API.
- Host-event application flow for institutions.
- Admin console for reviewing host applications.
- Hackathon listing and dynamic detail routes.

### 🧾 Programmatic Content And SEO

- Notes catalog and dynamic notes pages.
- MCQ catalog and interactive MCQ detail pages.
- Interview-preparation catalog with dynamic interview pages.
- Semester catalog and semester guide pages.
- Static params for fast pre-rendering.
- JSON-LD schema generation for search-friendly pages.
- Internal-link injection for stronger topical authority.
- Author/citation metadata and structured educational content.

### 📊 Personalized Dashboard

- Protected `/dashboard` route.
- Clerk-aware loading and redirect handling.
- User stats, rank, XP, streaks, wallet, recent activity, quick actions.
- Activity graph from `/api/activity`.
- Achievements from `/api/achievements`.
- Level thresholds from `/api/levels`.

### 🛡️ Production Foundations

- PostgreSQL-first production mode.
- JSON adapter for local single-machine development.
- Redis-ready distributed rate limiting.
- Runtime readiness endpoint that blocks production when required config is missing.
- Demo seed protection for production databases.
- Static fallback data disabled in strict production mode.
- SQL migration checksum validation.

---

## 👣 User Journeys

### Student Journey

1. Visit the homepage and choose a class, subject, engineering track, or battle mode.
2. Browse public class/chapter pages without signing in.
3. Sign up with Clerk to unlock dashboard, saved progress, wallet, notifications, and protected actions.
4. Study a chapter, answer questions, and receive score feedback.
5. Earn XP, Stars, streak progress, achievements, and level progress.
6. Join community discussions or register for events.
7. Enter battle lobby, select a subject, choose free/wager mode, and start matchmaking.

### Engineering Learner Journey

1. Open `/engineering`.
2. Choose a programming language or CS skill path.
3. Follow the day-wise plan.
4. Practice MCQs/interview content.
5. Track progress and continue through dashboard quick actions.

### Event Host Journey

1. Open `/events/host`.
2. Submit institution, organizer, and event details.
3. Application is stored for review.
4. Admin reviews host applications in `/admin/host-applications`.
5. Approved future hosts can run competitions, quizzes, mock tests, or hackathons.

### Admin Journey

1. Sign in with an authorized admin account.
2. Open `/admin/host-applications`.
3. Review host submissions.
4. Add internal notes.
5. Update application status.

---

## 🧪 Try These Flows

These flows are the best way to understand the product after the app is running.

| Flow | Steps | What It Demonstrates |
| --- | --- | --- |
| Public learning preview | Open `/` → choose `/class-9` → open Science → open a chapter/topic. | Public content discovery, class routing, subject plans, chapter UX, and topic content. |
| Authenticated learner dashboard | Sign in → open `/dashboard`. | Clerk auth, protected route handling, XP, streaks, wallet, achievements, activity graph, and quick actions. |
| Chapter practice and progress | Open a chapter practice route → answer questions → revisit dashboard/progress. | Question rendering, scoring, progress persistence, XP/Stars reward loop. |
| Community discussion | Open `/community` → filter/search posts → try creating a post. | Feed loading, filters, protected mutation, post detail routing. |
| Event registration | Open `/events` → filter events → register for a live/upcoming event. | Event catalog, auth-protected registration, saved registration state. |
| Event host application | Open `/events/host` → submit an institution event request. | Host-application form, validation, backend persistence, admin review flow. |
| Admin review | Open `/admin/host-applications` with an admin account. | Protected admin route, application review, status updates, internal notes. |
| Battle lobby | Open `/battle` → select subject → choose free or Stars wager → find opponent. | Battle setup UX, level-10 wager gate, wallet checks, matchmaking ticket creation. |
| Programmatic content | Open `/notes`, `/mcqs`, `/interviews`, or `/semester`. | SEO-focused generated content, schemas, internal links, and interactive study pages. |

---

## 📚 Content Coverage Snapshot

| Content Area | Current Coverage |
| --- | --- |
| Class 9 | Mathematics, Science, Social Science, English, Hindi, Sanskrit, IT, AI, Computer Applications, Physical Education, Art Education, Work Education, Health and Physical Activity. |
| Class 10 | Maths Standard, Maths Basic, Science, Social Science, English, Hindi. |
| Class 11 | Science, Commerce, and Humanities stream routing with subject pages. |
| Class 12 | Science, Commerce, and Humanities stream routing with board/entrance-oriented subject pages. |
| Class 9 Science Deep Content | Matter in Our Surroundings, Motion, Force and Laws of Motion, and related topic pages/simulations are represented in the codebase. |
| Engineering Languages | C, C++, Java, Python, JavaScript, TypeScript, Rust, Kotlin, Swift, SQL, Dart, Ruby. |
| Engineering Skills | DSA, Web Development, System Design, DBMS, Operating Systems, Computer Networks, Git/GitHub, Competitive Programming, Interview Preparation. |
| Practice Content | MCQs, notes, interviews, semester guides, chapter questions, fallback questions, and programmatic study pages. |
| Events | Olympiads, coding challenges, mock tests, hackathons, battle competitions, and host applications. |

Content is designed as DB-first for production. Static catalogs and fallback questions exist so local development and previews remain usable when PostgreSQL is not configured.

---

## 🧭 Product Routes

### Public And Marketing

| Route | Purpose |
| --- | --- |
| `/` | Home page with platform overview, tracks, features, battle preview, stats, leaderboard preview, community highlights, and CTA. |
| `/about` | Platform story and positioning. |
| `/features` | Feature overview page. |
| `/pricing` | Pricing page with honest current/future tier messaging. |
| `/faq` | Frequently asked questions. |
| `/contact` | Contact form route. |
| `/privacy` | Privacy policy. |
| `/terms` | Terms of service. |

### Learning

| Route | Purpose |
| --- | --- |
| `/class-9` | Class 9 subject overview. |
| `/class-9/[subject]` | Class 9 subject learning plan. |
| `/class-9/[subject]/[chapter]` | Class 9 chapter practice/deep content route. |
| `/class-9/[subject]/[chapter]/study` | Chapter study route. |
| `/class-9/[subject]/[chapter]/[topicSlug]` | Topic-level study experience. |
| `/class-10` | Class 10 board-prep overview. |
| `/class-10/[subject]` | Class 10 subject plan. |
| `/class-10/[subject]/[chapter]` | Class 10 chapter practice. |
| `/class-11` | Class 11 stream selector. |
| `/class-11/[stream]/[subject]` | Class 11 stream subject page. |
| `/class-11/[stream]/[subject]/[chapter]` | Class 11 chapter practice. |
| `/class-12` | Class 12 stream selector. |
| `/class-12/[stream]/[subject]` | Class 12 stream subject page. |
| `/class-12/[stream]/[subject]/[chapter]` | Class 12 chapter practice. |
| `/engineering` | Engineering track hub. |
| `/engineering/[slug]` | Engineering language or CS skill plan. |
| `/semester` | Semester catalog. |
| `/semester/[slug]` | Semester detail route. |
| `/notes` | Notes catalog. |
| `/notes/[slug]` | Notes detail route. |
| `/mcqs` | MCQ catalog. |
| `/mcqs/[slug]` | MCQ practice page. |
| `/interviews` | Interview-prep catalog. |
| `/interviews/[slug]` | Interview-prep detail route. |
| `/test` | Test Center assessment hub with subject lanes, upcoming assessments, trust signals, quick access cards, and future full mock-test execution. |

### Gamification And Community

| Route | Purpose |
| --- | --- |
| `/dashboard` | Signed-in learner dashboard. |
| `/battle` | Battle lobby. |
| `/battle/matchmaking` | Matchmaking transition route. |
| `/battle/[matchId]` | Socket.IO battle-room client page for the optional live battle server. |
| `/leaderboard` | Platform leaderboard. |
| `/community` | Community feed. |
| `/community/post/[id]` | Community post detail. |
| `/events` | Events and competitions. |
| `/events/host` | Institution event-host application form. |
| `/hackathon` and `/hackathons` | Hackathon listing routes. |
| `/hackathon/[id]` and `/hackathons/[id]` | Hackathon detail routes. |

### Account And Admin

| Route | Purpose |
| --- | --- |
| `/sign-in/[[...sign-in]]` | Clerk sign-in route. |
| `/sign-up/[[...sign-up]]` | Clerk sign-up route. |
| `/forgot-password` | Password recovery placeholder route. |
| `/profile` | User profile. |
| `/settings` | User settings, track selection, and account actions. |
| `/wallet` | Stars wallet page. |
| `/notifications` | Notification center. |
| `/search` | Search page. |
| `/admin/host-applications` | Admin review console for event host applications. |

---

## 🧰 Tech Stack

### Frontend

| Technology | Used For |
| --- | --- |
| **Next.js 16 App Router** | Routing, layouts, server components, metadata, route handlers, ISR, sitemap, robots. |
| **React 19** | Interactive UI components and client boundaries. |
| **TypeScript** | Type-safe app, API, data contracts, and route logic. |
| **CSS Modules** | Route-owned styling for pages like dashboard, battle, community, events, class pages, and learning plans. |
| **Global CSS Tokens** | Theme variables, base typography, layout helpers, skeleton utilities, and shared design tokens. |
| **Lucide React** | Professional icon system across navigation, buttons, cards, stats, filters, and dashboards. |
| **TanStack Query** | Client-side server-state provider. |
| **Zustand** | Auth, UI theme, level, and streak state stores. |
| **React Hot Toast** | Toast notifications. |
| **Framer Motion / Intersection Observer** | Animation-ready UI behavior and scroll reveals. |
| **KaTeX / React KaTeX** | Math rendering support for learning content. |
| **Recharts** | Chart-ready analytics dependency. |
| **Next Image** | Optimized local and remote images with AVIF/WebP support. |
| **Tailwind CSS 4 / PostCSS** | Styling pipeline dependency; route CSS modules and global tokens are the primary authoring style. |
| **React Hook Form** | Form-ready dependency for structured input flows. |
| **Axios / Fetch** | API communication helpers across client and server flows. |
| **date-fns** | Date formatting and time calculations. |
| **clsx / tailwind-merge** | Class-name composition helpers. |
| **Howler / React Confetti** | Audio and celebration effects for gamified experiences. |
| **Sharp** | Image processing support for asset workflows and Next.js image optimization. |

### Backend Inside Next.js

| Technology | Used For |
| --- | --- |
| **Next.js Route Handlers** | Production HTTP API under `frontend/src/app/api`. |
| **PostgreSQL + pg** | Durable users, progress, events, community, wallet, battle, leaderboard, audit, jobs, and content data. |
| **Redis + ioredis** | Distributed rate limiting and future live counters/queues. |
| **Zod** | Request validation for auth, battle, events, and other flows. |
| **Clerk** | Primary hosted auth and Google/session login support. |
| **Signed HTTP-only Sessions** | Legacy/local email-password session fallback. |
| **Pino-style Logger** | Structured runtime logging helper. |
| **SQL Migrations** | Production schema authority. |
| **Prisma** | Optional client/schema tooling; not the current production schema authority. |

### Top-Level Backend Package

| Package | Current Role |
| --- | --- |
| `backend/` | Express 5 + TypeScript + Socket.IO + Prisma scaffold. It contains a large API/server implementation and Socket.IO battle services, but project docs mark it as legacy/scaffolding for public HTTP API deployment until it is deliberately reconciled with the `eduquest_*` SQL schema used by the live Next.js app. |

Use the Next.js API routes as the current production HTTP backend. Use the top-level backend only when you intentionally need the Express/Socket.IO server during local battle-room work.

The optional Express package also contains scaffolded domains for coding submissions, mock tests, metrics/Prometheus, uploads, SEO, audit logs, schedulers, analytics flushing, email templates, and Socket.IO battle services.

---

## 🏗️ Architecture

```mermaid
flowchart TD
    Browser["Student Browser"]
    NextApp["Next.js App Router\nfrontend/"]
    Pages["Pages + Client Components\nsrc/app + src/components"]
    Api["Route Handlers\nsrc/app/api"]
    ServerLib["Server Modules\nsrc/lib/server"]
    Repo["Repository Layer\nJSON dev adapter / PostgreSQL adapter"]
    Postgres[("PostgreSQL\nproduction source of truth")]
    Redis[("Redis\nrate limit + future queues")]
    Clerk["Clerk Auth"]
    Express["Optional Express + Socket.IO\nbackend/ scaffold"]

    Browser --> NextApp
    NextApp --> Pages
    NextApp --> Api
    Pages --> Api
    Api --> ServerLib
    ServerLib --> Repo
    Repo --> Postgres
    ServerLib --> Redis
    Api --> Clerk
    Browser -. "Socket.IO battle rooms" .-> Express
    Express -. "battle transport / scaffold APIs" .-> Postgres
```

### Runtime Flow

1. The browser renders pages from the Next.js App Router.
2. Client pages call `/api/*` route handlers for data.
3. Route handlers validate input, resolve auth, apply same-origin and rate-limit guards, then call server modules.
4. Server modules use the repository layer.
5. Local development can use JSON fallback data.
6. Production should use PostgreSQL with Redis-backed rate limiting.
7. Health and readiness endpoints expose adapter, migration, and connectivity status without leaking secrets.

---

## 📁 Repository Structure

```txt
eduquest/
├── frontend/
│   ├── src/
│   │   ├── app/                         # Next.js App Router pages + API routes
│   │   │   ├── api/                     # Production HTTP backend route handlers
│   │   │   ├── class-9/                 # Class 9 learning routes
│   │   │   ├── class-10/                # Class 10 board-prep routes
│   │   │   ├── class-11/                # Stream-based Class 11 routes
│   │   │   ├── class-12/                # Stream-based Class 12 routes
│   │   │   ├── battle/                  # Battle lobby, matchmaking, match room
│   │   │   ├── community/               # Community feed and post detail
│   │   │   ├── dashboard/               # Signed-in learner dashboard
│   │   │   ├── engineering/             # Engineering learning tracks
│   │   │   ├── events/                  # Events and host application flows
│   │   │   └── ...                      # Profile, settings, wallet, search, legal pages
│   │   ├── components/                  # Reusable UI, layout, learning, simulations, gamification
│   │   ├── hooks/                       # Browser hooks such as auth, level, streak, anti-cheat
│   │   ├── lib/
│   │   │   ├── curriculum/              # Learning catalogs and subject routing
│   │   │   ├── content/                 # Deep class content modules
│   │   │   ├── events/                  # Event catalog
│   │   │   ├── server/                  # Server-only auth, DB, repos, cache, audit, jobs, SEO
│   │   │   └── utils/                   # Shared utilities
│   │   ├── store/                       # Zustand stores
│   │   ├── styles/                      # Global CSS and route-shared styles
│   │   └── types/                       # Shared TypeScript types
│   ├── public/
│   │   ├── images/                      # Hero images, topic images, simulation images
│   │   └── favicons/                    # Route-specific SVG favicons
│   ├── prisma/                          # Optional Prisma schema/tooling
│   ├── scripts/                         # Asset and migration helper scripts
│   └── package.json
│
├── backend/                             # Express + Socket.IO scaffold / optional local battle server
│   ├── src/
│   │   ├── routes/                      # Express route modules
│   │   ├── services/                    # Socket, battle, email, audit, analytics, scheduler services
│   │   ├── middlewares/                 # Express middleware
│   │   ├── config/                      # DB, Redis, cache config
│   │   └── index.ts                     # Express server bootstrap
│   ├── prisma/                          # Backend Prisma schema
│   └── package.json
│
├── docs/
│   ├── IMPLEMENTATION_STATUS.md         # What is real now and remaining production work
│   └── PRODUCTION_DEPLOYMENT.md         # Deployment checklist
│
├── docker-compose.yml                   # Full-stack compose scaffold
├── package.json                         # Root metadata
└── README.md                            # GitHub entry document
```

---

## 🧑‍💻 Developer Source Map

Use this section when you are new to the codebase and want to know where each feature lives.

| If You Want To Work On... | Start Here | Related Backend/API |
| --- | --- | --- |
| Home page sections | `frontend/src/app/page.tsx`, `frontend/src/app/HomePage.module.css`, `frontend/src/components/Home` | `/api/platform-stats`, homepage DB queries |
| Global layout | `frontend/src/app/layout.tsx`, `frontend/src/components/layout/Navbar`, `frontend/src/components/layout/Footer` | Clerk provider, SEO metadata |
| Class 9 routes | `frontend/src/app/class-9`, `frontend/src/lib/content/class9`, `frontend/src/lib/curriculum` | `/api/subjects`, `/api/progress`, curriculum repositories |
| Class 10 routes | `frontend/src/app/class-10`, `frontend/src/lib/server/data/subject-plans.ts` | subject/chapter repository helpers |
| Class 11/12 stream routes | `frontend/src/app/class-11`, `frontend/src/app/class-12` | stream-aware subject plan helpers |
| Engineering tracks | `frontend/src/app/engineering`, `frontend/src/lib/constants.ts` | static engineering plan snapshot |
| Chapter practice | `frontend/src/app/class-*/.../[chapter]`, `frontend/src/components/learning` | `/api/progress`, `/api/questions` |
| Deep topic pages | `frontend/src/app/class-9/[subject]/[chapter]/[topicSlug]` | `frontend/src/lib/content/class9/science` |
| Physics simulations | `frontend/src/components/physics`, `frontend/src/components/simulations` | mostly client-side simulation logic |
| Dashboard | `frontend/src/app/dashboard/DashboardClient.tsx` | `/api/dashboard`, `/api/wallet`, `/api/levels`, `/api/activity`, `/api/achievements` |
| Battle lobby | `frontend/src/app/battle/BattleClient.tsx` | `/api/battle/history`, `/api/battle/matchmaking`, `/api/wallet` |
| Battle room | `frontend/src/app/battle/[matchId]/page.tsx` | optional `backend/src/services/socket.service.ts` |
| Community | `frontend/src/app/community` | `/api/community`, `/api/community/posts` |
| Events | `frontend/src/app/events`, `frontend/src/lib/events/event-catalog.ts` | `/api/events`, `/api/events/register`, `/api/events/host-application` |
| Admin host reviews | `frontend/src/app/admin/host-applications` | `/api/admin/host-applications` |
| Auth | `frontend/src/app/sign-in`, `frontend/src/app/sign-up`, `frontend/src/lib/server/auth` | Clerk, `/api/auth/*` |
| Database migrations | `frontend/src/lib/server/database/migrations` | `npm run db:migrate` |
| Repository layer | `frontend/src/lib/server/repositories` | JSON adapter and PostgreSQL adapter |
| Runtime health | `frontend/src/lib/server/observability` | `/api/health`, `/api/readiness` |
| SEO | `frontend/src/app/sitemap.ts`, `frontend/src/app/robots.ts`, `frontend/src/lib/server/seo` | schema generators and internal linker |

### Ownership Rules

- Page-specific UI stays inside that page folder.
- Shared UI belongs in `frontend/src/components`.
- Server-only code belongs in `frontend/src/lib/server`.
- Production database changes require a new numbered SQL migration.
- Do not place secrets, database access, or server-only helpers inside client components.

---

## 🔌 API Surface

The live HTTP API is implemented in `frontend/src/app/api`.

| API Route | Purpose |
| --- | --- |
| `/api/health` | Liveness check and safe backend snapshot. |
| `/api/readiness` | Production readiness gate; can return `503` when config/migrations/adapters are not ready. |
| `/api/auth/sign-in` | Legacy email/password sign-in. |
| `/api/auth/sign-up` | Legacy email/password account creation. |
| `/api/auth/sign-out` | Session cleanup. |
| `/api/auth/me` | Current user lookup. |
| `/api/auth/change-password` | Password change flow for compatible accounts. |
| `/api/dashboard` | Signed-in dashboard snapshot. |
| `/api/wallet` | Stars wallet balance and paginated transaction history. |
| `/api/levels` | Level threshold data. |
| `/api/activity` | Activity graph data. |
| `/api/achievements` | Achievement definitions and earned state. |
| `/api/progress` | Overall learning progress. |
| `/api/progress/answers` | Answer persistence, score updates, XP/Stars rewards, streak updates, and wallet transaction creation. |
| `/api/progress/chapters/[chapterId]` | Chapter progress updates, slug-based progress persistence, score-based level awards, and completion state. |
| `/api/questions` | Question access with filtering and pagination support. |
| `/api/subjects` | Subject catalog. |
| `/api/subjects/[slug]/chapters` | Chapters by subject. |
| `/api/content/subjects` | Content subject list for battle and learning surfaces. |
| `/api/classes` | Class catalog data. |
| `/api/battle/matchmaking` | Create battle matchmaking ticket. |
| `/api/battle/history` | Battle history and stats. |
| `/api/battles` | Battle compatibility/statistics route. |
| `/api/leaderboard` | Ranking data. |
| `/api/community` | Community overview. |
| `/api/community/posts` | Community post list and creation. |
| `/api/community/posts/[id]` | Community post detail. |
| `/api/events` | Events catalog and user registration state. |
| `/api/events/register` | Event registration. |
| `/api/events/host-application` | Institution host application submission. |
| `/api/admin/host-applications` | Admin host-application list. |
| `/api/admin/host-applications/[id]` | Admin review/update for one application. |
| `/api/search` | Search across platform entities. |
| `/api/notifications` | Notification feed; PATCH can mark notifications as read. |
| `/api/profile` | Profile data. |
| `/api/contact` | Contact form endpoint backed by `eduquest_contact_submissions`. |
| `/api/platform-stats` | Platform statistics. |
| `/api/users` and `/api/users/me` | User endpoints; `/api/users/me` supports profile/track updates. |

---

## 🗄️ Data And Persistence

EduQuest has a DB-first production design with local-friendly fallback behavior.

### Production Source Of Truth

- SQL migrations live in `frontend/src/lib/server/database/migrations`.
- The migration runner is `frontend/src/lib/server/database/migrations/run-migrations.ts`.
- Current migrations run from `001_initial_platform.sql` through `021_chapter_milestones.sql`.
- Migration checksum tracking is part of the readiness system.
- Production deployments must run `npm run db:migrate` from `frontend/`.

### Runtime Adapters

| Adapter | Use Case |
| --- | --- |
| `EDUQUEST_PERSISTENCE_ADAPTER=json` | Local single-process preview only. Not safe for production or multi-instance deployments. |
| `EDUQUEST_PERSISTENCE_ADAPTER=postgres` | Required for production and any real shared environment. |
| `EDUQUEST_RATE_LIMIT_ADAPTER=memory` | Local development fallback. |
| `EDUQUEST_RATE_LIMIT_ADAPTER=redis` | Required for production/multi-instance rate limiting. |

### Important Data Policy

- Static fallback content is allowed only for development/local preview.
- Strict production mode should use PostgreSQL data only.
- Demo seed data is blocked in production unless `EDUQUEST_ALLOW_DEMO_SEED=true` is intentionally set for an approved staging/demo database.
- Prisma schemas exist as optional tooling, but the current production schema authority is the numbered SQL migration folder.

---

## 🔐 Authentication

EduQuest currently supports two auth paths:

| Auth Path | Role |
| --- | --- |
| **Clerk** | Primary auth path for hosted sessions and Google/new-account login. Protected pages use Clerk middleware. |
| **Legacy signed session cookie** | Local/legacy email-password fallback used by `/api/auth/sign-in` and `/api/auth/sign-up` when enabled. |

Protected route families include:

- `/dashboard`
- `/profile`
- `/wallet`
- `/settings`
- `/notifications`
- `/admin`

Public learning pages remain accessible so students can preview content before signing in.

---

## ⚙️ Local Setup

### Prerequisites

- Node.js `20+`
- npm
- PostgreSQL `16+` if running DB-backed mode
- Redis `7+` if testing distributed rate limiting or production-like readiness
- Clerk project keys if testing Clerk sign-in/sign-up

### 1. Clone The Repository

```bash
git clone <your-repo-url>
cd eduquest
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Create Environment File

```bash
cp .env.example .env.local
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Important: `frontend/.env.example` is a production/staging checklist, so it defaults to PostgreSQL/Redis-style settings. For the fastest local preview, replace those values with:

```env
NODE_ENV=development
EDUQUEST_PERSISTENCE_ADAPTER=json
EDUQUEST_RATE_LIMIT_ADAPTER=memory
EDUQUEST_ALLOW_STATIC_FALLBACKS=true
EDUQUEST_SESSION_SECRET=local-development-secret-change-before-production-12345
```

For PostgreSQL-backed local development, use:

```env
NODE_ENV=development
EDUQUEST_PERSISTENCE_ADAPTER=postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/eduquest
EDUQUEST_RATE_LIMIT_ADAPTER=memory
EDUQUEST_ALLOW_STATIC_FALLBACKS=true
EDUQUEST_SESSION_SECRET=local-development-secret-change-before-production-12345
```

Clerk note: the app mounts `ClerkProvider` and Clerk middleware globally. For a normal local run, create a Clerk development project and add these keys. Legacy email/password auth supplements server API sessions, but it does not remove the global Clerk provider requirement.

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 4. Run Database Migrations

Only needed when using PostgreSQL mode.

```bash
cd frontend
npm run db:migrate
```

Optional local seed:

```bash
npm run db:seed
```

Do not seed production unless you intentionally set `EDUQUEST_ALLOW_DEMO_SEED=true` for a staging/demo database.

### 5. Start The Next.js App

```bash
cd frontend
npm run dev
```

Open:

```txt
http://localhost:3000
```

For Replit-style/local preview on port `5000`:

```bash
cd frontend
npm run dev -- --port 5000
```

Open:

```txt
http://localhost:5000
```

### 6. Optional: Run The Express / Socket.IO Backend

Use this only when working on the top-level Express server or Socket.IO battle-room transport.

```bash
cd backend
npm install
npm run dev
```

Default backend URL:

```txt
http://localhost:4000
```

If testing battle rooms from the frontend, set:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

### 7. Verify Health

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/readiness
```

In development, readiness can be `degraded` when PostgreSQL, Redis, or strong production secrets are not configured. In production, those same missing pieces become blockers.

---

## 🔑 Environment Variables

### Frontend / Next.js Runtime

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | Yes | `development`, `production`, or `test`. |
| `EDUQUEST_SESSION_SECRET` | Production yes | Strong 32+ character session signing secret. |
| `EDUQUEST_PERSISTENCE_ADAPTER` | Production yes | `json` for local only, `postgres` for production. |
| `DATABASE_URL` | PostgreSQL mode | PostgreSQL connection string. |
| `POSTGRES_POOL_MAX` | Optional | PostgreSQL pool max size. |
| `POSTGRES_IDLE_TIMEOUT_MS` | Optional | PostgreSQL idle timeout. |
| `POSTGRES_CONNECT_TIMEOUT_MS` | Optional | PostgreSQL connection timeout. |
| `POSTGRES_SSL` | Optional | Enables SSL for PostgreSQL connections. |
| `POSTGRES_SSL_REJECT_UNAUTHORIZED` | Optional | Controls SSL certificate validation. |
| `EDUQUEST_RATE_LIMIT_ADAPTER` | Production yes | `memory` for local, `redis` for production. |
| `REDIS_URL` | Redis mode | Redis connection string. |
| `REDIS_CONNECT_TIMEOUT_MS` | Optional | Redis connection timeout. |
| `EDUQUEST_RATE_LIMIT_FAIL_OPEN` | Optional | Keep false/unset in production for sensitive routes. |
| `EDUQUEST_ALLOW_STATIC_FALLBACKS` | Optional | Allows static fallback data. Should be disabled for public production. |
| `EDUQUEST_STRICT_DATA_MODE` | Optional | Forces strict production-style data behavior. |
| `EDUQUEST_ALLOW_DEMO_SEED` | Optional | Allows demo seed only for approved staging/demo DBs. |
| `EDUQUEST_ENABLE_LEGACY_AUTH` | Optional | Enables legacy email/password session fallback. |
| `EDUQUEST_COOKIE_SECURE` | Optional | Controls secure cookie behavior. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical site URL for SEO helpers. |
| `NEXT_PUBLIC_API_URL` | Optional | Public API URL when using split deployments. |
| `NEXT_PUBLIC_SOCKET_URL` | Battle rooms | Socket.IO backend URL. Defaults to `http://localhost:4000`. |
| `LOG_LEVEL` | Optional | Runtime logger level. |

### Clerk Auth

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Normal app run | Public Clerk key used by the global `ClerkProvider`. |
| `CLERK_SECRET_KEY` | Auth/protected APIs | Server-side Clerk secret used by API auth resolution. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Optional | Sign-in route, usually `/sign-in`. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Optional | Sign-up route, usually `/sign-up`. |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Optional | Redirect after sign in, usually `/dashboard`. |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Optional | Redirect after sign up, usually `/dashboard`. |

### Optional Express Backend

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | Optional | Express backend port, default `4000`. |
| `DATABASE_URL` | Backend DB mode | PostgreSQL connection string. |
| `REDIS_URL` | Optional | Redis for backend cache/rate limits/socket scaling. |
| `JWT_SECRET` | Backend auth | Access-token signing secret. |
| `REFRESH_SECRET` / `JWT_REFRESH_SECRET` | Backend auth | Refresh-token signing secret. |
| `FRONTEND_URL` | CORS | Allowed frontend origin. |

---

## 🧩 Configuration Profiles

Use these profiles as mental models when choosing environment variables.

### Profile A: Fast Local Preview

Best for quickly opening the UI and public routes.

```env
NODE_ENV=development
EDUQUEST_PERSISTENCE_ADAPTER=json
EDUQUEST_RATE_LIMIT_ADAPTER=memory
EDUQUEST_ALLOW_STATIC_FALLBACKS=true
EDUQUEST_SESSION_SECRET=local-development-secret-change-before-production-12345
```

Notes:

- No PostgreSQL required.
- No Redis required.
- Protected Clerk pages still need Clerk development keys.
- Not suitable for real users or multiple server instances.

### Profile B: Local PostgreSQL Development

Best for testing migrations, dashboard data, progress, events, community, and production-like APIs.

```env
NODE_ENV=development
EDUQUEST_PERSISTENCE_ADAPTER=postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/eduquest
EDUQUEST_RATE_LIMIT_ADAPTER=memory
EDUQUEST_ALLOW_STATIC_FALLBACKS=true
EDUQUEST_SESSION_SECRET=local-development-secret-change-before-production-12345
```

Then run:

```bash
cd frontend
npm run db:migrate
```

### Profile C: Production App

Best for public deployment.

```env
NODE_ENV=production
EDUQUEST_PERSISTENCE_ADAPTER=postgres
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/eduquest?sslmode=require
EDUQUEST_RATE_LIMIT_ADAPTER=redis
REDIS_URL=redis://USER:PASSWORD@HOST:6379
EDUQUEST_SESSION_SECRET=replace-with-strong-32-plus-character-secret
EDUQUEST_ALLOW_STATIC_FALLBACKS=false
```

Production should pass `/api/readiness` before public traffic.

### Profile D: Battle Room Development

Best for testing the optional Socket.IO battle-room transport.

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

Run both:

```bash
cd frontend
npm run dev
```

```bash
cd backend
npm run dev
```

Remember: this battle-room transport is scaffolded/experimental until Redis-backed production matchmaking and live-room orchestration are completed.

---

## 🧪 Useful Scripts

Run these from `frontend/` unless noted.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js development server. |
| `npm run dev -- --port 5000` | Start Next.js on port `5000`. |
| `npm run build` | Create production Next.js build. |
| `npm run start` | Start production Next.js server after build. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Run TypeScript check with `tsc --noEmit`. |
| `npm run db:migrate` | Run production SQL migrations. |
| `npm run db:seed` | Seed local/staging demo data. |
| `npm run assets:route-heroes` | Generate route hero assets. |

Run these from `backend/` only when working on the optional Express backend:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Express backend with TypeScript. |
| `npm run dev:watch` | Start Express backend with Nodemon. |
| `npm run build` | Compile backend TypeScript. |
| `npm run start` | Run compiled backend from `dist/`. |
| `npm run seed` | Run backend seed script. |
| `npm run db:migrate` | Run Prisma migrate for backend schema. |
| `npm run db:push` | Push Prisma schema. |
| `npm run db:studio` | Open Prisma Studio. |

---

## 🧪 Testing And Quality Gates

Automated test coverage is still a future production-hardening item. Today, use the checks that are actually configured in the repository.

### Current Frontend Checks

```bash
cd frontend
npm run typecheck
npm run lint
npm run build
```

### Current Backend Checks

```bash
cd backend
npm run build
npm run test
```

`backend/npm run test` currently reports that tests are not configured and exits successfully. The root `package.json` is metadata-only and its `test` script intentionally fails, so run checks from `frontend/` and `backend/` directly.

### Recommended Manual Smoke Tests

- Home page loads.
- Public class pages load.
- Subject and chapter routes load.
- Sign-in/sign-up route renders with Clerk keys.
- Dashboard redirects correctly when signed out.
- `/api/health` returns a JSON response.
- `/api/readiness` explains all local blockers.
- Community feed loads and protected post creation asks for auth.
- Events page loads and protected registration asks for auth.
- Battle lobby loads and wager gate behaves by level.

### Planned Automated Suites

- API route tests for auth, progress, dashboard, events, community, wallet, notifications, and search.
- Repository adapter tests for JSON and PostgreSQL implementations.
- Migration checksum and rollback safety tests.
- Accessibility tests for key pages.
- Browser-flow tests for sign-in, dashboard, learning, community, events, and battle lobby.
- Socket.IO integration tests for live battle rooms once the production battle transport is finalized.

---

## 🛡️ Security Performance And Accessibility

### Security Posture

- Clerk is the primary auth layer for protected routes.
- Legacy signed HTTP-only sessions exist for local/legacy email-password flows.
- Protected route families are enforced through Clerk middleware.
- Same-origin guards protect sensitive mutation routes.
- Rate limiting supports memory mode locally and Redis mode in production.
- Production requires a strong `EDUQUEST_SESSION_SECRET`.
- Audit-log contracts avoid storing passwords, raw tokens, or full sensitive request bodies.
- Static fallback data is blocked in strict production mode so missing database data is visible.
- Demo seed data is blocked in production unless explicitly allowed for an approved staging/demo database.
- Next.js security headers disable framework disclosure, prevent MIME sniffing, restrict browser permissions, and set a safer referrer policy.

### Privacy And Student Data Notes

- Do not commit `.env`, Clerk secrets, database URLs, Redis URLs, session secrets, or production logs.
- Do not store raw passwords; auth helpers use hashing/session abstractions.
- Do not put student secrets or raw request bodies into audit metadata.
- Use managed PostgreSQL backups before production migration changes.
- Add a public `SECURITY.md` before a public open-source release so security reports have a clear path.

### Performance Posture

- Next.js App Router supports server components, metadata, ISR, and route-level loading boundaries.
- Home stats are revalidated instead of fetched on every client render.
- Heavy interactive surfaces use client boundaries and loading skeletons.
- Next Image is configured for local images, Unsplash, AVIF, WebP, responsive breakpoints, and cache TTL.
- PostgreSQL pool settings are configurable through environment variables.
- Redis is planned for live counters, battle queues, and distributed hot paths beyond rate limiting.

### Accessibility Posture

- Route-level pages use semantic headings, buttons, links, and form labels in most surfaces.
- Loading skeletons reduce layout jumps on dashboard, leaderboard, battle, community, and events routes.
- Icon buttons and visual states are paired with text in major workflows.
- Future accessibility work should add automated checks, keyboard-flow audits, color-contrast audits, and screen-reader smoke tests.

---

## 🌍 Deployment Options

### Recommended Current Path: Next.js App Deployment

Deploy `frontend/` as the main app. This is the path aligned with the active production HTTP API.

Recommended services:

- Vercel, Netlify, Render, Railway, Fly.io, or a Node-capable VPS.
- Managed PostgreSQL for production data.
- Managed Redis for production rate limiting.
- Clerk for hosted authentication.

Deployment steps:

1. Set the project root to `frontend/` in the hosting provider.
2. Configure all production environment variables.
3. Run `npm run db:migrate` before public traffic reaches a fresh database.
4. Build with `npm run build`.
5. Verify `/api/health` and `/api/readiness`.

### Optional Split Deployment

Use this only when battle-room Socket.IO work requires the top-level Express backend.

| Service | Suggested Runtime | Notes |
| --- | --- | --- |
| Web app | `frontend/` Next.js | Main UI and current production HTTP API. |
| Socket backend | `backend/` Express + Socket.IO | Optional battle transport server. |
| Database | PostgreSQL | Must align schema before public backend deployment. |
| Cache | Redis | Needed for distributed rate limits and future matchmaking queues. |

### Docker Compose Note

`docker-compose.yml` describes a full-stack shape, but the current repo is missing `frontend/Dockerfile`. Treat Compose as a deployment scaffold until that Dockerfile and the frontend container path are finalized.

---

## 🚢 Production Checklist

Before sending real learners to the platform:

1. Set `NODE_ENV=production`.
2. Set a strong `EDUQUEST_SESSION_SECRET`.
3. Set `EDUQUEST_PERSISTENCE_ADAPTER=postgres`.
4. Configure `DATABASE_URL`.
5. Run `npm run db:migrate` from `frontend/`.
6. Set `EDUQUEST_RATE_LIMIT_ADAPTER=redis`.
7. Configure `REDIS_URL`.
8. Disable public static fallback data unless intentionally approved.
9. Confirm `/api/readiness` returns `ready`.
10. Smoke test sign-up, sign-in, dashboard, class pages, chapter practice, battle lobby, community, events, search, profile, wallet, and notifications.
11. Run quality gates:

```bash
cd frontend
npm run typecheck
npm run lint
npm run build
```

Optional backend checks:

```bash
cd backend
npm run build
```

---

## ✅ Release Readiness Matrix

Use this matrix before treating the project as public-production ready.

| Area | Local Preview | Staging | Public Production |
| --- | --- | --- | --- |
| Frontend build | Recommended | Required | Required |
| Typecheck | Recommended | Required | Required |
| Lint | Recommended | Required | Required |
| PostgreSQL | Optional | Required | Required |
| SQL migrations | Optional in JSON mode | Required | Required |
| Redis rate limit | Optional | Recommended | Required |
| Clerk keys | Required for normal auth UI | Required | Required |
| Strong session secret | Recommended | Required | Required |
| Static fallbacks | Allowed | Optional with caution | Disabled |
| Demo seed | Allowed locally | Only approved staging | Blocked |
| `/api/health` | Should respond | Must respond | Must respond |
| `/api/readiness` | Can be degraded | Should be ready | Must be ready |
| Docker Compose | Scaffold only | Scaffold only | Not official until frontend Dockerfile exists |
| Automated tests | Planned | Add before major release | Required before scale |
| Battle live rooms | Scaffold/experimental | Validate carefully | Needs production hardening |

---

## 🧯 Troubleshooting

| Problem | Likely Cause | Fix |
| --- | --- | --- |
| App starts but dashboard does not load | Missing Clerk keys, missing DB, or auth provisioning issue | Check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL`, and `/api/readiness`. |
| `/api/readiness` returns `degraded` locally | Production dependencies are not configured in development | This is okay for local preview. Use PostgreSQL + Redis to test production-like readiness. |
| `/api/readiness` returns `blocked` in production | Required production env, migrations, PostgreSQL, Redis, or strong secret is missing | Read the `blockers` array in the JSON response and fix each item. |
| PostgreSQL adapter fails | `DATABASE_URL` missing, wrong SSL config, DB offline, or migrations not applied | Verify connection string, `POSTGRES_SSL`, and run `npm run db:migrate`. |
| Static fallback data appears in production | `EDUQUEST_ALLOW_STATIC_FALLBACKS=true` or strict mode not configured correctly | Disable fallback data before public production traffic. |
| Event/community/profile APIs return empty data | Database not seeded or migrations incomplete | Run migrations and seed only on local/staging where allowed. |
| Battle room cannot connect | Socket server not running or `NEXT_PUBLIC_SOCKET_URL` wrong | Start `backend/` and set `NEXT_PUBLIC_SOCKET_URL=http://localhost:4000`. |
| Wager buttons are locked | User level is below 10 | Use free battle mode or level up the account. |
| Docker Compose fails for frontend | `frontend/Dockerfile` is not present | Add a frontend Dockerfile or deploy `frontend/` directly. |
| Git warns about line endings on Windows | CRLF/LF conversion setting | Usually safe; normalize with `.gitattributes` if the team wants strict line endings. |

---

## 📝 Current Notes

- Root `README.md` is what GitHub shows automatically on the repository landing page.
- The root `package.json` is currently metadata-only. Use `frontend/package.json` and `backend/package.json` for real development scripts.
- The current production HTTP backend lives in `frontend/src/app/api` and `frontend/src/lib/server`.
- The top-level `backend/` package is useful but should be treated as Express/Socket.IO scaffold until its auth, deployment story, and schema are reconciled with the active `eduquest_*` SQL migrations.
- `docker-compose.yml` exists as a full-stack scaffold, but the current repository does not include `frontend/Dockerfile`; verify or add that Dockerfile before relying on compose for deployment.
- Prisma is present in both frontend and backend packages, but current production database authority is the numbered SQL migration system under `frontend/src/lib/server/database/migrations`.
- Local JSON persistence is only for development previews. Do not use it for multi-instance production traffic.
- Public class/chapter pages are intentionally accessible without sign-in; dashboard, account, wallet, notifications, and admin routes are protected.
- Automated test coverage is not fully configured yet; current quality gates are typecheck, lint, build, readiness checks, and browser/API smoke tests.
- Battle rooms currently have client/server scaffolding and optional Socket.IO transport code. Production-grade Redis-backed matchmaking and live-room orchestration are still future work.
- Some achievement unlock logic, notification real-time delivery, and cloud upload storage are intentionally future-facing.
- If a smaller docs file conflicts with this README, treat the README as the most detailed onboarding guide and sync the smaller docs before release.

---

## 🗂️ Documentation Map

| Document | Purpose |
| --- | --- |
| `README.md` | Main GitHub-facing project overview and setup guide. |
| `docs/IMPLEMENTATION_STATUS.md` | Current implementation status and known remaining production work. |
| `docs/PRODUCTION_DEPLOYMENT.md` | Production environment, migration, and release checklist. |
| `frontend/README.md` | Frontend ownership rules. |
| `backend/README.md` | Backend boundary note and warning about Express scaffold status. |
| `frontend/src/app/README.md` | App Router ownership notes. |
| `frontend/src/app/api/README.md` | API route-handler conventions. |
| `frontend/src/lib/server/database/README.md` | Database folder ownership and production notes. |
| `frontend/src/lib/server/database/PRODUCTION_DATA_POLICY.md` | Production schema authority and fallback-data policy. |
| `frontend/src/lib/server/database/migrations/README.md` | SQL migration naming and safety rules. |
| `frontend/src/lib/server/repositories/README.md` | Storage abstraction and adapter notes. |
| `frontend/src/lib/server/cache/README.md` | Redis/cache ownership and production scaling notes. |
| `frontend/src/lib/server/observability/README.md` | Runtime diagnostics ownership. |
| `frontend/src/components/README.md` | Shared component ownership. |
| `frontend/src/components/gamification/README.md` | Gamification component notes. |
| `frontend/src/hooks/README.md` | Browser hook ownership. |
| `frontend/src/store/README.md` | Zustand store ownership. |

---

## 🛣️ Future Work

### Battle And Real-Time Systems

- Production-harden real-time battle rooms.
- Add Redis-backed matchmaking queues and live room coordination.
- Persist full battle result history from Socket.IO rooms.
- Add reconnection recovery tests for live battles.
- Expand anti-cheat signals and audit trails.
- Add WebSocket/SSE notification delivery instead of polling-only flows.

### Learning And Assessment

- Add more complete chapter content for Class 10-12.
- Expand topic-level deep-study pages beyond Class 9 Science.
- Add full mock exam mode to the Test Center.
- Add safe-browser/proctored assessment flows.
- Add more YouTube hint URLs and rich explanations.
- Add in-browser code execution through a secure judge such as Judge0 or Piston.

### Platform And Scale

- Add background workers for emails, notification fanout, certificates, reminders, and scheduled jobs.
- Move future live counters and leaderboard hot paths to Redis where appropriate.
- Add automated API, repository, accessibility, and browser-flow tests.
- Add WebP/AVIF variants for all route-owned hero assets.
- Decide whether Prisma remains optional tooling or becomes the primary data-access layer.
- Add production Dockerfile for the frontend if Docker Compose becomes the official deployment path.
- Sync `docs/PRODUCTION_DEPLOYMENT.md` with the root README whenever deployment commands change.

### Product Experience

- Improve moderation tools for community posts.
- Add richer profile customization and wallet marketplace items.
- Add certificate generation for events and hackathons.
- Add parent/teacher visibility dashboards.
- Add school/college partner APIs.
- Add PWA/offline study support.
- Add cloud object storage for uploads, such as S3-compatible storage.
- Add repository polish files such as `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`, issue templates, and pull-request templates before a public open-source launch.

---

## 🤝 Contributing

When adding new work:

- Keep route-specific styles inside the route folder.
- Keep shared UI in `frontend/src/components`.
- Keep server-only logic in `frontend/src/lib/server`.
- Add SQL migrations for production database changes.
- Avoid editing already-applied migrations; create a new numbered migration instead.
- Keep sensitive data out of logs, audit metadata, screenshots, and committed files.
- Run typecheck, lint, build, and relevant smoke tests before opening a PR.

### Suggested Branch Naming

```txt
codex/<short-feature-name>
feature/<short-feature-name>
fix/<short-bug-name>
docs/<short-doc-change>
```

### Pull Request Checklist

- Explain what changed and why.
- Include screenshots or short clips for UI changes.
- Mention affected routes and API endpoints.
- Mention new environment variables.
- Include migration notes when database schema changes.
- Confirm `cd frontend && npm run typecheck`.
- Confirm `cd frontend && npm run lint`.
- Confirm `cd frontend && npm run build`.
- Confirm relevant manual smoke tests.
- Confirm no secrets, local logs, generated build folders, or `.env` files were committed.
- Update this README or related docs when setup, deployment, routes, or architecture change.

---

## 📄 License

This repository is currently marked as `ISC` in the root and package manifests, but a standalone `LICENSE` file is not present yet. Add one before a public open-source release or replace this section with the correct private/commercial license text.

---

<div align="center">

Built for students who want structure, momentum, and a little competitive fire in their daily learning.

</div>
