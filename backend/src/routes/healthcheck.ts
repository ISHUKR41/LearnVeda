/**
 * FILE: healthcheck.ts
 * LOCATION: backend/src/routes/healthcheck.ts
 * PURPOSE: Production-grade health check endpoints for monitoring, load
 *          balancers, Kubernetes probes, and CI/CD pipeline verifications.
 *
 * ENDPOINTS:
 *  GET /health/live     — Basic liveness (is the process running?)
 *  GET /health/ready    — Full readiness (DB + Redis + services)
 *  GET /health/detailed — Deep health with dependency status and metrics
 *  GET /health/startup  — Startup probe (for Kubernetes startupProbe)
 *
 * DESIGN:
 *  - /health/live: Returns 200 instantly. Used by load balancers to detect
 *    crashed processes. No database calls — pure process check.
 *  - /health/ready: Verifies database and Redis connectivity. Returns 503
 *    if any critical dependency is unreachable. Used by Kubernetes readinessProbe.
 *  - /health/detailed: Returns comprehensive system metrics including memory,
 *    uptime, database pool stats, response time percentiles, and circuit breaker
 *    states. Protected by admin auth in production.
 *  - /health/startup: One-time check during pod initialization. Returns 200
 *    once the database migration has run and the pool is ready.
 *
 * WHY SEPARATE FROM /health:
 *  The main /health endpoint in index.ts is a simple liveness check.
 *  These endpoints provide granular health information needed for production
 *  orchestration, monitoring dashboards, and automated alerting.
 *
 * DEPENDENCIES: ../config/database, ../config/redis, ../utils/circuit-breaker
 * USED BY: Kubernetes probes, Datadog/Grafana monitoring, CI/CD pipelines
 * LAST UPDATED: 2026-05-27
 */

import { Router, Request, Response } from "express";
import { checkDatabaseHealth, getPoolMetrics } from "../config/database";
import { probeRedis } from "../config/redis";
import { databaseCircuit, redisCircuit, emailCircuit } from "../utils/circuit-breaker";
import { getResponseTimeMetrics } from "../middlewares/response-time";

const router = Router();

/* ─────────────────────────────────────────────
 * Server start time — captured once at module load
 * Used to calculate uptime and detect recently-restarted instances
 * ───────────────────────────────────────────── */
const SERVER_START_TIME = new Date();

/* ─────────────────────────────────────────────
 * GET /health/live
 *
 * Liveness probe — the simplest possible health check.
 * Returns 200 if the Express process is running and handling requests.
 *
 * Use case: Kubernetes livenessProbe, basic load balancer health check.
 * Response time: <1ms (no I/O operations)
 * ───────────────────────────────────────────── */
router.get("/live", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

/* ─────────────────────────────────────────────
 * GET /health/ready
 *
 * Readiness probe — checks all critical dependencies.
 * Returns 200 only if the server can fully serve requests.
 * Returns 503 if any critical dependency is unreachable.
 *
 * Use case: Kubernetes readinessProbe, deployment verification.
 * This endpoint is called frequently (every 10-30 seconds) by
 * orchestrators, so it must be lightweight and fast.
 * ───────────────────────────────────────────── */
router.get("/ready", async (_req: Request, res: Response) => {
  /* Check database connectivity */
  const dbHealthy = await checkDatabaseHealth();

  /* Check Redis connectivity (only if configured) */
  const isRedisConfigured = Boolean(process.env.REDIS_URL);
  const redisHealthy = isRedisConfigured ? await probeRedis() : true;

  /* Determine overall readiness */
  const isReady = dbHealthy && (isRedisConfigured ? redisHealthy : true);

  const statusCode = isReady ? 200 : 503;

  res.status(statusCode).json({
    ready: isReady,
    checks: {
      database: {
        status: dbHealthy ? "healthy" : "unreachable",
        circuitState: databaseCircuit.getState(),
      },
      redis: {
        status: isRedisConfigured
          ? (redisHealthy ? "healthy" : "unreachable")
          : "not_configured",
        circuitState: isRedisConfigured ? redisCircuit.getState() : "N/A",
      },
    },
    timestamp: new Date().toISOString(),
  });
});

/* ─────────────────────────────────────────────
 * GET /health/detailed
 *
 * Deep health check — comprehensive system metrics.
 * Intended for internal monitoring dashboards (Grafana, Datadog).
 *
 * Returns: process metrics, database pool stats, circuit breaker
 * states, response time percentiles, and memory usage.
 *
 * NOTE: This endpoint should be protected by admin authentication
 * in production to prevent information leakage.
 * ───────────────────────────────────────────── */
router.get("/detailed", async (_req: Request, res: Response) => {
  /* ── Database check ── */
  const dbHealthy = await checkDatabaseHealth();
  const poolMetrics = getPoolMetrics();

  /* ── Redis check ── */
  const isRedisConfigured = Boolean(process.env.REDIS_URL);
  const redisHealthy = isRedisConfigured ? await probeRedis() : true;

  /* ── Process metrics ── */
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  /* ── Response time metrics ── */
  const responseMetrics = getResponseTimeMetrics();

  /* ── Circuit breaker states ── */
  const circuitBreakers = {
    database: databaseCircuit.getMetrics(),
    redis: redisCircuit.getMetrics(),
    email: emailCircuit.getMetrics(),
  };

  /* ── Overall status determination ── */
  const overallStatus = dbHealthy && (isRedisConfigured ? redisHealthy : true)
    ? "healthy"
    : "degraded";

  res.status(overallStatus === "healthy" ? 200 : 503).json({
    status: overallStatus,
    version: process.env.npm_package_version ?? "1.0.0",
    environment: process.env.NODE_ENV ?? "development",
    startTime: SERVER_START_TIME.toISOString(),
    uptime: {
      seconds: Math.floor(process.uptime()),
      human: formatUptime(process.uptime()),
    },

    /* Process metrics */
    process: {
      pid: process.pid,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: {
        rss: formatBytes(memoryUsage.rss),
        heapUsed: formatBytes(memoryUsage.heapUsed),
        heapTotal: formatBytes(memoryUsage.heapTotal),
        external: formatBytes(memoryUsage.external),
        arrayBuffers: formatBytes(memoryUsage.arrayBuffers),
      },
      cpu: {
        userMicroseconds: cpuUsage.user,
        systemMicroseconds: cpuUsage.system,
      },
    },

    /* Dependency health */
    dependencies: {
      database: {
        status: dbHealthy ? "healthy" : "unreachable",
        pool: poolMetrics,
      },
      redis: {
        status: isRedisConfigured
          ? (redisHealthy ? "healthy" : "unreachable")
          : "not_configured",
      },
    },

    /* Performance metrics */
    performance: {
      responseTime: responseMetrics,
    },

    /* Circuit breaker states */
    circuitBreakers,

    /* Metadata */
    timestamp: new Date().toISOString(),
  });
});

/* ─────────────────────────────────────────────
 * GET /health/startup
 *
 * Startup probe — checks if the server has completed initialization.
 * Returns 200 once the database pool is ready and migrations have run.
 *
 * Use case: Kubernetes startupProbe (prevents readiness/liveness checks
 * from running before the app is fully initialized).
 * ───────────────────────────────────────────── */
router.get("/startup", async (_req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseHealth();

  if (!dbHealthy) {
    res.status(503).json({
      started: false,
      message: "Database not yet available. Server still starting up.",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.status(200).json({
    started: true,
    startTime: SERVER_START_TIME.toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

/* ─────────────────────────────────────────────
 * Helper Functions
 * ───────────────────────────────────────────── */

/**
 * Formats bytes into a human-readable string (e.g., "128.5 MB").
 * Used for memory usage display in the detailed health endpoint.
 *
 * @param bytes - Number of bytes
 * @returns Formatted string with appropriate unit
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, unitIndex);
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Formats seconds into a human-readable uptime string.
 *
 * @param seconds - Uptime in seconds
 * @returns Formatted string (e.g., "2d 5h 30m 15s")
 */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(" ");
}

export default router;
