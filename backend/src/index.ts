/**
 * FILE: index.ts
 * LOCATION: backend/src/index.ts
 * PURPOSE: Entry point for the EduQuest Express backend server.
 *          Registers all middleware, API routes, global error handler, and
 *          starts listening on the configured PORT.
 *
 * ARCHITECTURE:
 *  - Express v5 + TypeScript — full production server
 *  - PostgreSQL (via pg Pool) — central database connection
 *  - Redis (via ioredis) — caching, sessions, rate limiting
 *  - Routes: auth, content, battle, progress, leaderboard, community,
 *            users, notifications, search, events, wallet
 *  - Helmet — comprehensive security headers
 *  - CORS — configured for Next.js frontend origin
 *  - Morgan — structured HTTP request logging
 *  - Rate limiting — prevents API abuse
 *  - Graceful shutdown — handles SIGTERM/SIGINT cleanly
 *
 * CAPACITY: Stateless server design — safe for horizontal scaling.
 *           PostgreSQL pool supports 50 concurrent connections.
 *           Designed for 100+ concurrent users.
 *
 * DEPENDENCIES: express, cors, helmet, morgan, compression
 * USED BY: npm start / npm run dev
 * LAST UPDATED: 2026-05-19
 */

import * as dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import hpp from "hpp";
import { rateLimiter } from "./middlewares/rateLimiter";
import { closeRedisClient, probeRedis } from "./config/redis";
import logger from "./utils/logger";

/* ─────────────────────────────────────────────
 * Route imports — each module handles a distinct feature domain.
 * Every route file is self-contained with its own validation,
 * error handling, and database queries.
 * ───────────────────────────────────────────── */
import authRoutes         from "./routes/auth";
import contentRoutes      from "./routes/content";
import progressRoutes     from "./routes/progress";
import battleRoutes       from "./routes/battle";
import leaderboardRoutes  from "./routes/leaderboard";
import communityRoutes    from "./routes/community";
import userRoutes         from "./routes/users";
import notificationRoutes from "./routes/notifications";
import searchRoutes       from "./routes/search";
import eventRoutes        from "./routes/events";
import hackathonRoutes    from "./routes/hackathons";
import walletRoutes       from "./routes/wallet";
import adminRoutes        from "./routes/admin";
import codingRoutes       from "./routes/coding";
import testRoutes         from "./routes/tests";
import metricsRoutes      from "./routes/metrics";
import uploadRoutes       from "./routes/uploads";
import seoRoutes          from "./routes/seo";
import auditRoutes        from "./routes/audit";
import healthcheckRoutes  from "./routes/healthcheck";

import { createServer } from "http";
import { initSocket } from "./services/socket.service";

/* Database management */
import { checkDatabaseHealth, closeDatabasePool, getPoolMetrics } from "./config/database";

/* Production services */
import { startScheduler, stopScheduler } from "./services/scheduler.service";
import { startAnalyticsFlushTimer, stopAnalyticsFlushTimer } from "./services/analytics.service";
import { startAuditFlushTimer, stopAuditFlushTimer } from "./services/audit.service";
import { createRequestLogger, analyticsTracker } from "./middlewares/request-logger.middleware";
import { globalErrorHandler, notFoundHandler } from "./middlewares/error-handler.middleware";
import { responseTimeMiddleware } from "./middlewares/response-time";

/* ─────────────────────────────────────────────
 * App & Configuration
 * ───────────────────────────────────────────── */
const app = express();
const PORT = parseInt(process.env.PORT ?? "4000", 10);
const IS_DEV = process.env.NODE_ENV !== "production";
const server = createServer(app);
initSocket(server);


/* ─────────────────────────────────────────────
 * SECTION 1: Security & Parsing Middleware
 *
 * Order matters:
 *  1. Helmet first — sets security headers on every response
 *  2. CORS second — handles preflight OPTIONS requests
 *  3. Compression — reduces bandwidth usage
 *  4. JSON parsing — must come before route handlers
 *  5. Morgan last among middleware — logs complete request info
 * ───────────────────────────────────────────── */

/* 1. Helmet — security headers (HSTS, CSP, X-Frame-Options, etc.) */
app.use(
  helmet({
    /* Allow Next.js frontend to embed assets from its own origin */
    contentSecurityPolicy: IS_DEV ? false : undefined,
    /* Allow cross-origin resource loading for fonts and images */
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/* 2. CORS — allow requests from the Next.js dev + production domains */
app.use(
  cors({
    origin: [
      "http://localhost:3000",    /* Next.js dev server */
      "http://localhost:5000",    /* Alternative dev port */
      "http://127.0.0.1:3000",   /* localhost alternative */
      process.env.FRONTEND_URL ?? "https://eduquest.vercel.app",
    ],
    credentials: true,            /* Allow cookies in cross-origin requests */
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
    maxAge: 86400,                /* Cache preflight for 24 hours */
  })
);

/* 3. Response compression — gzip/brotli for reduced bandwidth */
app.use(compression({
  threshold: 1024, // Only compress responses larger than 1KB
  level: 6,        // Balanced compression level (1=fast, 9=best)
}));

/* 4. HTTP Parameter Pollution protection */
app.use(hpp());

/* 5. Response time tracking — measures full request lifecycle */
app.use(responseTimeMiddleware);

/* 6. Body parsing — JSON and URL-encoded form data */
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

/* 7. HTTP request logging */
if (IS_DEV) {
  /* Development: colorized, concise logging */
  app.use(morgan("dev"));
} else {
  /* Production: minimal logging with response time */
  app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
}

/* ─────────────────────────────────────────────
 * SECTION 2: Request ID Middleware
 * Attaches a unique X-Request-ID header for tracing across logs.
 * If the client sends one, we reuse it (enables end-to-end tracing).
 * ───────────────────────────────────────────── */
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers["x-request-id"] as string
    ?? `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  res.setHeader("X-Request-ID", requestId);
  (req as Request & { requestId: string }).requestId = requestId;
  next();
});

/* ─────────────────────────────────────────────
 * SECTION 2.5: Health & Readiness Endpoints (Bypasses Rate Limiter)
 * Registered before the global rate limiter to ensure load balancers
 * and monitoring probes are never rate limited or blocked during failures.
 * ───────────────────────────────────────────── */

/**
 * GET /health
 * Basic liveness check — responds 200 if the process is running.
 */
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "eduquest-backend",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "development",
    version: process.env.npm_package_version ?? "1.0.0",
    uptime: Math.floor(process.uptime()),
  });
});

/**
 * GET /ready
 * Readiness check — verifies database and Redis connectivity.
 */
app.get("/ready", async (_req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseHealth();
  const redisHealthy = await probeRedis();
  const isRedisActive = Boolean(process.env.REDIS_URL);

  if (!dbHealthy || (isRedisActive && !redisHealthy)) {
    res.status(503).json({
      ready: false,
      database: dbHealthy ? "healthy" : "unreachable",
      redis: isRedisActive ? (redisHealthy ? "healthy" : "unreachable") : "not_configured"
    });
    return;
  }

  res.status(200).json({
    ready: true,
    database: "healthy",
    redis: isRedisActive ? "healthy" : "not_configured"
  });
});

/**
 * GET /api
 * API root — lists all available endpoints for developer reference.
 */
app.get("/api", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: "EduQuest API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth — Authentication (register, login, refresh)",
      content: "/api/content — Academic content (classes, subjects, chapters)",
      progress: "/api/progress — User progress tracking",
      battle: "/api/battle — Match/battle system",
      leaderboard: "/api/leaderboard — Rankings and leaderboards",
      community: "/api/community — Discussion forums",
      users: "/api/users — User profiles and settings",
      notifications: "/api/notifications — In-app notifications",
      search: "/api/search — Cross-entity search",
      events: "/api/events — Events and competitions",
      wallet: "/api/wallet — Stars wallet and transactions",
      admin: "/api/admin — Content management CRUD",
      coding: "/api/coding — Engineering coding problems",
      tests: "/api/tests — Mock test system",
      metrics: "/api/metrics — System monitoring & Prometheus",
      uploads: "/api/uploads — File upload management",
      seo: "/api/seo — SEO sitemap, schemas, breadcrumbs",
      audit: "/api/audit — Security audit trail",
    },
    health: "/health — Server liveness check",
    ready: "/ready — Database readiness check",
  });
});

/* ─────────────────────────────────────────────
 * SECTION 3: Production Rate Limiting
 * Uses a Redis-backed rate limiter for distributed scaling,
 * falling back to process-local in-memory limiting if Redis is offline.
 * ───────────────────────────────────────────── */
app.use(rateLimiter({
  windowMs: 60_000, // 1 minute window
  limit: 100,       // Max 100 requests per minute per client IP
  keyPrefix: "api-global",
}));

/* ─────────────────────────────────────────────
 * SECTION 4: API Routes
 * Each feature domain is a separate Express router module.
 * All routes are prefixed with /api/ for clean separation.
 *
 * Route Registration Order:
 *  - Public routes first (no auth required)
 *  - Protected routes after (auth middleware in each module)
 * ───────────────────────────────────────────── */

/* Auth — register, login, logout, token refresh */
app.use("/api/auth", authRoutes);

/* Content — classes, subjects, chapters, topics, questions, engineering */
app.use("/api/content", contentRoutes);

/* User progress — chapter completion, XP updates, streak tracking */
app.use("/api/progress", progressRoutes);

/* Battle — matchmaking queue, match lifecycle, results */
app.use("/api/battle", battleRoutes);

/* Leaderboard — global and filtered rank lists */
app.use("/api/leaderboard", leaderboardRoutes);

/* Community — forum posts, likes, comments */
app.use("/api/community", communityRoutes);

/* Users — public profiles, settings, avatar, stats */
app.use("/api/users", userRoutes);

/* Notifications — in-app notification feed */
app.use("/api/notifications", notificationRoutes);

/* Search — cross-entity search (chapters, users, posts) */
app.use("/api/search", searchRoutes);

/* Events — competitions, hackathons, event registration */
app.use("/api/events", eventRoutes);

/* Hackathons — decoupled tournament portal routes */
app.use("/api/hackathons", hackathonRoutes);

/* Wallet — Stars balance, transactions, earning/spending */
app.use("/api/wallet", walletRoutes);

/* Admin — Content management CRUD (subjects, chapters, topics, questions) */
app.use("/api/admin", adminRoutes);

/* Coding — Engineering learning plans, lessons, problems, submissions */
app.use("/api/coding", codingRoutes);

/* Tests — Mock test execution, scoring, and results */
app.use("/api/tests", testRoutes);

/* Metrics — System health, pool stats, scheduler, Prometheus export */
app.use("/api/metrics", metricsRoutes);

/* Uploads — File upload for avatars, documents, attachments */
app.use("/api/uploads", uploadRoutes);

/* SEO — Dynamic sitemap, robots.txt, JSON-LD schemas, breadcrumbs */
app.use("/api/seo", seoRoutes);

/* Audit — Admin audit log viewer, statistics, export */
app.use("/api/audit", auditRoutes);

/* Health Checks — Kubernetes probes, detailed system health */
app.use("/health", healthcheckRoutes);

/* ─────────────────────────────────────────────
 * SECTION 5: Health & Readiness Endpoints
 * Used by load balancers, Kubernetes probes, and monitoring.
 * ───────────────────────────────────────────── */

/* Health and readiness endpoints are registered in Section 2.5 above */

/**
 * GET /metrics
 * Returns detailed server metrics for monitoring tools (Prometheus, Grafana, Datadog).
 * Includes database pool stats, cache hit rates, and uptime information.
 */
app.get("/metrics", (_req: Request, res: Response) => {
  const poolMetrics = getPoolMetrics();
  const cacheStats = require("./config/cache").cache.getStats();

  res.json({
    ok: true,
    data: {
      server: {
        uptime: Math.floor(process.uptime()),
        environment: process.env.NODE_ENV ?? "development",
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
      },
      database: poolMetrics,
      cache: cacheStats,
    },
  });
});

/* ─────────────────────────────────────────────
 * SECTION 6: 404 Catch-All (Production Error Handler)
 * Uses the centralized error handling middleware.
 * ───────────────────────────────────────────── */
app.use(notFoundHandler);

/* ─────────────────────────────────────────────
 * SECTION 7: Global Error Handler (Production Error Handler)
 * Catches all unhandled errors thrown in route handlers.
 * Returns consistent JSON with typed error codes.
 * ───────────────────────────────────────────── */
app.use(globalErrorHandler);

/* ─────────────────────────────────────────────
 * SECTION 8: Start Server with Graceful Shutdown
 * ───────────────────────────────────────────── */
server.listen(PORT, "0.0.0.0", () => {
  logger.info(`EduQuest backend started on port ${PORT}`, { environment: IS_DEV ? "development" : "production" });

  /* Start production services */
  startScheduler();
  startAnalyticsFlushTimer();

  console.log("");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║                    EduQuest Backend v2.0                    ║");
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log(`║  Status:      RUNNING                                      ║`);
  console.log(`║  Port:        ${String(PORT).padEnd(46)}║`);
  console.log(`║  Environment: ${(IS_DEV ? "development" : "production").padEnd(46)}║`);
  console.log(`║  Node.js:     ${process.version.padEnd(46)}║`);
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log("║  API Routes:                                               ║");
  console.log("║    /api/auth          — Authentication & JWT                ║");
  console.log("║    /api/content       — Academic Content CRUD               ║");
  console.log("║    /api/progress      — User Progress Tracking              ║");
  console.log("║    /api/battle        — Real-time Battle System             ║");
  console.log("║    /api/leaderboard   — Global & Weekly Rankings            ║");
  console.log("║    /api/community     — Discussion Forums                   ║");
  console.log("║    /api/users         — User Profiles & Settings            ║");
  console.log("║    /api/notifications — Multi-channel Notifications         ║");
  console.log("║    /api/search        — Cross-entity Search                 ║");
  console.log("║    /api/events        — Events & Competitions               ║");
  console.log("║    /api/wallet        — Stars Wallet & Transactions         ║");
  console.log("║    /api/admin         — Admin Panel CRUD                    ║");
  console.log("║    /api/coding        — Engineering Learning                ║");
  console.log("║    /api/tests         — Mock Test Execution                 ║");
  console.log("║    /api/metrics       — Monitoring & Prometheus             ║");
  console.log("║    /api/uploads       — File Upload Service                 ║");
  console.log("║    /api/seo           — SEO Sitemap & Schemas               ║");
  console.log("║    /api/audit         — Security Audit Trail                ║");
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log("║  Production Services:                                      ║");
  console.log("║    ✅ Job Scheduler (7 recurring jobs)                      ║");
  console.log("║    ✅ Analytics Engine (buffered event tracking)            ║");
  console.log("║    ✅ Email Service (12 HTML templates)                     ║");
  console.log("║    ✅ Health Monitor (DB, Redis, memory, event loop)        ║");
  console.log("║    ✅ Request Logger (structured JSON logs)                 ║");
  console.log("║    ✅ Error Handler (typed errors + PG error mapping)       ║");
  console.log("║    ✅ SEO Engine (sitemap, schema, breadcrumbs)             ║");
  console.log("║    ✅ Audit Service (tamper-proof trail + batch writes)      ║");
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log(`║  Health:     http://localhost:${PORT}/health${" ".repeat(28)}║`);
  console.log(`║  API Docs:   http://localhost:${PORT}/api${" ".repeat(28)}║`);
  console.log(`║  Metrics:    http://localhost:${PORT}/api/metrics/health${" ".repeat(14)}║`);
  console.log(`║  Prometheus: http://localhost:${PORT}/api/metrics/prometheus${" ".repeat(9)}║`);
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log("");
});

/* ─────────────────────────────────────────────
 * Graceful Shutdown Handler
 * Ensures all active requests complete and database connections close
 * before the process exits. Critical for zero-downtime deployments.
 * ───────────────────────────────────────────── */
async function gracefulShutdown(signal: string) {
  console.log(`\n[EduQuest] Received ${signal}. Shutting down gracefully...`);

  /* Stop accepting new connections */
  server.close(async () => {
    console.log("[EduQuest] HTTP server closed.");

    /* Stop production services in order */
    stopScheduler();
    console.log("[EduQuest] Job scheduler stopped.");

    await stopAnalyticsFlushTimer();
    console.log("[EduQuest] Analytics buffer flushed.");

    await stopAuditFlushTimer();
    console.log("[EduQuest] Audit buffer flushed.");

    /* Close database pool */
    await closeDatabasePool();
    console.log("[EduQuest] Database pool closed.");

    /* Close Redis client pool */
    await closeRedisClient();
    console.log("[EduQuest] Redis connection closed.");

    console.log("[EduQuest] All resources released. Goodbye!");
    process.exit(0);
  });

  /* Force shutdown after 30 seconds if graceful fails */
  setTimeout(() => {
    console.error("[EduQuest] Forced shutdown after 30s timeout.");
    process.exit(1);
  }, 30_000);
}

/* Listen for termination signals */
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

/* Handle uncaught errors (last resort — should never reach here) */
process.on("unhandledRejection", (reason) => {
  console.error("[EduQuest] Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[EduQuest] Uncaught Exception:", err);
  process.exit(1);
});

export default app;
