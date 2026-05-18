/**
 * FILE: index.ts
 * LOCATION: backend/src/index.ts
 * PURPOSE: Entry point for the EduQuest Express backend server.
 *          Registers all middleware, API routes, global error handler, and
 *          starts listening on the configured PORT.
 *
 * Architecture:
 *  - Express v5 + TypeScript
 *  - PostgreSQL (via `pg` Pool) — database queries in repository layers
 *  - Routes: auth, battle, progress, leaderboard, community, users, notifications
 *  - Helmet — security headers (CSP, HSTS, etc.)
 *  - CORS — configured for Next.js frontend origin
 *  - Morgan — HTTP request logging in dev mode
 *  - Global error handler — consistent JSON error responses
 *
 * Capacity: The server is stateless; horizontal scaling is safe.
 *           The pg pool supports up to 100 concurrent DB connections by default.
 *
 * LAST UPDATED: 2026-05-18
 */

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

/* ─────────────────────────────────────────────
 * Route imports — each module handles a distinct feature domain
 * ───────────────────────────────────────────── */
import authRoutes        from "./routes/auth";
import progressRoutes    from "./routes/progress";
import battleRoutes      from "./routes/battle";
import leaderboardRoutes from "./routes/leaderboard";
import communityRoutes   from "./routes/community";
import userRoutes        from "./routes/users";
import notificationRoutes from "./routes/notifications";
import searchRoutes      from "./routes/search";

/* ─────────────────────────────────────────────
 * App & Configuration
 * ───────────────────────────────────────────── */
const app = express();
const PORT = parseInt(process.env.PORT ?? "4000", 10);
const IS_DEV = process.env.NODE_ENV !== "production";

/* ─────────────────────────────────────────────
 * SECTION 1: Security & Parsing Middleware
 *
 * Order matters:
 *  1. Helmet first — sets security headers on every response
 *  2. CORS second — handles preflight OPTIONS requests before auth
 *  3. JSON parsing — must come before route handlers
 *  4. Morgan last among middleware — logs complete request info
 * ───────────────────────────────────────────── */

/* 1. Helmet — security headers (HSTS, CSP, X-Frame-Options, etc.) */
app.use(
  helmet({
    /* Allow Next.js frontend to embed assets from its own origin */
    contentSecurityPolicy: IS_DEV ? false : undefined,
  })
);

/* 2. CORS — allow requests from the Next.js dev + production domains */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      process.env.FRONTEND_URL ?? "https://eduquest.replit.app",
    ],
    credentials: true,           /* Allow cookies in cross-origin requests */
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  })
);

/* 3. Body parsing */
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

/* 4. HTTP request logging — only in development to keep prod logs clean */
if (IS_DEV) {
  app.use(morgan("dev"));
} else {
  /* Minimal production logging — method, URL, status, response time */
  app.use(morgan("tiny"));
}

/* ─────────────────────────────────────────────
 * SECTION 2: Request ID Middleware
 * Attaches a unique X-Request-ID header for tracing across logs.
 * ───────────────────────────────────────────── */
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers["x-request-id"] as string
    ?? `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  res.setHeader("X-Request-ID", requestId);
  (req as Request & { requestId: string }).requestId = requestId;
  next();
});

/* ─────────────────────────────────────────────
 * SECTION 3: API Routes
 * Each feature domain is a separate Express router module.
 * All routes are prefixed with /api/ for clean separation from the Next.js frontend.
 * ───────────────────────────────────────────── */

/* Auth — register, login, logout, session refresh */
app.use("/api/auth", authRoutes);

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

/* ─────────────────────────────────────────────
 * SECTION 4: Health & Readiness Endpoints
 * Used by load balancers and monitoring probes.
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
  });
});

/**
 * GET /ready
 * Readiness check — verifies DB connectivity before reporting ready.
 * (Minimal implementation; can be expanded with pg pool check.)
 */
app.get("/ready", (_req: Request, res: Response) => {
  res.status(200).json({ ready: true });
});

/* ─────────────────────────────────────────────
 * SECTION 5: 404 Catch-All
 * Handles any request that didn't match a defined route.
 * Returns a consistent JSON error instead of HTML default.
 * ───────────────────────────────────────────── */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    error: {
      code: "NOT_FOUND",
      message: `No route found for ${req.method} ${req.originalUrl}`,
    },
  });
});

/* ─────────────────────────────────────────────
 * SECTION 6: Global Error Handler
 * Catches all unhandled errors thrown in route handlers.
 * Always returns JSON — never HTML — so the frontend can parse reliably.
 * ───────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[EduQuest Error]", err.message, err.stack);

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
 * SECTION 7: Start Server
 * ───────────────────────────────────────────── */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[EduQuest Backend] Listening on port ${PORT} (${IS_DEV ? "development" : "production"})`);
  console.log(`[EduQuest Backend] Routes: /api/auth, /api/progress, /api/battle, /api/leaderboard, /api/community, /api/users, /api/notifications, /api/search`);
  console.log(`[EduQuest Backend] Health check: http://localhost:${PORT}/health`);
});

export default app;
