# EDUBATTLE — MASTER CONTENT PLAN (MCP)
## Gamified Educational Battle Platform for Class 9–12 & Engineering Programming

---

> **Document Version:** 3.0 — Ultra Detailed Master Plan
> **Project Name:** EduBattle
> **Target Audience:** Indian Students (Class 9–12, Engineering)
> **Backend Language:** TypeScript with Node.js
> **Frontend Framework:** SvelteKit
> **Document Language:** English
> **No Code in This Document — Only Plans, Descriptions, and Specifications**

---

# TABLE OF CONTENTS

1. Project Overview & Vision
2. Core Philosophy & Design Principles
3. Complete Technology Stack
4. Libraries, Tools & Dependencies
5. Full Folder & File Structure
6. Pages & Their Detailed Descriptions
7. Home Page — Complete Detail
8. Sign In & Sign Up Pages
9. Dashboard Page — Complete Detail
10. Class 9th Page & All Subjects
11. Class 10th Page & All Subjects
12. Class 11th Page & All Subjects
13. Class 12th Page & All Subjects
14. Engineering Page & All Programming Languages
15. C Language — 30 Day Plan (Full Detail)
16. C++ Language — 30 Day Plan (Full Detail)
17. Python Language — 45 Day Plan (Full Detail)
18. Java Language — 45 Day Plan (Full Detail)
19. JavaScript Language — 30 Day Plan (Full Detail)
20. TypeScript language — 40 Day Plan (Full Detail)
21. Rust Language — 40 Day Plan (Full Detail)
22. Kotlin Language — 30 Day Plan (Full Detail)
23. Swift Language — 30 Day Plan (Full Detail)
24. TypeScript Language — 25 Day Plan (Full Detail)
25. SQL & Database Language — 20 Day Plan
26. Data Structures & Algorithms (DSA) — 60 Day Plan
27. Test Page — Complete Detail
28. Gamification System — Complete Detail
29. Matchmaking System — Complete Detail
30. Community Page — Complete Detail
31. Events Portal — Complete Detail
32. Wallet & Sparks System — Complete Detail
33. Monetization Model — Complete Detail
34. Anti-Cheat & Security System
35. Sound Effects & Audio System
36. YouTube Integration — Help Links System
37. Animations & UI Effects System
38. Database Schema — Complete Detail
39. API Endpoints — Complete Detail
40. Admin Panel — Complete Detail
41. Notification System
42. Search & Filtering System
43. Performance & Optimization Strategy
44. Deployment & Infrastructure
45. Security Architecture
46. Analytics & Reporting System
47. Mobile Responsiveness Plan
48. Accessibility Plan
49. Internationalization & Localization
50. Future Roadmap & Feature Pipeline
51. Class 9 Maths — Chapter-by-Chapter Question Bank Specification
52. Class 9 Science — Chapter-by-Chapter Question Bank Specification
53. Class 10 Maths — Chapter-by-Chapter Question Bank Specification
54. Class 10 Science — Chapter-by-Chapter Question Bank Specification
55. Class 11 Physics — Chapter-by-Chapter Question Bank Specification
56. Class 11 Chemistry — Chapter-by-Chapter Question Bank Specification
57. Class 12 Physics — Chapter-by-Chapter Question Bank Specification
58. Class 12 Chemistry — Chapter-by-Chapter Question Bank Specification
59. C Language — All 30 Days — Full Subtopic & Question Breakdown
60. Python — All 45 Days — Full Subtopic & Question Breakdown

---

# 1. PROJECT OVERVIEW & VISION

## 1.1 What is EduBattle?

EduBattle is a gamified educational learning platform built for Indian students from Class 9 to Class 12 and Engineering students learning programming languages. It combines the excitement of real-time competitive battles (inspired by BGMI — Battlegrounds Mobile India), the consistency tracking of LeetCode and GitHub streaks, and the structured learning of CBSE curriculum into one single modern, minimal, and highly engaging web application.

Students come to EduBattle to:
- Study CBSE subjects chapter by chapter
- Follow structured day-by-day programming language plans
- Battle real opponents in real-time on any subject or chapter
- Earn points, level up, maintain streaks
- Participate in college-hosted coding events
- Engage in a community of fellow learners

EduBattle is not just another study platform. It is a learning battlefield where knowledge is your weapon and your level is your rank. Every session on EduBattle feels like a game — and that is exactly by design.

## 1.2 The Core Problem Being Solved

In India, millions of students struggle with:
- Boring, non-interactive study methods that lead to disengagement
- Lack of motivation to study consistently every day
- No real-time competitive element in education — no way to test yourself against peers
- Difficulty finding quality resources for CBSE subjects and programming
- No platform that rewards learning with tangible progress and virtual rewards
- No safe, structured environment for colleges to host coding competitions

EduBattle solves all of these problems simultaneously by making education feel like a game — where you earn points, level up, battle opponents, maintain streaks, and even win Sparks (virtual currency) through demonstrated skill.

## 1.3 Platform Goals

The primary goals of EduBattle as a platform:

Goal 1 — Make learning addictive and enjoyable through gamification
Goal 2 — Create a competitive environment that motivates daily practice
Goal 3 — Provide structured, day-by-day learning paths for programming languages
Goal 4 — Connect students across India through real-time skill-based battles
Goal 5 — Support colleges in hosting their own coding and subject competitions
Goal 6 — Provide a safe, anti-cheat environment for fair competition
Goal 7 — Build a community where students ask questions, share insights, and grow together
Goal 8 — Create a sustainable business through subscriptions, skill packs, and advertising

## 1.4 Target Users

EduBattle serves multiple distinct user types, each with unique needs:

Class 9 Students:
- Learning core CBSE subjects for the first time at the secondary level
- Need engaging explanations and practice questions
- Benefit most from streak tracking and gamification

Class 10 Students:
- Preparing for their first major board examinations
- Need board-exam style questions and strict practice
- Benefit most from timed tests and battle pressure

Class 11 Students:
- Transitioning to stream-based learning (Science/Commerce/Arts)
- Need comprehensive coverage of new topics
- Benefit from subject-specific communities

Class 12 Students:
- Facing board exams and entrance exams simultaneously
- Need both NCERT and entrance-exam difficulty questions
- Benefit from competitive battles that simulate exam pressure

Engineering Students:
- Want to learn programming languages from scratch
- Need structured day plans with theory and practice
- Benefit most from the events portal for college competitions

Teachers and Educators:
- Monitor student progress via admin-level access
- Create events and practice sets for their students

College Coordinators:
- Host official coding competitions using EduBattle's Events Portal
- Need verified organizer status and anti-cheat tools

## 1.5 Unique Selling Points (USPs)

1. BGMI-Style Matchmaking — Real-time battles between students of the same level and class
2. Structured Day Plans — Detailed 30–60 day plans for each programming language
3. Streak System — Like GitHub and LeetCode, daily consistency is tracked and rewarded
4. Events Portal — Colleges can host their own competitions using EduBattle's infrastructure
5. Sparks Economy — Virtual currency earned through skill that can be used in battles
6. YouTube Help Links — Every single question has a reference YouTube video
7. Anti-Cheat Browser Mode — Competition events run only in a sandboxed, secure environment
8. Minimalist UI — Clean, distraction-free design focused on learning
9. Copy-Paste Prevention — All quiz and battle answers must be typed manually
10. Sound Feedback — Correct and wrong answers have distinct audio cues for reinforcement
11. Community Segmentation — Each class and each programming language has its own community
12. Complete CBSE Coverage — All subjects, all chapters, for all four secondary classes

---

# 2. CORE PHILOSOPHY & DESIGN PRINCIPLES

## 2.1 Design Philosophy

EduBattle follows a minimalist-first approach. Every design decision is guided by these principles:

Clarity over complexity:
Users should never be confused about what to do next. The interface guides them naturally from one action to the next without requiring instructions.

Action over decoration:
Every element on screen serves a purpose. No decorative elements that distract from the primary task of learning and battling.

Progress visibility:
Users should always see how far they have come — their level, streak, XP progress, and completion percentage are always visible.

Reward immediacy:
Points, sounds, and animations confirm every correct action. The reward must come within milliseconds of the action, not seconds.

Mobile-first thinking:
Even though EduBattle is a web application, every component is designed to work perfectly on a 375px wide mobile screen first, then enhanced for tablet and desktop.

## 2.2 Color Philosophy

The EduBattle color palette evokes professionalism, energy, and focus:

Primary Background: Deep dark navy #0D1117 — professional, focused, reduces eye strain during long sessions
Accent Color: Electric blue #58A6FF — energetic, tech-forward, used for CTAs and highlights
Success Color: Bright green #3FB950 — reward signals, correct answers, level up indicators
Danger Color: Vivid red #F85149 — wrong answers, warnings, errors
Warning Color: Amber #D29922 — caution, streaks about to break, approaching deadlines
Text Primary: Off-white #E6EDF3 — easy to read on dark backgrounds
Text Secondary: Muted gray #8B949E — supplementary information
Card Background: Slightly lighter than BG #161B22 — clear content hierarchy
Border Color: Subtle dark border #30363D — separates content without harsh contrast

This color scheme feels like VS Code or GitHub Dark — both extremely familiar to developers and cool for students.

## 2.3 Typography Philosophy

Headings: Space Grotesk or Inter Bold — modern, clean, conveys confidence
Body Text: Inter Regular — one of the most readable fonts ever designed, free via Google Fonts
Code Blocks: JetBrains Mono — professional monospace, makes code beautiful
Numbers and Stats: Roboto Mono — clear digit alignment for scores and levels

Font sizes follow an 8-point grid:
- Display: 48px (hero headlines)
- H1: 36px (page titles)
- H2: 28px (section titles)
- H3: 22px (card titles)
- H4: 18px (subsection titles)
- Body: 16px (default reading size)
- Small: 14px (labels, metadata)
- XSmall: 12px (timestamps, fine print)

## 2.4 Interaction Philosophy

Every click should feel responsive — use micro-animations between 150ms and 300ms.
Buttons should have four states: default, hover, active (pressed), and disabled.
Loading states should always show a skeleton or spinner — a blank page is never acceptable.
Error states should show friendly, actionable messages — not technical error codes.
Success states should celebrate — confetti, sound, animation — the user deserves it.

## 2.5 Spacing Philosophy

EduBattle uses an 8-point spacing system:
- 8px — tiny spacing (between icon and label)
- 16px — standard spacing (padding inside cards)
- 24px — medium spacing (between cards)
- 32px — large spacing (section padding)
- 48px — extra large (major section breaks)
- 64px — section margins on desktop

## 2.6 Component Philosophy

Every component in EduBattle is designed to be:
- Self-contained (no hidden dependencies)
- Reusable (used in at least 2 different places)
- Accessible (keyboard navigable, screen reader friendly)
- Responsive (works at all breakpoints)
- State-aware (knows if user is logged in, their level, their subscription)

---

# 3. COMPLETE TECHNOLOGY STACK

## 3.1 Backend — TypeScript with Node.js

Why TypeScript was chosen over other backend languages:

TypeScript compiles to native machine code making it extremely fast — benchmark tests show TypeScript handles 3–5x more requests per second than Node.js for CPU-bound tasks.

TypeScript's asynchronous workers model makes real-time matchmaking trivial — thousands of battle rooms can run simultaneously without thread overhead.

TypeScript has a strong standard library meaning fewer third-party dependencies and less attack surface.

TypeScript is statically typed, catching an entire class of errors at compile time that dynamic languages miss until production.

TypeScript builds to a deployable server bundle making deployment as simple as copying one file to the server.

TypeScript Version to use: TypeScript 1.22 or newer (to access the new routing improvements in Fastify or NestJS HTTP server)

Key TypeScript architectural patterns used in EduBattle:
- Repository pattern: database queries abstracted behind interfaces
- Service layer: business logic completely separate from HTTP handlers
- Middleware chain: authentication, logging, rate limiting as composable middleware
- Dependency injection: services injected into handlers (no global state)
- Error wrapping: TypeScript 1.13+ errors with context

## 3.2 Frontend — SvelteKit

Why SvelteKit was chosen:

SvelteKit ships zero framework code to the browser — Svelte compiles away at build time. This means EduBattle's frontend loads faster than equivalent React apps.

SvelteKit has built-in SSR (Server Side Rendering) meaning the first page load is fully rendered HTML — critical for SEO and perceived performance.

SvelteKit's file-based routing is intuitive — the folder structure mirrors the URL structure, making development easier.

Svelte's reactivity system is simpler than React's hooks — `$: derivedValue = someComputation` is all you need for reactive derived state.

Svelte animations via `svelte/transition` and `svelte/animate` are built-in and performant without any additional libraries.

SvelteKit Version: 2.x with Svelte 5 (Runes API)

## 3.3 Database — PostgreSQL

Why PostgreSQL:

PostgreSQL is the most feature-rich open-source relational database. For EduBattle specifically:
- ACID compliance is critical for Sparks wallet transactions — money must never be lost
- JSON/JSONB columns allow flexible storage for question options without schema migration
- Full-text search replaces the need for a separate search service at smaller scale
- Triggers allow automatic streak recalculation without application logic
- Partitioning on the user_answers table handles billions of rows gracefully

PostgreSQL Version: 16 (latest stable)

Key PostgreSQL extensions:
- pg_cron: scheduled jobs for daily streak reset, weekly leaderboard calculation
- pg_stat_statements: query performance monitoring
- uuid-ossp: UUID generation

## 3.4 Caching & Real-Time — Redis

Why Redis:

Redis runs in memory making it orders of magnitude faster than PostgreSQL for:
- Matchmaking queues: new users enter a queue, Redis pops them out for matching
- Leaderboards: sorted sets update in O(log n) and return top N in O(log n + N)
- Session storage: user tokens cached for fast authentication middleware
- Rate limiting: atomic INCR operations for per-IP request counting

Redis Version: 7.x

Redis data structure mapping:
- Matchmaking queues: LIST with LPUSH (add to queue) and RPOP (take from queue)
- Live leaderboards: ZSET (sorted set) with user_id as member and XP as score
- Battle rooms: HASH with all battle state fields
- Rate limit counters: STRING with INCR and EXPIRE
- Battle result pub/sub: PUBLISH/SUBSCRIBE channels

## 3.5 Real-Time Communication — WebSockets

WebSockets allow the server to push data to connected clients without polling. In EduBattle:

Every battle uses a persistent WebSocket connection:
- Player joins battle → connects to WebSocket server at /ws/battles/:battleId
- Battle questions are pushed via WebSocket (not HTTP polling)
- Answer submissions travel via WebSocket for sub-100ms round-trip
- Opponent's score updates arrive via WebSocket instantly when they answer
- Battle end result is pushed via WebSocket — no need to refresh

The WebSocket hub in TypeScript manages all active connections:
- A map of battleId to a list of connected players
- Each player's connection is a asynchronous workers with a channel
- Messages are sent to the channel and the asynchronous workers writes to the WebSocket
- If a write fails: connection is dead, asynchronous workers cleans up

## 3.6 Search — MeiliSearch

MeiliSearch is an open-source search engine that EduBattle runs self-hosted.

What gets indexed in MeiliSearch:
- Community posts (title and body)
- Questions (question text)
- Events (name and description)
- Chapters and topics (names)

MeiliSearch is chosen over Elasticsearch because:
- Zero-config typo tolerance (searches for "plynomial" still find "polynomial")
- Very fast — returns results in under 50ms even on large datasets
- Simple HTTP API — no complex query DSL
- Open source and self-hostable — no per-request cost

## 3.7 File Storage — MinIO or Cloudflare R2

For user avatars, event banners, and certificate PDFs.

MinIO is used in development (self-hosted S3-compatible storage).
Cloudflare R2 is used in production (S3-compatible, no egress fees).

Objects stored:
- avatars/userId/avatar.webp — user profile pictures
- events/eventId/banner.webp — event banners
- certificates/eventId/userId/certificate.pdf — completion certificates

## 3.8 Payment — Razorpay

Razorpay is India's leading payment gateway supporting:
- UPI: Google Pay, PhonePe, Paytm, BHIM
- Debit Cards: Visa, Mastercard, RuPay
- Credit Cards: All major networks
- Net Banking: All major Indian banks
- Wallets: Razorpay Wallet, Mobikwik

Razorpay is used for:
- ₹200/month premium subscription (recurring billing)
- ₹100 Skill Pack (one-time purchase)
- Sparks loading (manual top-up)

## 3.9 Email — SendGrid

SendGrid sends transactional emails:
- Account verification: Welcome to EduBattle, verify your email
- Password reset: Your password reset link
- Battle result summary: How you did in today's battles
- Event reminders: Your event starts in 1 hour
- Weekly progress digest: Your week in review
- Subscription renewal notice: Your subscription renews in 3 days

Email templates are built with responsive HTML email components.

## 3.10 Containerization — Docker

Every service runs in Docker:
- edubattle-api: TypeScript binary in a minimal minimal Node.js container
- edubattle-frontend: SvelteKit Node.js server in node:alpine
- edubattle-db: postgres:16-alpine
- edubattle-redis: redis:7-alpine
- edubattle-meilisearch: getmeili/meilisearch
- edubattle-minio: minio/minio (development only)
- edubattle-nginx: nginx:alpine

Docker Compose wires all services together with a shared network.

## 3.11 CI/CD — GitHub Actions

On every push to the main branch:
Step 1: Run TypeScript unit tests (TypeScript test ./...)
Step 2: Run TypeScript type checking (tsc --noEmit)
Step 3: Build SvelteKit production bundle
Step 4: Run golangci-lint (linting)
Step 5: Build Docker images
Step 6: Push images to GitHub Container Registry
Step 7: SSH to production server
Step 8: Pull new images and restart containers
Step 9: Run any pending database migrations
Step 10: Health check endpoint returns 200
Step 11: If health check fails, auto-rollback to previous image

## 3.12 Monitoring — Prometheus + Grafana

Prometheus scrapes metrics from the TypeScript API server:
- HTTP request rate (per endpoint)
- HTTP error rate
- Database query duration histogram
- WebSocket connection count (active battles)
- Redis operation duration

Grafana displays dashboards:
- Request rate over time
- Error rate alerts
- Active battles live count
- Database performance
- Memory and CPU usage

Alerts configured for:
- Error rate exceeds 5% in any 5-minute window
- API response time exceeds 2 seconds average
- Database connection pool exhausted
- Redis memory exceeds 80% of allocated

---

# 4. LIBRARIES, TOOLS & DEPENDENCIES

## 4.1 TypeScript Backend Libraries — Detailed List

gorilla/mux:
Purpose: HTTP router and URL pattern matching
Why: Most mature TypeScript router with named route parameters, middleware support, and strict routing
Usage: All API routes defined using mux.NewRouter()

Socket.IO or ws:
Purpose: WebSocket server implementation
Why: The de-facto standard WebSocket library for TypeScript
Usage: Upgrade HTTP connections to WebSocket for battle rooms

TypeScript-jwt/jwt (v5):
Purpose: Create and validate JWT tokens
Why: Well-maintained, standards-compliant JWT library
Usage: Generate access tokens on login, validate on every protected request

lib/pq:
Purpose: PostgreSQL driver for TypeScript's database/sql
Why: Mature, battle-tested PostgreSQL driver with excellent error messages
Usage: All database operations TypeScript through this driver

redis/TypeScript-redis (v9):
Purpose: Redis client with connection pooling
Why: Official recommended Redis client for TypeScript, supports all Redis commands
Usage: Matchmaking queues, session cache, rate limiting, leaderboards

joho/godotenv:
Purpose: Load .env files into environment variables
Why: Simple, no-magic environment configuration
Usage: Load development config from .env file

TypeScript-playground/validator (v10):
Purpose: Struct-based input validation with tags
Why: Declarative validation — annotate struct fields with validate tags
Usage: Validate all API request bodies before processing

rs/zerolog:
Purpose: Structured JSON logging
Why: Zero-allocation logger, outputs machine-readable JSON logs
Usage: All log messages as JSON with timestamp, level, request ID

google/uuid:
Purpose: Generate RFC 4122 UUIDs
Why: Standard, cryptographically random IDs
Usage: Every entity (users, battles, questions, transactions) gets a UUID primary key

TypeScript.org/x/crypto/bcrypt:
Purpose: Password hashing with bcrypt algorithm
Why: bcrypt is the industry standard for password storage — adaptive work factor
Usage: Hash passwords on registration, compare on login

shopspring/decimal:
Purpose: Precise decimal arithmetic
Why: Prevents floating-point errors in currency calculations
Usage: All Sparks balance calculations

stretchr/testify:
Purpose: Test assertions and mocking
Why: Makes tests readable with assert.Equal, assert.NoError, etc.
Usage: All unit tests use testify assertions

OpenAPI tooling for TypeScript/swag:
Purpose: Generate Swagger/OpenAPI documentation from TypeScript annotations
Why: Keep API docs in sync with code automatically
Usage: Every handler has swagger annotations, docs auto-generated

ulule/limiter:
Purpose: Rate limiting middleware for TypeScript
Why: Simple store-based rate limiting with Redis backend
Usage: Limit login attempts, API requests, answer submissions

sendgrid/sendgrid-TypeScript:
Purpose: Send transactional emails via SendGrid API
Why: SendGrid is reliable and has good free tier
Usage: Verification emails, password reset, event reminders

razorpay/razorpay-TypeScript:
Purpose: Razorpay payment integration
Why: Official TypeScript client for India's best payment gateway
Usage: Verify payment signatures, fetch payment details

meilisearch/meilisearch-TypeScript:
Purpose: MeiliSearch TypeScript client
Why: Official client with typed responses
Usage: Index content, run search queries

disintegration/imaging:
Purpose: Image processing
Why: Pure TypeScript image manipulation library
Usage: Resize and crop user avatars to standard size

## 4.2 SvelteKit Frontend Libraries — Detailed List

svelte + @sveltejs/kit:
Purpose: The core framework
Why: Fastest-compiling frontend framework, zero runtime overhead
Usage: All pages, components, routing, SSR

tailwindcss:
Purpose: Utility-first CSS framework
Why: No context switching between JS and CSS files, consistent design tokens
Usage: All styling uses Tailwind utility classes

daisyui:
Purpose: Pre-built component library on top of Tailwind
Why: Provides accessible, themed components without writing them from scratch
Usage: Buttons, badges, modals, inputs, alerts

chart.js + svelte-chartjs:
Purpose: Interactive charts and graphs
Why: Most widely used chart library, excellent documentation
Usage: Progress graphs on dashboard, battle history charts, activity graphs

howler.js:
Purpose: Cross-browser audio playback
Why: Works on all browsers including Safari (which has quirky audio APIs)
Usage: All sound effects — correct/wrong answers, level up, battle sounds

socket.io-client:
Purpose: WebSocket client with automatic reconnection
Why: Handles reconnection, heartbeats, and transport fallback automatically
Usage: Battle arena WebSocket connection

marked:
Purpose: Markdown to HTML parser
Why: Safe, fast, well-tested markdown parser
Usage: Render theory content which is written in Markdown

highlight.js:
Purpose: Syntax highlighting for code blocks
Why: Supports 190+ programming languages, lightweight
Usage: Highlight code examples in programming questions

katex:
Purpose: LaTeX math equation rendering
Why: Fastest math renderer for the browser, better than MathJax
Usage: Display math formulas in Physics, Chemistry, and Maths questions

zod:
Purpose: TypeScript-first schema validation
Why: Runtime validation with TypeScript type inference
Usage: Validate all form inputs on the frontend

date-fns:
Purpose: Date manipulation and formatting
Why: Tree-shakeable, tiny, no Moment.js bloat
Usage: Format streak dates, countdown timers, "X days ago" timestamps

lucide-svelte:
Purpose: Icon library
Why: Clean, minimal, consistent icons — 1000+ available
Usage: All icons across the entire application

svelte-confetti:
Purpose: Confetti particle animation
Why: Simple Svelte component, performant canvas-based confetti
Usage: Level up, battle win, achievement unlock celebrations

@fontsource/inter:
Purpose: Inter font
Why: Self-hosted fonts — no external font service calls (better privacy and speed)
Usage: All body text

@fontsource/jetbrains-mono:
Purpose: Monospace font for code
Why: Specifically designed for developers, excellent readability
Usage: Code blocks in engineering questions and explanations

axios:
Purpose: HTTP client for API calls
Why: Interceptors allow global auth header injection and error handling
Usage: All API calls from frontend to backend

svelte-motion:
Purpose: Animation library similar to Framer Motion
Why: Declarative animations for complex entrance and exit animations
Usage: Page transitions, card animations

svelte-intersection-observer:
Purpose: Trigger actions when elements enter the viewport
Why: Performance — only run animations when element is visible
Usage: Animate statistics and cards as they scroll into view

svelte-toast:
Purpose: Non-blocking notification toasts
Why: Accessible, keyboard-dismissible, auto-dismisses
Usage: Action feedback that doesn't interrupt the user

@sveltejs/adapter-node:
Purpose: Deploy SvelteKit as a Node.js server
Why: Full SSR support with streaming for production
Usage: Production deployment

## 4.3 Development Tools — Detailed List

VS Code:
The primary development editor. Extensions recommended:
- TypeScript (official TypeScript extension by Google)
- Svelte for VS Code (official Svelte extension)
- Tailwind CSS IntelliSense (autocomplete for Tailwind classes)
- Thunder Client (HTTP client for API testing)
- Error Lens (inline error display)

tsx watch or nodemon:
Purpose: Live reload for TypeScript development
Why: Watches TypeScript files and restarts the server automatically on save
Usage: Development server — never restart manually

golangci-lint:
Purpose: Run multiple TypeScript linters simultaneously
Why: Catches bugs, security issues, and style problems before code review
Usage: Run in CI and before commits

Postman:
Purpose: API endpoint testing
Why: Visual interface for testing REST and WebSocket APIs
Usage: Test every API endpoint during development

TablePlus:
Purpose: Database GUI
Why: Beautiful, fast PostgreSQL GUI for macOS and Windows
Usage: Inspect database data during development

Redis Insight:
Purpose: Redis GUI
Why: Official Redis GUI from Redis Labs — shows all keys, memory usage
Usage: Debug matchmaking queues and cached data

Figma:
Purpose: UI/UX design and prototyping
Why: Industry standard design tool with excellent collaboration features
Usage: Design all screens before coding them

Playwright:
Purpose: End-to-end browser testing
Why: Tests real browser behavior including WebSocket connections
Usage: Test complete user flows (register → learn → battle)

k6:
Purpose: Load testing
Why: JavaScript-based load testing tool with excellent metrics
Usage: Simulate 1000+ concurrent users in matchmaking

Docker Desktop:
Purpose: Container management
Why: GUI for Docker — easier than CLI for development
Usage: Start and stop all services with one click

---

# 5. FULL FOLDER & FILE STRUCTURE

## 5.1 Root Project Structure

The entire EduBattle project lives in a single repository (monorepo approach). This makes it easy to:
- Share types between frontend and backend
- Deploy both services from one CI/CD pipeline
- Have consistent tooling (linting, formatting, testing)

Root directory contains:
- backend/ — all TypeScript server code
- frontend/ — all SvelteKit UI code
- database/ — SQL schema, migrations, seeds
- content/ — educational content in Markdown and JSON
- nginx/ — reverse proxy configuration
- docker-compose.yml — local development environment
- docker-compose.prod.yml — production environment
- Makefile — common commands

## 5.2 Backend Directory Structure

backend/
The root of all TypeScript server code.

backend/cmd/server/main.TypeScript:
The application entry point. Initializes database connections, Redis connection, HTTP router, WebSocket hub, and starts the HTTP server. Contains the signal handler for graceful shutdown.

backend/config/config.TypeScript:
Reads all configuration from environment variables. Defines a Config struct with fields for database URL, Redis URL, JWT keys, API keys, and all other settings. Has a Load() function that reads .env file in development.

backend/config/database.TypeScript:
Sets up the PostgreSQL connection pool. Configures connection pool size (20 max connections), connection lifetime, and ping interval. Returns a *sql.DB instance.

backend/internal/auth/:
Authentication package. Contains JWT creation and validation (jwt.TypeScript), bcrypt password operations (password.TypeScript), auth middleware that validates tokens on protected routes (middleware.TypeScript), and OAuth setup for future Google login (oauth.TypeScript).

backend/internal/handlers/:
HTTP handler functions for every route group. Each file corresponds to one route group. Handlers receive service instances via dependency injection and call service methods. Handlers are responsible only for: parsing request, calling service, formatting response.

backend/internal/models/:
TypeScript structs that represent database entities. Each struct has JSON tags for serialization and db tags for scanning from SQL results. These are pure data structs — no methods that do business logic.

backend/internal/repository/:
Functions that execute SQL queries against the database. Each repository file corresponds to one table or logical group. Repository functions take context, SQL parameters, return model structs or errors. Never contain business logic — only data access.

backend/internal/services/:
Business logic layer. Services orchestrate multiple repository calls, validate business rules, and emit events. For example: battle_service.TypeScript decides when two players are matched, creates the battle record, and notifies both players.

backend/internal/websocket/:
WebSocket hub implementation. hub.TypeScript manages a map of all active WebSocket connections. client.TypeScript represents a single connected client with read and write asynchronous workers. battle_room.TypeScript manages the state of one active battle.

backend/internal/middleware/:
HTTP middleware functions. These wrap route handlers to add cross-cutting concerns: CORS headers, rate limiting, request logging with unique request IDs, JWT authentication, and GZIP compression.

backend/migrations/:
SQL migration files numbered sequentially. Run in order to build the database schema from scratch. Each file contains the DDL for one logical group of tables.

backend/seeds/:
SQL seed files with sample questions and initial data. Used to populate a fresh development database with realistic data.

## 5.3 Frontend Directory Structure

frontend/src/routes/:
SvelteKit's file-based routing. Every folder is a route segment, every +page.svelte is a page component. The structure mirrors the URL structure exactly.

frontend/src/lib/components/:
Shared Svelte components. Organized by function:
- common/ — truly generic UI elements (Button, Card, Modal)
- layout/ — structural components (Navbar, Footer, Sidebar)
- gamification/ — level badges, XP bars, streak displays
- questions/ — question display, MCQ options, answer inputs
- battle/ — battle arena, opponent cards, timer, results
- dashboard/ — stats cards, activity graphs, quick actions
- community/ — post cards, comment threads, vote buttons
- events/ — event cards, registration forms, leaderboards

frontend/src/lib/stores/:
Svelte stores (reactive global state). Each store manages one domain of application state. auth.store.ts is the source of truth for authentication. battle.store.ts tracks active battle state.

frontend/src/lib/utils/:
Pure utility functions with no Svelte dependencies. api.ts configures axios with base URL and auth headers. audio.ts wraps Howler.js with EduBattle-specific sound names. anti_cheat.ts sets up copy-paste prevention globally.

frontend/static/sounds/:
All audio files used for sound effects. Described in full in Section 35.

## 5.4 Content Directory Structure

content/class9/maths/:
One folder per chapter (e.g., ch01-number-systems/).
Inside each chapter folder:
- theory.md — full theory with YouTube link at top and bottom
- questions.json — question bank for that chapter

content/engineering/c-language/:
Overview file plus one folder per day (day01/ through day30/).
Inside each day folder:
- theory.md — day's topic with YouTube link
- questions.json — day's question bank

## 5.5 Database Directory Structure

database/schema.sql:
Complete CREATE TABLE statements for all tables.

database/indexes.sql:
All CREATE INDEX statements for performance.

database/views.sql:
Leaderboard views and other complex derived queries.

database/triggers.sql:
Auto-update streak, auto-update question accuracy rate, etc.

database/functions.sql:
Stored functions for matchmaking logic, XP calculation, etc.

---

# 6. PAGES & THEIR DETAILED DESCRIPTIONS

## 6.1 Page Inventory — Every Page in the Application

EduBattle has the following pages, each at its own URL route:

Authentication Pages:
- / (Home) — public landing page
- /auth/signup — create account
- /auth/signin — log in
- /auth/forgot-password — request password reset
- /auth/reset-password — set new password after reset
- /auth/verify-email/:token — verify email address

Core Learning Pages:
- /dashboard — personal command center (requires auth)
- /class9 — Class 9 subject selection
- /class9/:subject — list of chapters for a subject
- /class9/:subject/:chapter — chapter theory + questions
- /class10 — Class 10 subject selection
- /class10/:subject — subject chapters
- /class10/:subject/:chapter — chapter content
- /class11 — Class 11 subject selection (with stream filter)
- /class11/:subject — subject chapters
- /class11/:subject/:chapter — chapter content
- /class12 — Class 12 subject selection
- /class12/:subject — subject chapters
- /class12/:subject/:chapter — chapter content

Engineering Pages:
- /engineering — programming language selection
- /engineering/:language — language overview + day plan grid
- /engineering/:language/day/:day — single day content and questions

Battle Pages:
- /battle — battle lobby (choose mode and subject, enter queue)
- /battle/arena/:battleId — live battle in progress
- /battle/result/:battleId — battle result and review

Test Pages:
- /test — test selection page
- /test/:testId — active test
- /test/result/:testId — test result and review

Community Pages:
- /community — community hub
- /community/class9 — Class 9 community
- /community/class10 — Class 10 community
- /community/class11 — Class 11 community
- /community/class12 — Class 12 community
- /community/engineering — engineering community hub
- /community/engineering/c-language — C language forum
- /community/engineering/cpp — C++ forum
- /community/engineering/python — Python forum
- /community/engineering/java — Java forum
- /community/engineering/javascript — JavaScript forum
- /community/engineering/TypeScript — TypeScript forum
- /community/engineering/rust — Rust forum
- /community/engineering/kotlin — Kotlin forum
- /community/engineering/swift — Swift forum
- /community/engineering/typescript — TypeScript forum
- /community/engineering/sql — SQL forum
- /community/engineering/dsa — DSA forum
- /community/post/:postId — single post with replies

Events Pages:
- /events — browse all events
- /events/create — create event (coordinator only)
- /events/:eventId — event detail and registration
- /events/:eventId/compete — secure competition mode
- /events/:eventId/leaderboard — event live leaderboard
- /events/my-events — my registered events

Wallet and Payment Pages:
- /wallet — wallet overview with balance
- /wallet/add-funds — add Sparks via Razorpay
- /wallet/history — transaction history

Profile and Settings:
- /profile — own profile
- /profile/:username — public profile
- /settings — account settings, sound settings, notification preferences
- /leaderboard — global and filtered leaderboards

Admin Pages (requires admin role):
- /admin — admin dashboard
- /admin/users — user management
- /admin/questions — question bank management
- /admin/events — events approval
- /admin/reports — analytics and reports

---

# 7. HOME PAGE — COMPLETE DETAIL

## 7.1 Purpose and First Impression

The home page is the first thing a visitor sees. In 3–5 seconds, they must understand:
- This is a learning platform
- It involves some kind of battle or competition
- It is for Indian students
- It is free to start

The design must create excitement and urgency without being overwhelming.

## 7.2 Navbar on Home Page

The navbar floats above the hero section with a blur backdrop effect.

Left side: EduBattle logo (shield with lightning bolt) + wordmark "EduBattle" in bold
Center: Navigation links — Home, Classes, Engineering, Battle, Events, Community
Right side (not logged in): "Sign In" button (ghost/outline style) + "Sign Up Free" button (solid blue)
Right side (logged in): Flame streak icon + streak number, Sparks coin icon + balance, Bell icon (notification count badge), Avatar with dropdown

On mobile (below 768px):
- Center links hidden
- Hamburger menu icon replaces center
- Clicking hamburger opens a full-screen slide-out drawer with all navigation links

The navbar is sticky — it stays at the top as you scroll down.

## 7.3 Hero Section

This is the first thing below the navbar — takes up the full viewport height on desktop.

Headline: Large, bold, animated text — each word types in one by one:
"Learn." — appears
"Battle." — appears
"Level Up." — appears with a gold color pulse

Sub-headline below: "The only educational platform where you battle opponents in real-time and earn rewards for your knowledge — from CBSE Class 9 to Engineering"

Two CTA buttons centered below the headline:
Primary button: "Start Battling — It's Free" — solid electric blue, large, links to /auth/signup
Secondary button: "Watch a Demo" — outline style, opens a video modal showing a 90-second demo

Hero visual to the right on desktop, below text on mobile:
An animated SVG illustration showing:
- Two student avatars facing each other in a battle arena
- Floating subject bubbles between them: "Maths Ch.3", "C Language Day 7", "Physics", "Python"
- Score counters updating (animating numbers)
- Small XP points floating upward

Background: A dark gradient with subtle animated particle mesh (low-opacity dots connected by lines, slowly moving)

## 7.4 Live Stats Banner

Below the hero, a full-width dark card with 4 metrics displayed:

Metric 1 — Total Students: "12,847 Students" (number animates up when page loads)
Metric 2 — Battles Today: "1,203 Battles Fought Today" (live number)
Metric 3 — Questions Available: "45,000+ Questions" (static)
Metric 4 — Online Now: "342 Students Online" (live WebSocket counter)

These stats update every 30 seconds via a lightweight polling endpoint.
The "Online Now" metric uses a persistent WebSocket connection.

## 7.5 How It Works Section

Title: "How EduBattle Works"
Subtitle: "Four simple steps to turn studying into the most exciting thing you do today"

Four step cards in a horizontal row (vertical on mobile):

Step 1 — Choose Your Path
Icon: Graduation cap
Title: "Pick Your Class or Language"
Description: "Browse CBSE subjects for Class 9–12 or choose from 12 programming languages with structured day plans."

Step 2 — Learn and Earn Points
Icon: Book with star
Title: "Study, Answer, Score"
Description: "Read theory, solve questions, and earn XP points. Every correct answer brings you closer to the next level."

Step 3 — Battle Real Opponents
Icon: Crossed swords
Title: "Challenge Real Students"
Description: "Jump into BGMI-style matchmaking and battle opponents at your exact level on any chapter you choose."

Step 4 — Level Up and Win Rewards
Icon: Trophy
Title: "Earn Sparks and Climb the Ranks"
Description: "Win Sparks, maintain your streak, unlock badges, and rise on the leaderboard."

## 7.6 Features Grid

Title: "Everything You Need to Excel"

Six feature cards in a 2×3 grid (3×2 on desktop):

Card 1 — BGMI-Style Matchmaking
Icon: Gaming controller
Description: "Get matched with students at your exact level for perfectly balanced battles. No unfair advantages."

Card 2 — Daily Streak Tracking
Icon: Flame
Description: "Track your daily study streak like GitHub contributions. Stay consistent, earn milestone rewards."

Card 3 — Sparks Economy
Icon: Coin
Description: "Earn virtual Sparks by winning battles. Wager them in competitive battles once you reach Level 10."

Card 4 — College Events Portal
Icon: University building
Description: "Your college can host coding competitions directly on EduBattle. Verified organizer setup in 48 hours."

Card 5 — YouTube Help Links
Icon: Play button
Description: "Every question has a curated YouTube video link. Never get stuck — watch and learn in 2 minutes."

Card 6 — Anti-Cheat Secure Mode
Icon: Shield with check
Description: "All competitions run in secure browser mode. No copy-paste, no tab switching, purely fair."

## 7.7 Classes and Languages Row

Title: "Supporting Your Entire Academic Journey"

Two horizontal scrolling pill rows:

Row 1 — Classes:
Class 9 | Class 10 | Class 11 | Class 12
Each pill is clickable and links to the respective class page.
Hovering shows a tooltip: "5 Subjects | 50+ Chapters | 3,000+ Questions"

Row 2 — Languages:
C Language | C++ | Python | Java | JavaScript | TypeScript | Rust | Kotlin | Swift | TypeScript | SQL | DSA
Each pill links to the language overview page.
Hovering shows: duration ("30 Days") and difficulty level.

## 7.8 Live Battle Feed

Title: "Battles Happening Right Now"

A live scrolling feed showing the last 20 battles:
Each entry: "[Avatar] Rahul (Lvl 12) defeated Priya (Lvl 11) in Class 10 Maths — Quadratic Equations · 2 minutes ago"

The feed auto-scrolls upward slowly like a news ticker.
New battles prepend to the top.
This is driven by a WebSocket subscription to battle completion events.

This section creates FOMO and social proof — visitors see real activity.

## 7.9 Leaderboard Preview

Title: "Top Warriors This Week"

A compact leaderboard card showing the top 5 users in the weekly leaderboard:
Rank | Avatar | Username | Level | XP This Week

Below the table: "See Full Leaderboard →" link

## 7.10 Events Spotlight

Title: "Upcoming Events From Your College and Beyond"

Three event cards in a row (one on mobile):
Each card shows: Event name, Organizer (college name), Language/Subject, Start date, "X students registered", Registration status button

Below: "Browse All Events →" link

## 7.11 Testimonials Section

Title: "What Students Say"

Three testimonial cards:

Card 1:
Avatar + Name: "Arjun Singh, Class 12 — IIT Aspirant"
Quote: "I never thought I'd enjoy studying Physics, but battling classmates on EduBattle made it addictive. My chapter accuracy went from 40% to 85% in 3 weeks."

Card 2:
Avatar + Name: "Sneha Patel, Engineering Year 1 — Learning Python"
Quote: "The 45-day Python plan is the best thing that happened to my coding journey. The questions are tough enough to make you think, not just memorize."

Card 3:
Avatar + Name: "Raj Kumar, Class 10 — Maharashtra"
Quote: "My streak is at 34 days and I genuinely look forward to opening EduBattle every morning. It feels like a game but I'm learning so much more."

Cards are displayed in a horizontal slider with auto-advance every 5 seconds.

## 7.12 Bottom CTA Section

Full-width section with gradient background:
Headline: "Ready to Start Your Battle?"
Sub-text: "Join 12,847 students who made learning competitive"
Button: "Sign Up Free — No Credit Card Needed"
Small text below button: "Already have an account? Sign In"

## 7.13 Footer

Left: EduBattle logo and tagline "Learn. Battle. Level Up."
Center column: Learn — Classes, Engineering, Practice Tests, Leaderboard
Center column: Community — Class Forums, Engineering Forums, Events, Blog
Right column: Company — About Us, Privacy Policy, Terms of Service, Contact
Bottom: Copyright © 2025 EduBattle. All rights reserved. | Made in India

---

# 8. SIGN IN & SIGN UP PAGES

## 8.1 Sign Up Page — Full Specification

### Visual Layout
Split-screen layout on desktop:
- Left half: Sign-up form on a dark card
- Right half: Animated illustration of a battle scene with "Join 12,000+ students" text

On mobile: Form takes full screen, illustration hidden.

### Form Title and Sub-title
Title: "Create Your EduBattle Account"
Sub-title: "Free forever. No credit card. Battle in 2 minutes."

### Complete List of Form Fields

Field 1 — Full Name:
Label: "Full Name"
Type: Text input
Placeholder: "e.g., Rahul Singh"
Validation: Required, minimum 2 characters, maximum 100 characters
Error: "Please enter your full name (at least 2 characters)"

Field 2 — Username:
Label: "Username"
Type: Text input
Placeholder: "e.g., rahul_wins"
Validation: Required, 3–20 characters, only letters, numbers, and underscores
Real-time: After 500ms debounce, checks /api/auth/check-username
Visual feedback: Green checkmark if available, red X if taken
Error: "Username must be 3–20 characters, only letters, numbers, and underscores"

Field 3 — Email Address:
Label: "Email Address"
Type: Email input
Placeholder: "e.g., rahul@example.com"
Validation: Required, valid email format
Error: "Please enter a valid email address"

Field 4 — Password:
Label: "Password"
Type: Password input with show/hide toggle
Placeholder: "Choose a strong password"
Validation: Required, minimum 8 characters, must contain at least 1 uppercase letter and 1 number
Strength indicator: Shows weak/medium/strong based on password characteristics
Error: "Password must be at least 8 characters with one uppercase letter and one number"

Field 5 — Confirm Password:
Label: "Confirm Password"
Type: Password input
Placeholder: "Type your password again"
Validation: Must exactly match password field
Error: "Passwords do not match"

Field 6 — I am a:
Label: "I am a"
Type: Select dropdown
Options:
- "Class 9 Student"
- "Class 10 Student"
- "Class 11 Student — Science Stream"
- "Class 11 Student — Commerce Stream"
- "Class 11 Student — Arts Stream"
- "Class 12 Student — Science Stream"
- "Class 12 Student — Commerce Stream"
- "Class 12 Student — Arts Stream"
- "Engineering / College Student"
- "Teacher or Educator"
- "College Event Coordinator"
Validation: Required — must select one
Error: "Please select your role"

Field 7 — Terms and Conditions:
Label: "I agree to EduBattle's Terms of Service and Privacy Policy"
Type: Checkbox
Validation: Must be checked to submit
Error: "You must agree to the terms to create an account"

### Submit Button
Text: "Create My Account"
State: Disabled and grayed out until all validation passes
Loading state: Spinner icon + "Creating Account..."

### Post-Submit Flow
1. Form submits to POST /api/auth/register
2. Success: Page transitions to "Check Your Email" confirmation screen
   - Icon: Envelope illustration
   - Title: "Check Your Email!"
   - Message: "We sent a verification link to rahul@example.com. Click the link to activate your account."
   - Small link: "Didn't receive it? Resend Email" (rate limited — once per 5 minutes)
3. Error: Inline error displayed above the form (e.g., "Email already registered — try signing in")

### Alternative Sign Up
Below the form:
"Or sign up with Google" button (future feature — grayed out with "Coming Soon" tooltip)
"Already have an account? Sign In →" link

## 8.2 Sign In Page — Full Specification

### Visual Layout
Similar split-screen as sign-up:
- Left: Sign-in form
- Right: Leaderboard or stats animation

### Form Fields

Field 1 — Email or Username:
Label: "Email or Username"
Type: Text input
Placeholder: "Enter your email or username"
Validation: Required, not empty
Note: Backend resolves whether input is email or username

Field 2 — Password:
Label: "Password"
Type: Password input with show/hide toggle
Validation: Required, not empty

Field 3 — Remember Me:
Label: "Keep me signed in for 30 days"
Type: Checkbox
Default: Unchecked (session expires in 7 days by default)

### Forgot Password Link
Below the password field: "Forgot Password?" — links to /auth/forgot-password

### Submit Button
Text: "Sign In"
Loading state: "Signing In..."

### Sign In Flow Details
1. POST /api/auth/login with email/username and password
2. Server looks up user, verifies bcrypt hash
3. If email not verified: Show error "Please verify your email first. [Resend verification email]"
4. If account locked: Show error "Account temporarily locked due to too many failed attempts. Try again in X minutes."
5. If wrong credentials: Show generic "Invalid email/username or password" (never say which field is wrong)
6. If success: Set httpOnly cookies, redirect to /dashboard
7. If user was trying to access a protected page before being redirected to login: redirect back to that page

### Failed Login Lockout
After 5 failed login attempts within 15 minutes for the same email:
- Account login locked for 30 minutes
- Lock data stored in Redis: key = "login:lock:email@example.com", value = 1, TTL = 1800 seconds
- User sees: "Too many failed attempts. Try again in 28 minutes." (shows remaining time)

## 8.3 Forgot Password Page

Title: "Reset Your Password"
Description: "Enter the email address you used to register and we'll send you a reset link."

Field: Email address
Button: "Send Reset Link"

After submitting:
Always shows: "If an account with that email exists, you'll receive a reset link in the next few minutes."
This wording prevents confirming whether an email is registered (security best practice).

The reset link is valid for 1 hour and can only be used once.

## 8.4 Reset Password Page

Reached by clicking the link in the reset email.

Fields:
- New Password
- Confirm New Password

Validation same as sign-up password requirements.

After success: "Your password has been reset. Sign in with your new password." + link to sign-in page.

After link expired: "This reset link has expired. Request a new one." + link to forgot-password page.

---

# 9. DASHBOARD PAGE — COMPLETE DETAIL

## 9.1 Dashboard Purpose

The dashboard is the home base for every logged-in user. When a student logs into EduBattle, the dashboard is where they land. It answers four questions immediately:

1. Where am I? (level, tier, XP progress)
2. How consistent have I been? (streak)
3. What should I do next? (recommendations)
4. How am I doing vs others? (leaderboard rank)

## 9.2 Dashboard Top Bar — Critical Info

Displayed at the very top of the dashboard, always visible:

Level Badge:
A hexagonal badge with the level number inside. Color changes by tier:
- Bronze: brown/orange hex
- Silver: gray/silver hex
- Gold: golden yellow hex
- Platinum: teal/blue hex
- Diamond: purple/blue hex
- Master: red hex
- Grandmaster: animated gradient hex

XP Progress Bar:
Below the badge: "1247 / 1600 XP to Level 11"
A horizontal bar filled proportionally in electric blue.
Smooth animation when XP increases.

Streak Display:
Flame icon + "34 Day Streak"
Clicking this expands a tooltip showing: "Started on April 5, 2025. Your longest streak: 34 days. Come back tomorrow to keep it going!"

Sparks Balance:
Coin icon + "2,840 Sparks"
Only visible to Level 10+ users who can use Sparks.
Clicking links to /wallet.

Subscription Badge:
If premium subscriber: "Premium" badge next to username in golden text.
If free: No badge shown (not shaming free users).

## 9.3 Today's Activity Summary

Four metric cards in a horizontal row:

Card 1 — Questions Solved Today
Number: 47
Sub-text: "Daily goal: 50"
Small progress bar showing 94%

Card 2 — XP Earned Today
Number: 234 XP
Sub-text: "Your average: 180 XP/day"
Small upward arrow if above average

Card 3 — Correct Answer Rate Today
Number: 78%
Sub-text: "Overall lifetime: 71%"
Green if above lifetime average, red if below

Card 4 — Time Studied Today
Number: 1h 23m
Sub-text: "Productive time on platform"

## 9.4 Activity Graph

A GitHub-style contribution graph showing the last 180 days (6 months).

Each cell = one day. Cell color:
- Empty (no activity): #161B22 (same as card background)
- Light activity (1–5 questions): #0E4429
- Moderate activity (6–20 questions): #006D32
- High activity (21–50 questions): #26A641
- Intense activity (51+ questions): #39D353

Hovering over any cell shows a tooltip: "April 15 — 23 questions solved, 3 battles, 145 XP"

Below the graph:
"Current Streak: 34 days 🔥 | Longest Streak: 34 days | Total Active Days: 78"

The activity graph also serves as a visual reminder of the habit the user is building.

## 9.5 Quick Battle Widget

Located in the right column next to the activity graph.

Title: "Ready to Battle?"

Shows:
- User's current win rate: "You've won 58 of 97 battles (59.7%)"
- Students in queue right now for user's class: "23 students in Class 10 queue"
- Estimated wait time: "Usually matched in under 30 seconds"

Two buttons:
- "Quick Battle (5 min)" — 10 questions
- "Marathon Battle (30 min)" — 20 questions

Below buttons: Subject selector for the battle (defaults to last subject used)

## 9.6 Continue Learning Section

Title: "Pick Up Where You Left Off"

Three cards showing the last 3 chapters or day plans the user accessed:

Card format:
- Subject/Language icon and name
- Chapter or Day name
- Progress bar: "65% complete"
- "Continue" button linking directly to that content

If user has no history: Show "Start Learning" cards suggesting Class 9 Maths Ch 1 or C Language Day 1.

## 9.7 Personalized Recommendations

Title: "Recommended For You"

Three recommendations generated by a simple scoring algorithm:

Recommendation algorithm logic:
- Take all chapters/days the user has started but not completed
- Score by: lowest completion percentage × chapter importance
- Also include: chapters where accuracy is below 60% (need more practice)
- Include upcoming event subjects if user is registered for events

Each recommendation card shows:
- What to study
- Why it's recommended ("Your accuracy in this chapter is 52% — room to improve!")
- Estimated time to complete
- "Start Now" button

## 9.8 Upcoming Events Widget

If user has registered for events: shows next 2 upcoming events with countdown timer.
If no events: shows "Discover Events" card with 2 featured public events.

Event mini-card shows:
- Event name
- Organizer (college name)
- Subject/Language
- Start time countdown: "Starts in 2 days 4 hours"
- Status: "Registered" badge or "Register Now" button

## 9.9 Recent Battle History

Title: "Recent Battles"

Table with last 5 battles:
Columns: Opponent (avatar + username), Subject, Chapter, Result (Win/Loss/Draw badge), Points Earned, Date

Result badges:
- Win: Green badge with ✓
- Loss: Red badge with ✗
- Draw: Gray badge with =

Below table: "View All 97 Battles →" link to full battle history page

## 9.10 Leaderboard Position Widget

Title: "Your Rank This Week"

Shows 5 users on the weekly leaderboard:
2 users above the current user, the current user (highlighted), 2 users below.

Format for each row:
Rank number | Avatar | Username | Level | XP This Week | Gap to above

If user is already in top 3: Shows top 5 directly.
If user is in bottom 10: Shows bottom 5 with their position.

"See Full Weekly Leaderboard →" link

## 9.11 Achievements / Badges Section

Title: "Your Achievements"

Shows 2 rows of badges:
Row 1 (Earned): Full-color badges with their names
Row 2 (Next to Earn): Grayscale badges with lock icon and progress toward earning

Earned badge example: "First Blood — Won your first battle"
Locked badge example: "On Fire — Complete a 7-day streak (3/7 days done)"

Clicking any badge: expands a small popup with full description, when it was earned (or progress toward earning it), and the Sparks reward that came with it.

"See All 47 Achievements →" link to full achievements page

---

# 10. CLASS 9TH PAGE & ALL SUBJECTS

## 10.1 Class 9 Landing Page Layout

URL: /class9

Header section:
- Title: "Class 9 — CBSE"
- Tagline: "Master your Class 9 syllabus the battle-powered way"
- User's overall Class 9 progress (if logged in): "You have completed 34% of Class 9 content"
- "Jump back in" button linking to last studied chapter

Stream info bar:
"Class 9 covers all CBSE streams. Choose your subject below."

## 10.2 Class 9 Subject Cards

Six subject cards displayed in a responsive grid:

Card 1 — Mathematics (Maths)
Icon: Calculator or Sigma symbol
Chapters: 14 chapters
Questions in bank: 850+
Completion: [User's %]
Difficulty: Beginner to Intermediate
Best for: Logic, calculation, board practice
Button: "Start Maths"

Card 2 — Science
Icon: Atom or microscope
Chapters: 15 chapters
Questions: 900+
Covers: Physics, Chemistry, Biology integrated
Button: "Start Science"

Card 3 — Social Science
Icon: Globe or map
Chapters: History (5), Geography (6), Civics (5), Economics (4)
Questions: 750+
Button: "Start Social Science"

Card 4 — English
Icon: Open book
Chapters: Beehive (11), Moments (10)
Questions: 500+
Covers: Prose, Poetry, Grammar, Writing
Button: "Start English"

Card 5 — Hindi
Icon: Hindi letter character (ह)
Chapters: Sparsh, Sanchayan
Questions: 400+
Button: "Start Hindi"

Card 6 — Information Technology (Optional)
Icon: Computer screen
Chapters: 5 chapters
Questions: 250+
Note: "Elective subject — available for applicable schools"
Button: "Start IT"

## 10.3 Class 9 — Mathematics — Complete Chapter Breakdown

Chapter 1: Number Systems
Theory covers:
- Natural numbers, whole numbers, integers, rational numbers
- What is an irrational number? Definition and proof that √2 is irrational
- The real number line
- Representing rational and irrational numbers on the number line
- Operations on real numbers: addition, subtraction, multiplication, division
- Laws of exponents for real numbers
- Rationalization of surds

Key formulas for this chapter:
- (a+b)² = a² + 2ab + b²
- (a-b)² = a² - 2ab + b²
- (a+b)(a-b) = a² - b²
- (a+b+c)² = a² + b² + c² + 2ab + 2bc + 2ca

YouTube link: Points to a video explaining irrational numbers visually with number line

Question types for this chapter:
- MCQ: "Which of the following is irrational? (a) √4 (b) √3 (c) 0.25 (d) 1/3" — Answer: √3
- Short answer: "Rationalize the denominator of 1/(√7-√6)"
- True/False: "Every integer is a rational number" — True
- Fill in blank: "The product of two irrational numbers is always ____" — irrational (trick — not always true)

Chapter 2: Polynomials
Theory covers:
- Definition of polynomial, terms, coefficients, degree
- Types: monomial, binomial, trinomial, polynomial
- Degree of a polynomial
- Zeroes of a polynomial (roots)
- Remainder theorem: if p(x) is divided by (x-a), remainder is p(a)
- Factor theorem: (x-a) is a factor of p(x) if p(a) = 0
- Factorization using algebraic identities
- Key identities: (x+y+z)², x³+y³+z³-3xyz, and others

YouTube link: Points to remainder theorem and factor theorem explanation

Question types:
- MCQ: "The degree of polynomial 5x³ - 4x + 7 is?" — Answer: 3
- Short: "Find the zero of polynomial p(x) = 2x + 5"
- MCQ: "Using factor theorem, (x-2) is a factor of x²-4. True or False?"
- Long: "Factorize: x³ - 23x² + 142x - 120"

Chapter 3: Coordinate Geometry
Theory covers:
- Cartesian plane (Cartesian coordinate system)
- Origin, x-axis, y-axis, axes perpendicular to each other
- Quadrants I, II, III, IV and their sign conventions
- Plotting points like (3, 4), (-2, 5), (0, -3)
- Distance from x-axis = y-coordinate (ordinate)
- Distance from y-axis = x-coordinate (abscissa)

YouTube link: Points to coordinate geometry basics

Question types:
- MCQ: "In which quadrant does the point (-3, 7) lie?" — Answer: Quadrant II
- Short: "Plot and name the coordinates of a point 3 units above the x-axis and 4 units to the left of y-axis"
- True/False: "The x-coordinate of any point on y-axis is 0" — True
- MCQ: "The point (0, 0) is called the ____" — Origin

Chapter 4: Linear Equations in Two Variables
Theory covers:
- Standard form: ax + by + c = 0
- Solutions of a linear equation (infinite solutions)
- Graph of a linear equation: always a straight line
- Equation of x-axis: y = 0
- Equation of y-axis: x = 0
- Lines parallel to x-axis: y = k (constant)
- Lines parallel to y-axis: x = k (constant)

Chapter 5: Introduction to Euclid's Geometry
Theory covers:
- Euclid's 23 definitions
- Euclid's 5 postulates
- Euclid's axioms
- The parallel postulate controversy
- Modern axiomatic approach

Chapter 6: Lines and Angles
Theory covers:
- Basic terms: line, line segment, ray, angle
- Types of angles: acute, right, obtuse, straight, reflex
- Complementary and supplementary angles
- Adjacent angles, linear pair, vertically opposite angles
- Parallel lines and transversal: corresponding angles, alternate interior, co-interior
- Angle sum property of a triangle

Chapter 7: Triangles
Theory covers:
- Congruence of triangles (same shape and size)
- Criteria: SAS, ASA, AAS, SSS, RHS
- Properties of isosceles triangles
- Inequalities in triangles: angle opposite to larger side is larger

Chapter 8: Quadrilaterals
Theory covers:
- Types of quadrilaterals
- Properties of parallelograms (opposite sides equal, opposite angles equal, diagonals bisect)
- Properties of rectangle, rhombus, square
- Midpoint theorem

Chapter 9: Areas of Parallelograms and Triangles
Theory covers:
- Figures on same base and between same parallels
- Area of parallelogram = base × height
- Area of triangle = ½ × base × height
- If triangles are on same base and between same parallels: equal area

Chapter 10: Circles
Theory covers:
- Terms: chord, arc, sector, segment, semicircle
- Equal chords at equal distance from center
- Angle subtended by arc at center = 2 × angle at circumference
- Angles in the same segment are equal
- Cyclic quadrilateral: sum of opposite angles = 180°

Chapter 11: Constructions
Theory covers:
- Bisecting a given line segment
- Bisecting a given angle
- Constructing triangle given base, base angle, and sum/difference of other two sides
- Constructing triangle given perimeter and base angles

Chapter 12: Heron's Formula
Theory covers:
- Area of triangle using Heron's formula: Area = √(s(s-a)(s-b)(s-c)) where s = (a+b+c)/2
- Application to quadrilaterals by dividing into triangles

Chapter 13: Surface Areas and Volumes
Theory covers:
- Cube: Surface area = 6a², Volume = a³
- Cuboid: Surface area = 2(lb+bh+hl), Volume = lbh
- Cylinder: Curved SA = 2πrh, Total SA = 2πr(r+h), Volume = πr²h
- Cone: Curved SA = πrl, Total SA = πr(r+l), Volume = 1/3 πr²h
- Sphere: SA = 4πr², Volume = 4/3 πr³
- Hemisphere: Curved SA = 2πr², Total SA = 3πr², Volume = 2/3 πr³

Chapter 14: Statistics
Theory covers:
- Primary and secondary data
- Frequency distribution table
- Ungrouped and grouped data
- Mean: sum of all observations / total number
- Median: middle value when arranged in order
- Mode: most frequent value
- Bar graphs, histograms, frequency polygons
- Mean by direct method, assumed mean method

## 10.4 Class 9 — Science — Complete Chapter Breakdown

Chapter 1: Matter in Our Surroundings
Theory covers:
- Physical nature of matter: made of particles
- Characteristics: particles have spaces, in motion, attract each other
- States of matter: solid (definite shape, definite volume), liquid (no definite shape, definite volume), gas (neither)
- Interconversion: melting, freezing, evaporation, condensation, sublimation, deposition
- Effect of temperature and pressure on states
- Latent heat of fusion and vaporization
- Evaporation and cooling effect

Questions include:
- MCQ: "During evaporation, which particles escape from the surface?"
- Short: "Why do we feel cool after sweating?"
- MCQ: "The conversion of gas to solid without passing through liquid state is called?"
- True/False: "Gases are highly compressible" — True

Chapter 2: Is Matter Around Us Pure?
Theory covers:
- Pure substances: elements and compounds
- Mixtures: homogeneous (solutions) and heterogeneous (suspensions, colloids)
- Properties of solutions (solute, solvent, concentration)
- Tyndall effect in colloids
- Separation techniques: evaporation, distillation, fractional distillation, chromatography, crystallization, centrifugation

Chapter 3: Atoms and Molecules
Theory covers:
- Laws of chemical combination: law of conservation of mass, law of constant proportions
- Dalton's atomic theory
- Atomic mass and molecular mass
- Gram atomic mass and gram molecular mass
- Concept of mole (Avogadro's number = 6.022 × 10²³)
- Molar mass
- Chemical formulas and valency

Chapter 4: Structure of the Atom
Theory covers:
- Discovery of electrons (Thomson), protons (Rutherford), neutrons (Chadwick)
- Thomson's plum pudding model
- Rutherford's nuclear model (gold foil experiment)
- Bohr's model: electrons in orbits, energy levels K L M N
- Maximum electrons in each orbit: 2n²
- Valence electrons and valence shell
- Isotopes and isobars
- Atomic number and mass number

Chapter 5: The Fundamental Unit of Life (Cell)
Theory covers:
- Cell theory (Schleiden, Schwann, Virchow)
- Prokaryotic vs eukaryotic cells
- Cell organelles: cell membrane, cell wall, nucleus, mitochondria, chloroplast, vacuole, endoplasmic reticulum, Golgi apparatus, ribosomes, lysosomes
- Functions of each organelle
- Osmosis: movement of water from high to low concentration

Chapter 6: Tissues
Theory covers:
- Plant tissues: meristematic (apical, lateral, intercalary), permanent (simple: parenchyma, collenchyma, sclerenchyma; complex: xylem, phloem)
- Animal tissues: epithelial (squamous, cuboidal, columnar, ciliated), connective (blood, bone, cartilage, adipose, areolar), muscular (striated, smooth, cardiac), nervous

Chapter 7: Diversity in Living Organisms
Theory covers:
- Basis of classification
- Hierarchy: Kingdom, Phylum, Class, Order, Family, Genus, Species
- Five kingdoms (Monera, Protista, Fungi, Plantae, Animalia)
- Plantae: Thallophyta, Bryophyta, Pteridophyta, Gymnosperms, Angiosperms
- Animalia: Porifera, Coelenterata, Platyhelminthes, Nematoda, Annelida, Arthropoda, Mollusca, Echinodermata, Protochordata, Vertebrata
- Nomenclature: binomial nomenclature (Genus + species)

Chapter 8: Motion
Theory covers:
- Scalar vs vector quantities
- Distance vs displacement
- Speed vs velocity
- Acceleration: rate of change of velocity
- Uniform and non-uniform motion
- Equations of motion: v = u + at, s = ut + ½at², v² = u² + 2as
- Graphical representation: distance-time graph, velocity-time graph
- Uniform circular motion

Chapter 9: Force and Laws of Motion
Theory covers:
- Force: push or pull
- Balanced and unbalanced forces
- Newton's First Law (Law of Inertia)
- Newton's Second Law: F = ma
- Newton's Third Law: Action-Reaction
- Inertia and mass
- Momentum: p = mv
- Law of Conservation of Momentum
- Applications: recoil of gun, rocket propulsion

Chapter 10: Gravitation
Theory covers:
- Newton's Universal Law of Gravitation: F = Gm₁m₂/r²
- G = 6.67 × 10⁻¹¹ N⋅m²/kg²
- Free fall: acceleration due to gravity g ≈ 9.8 m/s²
- Equations of motion under gravity (taking a = g = 9.8 m/s²)
- Mass vs Weight: W = mg
- Thrust and pressure: P = F/A
- Archimedes' Principle: buoyant force
- Relative density

Chapter 11: Work and Energy
Theory covers:
- Work = Force × Displacement × cos θ
- Conditions for work to be done (force must have component in direction of displacement)
- Energy: capacity to do work
- Kinetic energy: KE = ½mv²
- Potential energy: PE = mgh
- Law of conservation of energy
- Power: P = Work/Time, SI unit = Watt
- Commercial unit: kilowatt-hour (kWh) — 1 kWh = 3.6 × 10⁶ J

Chapter 12: Sound
Theory covers:
- Sound is a mechanical wave (needs medium to travel)
- Production: vibration causes compression and rarefaction
- Characteristics: frequency (Hz), amplitude, wavelength, speed
- Speed of sound: 340 m/s in tsx watch or nodemon at 0°C
- Human hearing range: 20 Hz to 20,000 Hz
- Infrasound (below 20 Hz) and Ultrasound (above 20,000 Hz)
- Reflection of sound: echo, reverberation (>17m distance)
- SONAR principle
- Applications of ultrasound

Chapter 13: Why Do We Fall Ill?
Theory covers:
- Health: physical, mental, social well-being
- Disease: acute vs chronic
- Causes: pathogens (bacteria, viruses, fungi, protozoa, worms), deficiency, genetic
- Infectious vs non-infectious diseases
- How pathogens spread: tsx watch or nodemon, water, contact, vectors
- Means of prevention: hygiene, safe water, vaccination
- Principle of treatment vs prevention

Chapter 14: Natural Resources
Theory covers:
- Biosphere, lithosphere, hydrosphere, atmosphere
- tsx watch or nodemon: composition, importance, pollution
- Water cycle, importance of water
- Soil formation, soil composition
- Biogeochemical cycles: water, carbon, nitrogen, oxygen
- Ozone layer: depletion and its consequences

Chapter 15: Improvement in Food Resources
Theory covers:
- Crop improvement: hybridization, genetic modification
- Crop production management: irrigation, cropping patterns, manures vs fertilizers, crop protection
- Storage: silos, granaries
- Animal husbandry: cattle farming, poultry, egg, fisheries
- Apiculture (beekeeping)
- Food from animals: meat, milk, eggs, fish

## 10.5 Class 9 Social Science — Complete Chapter Coverage

All 20 chapters across History, Geography, Civics, and Economics are covered as described in the chapter lists. Each chapter has:
- 40–60 questions in the question bank
- Theory content summarizing NCERT in readable format
- YouTube links to explanation videos for each chapter
- MCQ, Short Answer, and Long Answer question types

---

# 11. CLASS 10TH PAGE & ALL SUBJECTS

## 11.1 Class 10 Overview and Importance

Class 10 is the first major milestone in Indian education. The CBSE Board exam results determine:
- Which school or college a student gets into for Class 11
- Which stream (Science/Commerce/Arts) is available to them
- Their confidence and academic self-image

EduBattle's Class 10 section is designed with extra emphasis on:
- Board exam-style question formats
- NCERT chapter completion coverage
- Previous year question patterns (marked where applicable)
- Time-pressure practice (board exams are 3 hours long)
- Chapter-wise marks weightage display

## 11.2 Class 10 — Mathematics — All 14 Chapters With Detail

Chapter 1: Real Numbers
Key concepts: Euclid's division algorithm (used to find HCF), fundamental theorem of arithmetic (every composite number has unique prime factorization), rational numbers have terminating or repeating decimal expansion, irrational numbers have non-terminating non-repeating decimal expansion.

HCF by Euclid's algorithm: if a = bq + r, then HCF(a,b) = HCF(b,r). Continue until remainder is 0. Last non-zero remainder is HCF.

Proving numbers irrational: Assume it is rational, write as p/q in lowest terms, derive contradiction.

Questions focus on: HCF and LCM using prime factorization, proving irrationality, decimal expansion type.

Chapter 2: Polynomials
Key concepts: Relationship between zeros and coefficients of quadratic polynomial ax² + bx + c:
- Sum of zeros = -b/a
- Product of zeros = c/a
For cubic polynomial ax³ + bx² + cx + d:
- Sum of zeros = -b/a
- Sum of products of pairs = c/a
- Product of all zeros = -d/a

Division algorithm for polynomials: dividend = divisor × quotient + remainder

Questions focus on: finding zeros given relationship, finding polynomial given zeros, applying division algorithm.

Chapter 3: Pair of Linear Equations in Two Variables
Key concepts:
Graphical method: plot both lines, intersection point is solution
Consistent (exactly one solution): lines intersect at one point
Inconsistent (no solution): lines are parallel (a₁/a₂ = b₁/b₂ ≠ c₁/c₂)
Infinitely many solutions: lines coincide (a₁/a₂ = b₁/b₂ = c₁/c₂)

Algebraic methods: substitution method, elimination method, cross-multiplication method

Cross multiplication: x/(b₁c₂-b₂c₁) = y/(c₁a₂-c₂a₁) = 1/(a₁b₂-a₂b₁)

Questions focus on: solving by all three methods, word problems (ages, money, speed), determining consistency.

Chapter 4: Quadratic Equations
Key concepts:
Standard form: ax² + bx + c = 0
Methods of solving: factorization, completing the square, quadratic formula
Quadratic formula: x = (-b ± √(b²-4ac)) / 2a
Discriminant: D = b² - 4ac
If D > 0: two distinct real roots
If D = 0: two equal real roots (repeated root)
If D < 0: no real roots (complex roots — not in Class 10 scope)

Nature of roots determined by discriminant without solving the equation.

Chapter 5: Arithmetic Progressions (AP)
Key concepts:
General term: aₙ = a + (n-1)d where a = first term, d = common difference
Sum of n terms: Sₙ = n/2 [2a + (n-1)d] = n/2 [a + l] where l = last term

Finding which term of AP is 0 or negative, finding number of terms, word problems involving AP.

Chapter 6: Triangles
Key concepts:
Basic Proportionality Theorem (Thales' theorem): if a line is drawn parallel to one side of a triangle, it divides the other two sides proportionally.
Converse of BPT: if a line divides two sides in same ratio, it is parallel to third side.
AAA similarity criterion, AA criterion (sufficient), SSS similarity, SAS similarity
If triangles are similar, ratio of their areas = ratio of squares of corresponding sides
Pythagoras theorem and its converse

Chapter 7: Coordinate Geometry
Key concepts:
Distance formula: d = √[(x₂-x₁)² + (y₂-y₁)²]
Section formula: P(x,y) divides line joining A(x₁,y₁) and B(x₂,y₂) in ratio m:n
x = (mx₂ + nx₁)/(m+n), y = (my₂ + ny₁)/(m+n)
Midpoint formula: x = (x₁+x₂)/2, y = (y₁+y₂)/2
Area of triangle: ½ |x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|
Collinearity: area = 0

Chapter 8: Introduction to Trigonometry
Key concepts:
Trigonometric ratios: sin, cos, tan, cosec, sec, cot in terms of opposite, adjacent, hypotenuse
Values at standard angles: 0°, 30°, 45°, 60°, 90°
Trigonometric identities: sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ, 1 + cot²θ = cosec²θ
Complementary angles: sin(90-θ) = cosθ, tan(90-θ) = cotθ

Chapter 9: Some Applications of Trigonometry
Key concepts:
Heights and distances word problems
Angle of elevation: angle above horizontal line of sight
Angle of depression: angle below horizontal line of sight
Using the trigonometric ratios to find unknown heights or distances
Multi-step problems involving two different observation points

Chapter 10: Circles
Key concepts:
Tangent to a circle: perpendicular to radius at point of contact
From external point, two tangents are equal in length
Proof of these properties using right triangle congruence

Chapter 11: Areas Related to Circles
Key concepts:
Circumference = 2πr, Area = πr²
Length of arc = (θ/360) × 2πr
Area of sector = (θ/360) × πr²
Area of segment = Area of sector - Area of triangle

Chapter 12: Surface Areas and Volumes
Key concepts:
Combination of solids: cone on cylinder, hemisphere on cylinder, etc.
Volume and surface area of each combination
Conversion of solids: sphere melted and recast into cylinders
Frustum of cone: V = πh/3 (r₁² + r₂² + r₁r₂), CSA = πl(r₁+r₂)

Chapter 13: Statistics
Key concepts:
Mean by direct method: x̄ = Σfxᵢ / Σf
Mean by assumed mean method: x̄ = a + Σfd / Σf
Mean by step deviation method: x̄ = a + (Σfu / Σf) × h
Median of grouped data using formula: M = l + [(n/2 - cf)/f] × h
Mode of grouped data: Mo = l + [(f₁-f₀)/(2f₁-f₀-f₂)] × h
Cumulative frequency curves (ogives): less than and more than ogives
Median from ogive

Chapter 14: Probability
Key concepts:
Experimental probability = number of favorable outcomes / total trials
Theoretical probability = P(E) = (number of favorable outcomes) / (total equally likely outcomes)
P(E) + P(E') = 1 (complementary events)
0 ≤ P(E) ≤ 1
Impossible event: P = 0, Certain event: P = 1
Problems with cards, dice, coins

## 11.3 Class 10 — Science — All 13 Chapters With Detail

Chapter 1: Chemical Reactions and Equations
Writing chemical equations, balancing equations, types of reactions (combination, decomposition, displacement, double displacement, oxidation-reduction), exothermic vs endothermic, corrosion, rancidity.

Chapter 2: Acids, Bases and Salts
Properties of acids and bases, pH scale, neutralization reaction, salts (formation, pH), important salts (washing soda, baking soda, bleaching powder, plaster of Paris), water of crystallization.

Chapter 3: Metals and Non-metals
Physical and chemical properties, reactivity series, extraction of metals (thermite reaction, electrolytic refining), alloys, corrosion prevention.

Chapter 4: Carbon and Its Compounds
Bonding in carbon (covalent), structural isomers, nomenclature of carbon compounds, functional groups, homologous series, chemical properties (combustion, oxidation, addition, substitution), ethanol and ethanoic acid, saponification.

Chapter 5: Life Processes
Nutrition (autotrophic: photosynthesis, heterotrophic), respiration (aerobic and anaerobic, glycolysis, ATP), transportation (heart, blood, lymph, xylem, phloem), excretion (Bowman's capsule, nephron, dialysis).

Chapter 6: Control and Coordination
Nervous system: neuron, synapse, reflex arc, brain (forebrain, midbrain, hindbrain), spinal cord.
Hormones: endocrine glands, tropic hormones, feedback mechanism. Plant hormones: auxin, gibberellin, cytokinin, abscisic acid.

Chapter 7: How Do Organisms Reproduce?
Types of reproduction: asexual (binary fission, budding, fragmentation, spore formation, vegetative propagation) and sexual. Reproduction in flowering plants: pollination, fertilization, seed and fruit formation. Human reproductive system: male and female anatomy, menstrual cycle, fertilization, development.

Chapter 8: Heredity and Evolution
Mendel's experiments: monohybrid (3:1) and dihybrid (9:3:3:1) crosses, law of segregation, law of independent assortment. Sex determination in humans (XX/XY). Variations and evolution, natural selection, speciation, human evolution.

Chapter 9: Light — Reflection and Refraction
Laws of reflection, image in plane mirror, spherical mirrors (concave and convex), mirror formula: 1/v + 1/u = 1/f, magnification: m = -v/u. Refraction: laws, refractive index, Snell's law. Lenses: convex and concave, lens formula: 1/v - 1/u = 1/f, power of lens P = 1/f.

Chapter 10: Human Eye and Colourful World
Structure of human eye, defects: myopia (concave lens), hypermetropia (convex lens), presbyopia. Atmospheric refraction: twinkling of stars, advance sunrise. Prism: dispersion, spectrum, rainbow. Scattering: Tyndall effect, blue sky, red sunset.

Chapter 11: Electricity
Electric potential and potential difference, Ohm's law V = IR, resistance, resistivity. Resistors in series: R_total = R₁+R₂+... Resistors in parallel: 1/R_total = 1/R₁+1/R₂+... Electric power P = VI = I²R = V²/R, energy = P×t.

Chapter 12: Magnetic Effects of Electric Current
Magnetic field, magnetic field lines, field due to current in straight conductor (right-hand rule), solenoid. Electromagnetic induction, Fleming's right-hand rule. Electric motor (Fleming's left-hand rule), generator. Domestic electric circuits: live, neutral, earth wires, fuse, MCB.

Chapter 13: Our Environment
Food chains and food webs, trophic levels, energy flow (10% rule), ecosystem, biodiversity. Environmental problems: ozone layer depletion (CFCs), waste management.

---

# 12. CLASS 11TH PAGE & ALL SUBJECTS

## 12.1 Class 11 Overview

Class 11 introduces specialization. The platform first asks the user which stream they are in:
- Science Stream: Physics, Chemistry, Mathematics or Biology, English, Computer Science/Physical Education
- Commerce Stream: Accountancy, Business Studies, Economics, English, Mathematics (optional)
- Arts Stream: History, Political Science, Economics, Geography, English

EduBattle fully covers Science and Commerce streams. Arts stream coverage is partial at launch.

## 12.2 Class 11 — Physics — All Units With Subtopic Detail

Unit I — Physical World and Measurement (Chapters 1–2)
Subtopics: Physical quantities, fundamental and derived units, SI system, significant figures, errors in measurement (absolute, relative, percentage), dimensions of physical quantities, dimensional analysis (principle of homogeneity), applications of dimensional analysis.

Important relationships for this unit:
- The 7 fundamental SI quantities: length (m), mass (kg), time (s), electric current (A), temperature (K), luminous intensity (cd), amount of substance (mol)
- Dimensional formula of force: [MLT⁻²]
- Dimensional formula of pressure: [ML⁻¹T⁻²]
- Dimensional formula of work/energy: [ML²T⁻²]

Unit II — Kinematics (Chapters 3–4)
Subtopics: Frame of reference, rest and motion, types of motion, displacement and distance, speed and velocity, average speed/velocity, instantaneous speed/velocity, acceleration, equations of uniformly accelerated motion, projectile motion, uniform circular motion.

Projectile motion breakdown:
- Horizontal: x = u cosθ × t (no acceleration horizontally)
- Vertical: y = u sinθ × t - ½gt²
- Maximum height: H = u²sin²θ / 2g
- Time of flight: T = 2u sinθ / g
- Horizontal range: R = u²sin2θ / g
- Maximum range when θ = 45°

Circular motion: centripetal acceleration a = v²/r = ω²r, centripetal force F = mv²/r

Unit III — Laws of Motion (Chapter 5)
Subtopics: Newton's three laws in detail, inertia, momentum, impulse, friction (static, kinetic, rolling), circular motion dynamics, banking of roads, spring force (Hooke's law).

Friction subtopics:
- Static friction: adjusts up to maximum (f_s = μₛN)
- Kinetic friction: constant when sliding (f_k = μₖN)
- μₛ > μₖ always
- Rolling friction is least among the three

Unit IV — Work, Energy, and Power (Chapter 6)
Subtopics: Work done by constant force, work done by variable force (graphical), work-energy theorem, conservative and non-conservative forces, potential energy (gravitational, spring elastic), law of conservation of energy, power, collision (elastic and inelastic), coefficient of restitution.

Energy conservation: KE + PE = constant (for conservative forces)
Elastic collision: momentum conserved + kinetic energy conserved
Perfectly inelastic collision: momentum conserved, maximum KE lost

Unit V — Motion of System of Particles and Rigid Body (Chapter 7)
Subtopics: Centre of mass, motion of centre of mass, angular displacement, velocity, acceleration, torque, moment of inertia, parallel and perpendicular axis theorems, rolling motion (rolling without slipping).

Moment of inertia examples:
- Solid sphere: I = 2/5 mr²
- Hollow sphere: I = 2/3 mr²
- Solid cylinder: I = 1/2 mr²
- Hollow cylinder (ring): I = mr²
- Disc: I = 1/2 mr²
- Rod (about center): I = 1/12 ml²

Unit VI — Gravitation (Chapter 8)
Subtopics: Kepler's laws (law of orbits — ellipse, law of areas — equal areas in equal time, law of periods — T² ∝ r³), Newton's law of gravitation, acceleration due to gravity variation (with altitude, depth, latitude), gravitational potential energy, escape velocity, orbital velocity, satellite motion, geostationary satellites.

Escape velocity: v_e = √(2gR) = √(2GM/R) ≈ 11.2 km/s on Earth
Orbital velocity: v_o = √(gR) = √(GM/R) ≈ 7.9 km/s for low orbit

Units VII–X cover Properties of Matter, Thermodynamics, Kinetic Theory, Oscillations, and Waves with equal detail.

## 12.3 Class 11 — Chemistry — All Units With Subtopic Detail

Unit 1 — Some Basic Concepts of Chemistry
Subtopics: Laws of chemical combination (conservation of mass, constant proportion, multiple proportion, Gay-Lussac's law of gaseous volumes, Avogadro's law), atomic and molecular mass, molar mass, mole concept, stoichiometry, limiting reagent, percentage composition, empirical and molecular formula.

Key calculations:
Number of moles = mass / molar mass
Number of particles = moles × 6.022 × 10²³
Concentration (molarity) = moles of solute / volume of solution in L

Unit 2 — Structure of Atom
Subtopics: Atomic models (Thomson, Rutherford, Bohr), quantum numbers (n, l, ml, ms), shapes of orbitals (s, p, d), aufbau principle, Pauli exclusion principle, Hund's rule, electronic configuration, stability of half-filled and fully-filled subshells, dual nature of matter (de Broglie), Heisenberg uncertainty principle.

Quantum numbers:
- n (principal): 1, 2, 3... determines energy and size
- l (azimuthal): 0 to n-1, determines shape (s=0, p=1, d=2, f=3)
- ml (magnetic): -l to +l, determines orientation
- ms (spin): +1/2 or -1/2

Unit 3 — Classification of Elements and Periodicity in Properties
Subtopics: Historical development of periodic table, modern periodic law, periodic trends (atomic radius, ionic radius, ionization enthalpy, electron gain enthalpy, electronegativity), anomalous properties of second period elements.

Trends across period (left to right): atomic radius decreases, ionization energy increases, electronegativity increases.
Trends down group: atomic radius increases, ionization energy decreases, electronegativity decreases.

Unit 4 — Chemical Bonding and Molecular Structure
Subtopics: Ionic bond (electron transfer, lattice energy, Born-Haber cycle), covalent bond (electron sharing), Lewis structures, formal charge, VSEPR theory (predicts shape), hybridization (sp, sp², sp³, sp³d, sp³d²), molecular orbital theory (bonding vs antibonding orbitals, bond order), hydrogen bonding (inter and intramolecular).

VSEPR shapes:
- 4 bond pairs, 0 lone pairs: tetrahedral (CH₄)
- 3 bond pairs, 1 lone pair: trigonal pyramidal (NH₃)
- 2 bond pairs, 2 lone pairs: bent/V-shaped (H₂O)

All remaining Class 11 Chemistry units covered with similar depth.

## 12.4 Class 11 — Accounts (Accountancy) — Detailed Coverage

Chapter 1: Introduction to Accounting
What is accounting, objectives of accounting, branches (financial, cost, management), users of accounting information, accounting cycle, accounting equation: Assets = Liabilities + Capital.

Chapter 2: Theory Base of Accounting
GAAP (Generally Accepted Accounting Principles), accounting concepts (going concern, consistency, prudence, materiality, cost concept, accrual, dual aspect, matching, realization), accounting standards (Indian AS vs IFRS), systems of accounting (cash basis vs accrual basis).

Chapter 3: Recording of Transactions I
Vouchers and source documents, types of accounts (personal, real, nominal), rules of debit and credit (traditional approach), journal entries, compound journal entries, special journals.

Chapter 4: Recording of Transactions II
Ledger: format and posting from journal, balancing accounts, cash book (simple, double column, triple column), petty cash book.

Chapter 5: Bank Reconciliation Statement (BRS)
Reasons for difference between cash book and pass book balance, preparation of BRS by adjusting either balance.

Chapter 6: Trial Balance and Rectification of Errors
Purpose of trial balance, preparation, classification of errors (errors of omission, commission, principle, compensating errors), suspense account.

---

# 13. CLASS 12TH PAGE & ALL SUBJECTS

## 13.1 Class 12 Overview

Class 12 is the most critical academic year. Students face:
- CBSE Board exams (February–March)
- JEE Mains (January and April)
- JEE Advanced (May)
- NEET (May)
- CA Foundation

EduBattle's Class 12 section bridges NCERT board preparation with entrance exam difficulty questions. Each chapter shows a "Board Level" and "JEE Level" toggle for engineering students.

## 13.2 Class 12 — Physics — All 14 Chapters With Detail

Chapter 1: Electric Charges and Fields
Subtopics: Properties of electric charges, Coulomb's law, superposition principle, electric field, electric field lines, electric flux, Gauss's law and applications (infinite wire, infinite plane sheet, solid sphere, hollow sphere).

Coulomb's law: F = kq₁q₂/r² where k = 1/(4πε₀) = 9×10⁹ N⋅m²/C²
Gauss's law: Φ = q_enclosed / ε₀

Electric field due to a uniformly charged sphere:
- Outside (r > R): E = q/(4πε₀r²) — same as point charge
- On surface (r = R): E = q/(4πε₀R²) — maximum
- Inside (r < R): E = 0 for conductor, E = qr/(4πε₀R³) for insulator

Chapter 2: Electrostatic Potential and Capacitance
Subtopics: Electric potential, potential due to point charge, potential due to dipole, potential due to uniformly charged sphere, equipotential surfaces, relation between field and potential (E = -dV/dr), capacitors (parallel plate, spherical, cylindrical), dielectrics, energy stored in capacitor, capacitors in series and parallel.

Energy stored in capacitor: U = ½CV² = ½QV = Q²/2C

Chapter 3: Current Electricity
Subtopics: Electric current, drift velocity, resistivity, temperature dependence of resistivity, Ohm's law, V-I characteristics, EMF and internal resistance, Kirchhoff's laws (KVL and KCL), Wheatstone bridge, meter bridge, potentiometer (comparison of EMFs, internal resistance).

Kirchhoff's laws:
KCL: Sum of currents at a junction = 0 (ΣI = 0)
KVL: Sum of EMFs = Sum of potential drops in a closed loop

Chapter 4: Moving Charges and Magnetism
Subtopics: Magnetic force on charge (Lorentz force), motion in magnetic field, velocity selector, cyclotron, Biot-Savart law, magnetic field due to straight wire and circular loop, Ampere's law, solenoid and toroid field, force between parallel currents, torque on current loop, moving coil galvanometer.

Lorentz force: F = q(v × B)
Biot-Savart: dB = (μ₀/4π) × (I dl × r̂)/r²
Ampere's law: ∮ B⋅dl = μ₀I_enclosed

Chapter 5: Magnetism and Matter
Subtopics: Bar magnet, magnetic field lines, magnetic dipole moment, torque on magnetic dipole, Earth's magnetic field (geographic north/south vs magnetic north/south), magnetic properties of materials (dia, para, ferromagnetic), hysteresis curve.

Chapter 6: Electromagnetic Induction
Subtopics: Magnetic flux, Faraday's laws, Lenz's law (direction of induced current), motional EMF (E = Blv), self-inductance, mutual inductance, energy stored in inductor (U = ½LI²), AC generator.

Faraday's law: E = -dΦ/dt
Self-inductance of solenoid: L = μ₀n²V

Chapter 7: Alternating Current
Subtopics: AC circuit with resistor, inductor, capacitor individually, impedance, phasors, series LCR circuit, resonance, Q-factor, power in AC circuits (power factor), transformer (step-up, step-down).

Resonance in LCR: ω₀ = 1/√(LC)
Power factor: cos φ = R/Z

Chapter 8: Electromagnetic Waves
Subtopics: Displacement current, Maxwell's equations (conceptual), EM wave properties (transverse, speed of light in vacuum), electromagnetic spectrum (radio, microwave, infrared, visible, UV, X-ray, gamma).

Chapter 9: Ray Optics and Optical Instruments
Subtopics: Reflection at curved surfaces (mirrors), refraction at plane surface, total internal reflection, prism, optical fiber, refraction at spherical surfaces, lenses, lens maker's equation (1/f = (n-1)[1/R₁ - 1/R₂]), power of combination of lenses, magnification, microscope, telescope.

Mirror formula: 1/v + 1/u = 1/f (with sign convention)
Lens formula: 1/v - 1/u = 1/f

Chapter 10: Wave Optics
Subtopics: Huygens' principle, wavefront, interference (constructive and destructive), Young's double slit experiment (YDSE), fringe width β = λD/d, coherent sources, diffraction (single slit), polarization (Malus' law: I = I₀cos²θ).

YDSE fringe width: β = λD/d where λ = wavelength, D = distance to screen, d = slit separation

Chapter 11: Dual Nature of Radiation and Matter
Subtopics: Photoelectric effect, Einstein's equation (KE_max = hν - φ where φ = work function), Millikan's experiment, de Broglie hypothesis (λ = h/mv), wave-particle duality.

Einstein's photoelectric equation: hν = φ + ½mv²_max

Chapter 12: Atoms
Subtopics: Rutherford's atom, Bohr model (energy levels, angular momentum quantization), spectral series of hydrogen (Lyman, Balmer, Paschen, Brackett, Pfund), ionization energy.

Energy of nth orbit in hydrogen: Eₙ = -13.6/n² eV
Radius of nth orbit: rₙ = 0.529 × n² Å

Chapter 13: Nuclei
Subtopics: Composition of nucleus, nuclear radius (R = R₀A^(1/3)), mass defect and binding energy, nuclear forces, radioactivity (alpha, beta, gamma decay), radioactive decay law (N = N₀e^(-λt)), half-life (T₁/₂ = 0.693/λ), nuclear fission and fusion.

Chapter 14: Semiconductor Electronics
Subtopics: Energy bands (conductor, semiconductor, insulator), intrinsic and extrinsic semiconductors (n-type and p-type), p-n junction (depletion region, forward and reverse bias), half-wave and full-wave rectifier, Zener diode, transistors (NPN and PNP, CB, CE, CC configurations), logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR), Boolean algebra.

Logic gate truth tables:
AND: output = 1 only when both inputs = 1
OR: output = 1 when any input = 1
NOT: output is complement of input
NAND = NOT of AND
NOR = NOT of OR

## 13.3 Class 12 — Accounts — Advanced Topics

Chapter 1: Accounting for Partnership Firms
Partnership deed, fixed vs fluctuating capital accounts, profit and loss appropriation account, goodwill (nature, valuation: average profit method, super profit method, capitalization method), admission of partner (new profit sharing ratio, sacrificing ratio, revaluation), retirement/death of partner, dissolution.

Chapter 2: Company Accounts
Shares (equity vs preference), issue at par/premium/discount, forfeiture and reissue, debentures (types, issue, interest), redemption, financial statements of companies (Balance Sheet, P&L, Cash Flow Statement).

---

# 14. ENGINEERING PAGE & ALL PROGRAMMING LANGUAGES

## 14.1 Engineering Landing Page — Full Specification

URL: /engineering

The engineering page is designed for two audiences:
1. Engineering/college students who need to learn programming
2. Class 11–12 Computer Science students

Page sections:

Section 1 — Hero:
Title: "Engineering — Learn Programming the Battle Way"
Tagline: "Choose your language. Follow the day plan. Practice with questions. Battle opponents."
Sub-text: "12 programming languages with structured day-by-day learning plans. Theory, questions, and YouTube links for every single day."

Section 2 — Language Cards (Main Content):
12 language cards in a 3-column grid on desktop, 2-column on tablet, 1-column on mobile.

Each card contains:
- Language logo (official logo in appropriate color)
- Language name (large, bold)
- Difficulty badge: "Beginner" / "Intermediate" / "Advanced"
- Plan duration: "30 Days" / "45 Days" / "60 Days"
- Total questions in question bank
- Number of current learners (live count from database)
- One-line description of what the language is best for
- "Start Plan" button

Section 3 — Which Language Should I Choose?
A comparison table or guide:
"Just starting out? Start with C Language or Python"
"Want to build websites? Start with JavaScript"
"Want Android apps? Start with Kotlin or Java"
"Want iOS apps? Start with Swift"
"Want to ace placements? Do DSA after any language"
"Want system programming? Try TypeScript or Rust"

Section 4 — Completion Badges Preview:
Shows all 12 "Language Master" badges that can be earned
"Earn a badge by completing all days and passing the final assessment"

## 14.2 Language Overview Page — Specification

When a user clicks on a language, they reach the Language Overview Page.

URL: /engineering/c-language (example)

Layout:

Top Section — Language Info Card:
- Language name and logo (large)
- One-paragraph description of what the language is and where it's used
- Prerequisites section: "What you should know before starting"
- Learning outcomes: "By the end of Day 30, you will be able to..."
- Famous companies that use this language
- Job roles that use this language
- Average salary for this skill in India (freshers)

Middle Section — Day Plan Grid:
A grid of day cards — one for each day of the plan.

Each day card:
- Day number prominently displayed (e.g., "Day 7")
- Topic name (e.g., "Functions in C")
- Number of subtopics covered
- Number of questions available
- Points obtainable (if all correct)
- Status indicator:
  - Completed (green checkmark + "Review" button)
  - In Progress (blue pulsing border + "Continue" button)
  - Locked/Future (slightly faded + "Start" button, click to begin)
  - Skipped/Missed (orange badge + "Catch Up" button)

The grid is paginated or scrollable.

Bottom Section — Progress Summary:
"You've completed 7 of 30 days — 23%"
"At your current pace, you'll finish in 23 more days"
"Next milestone: Day 10 — Arrays (unlocks Level 2 C badge)"

## 14.3 Day Content Page — Specification

URL: /engineering/c-language/day/7

This is where the actual learning happens for engineering students.

Page structure:

Top breadcrumb: Engineering > C Language > Day 7

Left side (60% of width on desktop):
- Day number and topic title: "Day 7 — Functions in C"
- Estimated reading time: "~12 minutes to read"
- "Watch Video First" button with YouTube link
- Full theory content rendered from Markdown
- YouTube help link button again at the bottom of theory
- Sub-topic navigation: links to each sub-topic within the day

Right side (40% of width on desktop — sticky):
- Day progress: "0 of 8 questions answered"
- Points earned today: "0 / 34 points"
- "Start Questions" button (appears after theory section is scrolled through)

Below theory:
Question section begins.

Question display format:
- Question number: "Question 1 of 8"
- Question text (with syntax highlighting if code is included)
- YouTube help link button (small, below question text — visible at all times)
- Answer input:
  - MCQ: Four option cards — click to select
  - True/False: Two large cards
  - Short Answer: Single-line text input
  - Long Answer: Multi-line textarea
- "Submit Answer" button

After submitting:
- Correct: Green flash, check mark animation, correct sound, "+3 Points" floating text
- Wrong: Red flash, shake animation, wrong sound, correct answer revealed
- Explanation text expands below the answer
- YouTube link highlighted: "Watch this explanation →"
- "Next Question" button appears

After all questions answered:
- Celebration animation if 80%+ correct
- Summary card: X of Y questions correct, Z points earned
- XP and Sparks notification
- "Continue to Day 8" button or "Review Mistakes" button

---

# 15. C LANGUAGE — 30 DAY PLAN (FULL DETAIL)

## 15.1 C Language — Complete Overview

C Language is not just a programming language — it is the foundation of computing itself. Written by Dennis Ritchie at Bell Labs in 1972, C became the language in which operating systems, compilers, interpreters, and virtually all system software was written.

Understanding C means understanding:
- How the computer actually works (memory, registers, addresses)
- Why higher-level languages are designed the way they are
- How to write programs that are efficient and predictable

The C language 30-day plan on EduBattle is structured to take a complete beginner from zero to being able to:
- Write console programs that solve real problems
- Understand memory management and pointers
- Implement fundamental data structures from scratch
- Be prepared for C++ and systems programming

## 15.2 Day 1: Introduction to C Programming

Topics covered in full:
History of C — who created it, when, why, what came before (BCPL, B), what came after (C++, Java, TypeScript)
Relevance of C today — Linux kernel, embedded systems, firmware, compilers
Setting up environment — GCC installation on Windows (MinGW), Mac (Xcode command line tools), Linux (usually pre-installed)
VS Code setup for C development — extensions (C/C++ extension by Microsoft), launch.json configuration
Structure of a C program:
- Comments (// single line, /* multi-line */)
- Preprocessor directives (#include)
- The main() function — why it exists, why it returns int
- Statements and semicolons
- The return 0 statement
printf() function — the "print formatted" function, format string, escape sequences (\n, \t, \\, \", \0)
Compilation process in detail:
- Source code (.c file) written by programmer
- Preprocessor processes #directives, removes comments, expands macros
- Compiler translates C to assembly language
- Assembler converts assembly to object code (.o file)
- Linker combines object files and libraries into executable
- Result: a binary executable

YouTube link for Day 1: Points to "Learn C in 1 hour" or CS50 Week 1 video on YouTube

Day 1 Questions (8 questions):

Question 1 (MCQ — 2 points):
Text: "Who created the C programming language?"
Options: (a) Bjarne Stroustrup (b) Dennis Ritchie (c) James Gosling (d) Guido van Rossum
Answer: (b) Dennis Ritchie
Explanation: Dennis Ritchie created C at Bell Labs in 1972. Stroustrup created C++, Gosling created Java, van Rossum created Python.

Question 2 (MCQ — 2 points):
Text: "What is the correct extension for C source files?"
Options: (a) .java (b) .py (c) .c (d) .cpp
Answer: (c) .c
Explanation: C source files use the .c extension. Java uses .java, Python uses .py, C++ uses .cpp or .cxx.

Question 3 (MCQ — 2 points):
Text: "Which function is the entry point of every C program?"
Options: (a) start() (b) begin() (c) main() (d) init()
Answer: (c) main()
Explanation: Every C program must have exactly one main() function. Program execution begins from the first statement inside main().

Question 4 (True/False — 1 point):
Text: "C is a high-level programming language."
Answer: True
Explanation: C is classified as a high-level language because it uses human-readable syntax. However, it is much closer to machine code than languages like Python or Java, which is why it is sometimes called a "middle-level" language informally.

Question 5 (MCQ — 2 points):
Text: "What does #include <stdio.h> do in a C program?"
Options: (a) Defines the main function (b) Includes the standard input/output library (c) Prints to the screen (d) Declares variables
Answer: (b) Includes the standard input/output library
Explanation: The #include directive tells the preprocessor to include the contents of stdio.h (standard input output header file) which contains declarations for printf, scanf, and other I/O functions.

Question 6 (Short Answer — 3 points):
Text: "What is the purpose of the return 0 statement at the end of main() in C?"
Correct answer: It signals to the operating system that the program completed successfully. By convention, returning 0 means success and any non-zero value indicates an error.
Acceptable variations: "tells OS program exited successfully", "signals successful completion"

Question 7 (MCQ — 2 points):
Text: "Which of the following correctly prints 'Hello World' in C?"
Options: (a) print("Hello World") (b) printf('Hello World') (c) printf("Hello World"); (d) console.log("Hello World")
Answer: (c) printf("Hello World");
Explanation: printf uses double quotes for the format string and requires a semicolon at the end. Option (a) is Python syntax. Option (b) uses single quotes (wrong for printf). Option (d) is JavaScript.

Question 8 (Short Answer — 3 points):
Text: "List the four steps of the C compilation process in order."
Correct answer: 1) Preprocessing, 2) Compilation, 3) Assembly, 4) Linking
Explanation: The preprocessor handles directives, compiler translates to assembly, assembler converts to object code, linker combines everything into an executable.

## 15.3 Day 2: Variables, Data Types, and User Input

Topics covered in full:
Variables — named storage locations in memory
Variable naming rules: can contain letters, digits, underscores; cannot start with digit; case-sensitive; no reserved keywords
Data types and their sizes (may vary by system):
- char: 1 byte, stores a single character or small integer (-128 to 127 or 0 to 255)
- int: typically 4 bytes on 32-bit/64-bit systems (-2,147,483,648 to 2,147,483,647)
- short: 2 bytes (-32,768 to 32,767)
- long: 4 or 8 bytes (platform dependent)
- long long: 8 bytes (-9.2×10¹⁸ to 9.2×10¹⁸)
- float: 4 bytes, ~7 decimal digits precision
- double: 8 bytes, ~15 decimal digits precision
- long double: 10 or 16 bytes (platform dependent)
sizeof operator: determines size of any type or variable
Format specifiers for printf and scanf:
- %d — int
- %i — int (same as %d for output, different for input)
- %f — float
- %lf — double (for scanf with double; printf accepts %f for both)
- %c — char
- %s — string (char array)
- %u — unsigned int
- %ld — long int
- %lld — long long int
- %o — octal, %x — hexadecimal
scanf() function — reading user input
- Requires & (address-of operator) for non-string variables
- Why &: scanf needs to know WHERE to write the value, not the current value
Declaring and initializing variables: int x = 5;
Declaration without initialization: int x; (value is garbage/undefined)
Constants using const keyword: const int MAX = 100;
Constants using #define: #define MAX 100
Difference between const and #define

YouTube link for Day 2: Points to beginner variables and data types C tutorial

Day 2 Questions (9 questions):

Question 1 (MCQ — 2 points):
Text: "Which data type stores a decimal number like 3.14 in C?"
Options: (a) int (b) char (c) float (d) bool
Answer: (c) float
Explanation: float stores decimal (floating-point) numbers. int stores whole numbers, char stores characters, bool doesn't exist in standard C (it's in C++ or via stdbool.h).

Question 2 (MCQ — 2 points):
Text: "What format specifier is used to read a double with scanf?"
Options: (a) %f (b) %d (c) %lf (d) %g
Answer: (c) %lf
Explanation: For scanf, %f reads float and %lf reads double. Note: for printf, %f works for both float and double due to default argument promotion.

Question 3 (MCQ — 2 points):
Text: "What is the output of: printf('%d', sizeof(int)); on a 64-bit system?"
Options: (a) 2 (b) 4 (c) 8 (d) Platform dependent
Answer: (d) Platform dependent
Explanation: The size of int is platform-dependent. On most 32-bit and 64-bit systems it is 4 bytes, but the C standard only guarantees int is at least 2 bytes.

Question 4 (Short Answer — 3 points):
Text: "Why does scanf require the & symbol before variable names (for non-string variables)?"
Answer: scanf needs the memory address of the variable to write the value into. Without &, you pass the current value of the variable (which could be garbage), not the location. The & operator gives the memory address.

Question 5 (MCQ — 2 points):
Text: "Which of the following is a valid variable name in C?"
Options: (a) 2age (b) my-name (c) _score (d) for
Answer: (c) _score
Explanation: (a) starts with a digit — invalid. (b) contains hyphen — invalid (hyphen is subtraction operator). (d) is a reserved keyword. (c) _score is valid — underscore at start is legal.

Question 6 (True/False — 2 points):
Text: "In C, variable names are case-sensitive. So 'score' and 'Score' are different variables."
Answer: True
Explanation: C is case-sensitive. int score; and int Score; declare two completely different variables.

Question 7 (Short Answer — 3 points):
Text: "What is the difference between 'const int MAX = 100;' and '#define MAX 100'?"
Answer: const int creates a variable with type information, is stored in memory, can be debugged, and is scope-aware. #define is a preprocessor directive that does simple text substitution before compilation — it has no type, no memory allocation, and no scope. const is generally preferred in modern C programming.

Question 8 (MCQ — 2 points):
Text: "What does 'int x;' without initialization contain?"
Options: (a) 0 (b) NULL (c) Garbage/undefined value (d) -1
Answer: (c) Garbage/undefined value
Explanation: In C, local variables that are declared but not initialized contain whatever random data was in that memory location. This is a common source of bugs. Always initialize variables before use.

Question 9 (Short Answer — 4 points):
Text: "Declare a variable for each of the following: a student's age (integer), their GPA (decimal), their grade letter (single character), and their name (assume max 50 characters)."
Answer: int age; float gpa; char grade; char name[50];
Explanation: age uses int, GPA uses float (or double for more precision), grade uses char, name uses a character array (string in C).

## 15.4 Day 3: Operators in C

Topics covered in full:
Arithmetic operators: + (addition), - (subtraction), * (multiplication), / (division), % (modulus/remainder)
Division behavior: integer/integer = integer (truncated). 7/2 = 3, not 3.5. To get 3.5: use 7.0/2 or cast (float)7/2
Modulus: only works with integers. 7%3 = 1 (remainder after dividing 7 by 3)
Relational operators: == (equal to), != (not equal to), < (less than), > (greater than), <= (less than or equal), >= (greater than or equal)
These return 1 (true) or 0 (false) in C
Logical operators: && (AND — both conditions must be true), || (OR — at least one must be true), ! (NOT — inverts the boolean)
Short-circuit evaluation: && stops evaluating if first is false; || stops evaluating if first is true
Assignment operators: = (assign), += (add and assign), -= (subtract and assign), *= (multiply), /= (divide), %= (modulo assign)
x += 5 is shorthand for x = x + 5
Increment and decrement: ++ (add 1), -- (subtract 1)
Prefix: ++x → increment first, then use the value
Postfix: x++ → use the value first, then increment
Example: int x=5; int y = x++; → y=5, x=6. int z = ++x; → x=7, z=7
Bitwise operators: & (AND), | (OR), ^ (XOR), ~ (NOT/complement), << (left shift), >> (right shift)
These operate on individual bits of integers
Left shift by n = multiply by 2ⁿ, Right shift by n = divide by 2ⁿ (for positive integers)
Ternary (conditional) operator: condition ? value_if_true : value_if_false
Example: int max = (a > b) ? a : b; — gives the larger of a and b
Comma operator: allows multiple expressions where one is expected
sizeof operator: gives size in bytes of a type or variable
Operator precedence: determines order of evaluation. Higher precedence evaluated first.
Precedence order (high to low): (), ++/--, */%, +/-, comparison, logical, ternary, assignment

## 15.5 Day 4 through Day 30 — Complete Summary

Day 4: Conditional Statements — if, if-else, if-else-if ladder, nested if, switch statement with case/break/default, dangling else problem, when to prefer switch vs if-else

Day 5: Loops in C — while loop syntax and flow, do-while (guaranteed at least one execution), for loop (init;condition;update), nested loops, break (exits innermost loop), continue (skips to next iteration), goto (and why it's harmful to code readability), infinite loops

Day 6: Functions — definition, declaration (prototype), calling, parameters vs arguments, return types, void functions, call by value (copy made), call by reference (pointer passed), local vs global scope, static variables in functions, recursion definition and base case importance, recursive factorial example, recursive Fibonacci

Day 7: Arrays — declaration and initialization, accessing elements with index (0-based), off-by-one errors, 2D arrays, passing arrays to functions (decays to pointer), array traversal, linear search, find max/min, reverse array

Day 8: Strings in C — strings as char arrays with null terminator '\0', string literals, gets() (unsafe) vs fgets(), puts(), scanf for strings, string.h library functions: strlen, strcpy, strcat, strcmp, strcmpi, strrev, strupr, strlwr, sprintf, sscanf

Day 9: Pointers — what is a memory address, address-of operator &, pointer variables, dereference operator *, pointer types match pointed type, null pointer (int *p = NULL), pointer arithmetic (incrementing pointer moves by sizeof(type)), pointers and arrays (array name is address of first element), pointer to pointer, dangling pointer (points to freed memory), wild pointer (uninitialized pointer)

Day 10: Dynamic Memory Allocation — stack vs heap memory, static allocation (compile time), dynamic allocation (runtime), stdlib.h, malloc(size_in_bytes) returns void* or NULL if failed, calloc(count, size) allocates and zeros memory, realloc(ptr, new_size) resizes allocation, free(ptr) releases memory, memory leak definition and consequences, always NULL check after malloc/calloc

Day 11: Structures — struct keyword, defining a structure (template/blueprint), creating struct variables, member access with dot operator (.), typedef to create cleaner names, nested structures (struct inside struct), array of structures, pointers to structures with arrow operator (->), structure padding and alignment

Day 12: Unions and Enumerations — union definition (all members share same memory), union size equals largest member, when to use unions (type-safe data conversion, memory optimization), enum keyword, defining enum values, default integer values (0, 1, 2...), custom values, using enum for state machines, enum vs #define vs const for named constants

Day 13: File Handling — why file handling, FILE pointer, fopen() modes: "r" (read), "w" (write, create/truncate), "a" (append), "r+" (read+write), "w+" (write+read, truncate), "rb"/"wb" (binary), fclose() to flush buffer and close, fprintf, fscanf, fgets, fputs, fread, fwrite for binary, fseek(file, offset, SEEK_SET/SEEK_CUR/SEEK_END), ftell() gets current position, rewind() goes to start, feof() checks end of file, ferror() checks errors

Day 14: Preprocessor Directives — what the C preprocessor does (text substitution before compilation), #include (with angle brackets for system headers, quotes for local), #define (constants and function-like macros), parameterized macros with side effects (why macros can be dangerous), #ifdef / #ifndef / #endif (conditional compilation), #if / #elif / #else, header guards (#ifndef MYHEADER_H / #define MYHEADER_H / #endif), predefined macros (__FILE__, __LINE__, __DATE__, __TIME__, __STDC__)

Day 15: Error Handling and Debugging — types of errors (syntax errors caught by compiler, runtime errors crash the program, logical errors wrong output but no crash), errno global variable set by failed system calls, perror() prints human-readable error message, strerror(errno) returns error string, assert() macro for debugging (disabled in release builds with NDEBUG), GDB debugger basics (set breakpoint, run, next, step, print, backtrace), reading compiler warnings (always compile with -Wall -Wextra)

Days 16–20: Data Structures implemented in C — Linked Lists (singly: insert at beginning/end/position, delete, traverse, search; doubly: forward and backward traversal, easier deletion), Stacks (using arrays and linked lists, push, pop, peek, isEmpty, isFull, applications: expression evaluation, undo), Queues (using arrays: circular queue to prevent phantom overflow; using linked lists; enqueue, dequeue, front, rear; applications: BFS, printer queue, CPU scheduling), Sorting Algorithms (bubble sort, selection sort, insertion sort, merge sort, quick sort — each with detailed step-by-step logic, time complexity analysis), Searching (linear search O(n), binary search O(log n) on sorted array, binary search recursive and iterative versions)

Days 21–25: Advanced Data Structures — Binary Trees (terminology, tree traversals: inorder/preorder/postorder, Binary Search Tree: insert/delete/search), Hash Tables (hash function, collision: chaining and open addressing, load factor), Graphs (adjacency matrix and adjacency list representation, BFS using queue, DFS using stack or recursion)

Days 26–28: Advanced C Topics — Bitwise manipulation tricks (checking bits, setting bits, clearing bits, toggling bits, bit masks), Modular Programming (multiple .c files, extern keyword, static keyword for file scope, compiling multiple files, libraries), Function Pointers (declaring, assigning, calling, using with qsort, array of function pointers, void pointers for generic programming)

Day 29: Mini Projects — Student grade calculator (using structs, file I/O, functions), Simple linked-list phonebook, Bank account simulation

Day 30: Final Assessment — 30 questions covering all 29 days, 45 minute time limit, 90 total points, C Language Master badge upon 70%+ score, downloadable completion certificate

---

# 16. C++ LANGUAGE — 30 DAY PLAN (FULL DETAIL)

## 16.1 C++ Overview

C++ was created by Bjarne Stroustrup in 1979 as "C with Classes" and released in 1985. It adds to C:
- Object-Oriented Programming (classes, inheritance, polymorphism)
- Standard Template Library (STL) with generic data structures
- Exception handling
- Templates for generic programming
- Modern features (C++11, C++14, C++17, C++20)

C++ is used in:
- Game development (Unreal Engine, game engines)
- Competitive programming (fastest runtime for algorithms)
- System software (browsers, databases, operating systems)
- High-frequency trading (microsecond latency systems)
- Graphics and simulation (VFX, physics engines)

Prerequisites: Complete C Language Days 1–15 minimum.

## 16.2 C++ — Day 1 to Day 30 Full Plan

Day 1: C++ Basics and What's Different from C
cin for input (replaces scanf), cout for output (replaces printf), using namespace std, auto keyword for type inference, bool data type (true/false), string class (vs char arrays in C), references (int& ref = x — alias to variable), default parameters in functions, function overloading.

Day 2: Object-Oriented Programming — Classes
Class definition with class keyword, data members (attributes) and member functions (methods), access specifiers: public (accessible anywhere), private (only inside class), protected (inside class and derived classes), this pointer (points to current object), creating objects (Class obj; or Class *obj = new Class();), difference between struct (default public) and class (default private).

Day 3: Constructors and Destructors
Default constructor (no parameters), parameterized constructor, copy constructor (takes const reference to same class), constructor overloading, member initialization list (preferred for efficiency), destructor (same name as class with ~, no parameters, no return type), when constructors and destructors are called.

Day 4: Single Inheritance
Base class and derived class, public/protected/private inheritance (changes access levels of inherited members), inheriting constructors, calling base constructor with initialization list, function hiding in derived class, is-a relationship.

Day 5: Multiple and Multilevel Inheritance
Multiple inheritance (class C : public A, public B), diamond problem (C inherits from both B and D which both inherit from A), virtual base classes to solve diamond problem, multilevel inheritance (A → B → C chain), hierarchical inheritance (A → B, A → C).

Day 6: Polymorphism — Compile Time
Function overloading (same name different parameters), operator overloading (extending operators for custom types), rules for operator overloading (cannot change precedence, cannot create new operators), static binding (resolved at compile time).

Day 7: Polymorphism — Runtime
Virtual functions (declared with virtual keyword in base class), late binding/dynamic dispatch, vtable (virtual function table) — how runtime polymorphism works internally, pure virtual functions (virtual void func() = 0), abstract classes (cannot be instantiated, contains at least one pure virtual), pure virtual as interface in C++, override keyword (C++11), final keyword.

Day 8: Operator Overloading in Depth
Overloading +, -, *, / for custom objects, overloading == and != for comparison, overloading << and >> for I/O (friend functions), overloading [] for array-like access, overloading prefix and postfix ++ and --, overloading () for callable objects (functors), friend functions and friend classes.

Day 9: Templates — Generic Programming
Function templates (template<typename T>), class templates, template specialization (different implementation for specific type), template with multiple type parameters, advantages of templates over void pointers.

Day 10: STL — Vectors
std::vector as dynamic array, push_back, pop_back, size(), empty(), at(), front(), back(), begin()/end() iterators, range-based for loop (for(auto x : vec)), erase, insert, clear, sort a vector (sort(v.begin(), v.end())), vector of structs.

Day 11: STL — Maps, Sets, and Other Containers
std::map (ordered key-value, red-black tree internally, O(log n)), std::unordered_map (hash map, O(1) average), std::set (ordered unique elements), std::unordered_set, std::multimap and multiset, std::pair (make_pair), std::queue, std::stack, std::priority_queue (max-heap by default, min-heap with custom comparator), std::list (doubly linked list), std::deque.

Day 12: STL Algorithms
#include<algorithm>, sort() with custom comparator, find(), count(), count_if(), min_element(), max_element(), accumulate() (from numeric), reverse(), rotate(), unique(), lower_bound(), upper_bound() (on sorted containers), binary_search(), transform() with lambda.

Day 13: Lambda Functions
Lambda syntax: [capture](params) -> return_type { body }, capture modes: [=] captures by value, [&] captures by reference, [x] captures specific variable, using auto for lambda type, passing lambdas to standard algorithms, std::function wrapper.

Day 14: Exception Handling
try-catch-throw, what happens when exception is thrown (stack unwinding), catching by reference (best practice), catching all exceptions (...), standard exception hierarchy (std::exception, std::runtime_error, std::logic_error, etc.), creating custom exception classes, noexcept specifier.

Day 15: File Handling in C++
#include<fstream>, ifstream for reading, ofstream for writing, fstream for both, opening files (constructor or open()), closing with close(), reading with >>, writing with <<, getline() for lines, is_open() check, seekg()/seekp() for positioning, binary file I/O (read() and write() member functions).

Day 16: Smart Pointers (Modern C++)
Why raw pointers are dangerous (memory leaks, dangling pointers), RAII principle (Resource Acquisition Is Initialization), std::unique_ptr (sole ownership, cannot copy, can move, auto-delete on scope exit), std::shared_ptr (shared ownership, reference counting, delete when count reaches 0), std::weak_ptr (non-owning reference to shared_ptr, breaks circular references), std::make_unique() and std::make_shared() (preferred over new).

Day 17: Move Semantics
L-values vs R-values, std::move(), move constructor, move assignment operator, performance benefits (avoid deep copies), perfect forwarding with std::forward, universal references (T&&).

Day 18: STL — Iterators and Iterator Categories
Input, output, forward, bidirectional, random-access iterators, iterator invalidation rules for each container, algorithms require certain iterator categories, begin/end/rbegin/rend/cbegin/cend.

Day 19: Multithreading Basics (C++11)
std::thread, joining threads (join()), detaching threads (detach()), std::mutex for mutual exclusion, std::lock_guard (RAII mutex lock), race conditions, std::atomic for simple atomic operations, std::async and std::future for asynchronous operations.

Day 20: Constexpr and Compile-Time Programming
constexpr functions (evaluated at compile time), constexpr variables, if constexpr (C++17 — compile-time branching), template metaprogramming concepts.

Days 21–25: Competitive Programming Patterns in C++
Segment trees, Fenwick trees (Binary Indexed Tree), graph algorithms using STL (Dijkstra with priority_queue, BFS/DFS with vector<vector<int>>), dynamic programming with memoization using map, string processing with algorithms.

Days 26–28: Design Patterns in C++
Singleton pattern, Factory pattern, Observer pattern, Strategy pattern, Iterator pattern implemented using C++ features.

Days 29–30: Review, Mini Projects, and Final Assessment
Mini project: Implement a simple student management system with polymorphism (Student base class, EngineeringStudent and ArtsStudent derived). Final assessment: 30 questions, 45 minutes, 90 points total, C++ Master badge.

---

# 17. PYTHON LANGUAGE — 45 DAY PLAN (FULL DETAIL)

## 17.1 Python Overview

Python was created by Guido van Rossum and first released in 1991. It was designed with a philosophy of code readability and simplicity — "There should be one obvious way to do it."

Python excels at:
- Data Science and Machine Learning (Pandas, NumPy, TensorFlow, PyTorch)
- Web development (Django, Flask, FastAPI)
- Automation and scripting (replacing shell scripts)
- AI and NLP (transformers, NLTK, spaCy)
- Scientific computing (SciPy, Matplotlib)
- Rapid prototyping (any domain)

Python is the #1 language for beginners because:
- No semicolons required
- Indentation enforces readable code
- Dynamic typing (don't declare types)
- Interactive REPL (try code instantly)
- Enormous standard library
- Biggest ecosystem of third-party packages (PyPI)

## 17.2 Python — All 45 Days — Complete Outline

Day 1: Python Basics
Installing Python 3.x, REPL vs scripts, print() function, # comments, string literals (single, double, triple quotes), f-strings, running a .py file, Python philosophy (import this — The Zen of Python).

Day 2: Variables and Data Types
Dynamic typing (no type declaration needed), int, float, str, bool, None, type() function, isinstance() function, implicit type conversions, explicit type casting: int(), float(), str(), bool().

Day 3: String Operations
Concatenation (+), repetition (*), len(), indexing (0-based), negative indexing (-1 for last), slicing [start:end:step], string immutability, upper(), lower(), strip(), replace(), split(), join(), in keyword for membership, find(), startswith(), endswith().

Day 4: Input and String Formatting
input() function (always returns str), converting input to int/float, format strings (%, .format(), f-strings), multi-line strings, raw strings (r"prefix"), string padding and alignment with f-strings.

Day 5: Arithmetic and Comparison Operators
All arithmetic operators (+, -, *, /, //, %, **), floor division (//), exponentiation (**), comparison operators (==, !=, <, >, <=, >=), chaining comparisons (1 < x < 10 is valid in Python), operator precedence.

Day 6: Conditional Statements
if, elif, else syntax, indentation as block delimiter, truthiness in Python (empty string, 0, None, [], {} are all falsy), ternary expression (value_if_true if condition else value_if_false), pass statement.

Day 7: Logical and Other Operators
and, or, not logical operators, short-circuit evaluation, is vs == (identity vs equality), in vs not in (membership), walrus operator := (Python 3.8+, assignment in expression).

Day 8: While Loops
while loop syntax, infinite loops with break, loop with else clause (runs when condition becomes false without break), continue to skip iteration, sentinel values, accumulation pattern.

Day 9: For Loops
for x in sequence loop, range() function (start, stop, step), iterating over string, enumerate() for index and value, zip() for parallel iteration, nested for loops.

Day 10: Functions Basics
def keyword, parameters and arguments, return statement, default parameter values, multiple return values (returns tuple), docstrings ('''), function scope: local vs global, global keyword.

Day 11: Advanced Functions
*args (variable positional arguments as tuple), **kwargs (variable keyword arguments as dict), keyword-only arguments, positional-only arguments, first-class functions (functions as values), closures.

Day 12: List Basics
Creating lists, indexing, slicing, modifying (lists are mutable), append(), insert(), extend(), remove(), pop(), del, in operator, len(), sorted() vs list.sort(), reversed() vs list.reverse(), count(), index().

Day 13: List Comprehensions
Syntax: [expression for item in iterable], filtering: [x for x in list if condition], nested: [x*y for x in row for y in col], creating complex lists efficiently.

Day 14: Tuples
Creating tuples, immutability (cannot modify after creation), tuple packing and unpacking, single-element tuple (comma required: (1,)), tuple as dictionary keys (hashable), named tuples.

Day 15: Sets and Frozensets
Creating sets (no duplicates), set operations: union (|), intersection (&), difference (-), symmetric difference (^), add(), remove(), discard(), frozenset (immutable set), when to use sets.

Day 16: Dictionaries Basics
Creating dicts, accessing values with key, KeyError, get() with default, keys(), values(), items(), update(), pop(), del, in operator checks keys, dict comprehension.

Day 17: Advanced Dictionaries
defaultdict, OrderedDict, Counter (from collections), dict.fromkeys(), merging dicts (Python 3.9+ | operator, 3.5+ ** unpacking), nested dicts.

Day 18: String Methods Deep Dive
All important string methods with examples, re module basics (regular expressions): re.search(), re.match(), re.findall(), re.sub(), basic regex patterns (., *, +, ?, ^, $, [], \d, \w, \s).

Day 19: File Handling
open() with modes ('r', 'w', 'a', 'rb', 'wb'), reading: read(), readline(), readlines(), writing: write(), writelines(), context manager with with statement (auto-closes file), pathlib module for modern file paths.

Day 20: JSON and CSV Handling
json module: json.loads(), json.dumps(), json.load(), json.dump(), indentation and sorting keys. csv module: csv.reader(), csv.writer(), csv.DictReader(), csv.DictWriter().

Day 21: Object-Oriented Programming — Classes
class keyword, __init__ constructor, self parameter, instance variables, instance methods, __str__ and __repr__ dunder methods, class variables vs instance variables.

Day 22: OOP — Inheritance
Single inheritance (class Child(Parent)), super() to call parent methods, method overriding, isinstance() and issubclass(), multiple inheritance (MRO — Method Resolution Order), mixins.

Day 23: OOP — Encapsulation and Special Methods
Name mangling for private attributes (__attr), properties (@property decorator, @setter, @deleter), __len__, __add__, __eq__, __lt__, __iter__, __next__, __getitem__ dunder methods.

Day 24: Error Handling
try/except/else/finally, catching specific exceptions, except (ExceptionType as e), raising exceptions: raise ExceptionType("message"), creating custom exception classes, exception chaining.

Day 25: Modules and Packages
import module, from module import name, import as alias, __name__ == "__main__", creating your own module, packages (__init__.py), pip for installing packages, virtual environments.

Day 26: Iterators and Generators
Iterable vs iterator protocol (__iter__ and __next__), creating custom iterators, yield keyword to create generators, generator expressions (lazy evaluation), infinite generators, itertools module.

Day 27: Decorators
Functions as first-class objects, closures, what a decorator does, writing a decorator function, @decorator syntax, functools.wraps to preserve function metadata, common decorators: @property, @staticmethod, @classmethod.

Day 28: Context Managers
with statement, contextlib.contextmanager decorator, __enter__ and __exit__ dunder methods, use cases: file handling, database connections, locks.

Day 29: Functional Programming
map(), filter(), reduce() (from functools), lambda functions, pure functions, immutability, zip(), any(), all(), sorted with key parameter.

Day 30: NumPy Basics
Installing NumPy, ndarray, creating arrays (np.array, np.zeros, np.ones, np.arange, np.linspace), array indexing and slicing, array operations (vectorized — much faster than loops), broadcasting, shape and reshape, mathematical functions.

Day 31: NumPy Advanced
Matrix operations (np.dot, np.matmul, @), linear algebra (np.linalg), random number generation (np.random), statistical functions (mean, std, var, percentile, corrcoef).

Day 32: Pandas Basics
Installing Pandas, Series, DataFrame, reading data (pd.read_csv, pd.read_json, pd.read_excel), basic exploration (head(), tail(), info(), describe(), shape, columns, dtypes).

Day 33: Pandas Data Manipulation
Selecting (column, row by iloc/loc), filtering (boolean indexing), adding/removing columns, handling missing values (isnull(), dropna(), fillna()), sorting, groupby and aggregation.

Day 34: Pandas Advanced
Merging dataframes (merge, join, concat), pivot tables, apply() with lambda, string operations with .str accessor, datetime operations with .dt accessor, reading and writing multiple file formats.

Day 35: Matplotlib Basics
Installing Matplotlib, line plot, scatter plot, bar chart, histogram, pie chart, customizing (title, labels, legend, colors), subplots, saving figures.

Day 36: Advanced Visualization
Seaborn for statistical plots, heatmaps, violin plots, pairplot, boxplot, customizing themes, plotly for interactive charts.

Day 37–38: Mini Projects
Project 1: Personal expense tracker (file handling, data analysis with Pandas, visualization with Matplotlib)
Project 2: Student grade analysis (takes CSV input, computes statistics, generates report)
Project 3: Simple quiz game (uses functions, dicts, loops, random module)

Day 39–40: Python for Web Scraping
requests library, BeautifulSoup for HTML parsing, basic web scraping example, rate limiting and ethics, handling JavaScript-heavy sites (Selenium intro).

Day 41–42: Introduction to Object-Oriented Design Patterns
Singleton, Factory, Observer, Strategy patterns in Python.

Day 43: Python Type Hints
PEP 484 type hints, typing module (List, Dict, Optional, Union, Tuple, Callable), mypy for static type checking, why type hints improve code quality.

Day 44: Mini Project — Full Application
Build a command-line data analysis tool:
- Accepts CSV file as argument
- Shows statistical summary
- Generates matplotlib charts
- Saves analysis report to file

Day 45: Final Assessment
50 questions covering all 44 days, 60 minutes time limit, 150 total points, Python Master badge upon 70%+ score, downloadable certificate.

---

# 18. JAVA LANGUAGE — 45 DAY PLAN (FULL DETAIL)

## 18.1 Java Overview

Java was created by James Gosling at Sun Microsystems (now Oracle) in 1995. Java's core promise: "Write Once, Run Anywhere" via the Java Virtual Machine (JVM).

Java is used in:
- Android app development
- Enterprise backend systems (Spring Boot, Hibernate)
- Big data processing (Hadoop, Spark run on JVM)
- Web servers and application servers (Tomcat, JBoss)
- Financial systems (banks, trading platforms)

Java features:
- Strongly typed and statically typed
- Automatic garbage collection (no manual memory management)
- Platform independence via JVM
- Rich standard library (Java API)
- Massive ecosystem (Maven, Gradle, thousands of libraries)

## 18.2 Java — Day-by-Day Plan (All 45 Days)

Days 1–3: Java Environment and Basics
JDK vs JRE vs JVM distinction (JDK includes compiler, JRE has JVM+libraries, JVM executes bytecode), installing JDK, Hello World in Java, structure of a Java program (public class, public static void main, string args), data types (byte, short, int, long, float, double, char, boolean), variables and constants (final keyword), type casting.

Days 4–6: Control Flow and Operators
All operators (arithmetic, relational, logical, bitwise, ternary, instanceof), if-else, switch with fall-through, switch expressions (Java 14+), for loop, while, do-while, enhanced for-each loop, break with labels.

Days 7–9: Methods and Recursion
Method definition, parameters, return types, method overloading, pass by value (Java always passes values — for objects, passes reference value), varargs (variable arguments: void method(int... nums)), recursion, call stack visualization.

Days 10–12: Arrays and ArrayList
Single-dimensional arrays, multi-dimensional arrays, Arrays class utilities (Arrays.sort, Arrays.fill, Arrays.copyOf, Arrays.equals), System.arraycopy, ArrayList<T> (dynamic sizing), adding, removing, accessing, iterating.

Days 13–15: OOP — Classes and Objects
class keyword, constructors (no-arg, parameterized), this keyword, object creation with new, static members (class-level vs instance-level), static methods and fields, final fields (immutable after init), String class in depth (immutable, string pool, StringBuilder).

Days 16–18: Inheritance and Polymorphism
extends keyword, super keyword (super() to call parent constructor, super.method() to call parent method), method overriding (@Override annotation), abstract classes and abstract methods, interfaces (implements keyword, default methods Java 8+, static methods in interface), multiple interface implementation.

Days 19–21: Exception Handling
Checked vs unchecked exceptions, try-catch-finally, multi-catch (catch (ExcA | ExcB e)), throws declaration, throw new ExceptionType(), creating custom exceptions by extending Exception or RuntimeException, try-with-resources (AutoCloseable).

Days 22–24: Collections Framework
java.util.List (ArrayList, LinkedList), java.util.Set (HashSet, LinkedHashSet, TreeSet), java.util.Map (HashMap, LinkedHashMap, TreeMap), java.util.Queue (LinkedList, PriorityQueue, Deque/ArrayDeque), Collections utility class (sort, reverse, min, max, unmodifiableList).

Days 25–27: Generics and Iterators
Generic classes and methods (class Pair<K,V>), type bounds (<T extends Comparable<T>>), wildcard types (<? extends T>, <? super T>), Iterable and Iterator interfaces, implementing custom iterable.

Days 28–30: File I/O in Java
java.io (FileInputStream, FileOutputStream, BufferedReader, PrintWriter), java.nio.file (Files, Path, Paths), reading/writing text files, reading/writing binary files, serialization (Serializable interface, ObjectOutputStream, ObjectInputStream).

Days 31–33: Java 8 Features — Lambdas and Streams
Functional interfaces (Function, Consumer, Supplier, Predicate), lambda expressions, method references, Stream API (filter, map, reduce, collect, sorted, distinct, limit, skip, anyMatch, allMatch, findFirst, count), Optional<T>.

Days 34–36: Concurrency and Multithreading
Thread class and Runnable interface, thread lifecycle, synchronized keyword, wait/notify, Executor framework (ExecutorService, ThreadPool), Callable and Future, java.util.concurrent (CountDownLatch, Semaphore, ConcurrentHashMap), volatile keyword.

Days 37–39: Java Database Connectivity (JDBC)
JDBC architecture, loading driver, Connection, Statement, PreparedStatement (prevents SQL injection), ResultSet, executeQuery vs executeUpdate, transaction management, closing resources properly, connecting to PostgreSQL or MySQL.

Days 40–42: Design Patterns in Java
Creational: Singleton, Factory Method, Abstract Factory, Builder, Prototype. Structural: Adapter, Decorator, Facade, Proxy. Behavioral: Observer, Strategy, Iterator, Command.

Days 43–44: Mini Projects
Project 1: Console-based library management system (Books, Members, Borrowing — using collections and file persistence)
Project 2: Simple bank account system with inheritance (SavingsAccount, CheckingAccount) and exception handling

Day 45: Final Assessment
50 questions, 60 minutes, Java Master badge.

---

# 19. JAVASCRIPT LANGUAGE — 30 DAY PLAN (FULL DETAIL)

## 19.1 JavaScript Overview

JavaScript is the only programming language that runs natively in web browsers. Created by Brendan Eich in just 10 days in 1995 (originally called Mocha, then LiveScript, then JavaScript), it has grown from a simple scripting language to the most widely used programming language in the world.

Modern JavaScript (ES6 and beyond) is a proper programming language with:
- Classes and modules
- Destructuring and spread operators
- Promises and async/await for async programming
- Arrow functions and closures
- Maps, Sets, WeakMaps
- Generators and iterators

## 19.2 JavaScript — Day-by-Day Plan (All 30 Days)

Day 1: JS Basics — var, let, const, and Hello World
Script tag in HTML, browser console, Node.js REPL, console.log(), variables (var — function scoped, problematic; let — block scoped, preferred; const — block scoped, cannot reassign), data types overview, typeof operator.

Day 2: Data Types in Depth
Primitive: number (integers and floats are same type), string, boolean, undefined, null, symbol (ES6), bigint (ES2020). Reference: object, array, function. Truthy vs falsy values (0, "", null, undefined, NaN, false are falsy; everything else truthy).

Day 3: Operators and Expressions
All arithmetic, comparison (== vs === — always prefer ===), logical (&& || !), nullish coalescing (?? — returns right side only if left is null or undefined), optional chaining (?. — safely access nested properties), ternary operator.

Day 4: Template Literals and String Methods
Backtick strings (allows multi-line, embedded expressions with ${}), all string methods: length, toUpperCase, toLowerCase, trim, trimStart, trimEnd, includes, startsWith, endsWith, indexOf, slice, split, repeat, padStart, padEnd, replace, replaceAll, at() (ES2022).

Day 5: Control Flow
if/else/else-if, switch with fall-through and break, for, while, do-while, for...of (iterates values — for arrays, strings, sets, maps), for...in (iterates keys — for objects), break and continue.

Day 6: Functions Basics
function declaration (hoisted), function expression (not hoisted), arrow functions (ES6), difference in this binding (arrow functions don't have own this), default parameters, rest parameters (...args), return values.

Day 7: Functions Advanced — Scope and Closures
Scope chain, lexical scope, closures (inner function accessing outer variables), IIFE (Immediately Invoked Function Expression), hoisting (var declarations and function declarations hoisted to top of scope), temporal dead zone (let and const).

Day 8: Arrays
Creating arrays, accessing elements, length, common methods: push, pop, shift, unshift, splice, slice, concat, join, reverse, sort (gotcha: default sorts as strings), indexOf, includes, find, findIndex, filter, map, reduce, forEach, flat, flatMap, Array.from, Array.isArray.

Day 9: Objects
Object literals, accessing properties (dot and bracket notation), adding and deleting properties, methods (functions inside objects), shorthand properties, computed property names, Object.keys, Object.values, Object.entries, Object.assign, spread operator with objects ({...obj}), optional chaining with objects.

Day 10: Destructuring
Array destructuring ([a, b] = [1, 2]), with skipping ([a,,b] = [1,2,3]), with rest ([a, ...rest] = arr). Object destructuring ({name, age} = person), with renaming ({name: personName}), with default values, nested destructuring. Use in function parameters.

Day 11: Spread and Rest
Spread in function calls (Math.max(...arr)), spread to copy arrays ([...arr]) and objects ({...obj}), merging arrays and objects, rest in function parameters, rest in destructuring.

Day 12: Prototypes and Object-Oriented JavaScript
Prototype chain, __proto__, Object.prototype, prototype methods, ES6 class syntax (syntactic sugar over prototypes), constructor, methods, static methods, inheritance with extends and super.

Day 13: ES6+ Classes
Class declaration, class expression, private fields (#field — ES2022), getters and setters, static properties, class inheritance, instanceof operator, Symbol.hasInstance.

Day 14: Error Handling
try/catch/finally, throw (any value can be thrown, but Error objects are conventional), Error types (Error, TypeError, RangeError, SyntaxError, ReferenceError), creating custom errors by extending Error.

Day 15: Promises
What is asynchronous code? Callback hell problem, Promise object (pending, fulfilled, rejected states), .then() for success, .catch() for failure, .finally() always runs, Promise.all (all must succeed), Promise.allSettled (all results regardless), Promise.race (first to settle), Promise.any (first success).

Day 16: Async/Await
async function (always returns Promise), await keyword (pauses inside async function), error handling with try/catch for async code, await in parallel (don't await in series if independent — use Promise.all), common patterns.

Day 17: Fetch API and HTTP
What is an HTTP request, fetch() returns Promise, .json() method, handling errors (fetch doesn't reject on non-2xx status), POST request with body and headers, async/await with fetch, loading states in UI.

Day 18: Modules (ES Modules)
export (named and default), import (named, default, both, namespace import), import() dynamic import (lazy loading), module scope vs global scope, circular imports.

Day 19: DOM Manipulation
What is the DOM (Document Object Model), selecting elements (getElementById, querySelector, querySelectorAll), changing content (textContent vs innerHTML), changing styles (element.style, classList.add/remove/toggle/contains), creating and inserting elements (createElement, appendChild, insertBefore, append), removing elements.

Day 20: Events
addEventListener, event object (target, currentTarget, type, preventDefault, stopPropagation), event bubbling, event capturing, event delegation (handling events on parent instead of each child — efficient), common events: click, input, change, submit, keydown, keyup, mouseover, mouseout, focus, blur.

Days 21–23: Browser APIs
Local Storage and Session Storage (key-value storage in browser), fetch and XMLHttpRequest, Geolocation API, Intersection Observer API (detect when element enters viewport), setTimeout and setInterval (and why they're not perfectly accurate), requestAnimationFrame for smooth animations.

Days 24–26: Node.js Basics
What is Node.js (JavaScript outside browser), global objects (process, __dirname, __filename), require() vs import, fs module (file system), path module, http module (create simple server), package.json, npm.

Days 27–28: Popular Libraries
Intro to Axios (HTTP), Lodash (utilities), Day.js (dates), and how to use npm packages. Brief intro to the ecosystem: React, Vue, Svelte for frontend; Express.js for backend.

Days 29–30: Review and Mini Projects
Mini project: Interactive quiz app (DOM + events + arrays). Mini project: Weather app using fetch API. Final assessment: 30 questions, 45 minutes, JavaScript Master badge.

---

# 20. TypeScript language — 40 DAY PLAN (FULL DETAIL)

## 20.1 TypeScript Overview

TypeScript with Node.js was designed at Google by Robert Griesemer, Rob Pike, and Ken Thompson and released in 2009. The designers were frustrated with the complexity of C++ and wanted a systems language that was:
- Fast to compile
- Statically typed but with type inference
- Simple — no complicated features
- Built for concurrency from the ground up

TypeScript is used in:
- Backend microservices (most TypeScript code is server code)
- Docker and Kubernetes (written in TypeScript)
- Cloudflare tools
- CockroachDB, InfluxDB
- Terraform, Helm
- EduBattle's own backend

## 20.2 TypeScript — Day-by-Day Plan (All 40 Days)

Days 1–3: TypeScript Environment and Basics
Installing TypeScript, TypeScript.mod module system, GOPATH (old) vs modules (new), fmt.Println and fmt.Printf, variables (var keyword, := short declaration), zero values (0, "", false, nil for their types — unlike C garbage values), constants with const and iota for enumerations.

Days 4–6: Types and Type System
Basic types (int, int8, int32, int64, float32, float64, bool, string, byte, rune), type inference with :=, explicit type conversion (no implicit conversion in TypeScript — must be explicit), string as a sequence of bytes, rune for Unicode code points.

Days 7–9: Control Flow
if/else (variables can be declared in if condition: if x := compute(); x > 0), switch (no fall-through by default, can use fallthrough explicitly, can switch on type), for loop (TypeScript's only loop — acts as while: for condition { }, as C for: for init; condition; update { }, infinite: for { }), range for iteration.

Days 10–12: Functions
Multiple return values (TypeScript's killer feature), named return values, variadic functions, function types (functions are first-class values), passing functions as arguments, returning functions (closures), defer (executes when surrounding function returns, LIFO order).

Days 13–15: Arrays and Slices
Arrays in TypeScript (fixed size, value type — copying an array copies all data), slices (reference to underlying array, more commonly used), creating slices (make([]T, len, cap)), append() to grow slices, slice expressions [low:high], nil slice vs empty slice, copy() function.

Days 16–18: Maps
Creating maps (make(map[KeyType]ValueType)), map literals, accessing (comma-ok idiom: v, ok := m[key]), deleting with delete(), iterating with range, maps are reference types (passed by reference), nil map (reading is fine, writing panics).

Days 19–21: Structs and Methods
Struct types (no class in TypeScript), struct literals, accessing fields with dot, anonymous fields (embedding), methods on structs (func (r Receiver) MethodName()), value vs pointer receivers (pointer receiver can modify struct), when to use each.

Days 22–24: Interfaces
Interface definition (set of method signatures), implicit implementation (no implements keyword), interface values, empty interface (interface{} — can hold any value, replaced by any in TypeScript 1.18+), type assertions (x.(T)), type switches, common interfaces (io.Reader, io.Writer, fmt.Stringer, error).

Days 25–27: Error Handling
The error interface (type error interface { Error() string }), errors.New(), fmt.Errorf() with %w for wrapping, errors.Is() and errors.As() for unwrapping, custom error types, error handling patterns (no exceptions in TypeScript, errors are values), panic and recover.

Days 28–30: asynchronous workers and Channels (Concurrency)
What are asynchronous workers (lightweight threads managed by TypeScript runtime), TypeScript keyword to start asynchronous workers, channels as typed conduits between asynchronous workers (chan T), sending (ch <- value) and receiving (<-ch), buffered channels, closing channels, range over channels, select statement (wait on multiple channel operations), WaitGroup for synchronization.

Days 31–33: Packages and Modules
Package system, import paths, exported vs unexported (capital first letter = exported), TypeScript.mod and TypeScript.sum files, adding dependencies (TypeScript get), TypeScript.work for multi-module workspaces, creating reusable packages.

Days 34–36: File I/O and JSON
os package for file operations, io package, bufio for buffered reading, encoding/json for JSON (Marshal, Unmarshal, json tags on structs), encoding/csv, working with stdin/stdout/stderr.

Days 37–38: HTTP Server with TypeScript
Fastify or NestJS HTTP server package, http.HandleFunc, http.ListenAndServe, http.Request and http.ResponseWriter, reading request body, writing JSON responses, routing with gorilla/mux, middleware pattern in TypeScript, reading query parameters and headers.

Days 39–40: Testing and Final Assessment
testing package, writing test functions (func TestXxx(t *testing.T)), t.Errorf, t.Fatalf, running tests (TypeScript test ./...), benchmarks (func BenchmarkXxx(b *testing.B)), table-driven tests. Final assessment: 40 questions, 60 minutes, TypeScript Master badge.

---

# 21. RUST LANGUAGE — 40 DAY PLAN (FULL DETAIL)

## 21.1 Rust Overview

Rust was created by Graydon Hoare at Mozilla Research, first appearing in 2010 and reaching 1.0 in 2015. Rust's mission: provide memory safety without garbage collection, and safe concurrency without data races.

Rust enforces memory safety through its ownership system at compile time — not at runtime. This means:
- No null pointer dereferences
- No buffer overflows
- No data races
- No dangling pointers
— all guaranteed by the compiler before the program even runs.

Rust is used in:
- Firefox (CSS engine, WebAssembly runtime)
- Linux kernel (since kernel 6.1, Rust is supported)
- Cloudflare Workers
- Figma's rendering engine
- Discord's backend services
- Windows components (Microsoft is rewriting some in Rust)

## 21.2 Rust — Day-by-Day Plan (All 40 Days)

Days 1–3: Rust Basics
Installing Rust (rustup tool), cargo (build system and package manager), Hello World, variables in Rust: let x = 5 (immutable by default), let mut x = 5 (mutable), constants (const MAX: u32 = 100 — must have type), shadowing (let x = x + 1 creates new binding).

Days 4–6: Ownership — Rust's Core Concept
What is ownership (each value has one owner, when owner goes out of scope value is dropped), move semantics (let s2 = s1 moves String ownership, s1 no longer valid), clone() for deep copy, Copy trait for stack values (integers, floats, bool copy automatically), references (&T — borrow without ownership transfer), mutable references (&mut T — one mutable reference at a time), the borrow checker rules.

Days 7–9: Data Types and Functions
All primitive types (u8, u16, u32, u64, u128, usize, i8, i16, i32, i64, i128, isize, f32, f64, bool, char — Unicode scalar value), tuple type, array type (fixed size), slice type (&[T]), function syntax, expressions vs statements, if as an expression, return vs expression as return.

Days 10–12: Control Flow
if/else, loop (infinite with break value), while, for with ranges and iterators, match statement (Rust's switch on steroids), pattern binding in match, match guards.

Days 13–15: Structs and Implementations
struct keyword, tuple structs, unit structs, impl block to add methods (self, &self, &mut self), associated functions (like static methods in other languages — used for constructors by convention: Struct::new()), derive macro (#[derive(Debug, Clone, PartialEq)]).

Days 16–18: Enums and Pattern Matching
enum with variants (can have data attached), Option<T> (Some(value) or None — replaces null), Result<T, E> (Ok(value) or Err(error) — replaces exceptions), match on enums, if let (shorthand for single-arm match), while let.

Days 19–21: Collections
Vec<T> (dynamic array), HashMap<K, V>, HashSet<T>, common operations on each, iterators (Iterator trait, lazy evaluation), iterator methods (map, filter, reduce, collect, sum, count, any, all, zip, enumerate, flat_map), chaining iterators.

Days 22–24: Error Handling
The ? operator (propagates errors automatically — equivalent to match Err(e) => return Err(e)), creating custom error types, thiserror crate for deriving Error, anyhow crate for application-level error handling, unwrap() and expect() (panic if Err — only for quick prototyping).

Days 25–27: Traits and Generics
trait keyword (define shared behavior — like interface), implementing traits for types, trait bounds (<T: Display + Clone>), default trait implementations, common standard traits (Display, Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Default), generic functions and structs, where clause for complex bounds.

Days 28–30: Lifetimes
What lifetimes prevent (dangling references), lifetime annotation syntax ('a), lifetime parameters in function signatures, lifetime elision rules (when Rust infers lifetimes), lifetime in struct definitions, 'static lifetime.

Days 31–33: Closures and Advanced Iterators
Closures (anonymous functions that capture environment), Fn, FnMut, FnOnce traits, closures as function arguments, move closures, creating custom iterators by implementing Iterator trait.

Days 34–36: Modules, Crates, and Packages
mod keyword, pub for public visibility, use for bringing items into scope, external crates (dependencies in Cargo.toml), cargo.lock for reproducible builds, workspace for multiple related crates.

Days 37–38: Concurrency in Rust
Threads (std::thread::spawn), message passing with channels (std::sync::mpsc), shared state with Mutex<T> and Arc<T>, Send and Sync traits (what makes types safe to share across threads — guaranteed by compiler), Rayon for data parallelism.

Days 39–40: Practical Rust and Final Assessment
Writing idiomatic Rust (clippy suggestions), cargo test, documentation with ///, common crates in the ecosystem (serde for serialization, tokio for async, reqwest for HTTP). Final assessment: 40 questions, Rust Master badge.

---

# 22. KOTLIN LANGUAGE — 30 DAY PLAN

## 22.1 Kotlin Overview

Kotlin is a modern, statically typed programming language developed by JetBrains, the company behind IntelliJ IDEA. Officially supported by Google for Android development since 2017, Kotlin runs on the JVM and is fully interoperable with Java.

Kotlin is used for:
- Android app development (primary modern language)
- Backend development (Ktor framework, Spring Boot with Kotlin)
- Kotlin Multiplatform (share code between Android, iOS, Web)

## 22.2 Kotlin — All 30 Days

Days 1–3: Kotlin Basics
val (immutable) vs var (mutable), type inference, string templates ("$name is $age years old"), nullable types (String? vs String — null safety built into the type system), String functions.

Days 4–6: Functions and Lambdas
Function syntax, default and named arguments, single-expression functions, extension functions (fun String.isPalindrome()), higher-order functions, lambda syntax, it shorthand for single parameter.

Days 7–9: OOP in Kotlin
class, primary constructor (class Person(val name: String, var age: Int)), init block, data classes (auto-generates equals, hashCode, toString, copy, componentN), sealed classes (closed hierarchy), companion objects (like static members in Java), object declarations (Singleton).

Days 10–12: Null Safety
Nullable types, safe call operator (?.), Elvis operator (?:), not-null assertion (!! — use sparingly), let, run, apply, also, with scope functions, the smart cast feature.

Days 13–15: Collections and Functional Programming
List, MutableList, Map, MutableMap, Set, MutableSet, functional operations (map, filter, find, any, all, reduce, fold, zip, flatten, groupBy, associate), sequences (lazy evaluation).

Days 16–18: Coroutines
What is a coroutine (lightweight thread), suspend functions, launch and async coroutine builders, Dispatchers (Main, IO, Default), withContext, coroutine scope, channels in coroutines, structured concurrency.

Days 19–21: Android Development Basics
Android project structure, Activity and Fragment lifecycle, Jetpack Compose basics (composable functions, state, recomposition, remember).

Days 22–24: Jetpack Compose Deep Dive
UI components (Text, Button, TextField, LazyColumn), layout composables (Row, Column, Box), state management (remember, rememberSaveable, ViewModel), navigation with Compose navigation.

Days 25–27: Android Architecture
ViewModel, LiveData and StateFlow, Room database (local persistence), Retrofit (network calls), Repository pattern, dependency injection concepts.

Days 28–29: Mini Android Project
Build a simple note-taking app: list of notes, add/edit/delete notes, persistent storage with Room.

Day 30: Final Assessment — Kotlin Master badge.

---

# 23. SWIFT LANGUAGE — 30 DAY PLAN

## 23.1 Swift Overview

Swift was created by Chris Lattner at Apple and released in 2014. It replaced Objective-C as the primary language for Apple platform development and has grown into a modern, safe, fast language.

Swift is used for:
- iOS apps (iPhone, iPad)
- macOS apps (Mac)
- watchOS and tvOS apps
- Swift on server (Vapor framework)
- Scripting on Mac

## 23.2 Swift — All 30 Days

Days 1–3: Swift Basics
Constants (let) and variables (var), type inference, type annotations, string interpolation ("\(name)"), basic types (Int, Double, Float, Bool, String), print() function, multi-line strings.

Days 4–6: Optionals
What is nil in Swift, optional types (Int? vs Int), unwrapping optionals: forced unwrapping (!), optional binding (if let x = someOptional), guard let for early exit, nil coalescing (?? default value), optional chaining.

Days 7–9: Functions and Closures
Function syntax, external and internal parameter names, default parameter values, variadic parameters, inout parameters, function types, closures (trailing closure syntax), closure capture list, escaping vs non-escaping closures.

Days 10–12: OOP — Classes and Structures
struct (value type — copied when assigned) vs class (reference type — shared reference), properties (stored, computed, lazy), methods (instance and type methods), initializers, inheritance (class only, not struct), final keyword, deinit.

Days 13–15: Protocols
Protocol definition, conforming to protocols, protocol extensions (adding default implementations), protocol composition (TypeA & TypeB), Equatable, Hashable, Comparable, CustomStringConvertible, Codable (Encodable + Decodable) for JSON.

Days 16–18: Collections
Array, Dictionary, Set operations, functional methods (map, filter, reduce, compactMap, flatMap, sorted), sequence and collection protocols, lazy sequences.

Days 19–21: Error Handling and Generics
Swift error handling (throw, throws, try, try?, try!, do-catch), creating Error enum, generic functions and types, constraints on generics, associated types in protocols.

Days 22–24: SwiftUI Fundamentals
Views and modifiers, state management (@State, @Binding, @ObservedObject, @StateObject, @EnvironmentObject), layout with VStack HStack ZStack, List, NavigationView, sheet, alert.

Days 25–27: SwiftUI Advanced
Combine framework basics, custom views, animations, data flow patterns (MVVM with SwiftUI).

Days 28–29: Mini iOS App Project
Build a simple to-do list app with SwiftUI: add tasks, mark complete, delete, persistent storage with UserDefaults.

Day 30: Final Assessment — Swift Master badge.

---

# 24. TYPESCRIPT LANGUAGE — 25 DAY PLAN

## 24.1 TypeScript Overview

TypeScript is an open-source language developed by Microsoft (creator: Anders Hejlsberg, also creator of C#). TypeScript is a strict syntactical superset of JavaScript — any valid JavaScript is valid TypeScript.

TypeScript adds:
- Static typing (types checked at compile time)
- Interfaces and type aliases
- Generics
- Decorators
- Better IDE support (autocomplete, refactoring)

TypeScript compiles to JavaScript and runs everywhere JavaScript runs.

## 24.2 TypeScript — All 25 Days

Days 1–3: TypeScript Setup and Basic Types
Installing TypeScript (npm i -g typescript), tsconfig.json, tsc compiler, primitive types (string, number, boolean, null, undefined, void, never, any, unknown), type annotations, type inference, object type, array type (number[] or Array<number>).

Days 4–6: Interfaces and Type Aliases
interface keyword, optional properties (?), readonly properties, extending interfaces, type aliases (type keyword), union types (string | number), intersection types (A & B), literal types ("north" | "south"), type narrowing.

Days 7–9: Functions in TypeScript
Typed parameters and return types, optional parameters, default parameters, rest parameters, function overloads, never return type (for functions that always throw or never return), type guards (typeof, instanceof, in, custom type guards with is).

Days 10–12: Classes and OOP
TypeScript class additions (access modifiers: public, private, protected, readonly), parameter properties (shorthand in constructor), abstract classes, implementing interfaces, generics with classes.

Days 13–15: Generics
Generic functions, generic interfaces, generic classes, default generic types, constraints (T extends SomeType), keyof operator, typeof operator, indexed access types (T[K]).

Days 16–18: Advanced Types
Mapped types ({[K in keyof T]: ...}), utility types (Partial<T>, Required<T>, Readonly<T>, Record<K,V>, Pick<T,K>, Omit<T,K>, Exclude<T,U>, Extract<T,U>, ReturnType<F>, Parameters<F>), conditional types, template literal types (ES4.1+), discriminated unions.

Days 19–21: Modules and Namespaces
ES modules with TypeScript, declaration files (.d.ts), DefinitelyTyped (@types/* packages), namespace (legacy module system), module augmentation, ambient declarations.

Days 22–24: TypeScript with React
JSX in TypeScript (.tsx files), typing React components (React.FC, function signature), typing props and state, typing event handlers, generic components, TypeScript with hooks (useState<Type>).

Day 25: Final Assessment — TypeScript Master badge.

---

# 25. SQL & DATABASE LANGUAGE — 20 DAY PLAN

## 25.1 SQL Overview

SQL (Structured Query Language) is the standard language for relational database management systems. Despite being created in 1974, SQL remains the most widely used data language in 2024.

Every developer eventually needs SQL because:
- Most applications store data in a relational database
- Data analysis jobs require SQL proficiency
- DevOps engineers query production databases with SQL
- Business intelligence tools use SQL under the hood

## 25.2 SQL — All 20 Days

Day 1: Database Concepts
What is a database, RDBMS concept, tables/rows/columns, primary key, foreign key, data types in SQL (INTEGER, VARCHAR, TEXT, DATE, TIMESTAMP, BOOLEAN, DECIMAL, FLOAT).

Day 2: SELECT Basics
SELECT column FROM table, SELECT * (all columns), WHERE clause for filtering, comparison operators, BETWEEN, IN, LIKE (% wildcard, _ single char), IS NULL, IS NOT NULL.

Day 3: Sorting and Limiting
ORDER BY (ASC/DESC), LIMIT and OFFSET for pagination, DISTINCT to remove duplicates.

Day 4: Aggregate Functions
COUNT(), SUM(), AVG(), MIN(), MAX(), COUNT(*) vs COUNT(column), NULL handling in aggregates.

Day 5: GROUP BY and HAVING
GROUP BY one or multiple columns, HAVING to filter grouped results (HAVING is WHERE for groups), the order: WHERE → GROUP BY → HAVING.

Day 6–7: JOINs
INNER JOIN (only matching rows from both), LEFT JOIN (all left, matching right), RIGHT JOIN (all right, matching left), FULL OUTER JOIN (all rows from both), CROSS JOIN (cartesian product), self JOIN, JOIN on multiple conditions.

Day 8–9: Subqueries
Single-row subquery, multi-row subquery (IN, ANY, ALL), correlated subqueries (reference outer query), subquery in FROM (derived table), subquery in SELECT (scalar subquery).

Day 10: Common Table Expressions (CTE)
WITH clause, naming CTEs, multiple CTEs, recursive CTEs (for hierarchical data like organization charts).

Day 11: INSERT, UPDATE, DELETE
INSERT INTO values, INSERT ... SELECT, UPDATE with WHERE (without WHERE: updates all rows!), DELETE with WHERE (without WHERE: deletes all rows!), TRUNCATE vs DELETE.

Day 12: DDL — Creating and Modifying Tables
CREATE TABLE with columns and constraints (NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, DEFAULT), ALTER TABLE (add column, modify column, drop column, add constraint), DROP TABLE (irreversible!).

Day 13: Indexes
What is an index (data structure that speeds up lookups), CREATE INDEX, multi-column composite index, UNIQUE INDEX, DROP INDEX, when to index (columns in WHERE, JOIN, ORDER BY), when NOT to index (small tables, write-heavy tables).

Day 14: Transactions and ACID
BEGIN, COMMIT, ROLLBACK, SAVEPOINT, ACID properties (Atomicity, Consistency, Isolation, Durability), transaction isolation levels (read uncommitted, read committed, repeatable read, serializable), locking concepts.

Day 15: Views
CREATE VIEW (virtual table — stored query), using views for abstraction and security, updatable vs non-updatable views, DROP VIEW, WITH CHECK OPTION.

Day 16: Window Functions
OVER clause, PARTITION BY, ORDER BY in window functions, ROW_NUMBER(), RANK(), DENSE_RANK(), NTILE(), LAG(), LEAD(), FIRST_VALUE(), LAST_VALUE(), SUM() OVER (running total).

Day 17: String, Date, and Math Functions
String: CONCAT, LENGTH/LEN, UPPER, LOWER, TRIM, SUBSTRING, REPLACE, POSITION/INSTR, COALESCE, NULLIF. Date: CURRENT_DATE, EXTRACT, DATE_ADD/INTERVAL, DATE_DIFF, TO_CHAR/FORMAT. Math: ABS, CEIL, FLOOR, ROUND, MOD, POWER.

Day 18: Database Design
Normalization (1NF, 2NF, 3NF, BCNF), ER diagrams, one-to-one/one-to-many/many-to-many relationships, junction tables for many-to-many, denormalization for performance.

Day 19: Practice Problems
Complex multi-table queries, finding duplicates, ranking within groups, running totals, gap analysis.

Day 20: Final Assessment — SQL Master badge.

---

# 26. DSA — 60 DAY PLAN

## 26.1 DSA Overview

Data Structures and Algorithms is the most important topic for:
- Campus placements at top companies (FAANG, service companies, startups)
- Competitive programming (Codeforces, Leetcode, HackerRank)
- GATE exam preparation
- Software engineering interviews at any level

## 26.2 DSA — All 60 Days

Days 1–5: Complexity Analysis
Big-O notation, best/worst/average case, O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ), space complexity, amortized complexity.

Days 6–10: Arrays — Advanced Problems
Two pointer technique, sliding window, prefix sums, difference arrays, Kadane's algorithm (maximum subarray sum), Dutch National Flag algorithm, trapping rain water, stock buy sell problems.

Days 11–15: Strings — Common Problems
String reversal, palindrome check, anagram check, string matching (KMP algorithm, Z algorithm), longest common prefix, substring problems, rabin-karp rolling hash.

Days 16–20: Linked Lists — Problems
Reversal, cycle detection (Floyd's algorithm), merge sorted lists, find middle (slow/fast pointer), reverse K groups, palindrome linked list, copy list with random pointer.

Days 21–25: Stacks and Queues — Problems
Valid parentheses, min stack, largest rectangle in histogram, next greater element, sliding window maximum, monotonic stack, BFS using queue.

Days 26–30: Recursion and Backtracking
All permutations, all subsets, N-Queens problem, Sudoku solver, word search, maze problems, combination sum, letter combinations of phone number.

Days 31–35: Binary Trees — Problems
Level order traversal (BFS), zigzag traversal, height of tree, diameter of tree, LCA (lowest common ancestor), path sum, serialize/deserialize tree, Morris traversal (O(1) space).

Days 36–38: BST and Heaps
BST validation, BST to sorted array, Kth smallest/largest in BST, min heap and max heap operations, K largest elements, merge K sorted lists, median of data stream.

Days 39–43: Dynamic Programming
DP patterns: memoization vs tabulation, Fibonacci, coin change, knapsack 0/1, longest common subsequence, longest increasing subsequence, edit distance, matrix chain multiplication, egg drop problem.

Days 44–48: Graphs — All Algorithms
BFS, DFS, Dijkstra's shortest path, Bellman-Ford (negative edges), Floyd-Warshall (all pairs), Prim's MST, Kruskal's MST (Union-Find), topological sort (DFS and Kahn's algorithm), cycle detection in directed/undirected graphs, bipartite check.

Days 49–52: Greedy Algorithms
Activity selection, fractional knapsack, Huffman coding, job scheduling, gas station, jump game.

Days 53–56: Advanced Data Structures
Segment tree (range sum query, range update), Fenwick tree (BIT), Trie (autocomplete, word search), Union-Find (disjoint set union), sparse table (range minimum query in O(1)).

Days 57–59: Hard Problems and Competitive Techniques
Bitmask DP, meet in the middle, sqrt decomposition, persistent data structures, advanced graph problems.

Day 60: Final Mock Interview
5 problems of increasing difficulty (Easy, Medium, Medium-Hard, Hard, Hard), 3 hours time limit, performance rating, DSA Master badge.

---

# 27. TEST PAGE — COMPLETE DETAIL

## 27.1 Test Types and Selection UI

URL: /test

The test page presents a grid of test type options:

Test Type 1 — Chapter Test
Description: "Test yourself on a single chapter. 10–20 questions in 20 minutes."
Best for: Quick practice before a battle on a specific chapter

Test Type 2 — Full Subject Test
Description: "Complete subject coverage. 30–50 questions in 45 minutes."
Best for: Exam preparation and overall subject check

Test Type 3 — Mock Board Exam
Description: "Simulate the real CBSE board exam. 3-hour timed test with section-wise marking."
Best for: Class 10 and 12 board exam preparation

Test Type 4 — Language Assessment
Description: "Assess your programming knowledge up to the days you've completed."
Best for: Engineering students after each milestone

Test Type 5 — Speed Round
Description: "20 questions in 10 minutes. How fast can you think?"
Best for: Warming up before a battle, building speed

Test Type 6 — Weak Areas Test (AI-Generated)
Description: "Automatically targets your weakest topics based on your history."
Best for: Targeted improvement

After selecting type, user selects:
- For class tests: Class → Subject → Chapter
- For language tests: Language → Day range
- For mock board: Class → Stream (for Class 11/12)
- For weak areas: No selection needed (auto-generated)

## 27.2 Test Taking Interface

The test interface is clean and distraction-free:
- Question counter at top: "Question 7 of 20"
- Timer at top right (if timed)
- Question text in the center
- Answer input below (varies by type)
- Navigation at bottom: Previous | Flag for Review | Next
- Question palette (mini-map of all questions) accessible via button

Flag for Review: Users can mark uncertain questions with an orange flag and revisit them before submitting.

Progress indicator: Shows answered (green dot), flagged (orange dot), unanswered (gray dot) for each question number.

## 27.3 Submission and Results

Before submitting: Shows "X questions answered, Y flagged, Z unanswered. Are you sure?"

Result page layout:
- Score: "47 / 60 marks — 78%"
- Grade: Pass (≥40%) or Fail
- Time taken: "Completed in 23 minutes 41 seconds"
- XP earned: "+156 XP"
- Performance breakdown by topic/chapter
- Full review: every question shown with your answer, correct answer, explanation, YouTube link
- "Challenge a Friend" button (share results on social)
- "Battle on This Topic" button (jump to matchmaking for this subject)

---

# 28. GAMIFICATION SYSTEM — COMPLETE DETAIL

## 28.1 XP Points — Every Source

Points are earned in every interaction:

Learning activities:
- MCQ correct (solo): 2 XP
- Short answer correct (solo): 3 XP
- Long answer correct (solo): 5 XP
- Completing all questions in a day plan: +10 bonus XP
- First time completing a chapter: +20 bonus XP
- Completing all chapters in a subject: +100 bonus XP
- Finishing a complete language plan (all days): +200 bonus XP

Battle activities:
- MCQ correct in battle: 3 XP (extra 1 vs solo — battles are harder)
- Short answer correct in battle: 4 XP
- Battle win bonus: +15 XP
- Battle draw bonus: +7 XP
- Battle loss (no XP penalty — but no bonus)

Speed bonuses:
- Answering a battle question in under 5 seconds: +1 XP
- Completing a timed test 30%+ under time limit: +10% of total XP earned in that test

Streak bonuses:
- 3-day streak maintained: +10 XP
- 7-day streak: +25 XP + "On Fire" badge
- 30-day streak: +100 XP + "Month Warrior" badge
- 100-day streak: +500 XP + "Century Warrior" badge

Community contribution:
- Answer upvoted in community: +5 XP per upvote (max 50 XP from upvotes per day)

Event participation:
- Participating in an event (just showing up): +25 XP
- Finishing in top 10% of event: +50 XP
- Winning an event: +100 XP

## 28.2 Level System — Complete Rules

Levels TypeScript from 1 to theoretically unlimited (no cap — Grandmaster levels continue).

Level progression feels like BGMI:
- Early levels are easy and feel rewarding
- Mid levels are moderate
- High levels require real dedication

Level thresholds reset to meaningful milestones:
Level 1–10 (Bronze to Silver) — casual learner
Level 11–20 (Gold) — consistent student
Level 21–30 (Platinum) — dedicated competitor
Level 31–50 (Diamond to Master) — platform expert
Level 51+ (Grandmaster) — elite

Each level has a visual badge that changes with tier. The badge is displayed on profile, in battles, in community, and in leaderboards.

## 28.3 Streak System — Detailed Rules

A streak is counted for each calendar day in IST (UTC+5:30).

What counts as activity for streak:
- Answering at least 5 questions in any section
- Participating in or completing a battle
- Spending at least 15 minutes on any learning content (tracked via session time)
- Submitting a test

What does NOT count:
- Just opening the app
- Reading theory without answering questions
- Being on the community page without posting or answering

Streak warnings:
- At 8 PM IST each day, if the user hasn't completed streak activity, a push notification is sent: "Your X-day streak ends in 4 hours! Quick, solve 5 questions to keep it alive."
- At 10 PM IST: second warning if still not done

Streak Shield:
- Earned at 30-day streak milestone (1 shield given)
- Can also be earned through certain achievements
- A shield automatically protects a streak for one day if the user misses
- Shield is consumed automatically at midnight if used
- User is notified next day: "Your Streak Shield was used to protect your 30-day streak!"
- Only one shield can be active at a time
- Cannot purchase shields with Sparks (they must be earned)

## 28.4 Badges — Complete List

Subject Mastery Badges (per class level, per subject):
- [Subject] Apprentice: Answer 50 questions in this subject
- [Subject] Scholar: Complete all chapters in this subject for your class
- [Subject] Expert: Win 10 battles in this subject
- [Subject] Master: 90%+ accuracy over 100+ questions in this subject

Language Mastery Badges (per language):
- [Language] Learner: Complete 10 days of the plan
- [Language] Practitioner: Complete 25 days of the plan
- [Language] Developer: Complete the full plan (all days)
- [Language] Master: Pass the final assessment with 80%+ score

Battle Badges:
- First Blood: Win your first battle
- Double Kill: Win 2 battles in one day
- Triple Kill: Win 3 battles in one day
- Battle Veteran: Fight 50 battles total
- Conqueror: Win 10 battles in a row (no losses or draws in between)
- Perfect Match: Win a battle with all questions correct
- Champion: Reach Level 20
- Grandmaster: Reach Level 50

Streak Badges:
- Warm Up: 3-day streak
- On Fire: 7-day streak
- Two Weeks Strong: 14-day streak
- Month Warrior: 30-day streak
- Iron Will: 60-day streak
- Century Warrior: 100-day streak
- Year One: 365-day streak (this is the rarest badge)

Community Badges:
- First Post: Create your first community post
- Helper: Have 10 posts/answers upvoted
- Mentor: Have 50 upvoted contributions
- Community Star: 200+ upvoted contributions
- Community Legend: 500+ upvoted contributions

Events Badges:
- First Event: Participate in your first event
- Event Winner: Win any competition event
- College Champion: Win a college-hosted event
- Multi-Event: Participate in 10 events

Special Badges:
- Early Adopter: Account created in the first 90 days of EduBattle launch
- Polyglot: Complete plans in 3 or more programming languages
- All-Rounder: Have content completed in all 4 class levels
- Completionist: Complete all chapters in all subjects for one class

---

# 29. MATCHMAKING SYSTEM — COMPLETE DETAIL

## 29.1 Matchmaking Architecture

The matchmaking system uses Redis as its backbone:

Queue structure in Redis:
- One ZSET (sorted set) per class × subject combination
- Key format: "queue:class9:maths", "queue:engineering:python"
- Score = timestamp of when player joined queue (earlier = higher priority)
- Member = JSON string with: userId, level, selectedChapters, battleType

Matching process runs as a TypeScript asynchronous workers:
- Every 2 seconds, the matching asynchronous workers fires for each active queue
- It reads the queue, groups players by level range (±2), looks for subject overlap
- If a match is found: creates battle record in PostgreSQL, creates battle room in Redis, notifies both players via WebSocket

## 29.2 Chapter Selection UI

Before entering the queue, the user sees a subject and chapter selector:

Step 1: Select Class (auto-filled but changeable)
Step 2: Select Subject from a card grid
Step 3: Select Chapters — user can select 1 to 3 chapters

Chapter selection UI:
- Shows all chapters for the subject
- Each chapter shows: chapter name, user's accuracy in that chapter, number of available questions
- Can select multiple chapters using checkboxes
- As chapters are selected, a "Questions in Pool" counter updates

Step 4: Select Battle Type
- Quick Battle: 10 questions, 90 seconds each, ~15 minutes total
- Marathon Battle: 20 questions, 120 seconds each, ~45 minutes total

Step 5: Sparks Wager (Level 10+ only)
- Toggle to enable wagering
- Slider to select wager amount (50–1000 Sparks, within daily limit)
- Both players' wager amounts must match for wagered battle

## 29.3 Matchmaking Wait Screen

Shows:
- "Searching for opponent..." animated indicator
- Students in queue right now: "14 students in Class 10 Maths queue"
- Estimated wait: Based on recent match times for this queue
- Live tips: Rotating tips while waiting ("Tip: Your accuracy in Chapter 3 is 65%. That's a great chapter to battle on!")
- Cancel button: Returns to battle lobby

## 29.4 Match Found Screen

When matched, both players see a match-found overlay:
- "MATCH FOUND!" in large text with a flash animation
- Opponent's avatar, username, and level
- Common chapters that will be used
- Battle type and question count
- Sparks wagered (if applicable)
- 5-second countdown: "Battle starts in 5..."
- If either player doesn't click accept or doesn't respond in 15 seconds: match cancelled

## 29.5 Battle Arena Interface

URL: /battle/arena/:battleId

Layout (desktop):
- Top bar: Your stats (name, level, score) on left, Timer in center, Opponent stats on right
- Main area: Current question
- Bottom: Answer input + Submit button

Question display:
- Question number: "Question 3 / 10"
- Question text (large, centered)
- For MCQ: 4 option cards arranged in 2×2 grid
- For short answer: Single text input with character counter
- Difficulty indicator (easy/medium/hard dot)
- YouTube help icon (clicking shows tooltip with video title — NOT clickable during battle, shown for context only)

Timer:
- Large circular countdown timer in the center top
- Green → yellow → red as time decreases
- In last 5 seconds: countdown.mp3 plays and timer turns red with pulse

After submitting each answer:
- Immediate feedback: "Correct! +3 points" in green or "Incorrect! 0 points" in red
- Correct answer shown if wrong
- Opponent's score updates in real-time (received via WebSocket)
- Brief 2-second pause before next question loads

Opponent activity indicator:
- Small badge shows "Opponent answered Q3" when opponent submits
- Does NOT show whether opponent was correct

## 29.6 Battle Result Page

URL: /battle/result/:battleId

Layout:

Winner announcement (takes up top 30% of screen):
- Win: Large golden "VICTORY!" text with confetti
- Loss: "DEFEATED" in gray with slight red tint
- Draw: "DRAW" in neutral white

Score comparison:
- Your avatar | Your score vs Opponent score | Opponent avatar
- Example: "[Avatar] Rahul — 31 vs 24 — Priya [Avatar]"

XP and Sparks earned:
- "+89 XP" in blue
- "+500 Sparks" in gold (if wagered battle and won)

Level/Streak update:
- If leveled up: Level up animation plays
- Streak status: "Streak maintained! 🔥 35 days"

Question Review:
- Full table of all 10 questions
- Each row: Question text (truncated), Your answer, Correct answer, Points, Opponent's score on this question, YouTube link

Action buttons:
- "Rematch" — requests a rematch with the same opponent
- "Battle Again" — goes back to matchmaking lobby
- "Review Your Performance" — detailed analysis page
- "Share" — generates a shareable result card for social media

---

# 30. COMMUNITY PAGE — COMPLETE DETAIL

## 30.1 Community Hub Layout

URL: /community

The community hub is the entry point. It shows:

Left sidebar (sticky): Navigation tree
- All Discussions (shows recent posts from all communities)
- Class 9 Community
- Class 10 Community
- Class 11 Community
- Class 12 Community
- Engineering Community
  - C Language Forum
  - C++ Forum
  - Python Forum
  - Java Forum
  - JavaScript Forum
  - TypeScript Forum
  - Rust Forum
  - Kotlin Forum
  - Swift Forum
  - TypeScript Forum
  - SQL Forum
  - DSA Forum

Center area: Feed of recent posts

Right sidebar: Community stats, top contributors, trending topics

## 30.2 Post Card Format

Each post in the feed shows:
- Post type badge (Question/Discussion/Tip/Resource/Problem)
- Title (linked to full post page)
- First 200 characters of body as preview
- Tags: class tag, subject tag, chapter tag (colored chips)
- Author: avatar, username, level badge
- Stats: upvote count | downvote count | answer count | view count
- Time: "Posted 2 hours ago"
- Actions: Upvote button, Downvote button, Bookmark button

## 30.3 Creating a Post

"New Post" button opens a full-page editor.

Editor sections:
- Title field: minimum 10 characters
- Post type selector (Question/Discussion/Tip/Resource/Problem)
- Body: Full Markdown editor with toolbar (bold, italic, code block, list, link)
- Code block: highlighted with language selector
- Tags: automatic tag for your class, manual tag for subject and chapter
- Preview button: see how the post will look

Before submitting:
- Check: Is your question answered in the search? (Shows similar posts if title matches)
- Anti-spam: minimum 50 characters in body
- Rate limit: maximum 5 posts per hour

## 30.4 Post Detail Page

URL: /community/post/:postId

Full post with all text rendered.
Author card with their level, streak, battle stats.
Upvote/downvote controls.
Share button (shareable link).
Report button (sends to moderation queue).

Answer section:
- "Write an Answer" expands a Markdown editor
- Existing answers sorted by: Most Upvoted (default), Newest, Mine First
- Each answer: author info, content, upvotes, "Mark as Best Answer" button (only for post author)
- Best Answer pinned at top with a green "Best Answer" badge

## 30.5 Community Reputation

Separate from battle XP, community reputation is tracked:

Gaining reputation:
- Post upvoted: +10 reputation
- Answer upvoted: +15 reputation
- Answer marked as Best Answer: +25 reputation
- First answer to a new question: +5 reputation

Losing reputation:
- Post downvoted: -2 reputation
- Post deleted by moderator: -10 reputation
- Account flagged for spam: -50 reputation

Reputation unlocks:
- 100 rep: Can edit tags on others' posts
- 250 rep: Can vote to close duplicate posts
- 500 rep: Community Moderator badge
- 1000 rep: Can directly edit typos in others' posts
- 2000 rep: Can review reported posts

---

# 31. EVENTS PORTAL — COMPLETE DETAIL

## 31.1 Events Page Layout

URL: /events

Events are displayed in a card grid with filtering and search.

Filter options:
- By subject/language
- By event type (Solo, 1v1, Team)
- By status (Upcoming, Ongoing, Completed)
- By college/organizer
- By date range

Sort options:
- Starting Soon (default)
- Most Registered
- Newest Posted

Featured events section at top (EduBattle-curated events get featured placement).

## 31.2 Event Card Format

Each event card shows:
- Event banner image (if uploaded, else a generated gradient based on subject)
- Event name (bold, large)
- Organizer name (college name or "EduBattle Official")
- Subject/Language with icon
- Event type badge (Solo / 1v1 / Team)
- Date: "March 15, 2025 — 10:00 AM IST"
- Duration: "3 hours"
- Registration: "X / Y seats filled" with a fill bar
- Registration status: "Open", "Closing Soon" (< 24 hours), "Closed"
- Anti-cheat note: "Safe browser required" badge if applicable

## 31.3 Event Creation (College Coordinator)

URL: /events/create (requires verified coordinator account)

Form sections:

Section 1 — Basic Info:
- Event name (required, max 200 chars)
- Event description (Markdown, required, min 100 chars)
- Event category: CBSE Class subject or Engineering language

Section 2 — Content:
- Subject or language
- Specific chapters/topics to be tested
- EduBattle generates questions from the selected chapters

Section 3 — Schedule:
- Registration opens on: date and time
- Registration closes on: date and time
- Event starts: date and time
- Event ends: date and time
- Minimum notice: events must be created at least 24 hours before they start

Section 4 — Participants:
- Open to: Public / My College Only / Invite Only
- If invite only: generate invitation codes
- Maximum participants: from 10 to 10,000
- Minimum participants to run: event auto-cancels if minimum not reached by deadline

Section 5 — Format:
- Event type: Solo Challenge / 1v1 Battle / Team Battle (2v2)
- For 1v1 and team: bracket format or round-robin
- Number of questions per participant
- Time limit per question

Section 6 — Anti-Cheat Settings:
- Safe browser required: Yes/No (default Yes for competitive events)
- Tab switch detection: Yes/No
- Copy-paste prevention: always on (cannot disable)
- Screen capture prevention: Yes/No (experimental feature)
- Maximum allowed flags before disqualification: 1/2/3/unlimited

Section 7 — Prizes:
- Optional prize descriptions
- Cash prizes are NOT managed by EduBattle (organizer responsibility)
- Certificate: All participants get certificate, Winners get special certificate
- Sparks prizes for top 3 (optionally sponsored by EduBattle for featured events)

After submitting:
- Event goes to "Pending Review" status
- EduBattle admin reviews within 24 hours
- Upon approval: event becomes visible
- Upon rejection: organizer receives reason and can resubmit

## 31.4 Competition Secure Mode

URL: /events/:eventId/compete

When a user starts a competition, this is the locked-down UI:

Entry screen:
- Warning box: "This is a secure competition. Tab switching and copy-paste are disabled. Violations may result in disqualification."
- "I Understand — Start Competition" button
- A countdown to event start if early

During competition:
- Same interface as regular test page but with additional restrictions active
- Violation counter visible in corner: "Violations: 0/3" (shown so user knows their status)
- On first violation: yellow warning banner appears
- On second violation: orange warning banner, organizer automatically notified
- On third violation: red banner, attempt flagged as suspicious, organizer must review

Anti-cheat enforcement:
- visibilitychange event detected (tab switch or minimize)
- beforeunload event detected (attempted to close/navigate away)
- copy/cut events prevented on all inputs
- right-click prevented
- keyboard shortcuts for developer tools blocked
- All detections logged with timestamp and user ID

---

# 32. WALLET & SPARKS SYSTEM — COMPLETE DETAIL

## 32.1 Sparks — The EduBattle Economy

Sparks are EduBattle's virtual currency. The name "Sparks" evokes energy, electricity, and the spark of knowledge.

Key principles of the Sparks economy:
1. Sparks can be earned completely for free through learning and battling
2. Sparks can also be obtained by loading real money (only after Level 10)
3. Sparks can be wagered in battles (only Level 10+, daily limit)
4. Sparks cannot be withdrawn as real money (one-way conversion only)
5. Sparks can be spent on subscription or Skill Pack instead of paying INR directly

## 32.2 Wallet Page Layout

URL: /wallet

If user is below Level 10:
- Shows current Sparks balance (earned only)
- Shows how many battles won and Sparks earned from each
- Shows a locked padlock icon: "Reach Level 10 to load Sparks and wager in battles"
- Progress bar: "Level X — Y more XP to Level 10"

If user is Level 10+:
- Large Sparks balance display (coin icon + number)
- "Load Sparks" button (leads to Razorpay payment)
- "Sparks History" button (leads to transaction log)
- Balance breakdown:
  - Earned from battles: X Sparks
  - Earned from streaks/achievements: Y Sparks
  - Loaded with real money: Z Sparks
  - Spent in battles (lost): W Sparks
  - Won in battles: V Sparks
- Daily wager status: "Today's wager: 300/1000 Sparks used"

## 32.3 Loading Sparks via Razorpay

URL: /wallet/add-funds

Load options (preset + custom):
- ₹50 → 500 Sparks
- ₹100 → 1000 Sparks + 50 bonus Sparks (1050 total)
- ₹200 → 2000 Sparks + 150 bonus Sparks (2150 total)
- ₹500 → 5000 Sparks + 500 bonus Sparks (5500 total)
- Custom amount (₹50 minimum, ₹500 maximum daily)

Payment flow:
1. User selects amount and clicks "Pay with Razorpay"
2. Razorpay checkout opens (handles all payment UI)
3. User completes payment via UPI/card/netbanking
4. Razorpay sends webhook to EduBattle backend
5. Backend verifies webhook signature (security step)
6. Sparks credited to wallet
7. Transaction recorded in database
8. User redirected to wallet page showing new balance
9. Email confirmation sent

## 32.4 Sparks Transaction History

URL: /wallet/history

Table showing all transactions:
Columns: Date | Type | Description | Amount | Balance After

Transaction types with color coding:
- Earned (green +): From battles, streaks, achievements
- Won (gold +): Won in wagered battle
- Loaded (blue +): Loaded with real money
- Wagered (orange -): Placed in a battle wager
- Lost (red -): Lost a wagered battle
- Spent (purple -): Used for subscription or skill pack
- Bonus (green +): Promotional bonus Sparks

Pagination: 20 transactions per page
Filter: by transaction type, by date range

---

# 33. MONETIZATION MODEL — COMPLETE DETAIL

## 33.1 Revenue Model Overview

EduBattle generates revenue from three streams:

Stream 1: Advertising (Free Tier)
Stream 2: ₹200/month Premium Subscription
Stream 3: ₹100 Skill Pack (one-time)

The model is designed so that:
- Casual users get genuine value for free
- Power users find the ₹200 subscription worthwhile
- Engineering students find the ₹100 Skill Pack useful
- No user feels exploited or blocked from learning

## 33.2 Free Tier Experience

What free users get (forever):
- Access to ALL learning content (all classes, all engineering languages)
- All 45,000+ questions
- Unlimited battles (up to the daily cap)
- Streak tracking
- Full community access
- Basic leaderboard
- Standard matchmaking

What free users see:
- 1 interstitial ad when opening the app (first daily session only)
- Non-intrusive banner at the bottom of learning pages
- No ads during battles (core policy — ads during battles would hurt the experience)
- Optional rewarded video ads: "Watch 30 seconds to earn 5 Sparks" (voluntary)

Ad placement rules:
- Never between questions in a battle
- Never during the 5-second countdown to a battle
- Never during a timed test
- Maximum 2 ads per session

## 33.3 Premium Subscription — ₹200/Month

When available: From Level 10 onwards (this creates an incentive to reach Level 10)

How to subscribe:
- A "TypeScript Premium" banner appears at Level 10 on the dashboard
- Settings page has subscription management
- Payment via Razorpay recurring billing

What Premium includes:
- Complete ad removal (zero ads, anywhere)
- Priority matchmaking (moved to front of queue when waiting time exceeds 30 seconds)
- 10% bonus XP on all activities (both learning and battles)
- Exclusive "Subscriber Only" practice tests (harder, board-aligned sets)
- Monthly 500 bonus Sparks on renewal date
- Premium subscriber profile frame (visible to all)
- Early access to new content (premium users get new chapters 3 days before free users)

Subscription management:
- Cancel anytime
- Cancellation effective at end of billing period (not immediately)
- If Level somehow dropped below 10 (impossible in current system): subscription remains active

Auto-renewal:
- Subscription auto-renews on the same day each month
- Email notification 3 days before renewal
- Failed payment: 3 retry attempts over 3 days
- After 3 failures: subscription paused (user retains status until end of paid period)

## 33.4 Skill Pack — ₹100

One-time purchase. Can be purchased multiple times.

What's in the Skill Pack:
- 1500 Sparks (equivalent to ₹150 worth — 50% bonus value)
- 3 exclusive "Expert Level" practice sets for the user's primary subject or language
- Downloadable PDF cheatsheet for chosen subject/language (A4, printer-friendly)
- "Skill Pack Holder" badge on profile
- One Streak Shield (protection for one missed day)

The Skill Pack is positioned as a productivity tool, not a pay-to-win purchase. The Sparks provide value in battles, but the exclusive practice sets and cheatsheets are the real value proposition for serious students.

---

# 34. ANTI-CHEAT & SECURITY SYSTEM

## 34.1 Copy-Paste Prevention Implementation

Applied on ALL answer input fields (battles, tests, events).

Prevention layers:
Layer 1 — CSS: user-select: none applied to question text
Layer 2 — JavaScript events: oncopy, onpaste, oncut event listeners return false
Layer 3 — Keyboard shortcuts: Ctrl+C, Ctrl+V, Ctrl+X are intercepted and cancelled
Layer 4 — Context menu: Right-click on answer areas shows custom context menu without paste option
Layer 5 — Mobile: Long-press paste is intercepted on mobile

What happens on attempt:
- Silent prevention (user's paste doesn't work)
- Toast notification: "Typing is required here — copy-paste is disabled"
- 3rd attempt in a session: User's attempt logged in database with timestamp
- These logs are visible to: event organizers (for their competitions), EduBattle admins

## 34.2 Tab Switch Detection (Events Only)

Technical implementation:
- document.addEventListener('visibilitychange', handler) — fires when tab is hidden
- window.addEventListener('blur', handler) — fires when window loses focus

On detection:
- First time: Warning overlay appears over the competition content. "You left the competition window. Return immediately."
- Second time: Stronger warning + flag added to attempt record in database
- Third time: Red warning + auto-flag + organizer immediately notified via real-time notification
- Fourth time: Competition attempt is automatically submitted (whatever answers were given) and marked suspicious

The overlay cannot be dismissed by keyboard shortcuts — user must click "I'm Back" button to return.

## 34.3 Server-Side Time Enforcement

Every question has a server-recorded start time.
Answer submission includes the question ID.
Server checks: submission_time - question_start_time <= time_limit.
Late submissions are rejected with error: "Time limit exceeded for this question".
This prevents browser manipulation to extend time.

## 34.4 Identity and Session Security

Multiple account detection:
- Track IP address, browser fingerprint (user agent + screen resolution + timezone), and device ID
- If same person creates 2 accounts with identical fingerprints: flag for review (may be coincidence on shared devices, admin reviews)
- Cannot have two accounts in the same battle (checked by IP and fingerprint at matchmaking time)

Session security:
- Every API request validated with JWT
- JWT includes user ID, issued-at time, expiration
- Tokens cannot be modified (signed with RS256)
- If a token is expired: user is redirected to re-authenticate

---

# 35. SOUND EFFECTS & AUDIO SYSTEM

## 35.1 Audio File Specifications

All audio files stored in /static/sounds/ in the frontend:

correct.mp3:
- Duration: 300ms
- Description: A bright, ascending two-tone chime. Similar to a notification sound but more satisfying.
- Volume: 70% of master (doesn't need to be loud, just pleasant)
- Use: Every correct answer in tests and solo practice

wrong.mp3:
- Duration: 200ms
- Description: A low, brief buzz or thud. Conveys "that was wrong" without being harsh.
- Volume: 60% of master
- Use: Every wrong answer in tests and solo practice

level_up.mp3:
- Duration: 2000ms
- Description: A triumphant fanfare — rising notes that peak and hold. Celebratory.
- Volume: 85% of master
- Use: Level progression events

battle_start.mp3:
- Duration: 1000ms
- Description: A deep "whomp" or battle horn sound. Signals combat begins.
- Volume: 80% of master
- Use: Battle countdown reaches zero

battle_win.mp3:
- Duration: 3000ms
- Description: Victory theme — uplifting, energetic music segment. Feels earned.
- Volume: 80% of master
- Use: Battle win result

battle_lose.mp3:
- Duration: 2000ms
- Description: Melancholic, brief. Not too sad — players should want to try again.
- Volume: 70% of master
- Use: Battle loss result

battle_draw.mp3:
- Duration: 1500ms
- Description: Neutral, slightly tense resolution. "It could have gone either way."
- Volume: 70% of master
- Use: Battle draw result

streak.mp3:
- Duration: 1000ms
- Description: A crackling fire sound followed by a soft whoosh. Evokes a streak of flame.
- Volume: 75% of master
- Use: First session each day when streak is still active

coins.mp3:
- Duration: 500ms
- Description: Classic coin collection sound. Satisfying clink.
- Volume: 75% of master
- Use: Sparks awarded to wallet

countdown.mp3:
- Duration: 1000ms (loops for 5 seconds)
- Description: Rhythmic beeping, like a timer. Each beep is one second.
- Volume: 80% of master, gets louder in last 2 seconds
- Use: Last 5 seconds of question timer

match_found.mp3:
- Duration: 1000ms
- Description: Alert sound — distinct enough to grab attention, like a "ping" with reverb.
- Volume: 90% of master (needs to grab attention)
- Use: Matchmaking finds opponent

badge_unlocked.mp3:
- Duration: 1000ms
- Description: A satisfying "unlock" or "achievement" sound. Layered chime.
- Volume: 75% of master
- Use: Achievement badges earned

## 35.2 Sound Management Architecture

The sound store (sound.store.ts) tracks:
- masterVolume: 0.0 to 1.0 (default 0.7)
- soundEnabled: boolean (default true)
- battleSoundsEnabled: boolean (default true)
- backgroundMusicEnabled: boolean (default false)

Howler.js initialization:
- All sounds preloaded on app mount
- Sprites defined in a single Howl instance for efficiency
- Failed loads: gracefully ignored (no console errors to user)
- iOS unlock: Howler handles the iOS audio context unlock automatically

Volume control:
- All sound effects respect Howler.volume(masterVolume)
- Individual sounds can have their own volume multiplier
- User can change volume in /settings page

---

# 36. YOUTUBE INTEGRATION — HELP LINKS SYSTEM

## 36.1 YouTube Link Placement Strategy

YouTube links appear in three places in the UX:

Placement 1 — Theory section (day plans and chapters):
- A prominent "Watch Video" button at the TOP of every theory page
- Same button at the BOTTOM of the theory (after reading, you can review with video)
- Button text: "Watch: [Video Title] — [Duration]"
- Button style: Red YouTube icon + video title in gray text

Placement 2 — Questions (after submitting):
- A small "?" icon next to the question number
- Only appears AFTER the user has submitted an answer
- Clicking shows a tooltip: "[Video Title] — [Duration] · Watch on YouTube →"
- During battles: This icon is NOT shown (would give unfair advantage during live battle)
- After battles (result/review page): Shown for every question

Placement 3 — Community posts:
- When a community post mentions a specific chapter, a related YouTube link is suggested automatically
- "Related Resource: [Video Title] →" shown as a subtle card below the post

## 36.2 YouTube Link Curation Process

Every link is manually reviewed by EduBattle content team:

Step 1: Content creator writes the chapter theory or day plan
Step 2: They search YouTube for best explanation of the key concept
Step 3: Quality checklist:
  - Is the video publicly accessible (not restricted)?
  - Is the explanation accurate and NCERT-aligned (for class content)?
  - Is the video quality acceptable (audio clear, no background noise)?
  - Is the channel reputable (established educational channel)?
  - Does the relevant explanation start within the first 2 minutes?
Step 4: If yes to all: link is added to the database
Step 5: Monthly automated check: YouTube Data API verifies each link is still live
Step 6: Dead links flagged and replaced within 48 hours

## 36.3 Preferred YouTube Channels by Content Type

Class 9–10 Maths:
- Khan Academy India
- NCERT official YouTube
- Vedantu Class 9 and 10 channels
- Unacademy Foundation

Class 11–12 Physics and Chemistry:
- Physics Wallah (PW) — most popular for CBSE/JEE
- Vedantu JEE
- NCERT Wallah (PW's NCERT-specific channel)
- Unacademy JEE

Programming Languages (Engineering):
- CS50 (Harvard) — for C and web development
- Take U Forward (Striver) — for DSA
- MyCodeSchool — for C and data structures
- Telusko — for Java
- Corey Schafer — for Python
- Traversy Media — for JavaScript
- TechWorld with Nana — for TypeScript and DevOps

---

# 37. ANIMATIONS & UI EFFECTS SYSTEM

## 37.1 Animation Principles

All animations follow these rules:

1. Purpose: Every animation must serve a function (feedback, attention, celebration). No purely decorative motion that slows the user down.

2. Duration: Short actions (button clicks) use 150–200ms. Medium actions (page transitions, card reveals) use 250–400ms. Celebrations (level up, win) use 500ms–3000ms.

3. Easing: Use ease-out for elements entering (feels natural — fast then slows). Use ease-in for elements leaving (starts slow then fast). Use spring-like easing for gamification events.

4. Reduced motion: All animations checked against prefers-reduced-motion CSS media query. If user has reduced motion enabled, animations are either removed or replaced with simple opacity fades.

5. GPU-accelerated: Use transform and opacity for animations (these are GPU-accelerated). Avoid animating width, height, top, left, margin (these cause reflow).

## 37.2 Core Animations — Detailed Specifications

Answer Correct Animation:
1. Background of selected MCQ option flashes from default to bright green (#3FB950) in 100ms
2. A white checkmark scales in from 0 to 1 in 200ms (spring easing)
3. "+3 Points" text appears above the option and floats upward over 800ms while fading out
4. correct.mp3 plays simultaneously

Answer Wrong Animation:
1. Selected option shakes horizontally: translate(-8px) → translate(8px) → translate(-4px) → translate(4px) → translate(0) over 400ms
2. Background flashes red (#F85149)
3. A white X mark appears
4. Correct answer option highlights green
5. wrong.mp3 plays

Level Up Sequence:
1. White flash overlay appears on screen (opacity 0 → 0.8 → 0) over 600ms
2. Level badge in the nav scales to 1.3x and spins 360° over 800ms
3. Badge number counts from old level to new level
4. Confetti falls from top of screen (svelte-confetti component, 3 second duration)
5. XP bar animates: fills to 100%, flashes, resets to 0, then fills to current XP in new level
6. level_up.mp3 plays
7. Toast notification: "Level X reached! You're now in [Tier]!"

Streak Milestone Animation (7-day):
1. Flame icon in navbar pulses (scale 1 → 1.3 → 1 over 300ms, repeats 3 times)
2. Flame color shifts to orange
3. Toast: "🔥 7-Day Streak! You're on fire! +25 Sparks awarded"
4. streak.mp3 plays

Battle Match Found Animation:
1. Player's avatar slides in from the left
2. Opponent's avatar slides in from the right
3. They "collide" in the center with a spark/flash effect (using CSS pseudo-elements)
4. "MATCH FOUND" text fades in above the collision
5. match_found.mp3 plays
6. 5-second countdown begins

## 37.3 Micro-interactions

Button hover:
- Scale: 1 → 1.02 over 150ms
- Background color shifts slightly lighter

Button active (press):
- Scale: 1 → 0.97 over 100ms
- Feels physical

Input focus:
- Border color transitions to electric blue (#58A6FF) over 200ms
- Subtle glow shadow appears

Card hover:
- Translate up 4px over 200ms
- Box shadow increases
- Gives a "lift" effect

Loading state:
- Shimmer effect across skeleton cards
- Shimmer moves left to right continuously

Toast notifications:
- Slide in from top-right over 300ms
- Auto-dismiss after 4 seconds with slide-out animation

---

# 38. DATABASE SCHEMA — COMPLETE DETAIL

(All tables previously described are repeated here with additional detail and relationships.)

## 38.1 Complete Relationship Map

users ─── user_levels (1:1)
users ─── user_streaks (1:1)
users ─── wallets (1:1)
users ─── user_progress (1:many)
users ─── user_answers (1:many)
users ─── battles (1:many as player1 or player2)
users ─── community_posts (1:many)
users ─── events (1:many as organizer)
users ─── event_registrations (1:many)
users ─── notifications (1:many)
users ─── subscriptions (1:many)
wallets ─── wallet_transactions (1:many)
questions ─── user_answers (1:many)
battles ─── wallet_transactions (optional 1:1)
events ─── event_registrations (1:many)
events ─── wallet_transactions (optional 1:many for prizes)

## 38.2 Additional Tables Not Previously Listed

Table: event_registrations
- id: UUID
- event_id: UUID REFERENCES events(id)
- user_id: UUID REFERENCES users(id)
- registration_time: TIMESTAMP DEFAULT NOW()
- status: ENUM('registered', 'participated', 'disqualified', 'winner')
- score: INTEGER DEFAULT 0
- rank: INTEGER NULL
- cheat_flags: INTEGER DEFAULT 0
- certificate_url: VARCHAR(500) NULL

Table: achievements
- id: UUID
- user_id: UUID REFERENCES users(id)
- achievement_key: VARCHAR(100) NOT NULL (e.g., 'first_blood', 'streak_7', 'python_master')
- earned_at: TIMESTAMP DEFAULT NOW()
- sparks_rewarded: INTEGER DEFAULT 0

Table: user_daily_limits
- id: UUID
- user_id: UUID REFERENCES users(id)
- date: DATE DEFAULT CURRENT_DATE
- questions_answered: INTEGER DEFAULT 0
- battles_fought: INTEGER DEFAULT 0
- sparks_wagered: BIGINT DEFAULT 0
- xp_earned: INTEGER DEFAULT 0

---

# 39. API ENDPOINTS — COMPLETE DETAIL

(All 70+ endpoints previously listed with their full specifications. All return JSON with consistent format: { success: bool, data: any, error: string? })

## 39.1 Standard Response Format

Every API endpoint returns JSON in this format:

Success response:
{ "success": true, "data": {...}, "meta": { "page": 1, "total": 100, "request_id": "uuid" } }

Error response:
{ "success": false, "error": { "code": "INVALID_INPUT", "message": "Username must be 3-20 characters", "field": "username" }, "request_id": "uuid" }

HTTP status codes used:
- 200: Success
- 201: Created
- 400: Bad request (invalid input)
- 401: Unauthorized (not logged in)
- 403: Forbidden (logged in but no permission)
- 404: Not found
- 409: Conflict (e.g., username already taken)
- 422: Unprocessable entity (logically invalid input)
- 429: Too many requests (rate limited)
- 500: Internal server error (never expose details to client)

---

# 40. ADMIN PANEL — COMPLETE DETAIL

## 40.1 Admin Dashboard

URL: /admin (requires admin role)

The admin panel is a separate section with its own navigation.

Dashboard shows:
- Platform health status (green/yellow/red indicators)
- Real-time user count (WebSocket)
- Today's signups, battles, revenue
- Server metrics (CPU, RAM via API)
- Moderation queue count (urgent if > 10 unreviewed items)
- Recent activity log (last 20 admin actions)

## 40.2 User Management (/admin/users)

Search: by username, email, user type, subscription, level, join date

User list columns:
- Avatar + Username (linked to admin user detail)
- Email
- User Type
- Level
- Subscription
- Status (Active/Suspended)
- Join Date
- Last Active

User detail page shows:
- All profile information
- Battle history (full, not just last 10)
- Wallet history
- Community activity
- Subscription history
- Login history with IP addresses
- Cheat flags received
- Admin notes (internal)

Admin actions available:
- Suspend account (with reason, shown to user on next login)
- Unsuspend account
- Force password reset
- Grant/revoke admin role
- Grant/revoke College Coordinator verified status
- Add bonus Sparks
- Reset streak (only with documented reason)
- View all JWT tokens and invalidate all sessions
- Export user data as JSON (GDPR compliance)
- Delete account (with 30-day soft-delete grace period)

## 40.3 Question Management (/admin/questions)

Question browser with filters:
- By class level, subject, chapter, difficulty, type
- By accuracy rate (show questions where accuracy is too low or too high)
- By creation date, last updated
- By creator

Bulk operations:
- Select multiple questions
- Bulk activate/deactivate
- Bulk reassign difficulty
- Export to CSV for external review

Question editor:
- Full form to create or edit any question
- Live preview of how question will appear to students
- Add/edit YouTube link with video preview
- Set difficulty and points
- Tag with class, subject, chapter

Content statistics:
- Questions per subject and class
- Average accuracy per chapter
- Questions added this month vs last month
- Questions flagged for inaccuracy by users

## 40.4 Events Management (/admin/events)

Approval queue:
- All events in "Pending Review" status shown with priority
- Event detail view (full preview of what students will see)
- Approve: event becomes visible and opens for registration
- Reject: Rejection reason sent to organizer via email
- Request changes: Ask organizer to modify and resubmit

Active events monitoring:
- Live participant count for active events
- Cheat flag alerts (if many flags on one event, alert admin)
- Ability to pause or cancel any active event

Post-event:
- Generate winner certificates
- Distribute Sparks prizes (if EduBattle-sponsored)
- Archive event data

---

# 41. NOTIFICATION SYSTEM

## 41.1 Real-Time Notification Architecture

Notifications flow:
1. Backend creates notification record in PostgreSQL
2. Backend publishes notification to Redis pub/sub channel: "notifications:userId"
3. Frontend subscribes to this channel via WebSocket
4. Frontend receives notification in real-time, increments unread badge
5. Shows toast notification for high-priority notifications

## 41.2 Notification Priority Levels

Priority 1 — Urgent (shown immediately, plays sound):
- Battle found (match_found.mp3)
- Battle result
- Event starting now

Priority 2 — Important (toast shown, badge incremented):
- Level up
- Badge unlocked
- Community reply to your post
- Streak milestone

Priority 3 — Informational (badge incremented, no toast):
- Event registration confirmed
- Weekly progress digest ready
- New content available

Priority 4 — Background (email only, no in-app):
- Subscription renewal reminder
- Billing confirmation
- Password reset email

## 41.3 Notification Preferences

Users can configure in /settings:
- Battle notifications: On/Off
- Level up notifications: On/Off (default on)
- Community notifications: On/Off (default on)
- Streak warnings: On/Off (default on)
- Event reminders: On/Off (default on)
- Email: All of the above can be configured for email
- Push notifications: Users can enable browser push notifications (PWA)

---

# 42. SEARCH & FILTERING SYSTEM

## 42.1 Global Search (Command Palette)

Triggered by: Clicking the search icon in navbar, or Ctrl+K keyboard shortcut

The search opens a full-width modal overlay.

Search indexes:
- Questions (question_text field)
- Community posts (title and body)
- Events (name and description)
- Chapters and topics (names)
- Users (username and full name — for public profiles)

Search result display:
Results shown in categorized sections:
- Chapters: "Class 10 Maths — Chapter 7: Coordinate Geometry"
- Community: "Question about Polynomials factor theorem..."
- Events: "Python Challenge — IIT Delhi — March 2025"
- Users: "rahul_singh — Level 15"

As you type, results update with 300ms debounce.
Recent searches stored in localStorage (last 5).
Pressing Escape closes the search.
Clicking a result navigates to that page.

## 42.2 MeiliSearch Index Configuration

Index 1 — questions:
Fields indexed: question_text, subject, chapter, language, class_level, difficulty
Searchable: question_text
Filterable: subject, chapter, language, class_level, difficulty, is_active
Sortable: accuracy_rate, times_shown

Index 2 — community_posts:
Searchable: title, body (first 1000 chars)
Filterable: class_level, subject, chapter, language, post_type, is_deleted
Sortable: upvotes, created_at, view_count

Index 3 — events:
Searchable: event_name, description (first 500 chars), college_name
Filterable: subject, language, event_type, status, visibility
Sortable: start_time, created_at

Typo tolerance: enabled (1 typo for words 4+ chars, 2 typos for words 9+ chars)
Highlighting: matches highlighted in results
Pagination: 10 results per page

---

# 43. PERFORMANCE & OPTIMIZATION STRATEGY

## 43.1 Database Performance Strategy

Index strategy (every indexed column listed):

Unique indexes (for lookup uniqueness):
- users.email
- users.username
- wallets.user_id

Single-column indexes (for frequent single-field filters):
- questions.class_level
- questions.subject
- questions.language
- questions.difficulty
- questions.is_active
- battles.status
- battles.started_at
- community_posts.created_at

Composite indexes (for multi-field queries):
- (questions.class_level, questions.subject, questions.chapter, questions.is_active)
- (user_answers.user_id, user_answers.answered_at)
- (battles.player1_id, battles.status)
- (battles.player2_id, battles.status)
- (wallet_transactions.user_id, wallet_transactions.created_at)
- (user_progress.user_id, user_progress.content_type, user_progress.completed)
- (community_posts.class_level, community_posts.subject, community_posts.created_at)

Partitioning:
- user_answers table partitioned by answered_at (monthly partitions)
- Old partitions (> 1 year) moved to archive tables

## 43.2 Redis Cache Strategy

User session: cache 24 hours (invalidated on logout)
User level/XP: cache 5 minutes (updated on XP change)
Question bank for a chapter: cache 30 minutes (invalidated when question added/updated)
Leaderboard top 100: cache 60 seconds (Redis ZSET is live, but response is cached)
Battle state: in Redis, no PostgreSQL caching needed
Matchmaking queues: live Redis LISTs, no caching layer

## 43.3 Frontend Performance

Code splitting: Each route is a separate JavaScript chunk (lazy loaded)
Image optimization: All images served as WebP, lazy-loaded with loading="lazy"
Font subsetting: Only characters used on the site included in font files
Service Worker: Caches static assets (fonts, icons, sounds) for offline capability
Preloading: SvelteKit preloads page data on hover over navigation links
Bundle size target: Under 200KB gzipped for initial JavaScript bundle

---

# 44. DEPLOYMENT & INFRASTRUCTURE

## 44.1 Production Setup

Cloudflare sits in front of everything:
- DDoS protection
- CDN for static assets (frontend HTML, CSS, JS cached at edge)
- WebSocket proxying

Nginx on the VPS:
- SSL/TLS termination
- Reverse proxy to TypeScript API and SvelteKit Node.js server
- Rate limiting at Nginx level (as backup to application-level rate limiting)
- GZIP compression
- Static file serving for uploaded media (with proper Cache-Control headers)

TypeScript API Server:
- deployable server bundle deployed via Docker
- Graceful shutdown: accepts SIGTERM, drains in-progress requests over 30 seconds, then exits
- Health check endpoint: /api/health returns 200 if DB and Redis are reachable

SvelteKit Server:
- Node.js server with adapter-node
- Serves SSR pages and static files
- Proxies API requests to TypeScript backend (in production, Nginx handles this)

## 44.2 Database Backup Strategy

PostgreSQL backups:
- Continuous WAL archiving to cloud storage (S3/R2)
- Full daily backups at 3 AM IST
- Point-in-time recovery possible
- Retained for 30 days
- Monthly archives retained for 1 year

Redis backup:
- RDB snapshot every 6 hours
- AOF (append-only file) enabled for durability
- Backed up to cloud storage daily

## 44.3 Scaling Plan

Current architecture (MVP):
- Single VPS: 4 vCPU, 8GB RAM
- PostgreSQL on same server
- Redis on same server
- Can handle: ~500 concurrent users, ~50 concurrent battles

Phase 2 scaling (1000+ concurrent users):
- Separate VPS for database
- Redis cluster (3 nodes)
- 2 API server instances behind load balancer
- CDN for all static assets
- Read replica for PostgreSQL (for leaderboard and analytics queries)

Phase 3 scaling (10,000+ concurrent users):
- Kubernetes cluster
- Managed PostgreSQL (AWS RDS or PlanetScale)
- Redis Cloud cluster
- API servers auto-scaling based on CPU
- Battle servers separate from API servers (WebSocket-heavy)

---

# 45. SECURITY ARCHITECTURE

## 45.1 Authentication Security

bcrypt cost factor: 12 (balance between security and performance — takes ~300ms on modern hardware, which is acceptable for login but expensive for brute-force attacks)

JWT algorithm: RS256 (asymmetric — private key signs tokens, public key verifies)
- Private key: stored as environment variable (never in code or git)
- Public key: can be public (used for verification only)
- Advantage: Backend services can verify tokens without knowing the private key

Token storage: httpOnly cookies
- httpOnly: JavaScript cannot access the cookie (prevents XSS token theft)
- SameSite=Strict: Cookie not sent with cross-site requests (prevents CSRF)
- Secure: Cookie only sent over HTTPS
- Domain: Set to .edubattle.in (accessible to both edubattle.in and api.edubattle.in)

## 45.2 Input Validation Strategy

All user input is validated at three layers:
1. Client-side (Zod in frontend): Provides immediate user feedback
2. API middleware (TypeScript-playground/validator): Validates request structs before hitting handlers
3. Database constraints: NOT NULL, UNIQUE, CHECK constraints as final defense

Never trust input from the client. Even if the frontend validates, the backend ALWAYS validates independently.

## 45.3 Secrets Management

All secrets stored as environment variables, never in code:
- DATABASE_URL (contains password)
- REDIS_URL (contains password if set)
- JWT_PRIVATE_KEY (multi-line PEM — stored as base64 encoded)
- SENDGRID_API_KEY
- RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
- STORAGE_ACCESS_KEY and STORAGE_SECRET_KEY

In production: secrets managed via server environment (not .env files)
In CI/CD: secrets stored in GitHub Actions Secrets (encrypted, not visible in logs)

## 45.4 Razorpay Payment Security

Never store raw payment data (card numbers, CVVs) — Razorpay handles all PCI compliance.

Payment verification process:
1. Frontend initiates payment with Razorpay order ID
2. Razorpay returns payment_id, order_id, signature
3. Frontend sends these three values to EduBattle backend
4. Backend verifies signature: HMAC-SHA256(order_id + "|" + payment_id, key_secret)
5. If signature matches: payment is genuine, credit Sparks
6. If signature doesn't match: reject (someone tampered with the payment confirmation)

This webhook verification prevents users from manually claiming payments they didn't make.

---

# 46. ANALYTICS & REPORTING

## 46.1 User Behavior Analytics

Events tracked (anonymized, no PII in analytics):

Learning events:
- chapter_opened (class, subject, chapter)
- question_answered (class, subject, chapter, difficulty, correct, time_taken)
- day_plan_opened (language, day)
- day_plan_completed (language, day, score)

Battle events:
- battle_lobby_opened
- battle_queue_joined (class, subject, wait_time)
- battle_matched (class, subject, level_diff)
- battle_completed (result, duration)

Navigation events:
- page_viewed (page, referrer)
- search_performed (query, results_count)
- youtube_link_clicked (content_type, chapter)

Community events:
- post_created (type, class, subject)
- answer_submitted
- upvote_cast

## 46.2 Key Metrics Dashboard (Admin)

Daily Metrics:
- New Signups
- Daily Active Users (DAU)
- Questions Answered
- Battles Started
- Battles Completed
- Revenue

Weekly Metrics:
- Weekly Active Users (WAU)
- Retention rate (Day 1, Day 7, Day 30)
- Average session length
- Average questions per session

Monthly Metrics:
- Monthly Active Users (MAU)
- DAU/MAU ratio (engagement quality)
- Revenue breakdown by stream
- Churn rate (subscriptions cancelled)
- Net Promoter Score (via periodic survey)

Content Metrics:
- Most viewed chapters
- Chapters with lowest accuracy (need better questions or content)
- Most-clicked YouTube links
- Least-used content (may need pruning or improvement)

---

# 47. MOBILE RESPONSIVENESS PLAN

## 47.1 Mobile Usage Priority

EduBattle expects 60-70% of users to access via mobile phones. The design is mobile-first with desktop enhancements.

Design priorities for mobile:
1. Navbar: Collapses to hamburger on screens below 768px
2. Battle arena: Single column layout (opponent info above, own info below, question in center)
3. Cards: Stack vertically on mobile (no grid)
4. Tables: Horizontally scrollable or converted to card list
5. Modals: Full-screen on mobile
6. Fonts: Slightly larger on mobile for readability (16px body minimum)
7. Tap targets: All interactive elements minimum 44×44px

## 47.2 Responsive Component Behavior

Navbar:
- Desktop (>768px): Full horizontal nav with all links visible
- Tablet (768px): Logo + Key links + hamburger for rest
- Mobile (<640px): Logo + hamburger only

Dashboard:
- Desktop: 3-column grid layout
- Tablet: 2-column grid
- Mobile: Single column, cards stacked

Battle Arena:
- Desktop: Split screen (question left, timer/scores right)
- Mobile: Full-width question, scores in compact top bar

Community Feed:
- Desktop: 3-column (sidebar + feed + trending)
- Tablet: 2-column (feed + trending)
- Mobile: Single column feed, sidebar becomes accordion

## 47.3 Touch Interaction Enhancements

For mobile users:
- MCQ options are taller (min 60px touch target)
- Swipe left/right to navigate between questions in tests
- Pull-to-refresh on community feeds and leaderboards
- Swipe to dismiss toast notifications
- Long-press on badges to see their description (no hover on mobile)

---

# 48. ACCESSIBILITY PLAN

## 48.1 WCAG 2.1 Level AA Compliance Goals

Color contrast:
- All normal text: minimum 4.5:1 contrast ratio
- Large text (18px+ bold or 24px+): minimum 3:1 ratio
- Focus indicators: minimum 3:1 contrast with adjacent colors

All foreground/background combinations verified:
- Off-white #E6EDF3 on dark navy #0D1117: contrast ratio 16.6:1 (passes)
- Electric blue #58A6FF on dark navy #0D1117: contrast ratio 8.3:1 (passes)
- Muted gray #8B949E on dark navy #0D1117: contrast ratio 5.9:1 (passes)

Keyboard navigation:
- Tab order follows logical visual flow
- All interactive elements reachable by Tab
- Skip to main content link at top of page (visible on focus)
- Focus ring visible on all elements (custom ring using box-shadow)
- Escape key closes modals, dropdowns
- Arrow keys navigate within components (select menus, radio groups)

Screen reader support:
- All images have alt attributes
- Icons used standalone have aria-label
- Form inputs have associated labels (not just placeholder text)
- Modals use aria-modal, aria-labelledby, aria-describedby
- Live regions (aria-live) for dynamic content (score updates, timer, notifications)
- ARIA landmarks: header, nav, main, aside, footer

## 48.2 Specific Accessible Patterns

Battle timer:
- Timer is visually displayed
- For screen reader: "Time remaining: 45 seconds" announced via aria-live region every 10 seconds
- In last 5 seconds: "5 seconds remaining", "4 seconds remaining" etc.

MCQ options:
- Options are radio buttons (native accessible semantics)
- Selected option announced by screen reader
- Answer feedback announced: "Correct, 3 points earned" or "Incorrect, correct answer is B"

Leaderboard:
- Implemented as a table with th headers
- Each row navigable via keyboard
- Your row has aria-current="true"

---

# 49. INTERNATIONALIZATION & LOCALIZATION

## 49.1 Language Strategy

EduBattle's primary UI language: English (all navigation, buttons, labels)

Theory content: English with Hindi alternatives planned for Phase 2

YouTube links: Curated in both English and Hindi for each topic. User preference in Settings:
- Preferred YouTube language: English | Hindi
- When Hindi is preferred, Hindi video link shown first, English as alternate

Date and time: Always IST (UTC+5:30), formatted as DD/MM/YYYY HH:MM

Numbers: Indian number formatting (1,00,000 not 100,000) for large Sparks values

Currency: Always ₹ (Indian Rupee), no other currencies at launch

## 49.2 RTL Support

Not planned for initial launch. EduBattle targets Indian students where left-to-right reading (English or Hindi in Latin script) is standard.

---

# 50. FUTURE ROADMAP & FEATURE PIPELINE

## 50.1 Phase 1 — MVP (First 6 Months)

Core learning platform:
- Home page complete
- Sign up and sign in
- Dashboard with streak, level, XP
- Class 9 and Class 10 complete content
- C Language (30 days) and Python (45 days) complete
- Basic 1v1 Quick Battle
- Basic leaderboard (global only)
- Class 9 and Class 10 community
- C and Python community
- Basic events portal (create and participate)
- Wallet with earned Sparks (no real money loading yet)
- Mobile responsive design
- Sound effects
- YouTube links for all content

## 50.2 Phase 2 — Growth (Months 7–12)

- Class 11 and Class 12 all subjects
- All 12 programming languages fully loaded
- Marathon battle format (20 questions)
- ₹200/month Premium Subscription
- ₹100 Skill Pack
- Sparks loading with Razorpay
- Full anti-cheat for events (safe browser mode)
- Weekly and Monthly leaderboards with prizes
- PWA (Progressive Web App) for mobile
- Push notifications
- Referral program (earn Sparks for inviting friends)
- Team Battles (2v2)

## 50.3 Phase 3 — Scale (Year 2)

- Native Android app (Kotlin)
- Native iOS app (Swift)
- Live classroom: teacher streams, students watch and answer questions in sync
- AI-generated personalized question recommendations
- AI-powered question explanation (chat with AI about why an answer is correct)
- Offline mode: download chapter content for offline study
- Parent dashboard: track child's progress, set daily goals
- School institutional plan (bulk pricing for schools)
- Certificate of completion with QR code verification
- NCERT eBook integration
- Voice-based questions (accessibility for visual impairment)
- 3v3 Team Battle format
- Inter-school and inter-college tournaments (bracket style)

## 50.4 Phase 4 — Ecosystem (Year 3+)

- EduBattle Creator Program: educators publish their own courses on the platform
- Mentorship marketplace: connect students with 1-on-1 expert mentors
- EduBattle for Schools: institutional version integrated with school management systems
- International expansion: IB curriculum, A-levels, SAT/ACT prep
- EduBattle Hackathons: 24-hour online coding competitions
- Content licensing: license EduBattle's question bank to other ed-tech platforms
- AI tutor: conversational AI that can teach full chapters interactively
- Adaptive learning: difficulty automatically adjusts based on performance

---

# 51. CLASS 9 MATHS — CHAPTER-BY-CHAPTER QUESTION BANK SPECIFICATION

## 51.1 Question Bank Structure for Class 9 Maths

Total target: 850+ questions across 14 chapters.

Chapter 1 — Number Systems:
- 60 questions total
- 30 MCQ (2 points each = 60 pts max)
- 20 Short Answer (3 points each = 60 pts max)
- 10 Long Answer (5 points each = 50 pts max)
- Difficulty distribution: 40% Easy, 40% Medium, 20% Hard

Sample questions for Number Systems:
MCQ 1: "Which of the following is a rational number? (a) √2 (b) √3 (c) √4 (d) π" — Answer: √4 (= 2)
MCQ 2: "The decimal expansion of 1/7 is: (a) terminating (b) non-terminating repeating (c) non-terminating non-repeating (d) none" — Answer: (b)
Short 1: "Prove that √5 is irrational using contradiction method"
Short 2: "Rationalize 1/(3+√2)"
Long 1: "Represent √3 on the number line using geometric construction"

Chapter 2 — Polynomials: 65 questions
Chapter 3 — Coordinate Geometry: 45 questions
Chapter 4 — Linear Equations: 55 questions
Chapter 5 — Euclid's Geometry: 40 questions
Chapter 6 — Lines and Angles: 65 questions
Chapter 7 — Triangles: 70 questions
Chapter 8 — Quadrilaterals: 55 questions
Chapter 9 — Areas: 50 questions
Chapter 10 — Circles: 65 questions
Chapter 11 — Constructions: 35 questions
Chapter 12 — Heron's Formula: 50 questions
Chapter 13 — Surface Areas and Volumes: 75 questions
Chapter 14 — Statistics: 60 questions

---

# 52. CLASS 9 SCIENCE — CHAPTER-BY-CHAPTER QUESTION BANK SPECIFICATION

## 52.1 Question Bank Structure for Class 9 Science

Total target: 900+ questions across 15 chapters.

Chapter 1 — Matter in Our Surroundings:
- 60 questions: 30 MCQ, 20 Short, 10 Long

Chapter 2 — Is Matter Around Us Pure?:
- 65 questions: 35 MCQ, 20 Short, 10 Long

Chapter 3 — Atoms and Molecules:
- 70 questions (more calculation-heavy): 30 MCQ, 25 Short (calculations), 15 Long

Sample mole concept questions:
MCQ: "What is the molecular mass of H₂O? (a) 16 (b) 18 (c) 17 (d) 34" — Answer: 18
Short: "How many molecules are present in 18g of water?"
Answer: 18g = 1 mole of H₂O = 6.022 × 10²³ molecules

Chapter 8 — Motion:
- 75 questions (many calculation problems)
Sample: "A car starts from rest and reaches 20 m/s in 5 seconds. Find acceleration."
Answer: a = (v-u)/t = (20-0)/5 = 4 m/s²

Chapter 10 — Gravitation:
- 70 questions
Sample: "A body of mass 10 kg is on the surface of Earth. Find its weight. (g = 10 m/s²)"
Answer: W = mg = 10 × 10 = 100 N

---

# 53. CLASS 10 MATHS — CHAPTER-BY-CHAPTER QUESTION BANK SPECIFICATION

## 53.1 Question Bank Structure for Class 10 Maths

Total target: 1000+ questions across 14 chapters. Class 10 gets extra questions because of board exam importance.

Chapter 3 — Pair of Linear Equations:
Target: 80 questions
Focus areas:
- Graphical method questions (identify solution type from a/b ratio)
- Substitution method word problems (age problems, money problems)
- Elimination method problems
- Cross-multiplication method
- Real-life application problems (two unknowns)

Sample board-style question (Long Answer):
"The sum of two numbers is 8. If 3 times the larger number is subtracted from 5 times the smaller, the result is 0. Find the numbers."
Answer: Let numbers be x and y where x > y. x + y = 8 and 5y - 3x = 0. From second: y = 3x/5. Substituting: x + 3x/5 = 8 → 8x/5 = 8 → x = 5, y = 3.

Chapter 5 — Arithmetic Progressions:
Target: 75 questions

Sample questions:
MCQ: "The nth term of AP 5, 8, 11, ... is?" — Answer: 5 + (n-1)×3 = 3n+2
Short: "Find the sum of first 20 terms of AP: 1, 3, 5, 7, ..."
Answer: a=1, d=2, n=20, S₂₀ = 20/2 × [2(1) + 19(2)] = 10 × 40 = 400

Chapter 6 — Triangles:
Target: 90 questions (large chapter with BPT, similarity, Pythagoras)

---

# 54. CLASS 10 SCIENCE — CHAPTER-BY-CHAPTER QUESTION BANK SPECIFICATION

## 54.1 Chapter-Wise Question Distribution

Chapter 11 — Electricity:
Target: 85 questions
Types: MCQ (definition/theory), Short (numerical), Long (complex circuits)

Sample numerical question:
"Three resistors of 2Ω, 3Ω, and 6Ω are connected in parallel. Find the equivalent resistance."
Answer: 1/R = 1/2 + 1/3 + 1/6 = 3/6 + 2/6 + 1/6 = 6/6 = 1 ⟹ R = 1Ω

Chapter 9 — Light:
Target: 90 questions
Sample: "An object is placed 30 cm from a concave mirror of focal length 15 cm. Find image position."
Answer: 1/v + 1/u = 1/f. u = -30, f = -15. 1/v = 1/f - 1/u = -1/15 + 1/30 = -2/30 + 1/30 = -1/30. v = -30 cm. Image is real, at 30 cm on same side as object.

---

# 55. CLASS 11 PHYSICS — CHAPTER-BY-CHAPTER QUESTION BANK SPECIFICATION

## 55.1 Physics Question Bank Overview

Class 11 Physics has 14 chapters across 10 units. Total target: 1200+ questions.

Chapter-wise question counts:
- Ch 1–2 (Measurement): 60 questions
- Ch 3 (Kinematics — Straight Line): 80 questions
- Ch 4 (Kinematics — Plane): 70 questions
- Ch 5 (Laws of Motion): 90 questions
- Ch 6 (Work-Energy-Power): 85 questions
- Ch 7 (System of Particles): 80 questions
- Ch 8 (Gravitation): 75 questions
- Ch 9 (Elasticity and Fluid Mechanics): 70 questions
- Ch 10 (Thermal Properties): 65 questions
- Ch 11 (Thermodynamics): 85 questions
- Ch 12 (Kinetic Theory): 60 questions
- Ch 13 (Oscillations): 80 questions
- Ch 14 (Waves): 80 questions

Sample Projectile Motion question (Ch 4):
"A ball is thrown horizontally at 20 m/s from a height of 80m. Find the time to hit the ground and horizontal range. (g = 10 m/s²)"
Answer: Vertical: h = ½gt² → 80 = ½×10×t² → t² = 16 → t = 4s. Horizontal range: x = 20×4 = 80m.

---

# 56. CLASS 11 CHEMISTRY — CHAPTER-BY-CHAPTER QUESTION BANK SPECIFICATION

## 56.1 Chemistry Question Bank Overview

Total target: 1100+ questions across 14 units.

Mole Concept sample questions (Unit 1):
MCQ: "The number of atoms in 0.5 mole of O₂ molecules is?"
Answer: 0.5 mole O₂ = 0.5 × 6.022×10²³ molecules × 2 atoms/molecule = 6.022×10²³ atoms

Short: "12g of carbon contains how many atoms?"
Answer: 12g C = 1 mole = 6.022×10²³ atoms

Mole concept is heavily tested — 50+ questions on this topic alone.

Periodic Trends sample questions (Unit 3):
MCQ: "Which has the highest ionization energy? (a) Li (b) Na (c) K (d) Rb"
Answer: (a) Li — ionization energy decreases down a group

---

# 57. CLASS 12 PHYSICS — CHAPTER-BY-CHAPTER QUESTION BANK SPECIFICATION

## 57.1 Class 12 Physics Question Bank Overview

Total target: 1400+ questions. Class 12 Physics is the highest-priority content for JEE aspirants.

Board + JEE tag system:
Each question tagged with:
- "Board" — appears in CBSE board exams
- "JEE Main" — appears in JEE Mains
- "JEE Advanced" — appears in JEE Advanced (hardest)

Sample LCR Circuit question (Ch 7 — AC):
"In a series LCR circuit, L = 0.5H, C = 8μF, R = 100Ω, connected to 200V AC source. Find resonant frequency and current at resonance."
Answer: ω₀ = 1/√(LC) = 1/√(0.5 × 8×10⁻⁶) = 1/√(4×10⁻⁶) = 1/(2×10⁻³) = 500 rad/s. f = ω₀/2π = 500/2π ≈ 79.6 Hz. At resonance, Z = R = 100Ω. I = V/R = 200/100 = 2A.

---

# 58. CLASS 12 CHEMISTRY — CHAPTER-BY-CHAPTER QUESTION BANK SPECIFICATION

## 58.1 Class 12 Chemistry Question Bank Overview

Total target: 1300+ questions across 16 chapters.

Electrochemistry sample question (Ch 3):
"The EMF of cell: Zn | Zn²⁺ (0.1M) || Cu²⁺ (0.01M) | Cu is 1.10V at standard conditions. Find the cell EMF."
Using Nernst equation: E = E° - (RT/nF) × ln(Q) = 1.10 - (0.0592/2) × log([Zn²⁺]/[Cu²⁺]) = 1.10 - 0.0296 × log(0.1/0.01) = 1.10 - 0.0296 × 1 = 1.0704V

---

# 59. C LANGUAGE — ALL 30 DAYS — FULL SUBTOPIC & QUESTION BREAKDOWN

## 59.1 Days 1–10 Question Count Summary

Day 1 — Introduction: 8 questions, 17 points max
Day 2 — Variables & Data Types: 9 questions, 22 points max
Day 3 — Operators: 8 questions, 20 points max
Day 4 — Conditionals: 7 questions, 18 points max
Day 5 — Loops: 8 questions, 19 points max
Day 6 — Functions: 8 questions, 22 points max
Day 7 — Arrays: 7 questions, 18 points max
Day 8 — Strings: 7 questions, 18 points max
Day 9 — Pointers: 8 questions, 23 points max (hardest topic — more long answers)
Day 10 — Dynamic Memory: 7 questions, 20 points max

## 59.2 Days 11–20 Question Count Summary

Day 11 — Structures: 7 questions, 18 points max
Day 12 — Unions & Enums: 6 questions, 18 points max
Day 13 — File Handling: 7 questions, 17 points max
Day 14 — Preprocessor: 6 questions, 17 points max
Day 15 — Error Handling: 6 questions, 17 points max
Day 16 — Linked Lists: 7 questions, 22 points max
Day 17 — Stacks: 7 questions, 20 points max
Day 18 — Queues: 7 questions, 20 points max
Day 19 — Sorting: 8 questions, 24 points max
Day 20 — Searching: 7 questions, 19 points max

## 59.3 Days 21–30 Question Count Summary

Day 21 — Trees: 7 questions, 19 points max
Day 22 — Graphs: 7 questions, 18 points max
Day 23 — Hash Tables: 6 questions, 18 points max
Day 24 — Memory Deep Dive: 6 questions, 17 points max
Day 25 — Bitwise Operations: 7 questions, 19 points max
Day 26 — Modular Programming: 6 questions, 16 points max
Day 27 — Command Line Args: 5 questions, 13 points max
Day 28 — Advanced Pointers: 6 questions, 16 points max
Day 29 — Practice Projects: 4 long questions, 24 points max
Day 30 — Final Assessment: 30 questions, 90 points total

Total C Language question bank: 196 guided questions + 30 final assessment = 226 questions

---

# 60. PYTHON — ALL 45 DAYS — FULL SUBTOPIC & QUESTION BREAKDOWN

## 60.1 Python Day-by-Day Question Counts

Days 1–5 (Basics): 8 questions per day = 40 questions
Days 6–10 (Control Flow + Functions): 9 questions per day = 45 questions
Days 11–15 (Lists, Tuples, Sets): 9 questions per day = 45 questions
Days 16–20 (Dicts, Strings, Files): 8 questions per day = 40 questions
Days 21–25 (OOP): 10 questions per day = 50 questions
Days 26–30 (Advanced Python): 9 questions per day = 45 questions
Days 31–36 (NumPy, Pandas, Matplotlib): 8 questions per day = 48 questions
Days 37–40 (Projects, Scraping): 6 questions per day = 24 questions
Days 41–44 (Type hints, Design patterns): 7 questions per day = 28 questions
Day 45 (Final Assessment): 50 questions

Total Python question bank: 415 guided questions + 50 final assessment = 465 questions

## 60.2 Sample Python OOP Questions

Day 21 — Classes question examples:

MCQ: "What is 'self' in a Python class method?"
(a) A keyword meaning the class itself
(b) A reference to the current instance of the class
(c) The parent class
(d) A constructor parameter
Answer: (b)
Explanation: self refers to the instance of the class that a method is called on. It allows methods to access and modify the instance's attributes.

Short Answer: "What is the difference between a class variable and an instance variable in Python?"
Answer: A class variable is shared among all instances of the class — it is defined in the class body outside any method. An instance variable is unique to each instance — it is typically defined in __init__ with self.variable_name. Changes to a class variable affect all instances, while changes to an instance variable only affect that specific instance.

Long Answer: "Explain the __init__ method in Python classes. What is its purpose, when is it called, and what are the rules for its use?"
Answer: The __init__ method is a special method (also called a dunder or magic method) that serves as the constructor for a Python class. It is automatically called when a new instance of the class is created using ClassName(). Its purpose is to initialize the instance's attributes with their initial values. Rules: it must be named exactly __init__, it must have self as its first parameter (additional parameters come after), it must not have a return statement (or can return None), Python calls it automatically — you don't call it directly. Example: class Student: def __init__(self, name, age): self.name = name; self.age = age creates a Student class where each instance has its own name and age attributes.

---

*End of EduBattle Master Content Plan v3.0*

---

**DOCUMENT STATISTICS:**

- Total Sections: 60 main sections
- Content Areas Covered:
  - All 4 class levels (Class 9, 10, 11, 12) with complete chapter lists
  - All 12 engineering programming languages with day-by-day plans
  - Gamification system (levels, XP, streaks, badges)
  - Matchmaking system (BGMI-style)
  - Community system (class-wise and language-wise)
  - Events portal (college competitions)
  - Wallet and Sparks economy
  - Monetization model (Free, ₹200/month, ₹100 Skill Pack)
  - Anti-cheat and security
  - Sound effects system
  - YouTube help links system
  - Animations and UI effects
  - Complete database schema (13+ tables)
  - 70+ API endpoints
  - Admin panel
  - Notification system
  - Search and filtering
  - Performance optimization
  - Deployment and infrastructure
  - Security architecture
  - Analytics and reporting
  - Mobile responsiveness
  - Accessibility
  - Complete future roadmap
  - Chapter-by-chapter question bank specifications for all subjects
  - No code included — planning document only

**EduBattle Master Content Plan — Complete**
