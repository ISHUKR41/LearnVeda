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
import walletRoutes       from "./routes/wallet";

import { createServer } from "http";
import { initSocket } from "./services/socket.service";

/* Database management */
import { checkDatabaseHealth, closeDatabasePool } from "./config/database";

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

/* 5. Body parsing — JSON and URL-encoded form data */
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

/* 4. HTTP request logging */
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

/* Wallet — Stars balance, transactions, earning/spending */
app.use("/api/wallet", walletRoutes);

/* ─────────────────────────────────────────────
 * SECTION 5: Health & Readiness Endpoints
 * Used by load balancers, Kubernetes probes, and monitoring.
 * ───────────────────────────────────────────── */

/* Health and readiness endpoints are registered in Section 2.5 above */

/* ─────────────────────────────────────────────
 * SECTION 6: 404 Catch-All
 * Handles any request that didn't match a defined route.
 * Returns consistent JSON error instead of HTML default.
 * ───────────────────────────────────────────── */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    error: {
      code: "NOT_FOUND",
      message: `No route found for ${req.method} ${req.originalUrl}`,
      hint: "Visit GET /api for a list of available endpoints.",
    },
  });
});

/* ─────────────────────────────────────────────
 * SECTION 7: Global Error Handler
 * Catches all unhandled errors thrown in route handlers.
 * Always returns JSON — never HTML.
 * ───────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[EduQuest Error]", err.message, IS_DEV ? err.stack : "");

  const statusCode = (err as Error & { statusCode?: number }).statusCode ?? 500;

  res.status(statusCode).json({
    ok: false,
    error: {
      code: "INTERNAL_ERROR",
      message: IS_DEV ? err.message : "An unexpected error occurred. Please try again.",
    },
  });
});

/* ─────────────────────────────────────────────
 * SECTION 8: Start Server with Graceful Shutdown
 * ───────────────────────────────────────────── */
server.listen(PORT, "0.0.0.0", () => {
  logger.info(`EduQuest backend started on port ${PORT}`, { environment: IS_DEV ? "development" : "production" });
  console.log("");
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║                  EduQuest Backend                       ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log(`║  Status:      RUNNING                                   ║`);
  console.log(`║  Port:        ${String(PORT).padEnd(42)}║`);
  console.log(`║  Environment: ${(IS_DEV ? "development" : "production").padEnd(42)}║`);
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║  Routes:                                                ║");
  console.log("║    /api/auth       — Authentication                     ║");
  console.log("║    /api/content    — Academic Content                    ║");
  console.log("║    /api/progress   — User Progress                      ║");
  console.log("║    /api/battle     — Battle System                      ║");
  console.log("║    /api/leaderboard — Rankings                          ║");
  console.log("║    /api/community  — Discussion Forums                  ║");
  console.log("║    /api/users      — User Profiles                      ║");
  console.log("║    /api/notifications — Notifications                   ║");
  console.log("║    /api/search     — Search                             ║");
  console.log("║    /api/events     — Events & Competitions              ║");
  console.log("║    /api/wallet     — Stars Wallet                       ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log(`║  Health:  http://localhost:${PORT}/health${" ".repeat(24)}║`);
  console.log(`║  API Docs: http://localhost:${PORT}/api${" ".repeat(24)}║`);
  console.log("╚══════════════════════════════════════════════════════════╝");
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

    /* Close database pool */
    await closeDatabasePool();

    /* Close Redis client pool */
    await closeRedisClient();

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
