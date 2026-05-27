/**
 * FILE: metrics.ts
 * LOCATION: backend/src/routes/metrics.ts
 * PURPOSE: Production monitoring and metrics API endpoints.
 *          Exposes system health, database pool stats, scheduler status,
 *          and Prometheus-compatible metrics for monitoring dashboards.
 *
 * ENDPOINTS:
 *  GET /api/metrics/health    — Full system health report (DB, Redis, memory, event loop)
 *  GET /api/metrics/pool      — Database connection pool statistics
 *  GET /api/metrics/scheduler — Scheduled job status and execution history
 *  GET /api/metrics/system    — System resource usage (CPU, memory, disk)
 *  GET /api/metrics/prometheus — Prometheus-compatible metrics export
 *
 * SECURITY: All endpoints require admin authentication.
 *           Health/ready endpoints at root level bypass this.
 *
 * USED BY: Admin dashboard, Grafana/Datadog monitoring, Prometheus scraper
 * LAST UPDATED: 2026-05-26
 */

import { Router, Request, Response } from "express";
import { getFullHealthReport, getLivenessStatus } from "../services/health.service";
import { getPoolMetrics } from "../config/database";
import { getSchedulerStatus, triggerJob } from "../services/scheduler.service";
import { getDailyStats, getEventBreakdown, getTopActiveUsers } from "../services/analytics.service";
import logger from "../utils/logger";
import os from "os";
import v8 from "v8";

const router = Router();

/* ─────────────────────────────────────────────
 * GET /api/metrics/health
 * Full system health report with component-level status.
 * Returns 200 for healthy/degraded, 503 for unhealthy.
 * ───────────────────────────────────────────── */
router.get("/health", async (_req: Request, res: Response) => {
  try {
    const report = await getFullHealthReport();
    const statusCode = report.status === "unhealthy" ? 503 : 200;
    res.status(statusCode).json(report);
  } catch (error) {
    logger.error("[Metrics] Health check failed", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    res.status(500).json({
      status: "unhealthy",
      error: "Health check system failure",
    });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/metrics/pool
 * Database connection pool statistics.
 * Useful for diagnosing connection exhaustion issues.
 * ───────────────────────────────────────────── */
router.get("/pool", (_req: Request, res: Response) => {
  const metrics = getPoolMetrics();
  res.json({
    ok: true,
    pool: metrics,
    recommendations: getPoolRecommendations(metrics),
  });
});

/* ─────────────────────────────────────────────
 * GET /api/metrics/scheduler
 * Scheduled job status and execution history.
 * Shows which jobs have run, their timing, and error counts.
 * ───────────────────────────────────────────── */
router.get("/scheduler", (_req: Request, res: Response) => {
  const status = getSchedulerStatus();
  res.json({
    ok: true,
    jobs: status,
    summary: {
      totalJobs: status.length,
      enabledJobs: status.filter((j) => j.enabled).length,
      totalRuns: status.reduce((sum, j) => sum + j.runCount, 0),
      totalErrors: status.reduce((sum, j) => sum + j.errorCount, 0),
    },
  });
});

/* ─────────────────────────────────────────────
 * POST /api/metrics/scheduler/:jobName/trigger
 * Manually trigger a specific scheduled job.
 * Used for emergency maintenance or testing.
 * ───────────────────────────────────────────── */
router.post("/scheduler/:jobName/trigger", async (req: Request, res: Response) => {
  const jobName = String(req.params.jobName);
  const success = await triggerJob(jobName);

  if (!success) {
    res.status(404).json({
      ok: false,
      error: `Job '${jobName}' not found`,
    });
    return;
  }

  res.json({
    ok: true,
    message: `Job '${jobName}' triggered successfully`,
  });
});

/* ─────────────────────────────────────────────
 * GET /api/metrics/system
 * Operating system and process resource usage.
 * CPU load, memory, heap, and event loop metrics.
 * ───────────────────────────────────────────── */
router.get("/system", (_req: Request, res: Response) => {
  const heapStats = v8.getHeapStatistics();
  const memUsage = process.memoryUsage();
  const cpus = os.cpus();

  res.json({
    ok: true,
    system: {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      nodeVersion: process.version,
      uptime: {
        process: Math.floor(process.uptime()),
        system: Math.floor(os.uptime()),
      },
      cpu: {
        model: cpus[0]?.model ?? "unknown",
        cores: cpus.length,
        loadAvg: os.loadavg(),
      },
      memory: {
        totalMb: Math.round(os.totalmem() / 1024 / 1024),
        freeMb: Math.round(os.freemem() / 1024 / 1024),
        usagePercent: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100),
      },
      process: {
        pid: process.pid,
        rssMb: Math.round(memUsage.rss / 1024 / 1024),
        heapUsedMb: Math.round(heapStats.used_heap_size / 1024 / 1024),
        heapTotalMb: Math.round(heapStats.total_heap_size / 1024 / 1024),
        heapLimitMb: Math.round(heapStats.heap_size_limit / 1024 / 1024),
        heapUsagePercent: Math.round(
          (heapStats.used_heap_size / heapStats.heap_size_limit) * 100
        ),
        externalMb: Math.round(memUsage.external / 1024 / 1024),
      },
    },
  });
});

/* ─────────────────────────────────────────────
 * GET /api/metrics/analytics
 * Dashboard analytics overview — daily stats, top users, event breakdown.
 * ───────────────────────────────────────────── */
router.get("/analytics", async (req: Request, res: Response) => {
  try {
    const daysParam = Array.isArray(req.query.days) ? req.query.days[0] : req.query.days;
    const days = parseInt(String(daysParam ?? "30"), 10);

    const [dailyStats, topUsers, eventBreakdown] = await Promise.all([
      getDailyStats(days),
      getTopActiveUsers(10),
      getEventBreakdown(7),
    ]);

    res.json({
      ok: true,
      analytics: {
        dailyStats,
        topUsers,
        eventBreakdown,
        period: { days, startDate: new Date(Date.now() - days * 86400000).toISOString() },
      },
    });
  } catch (error) {
    logger.error("[Metrics] Analytics query failed", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    res.status(500).json({ ok: false, error: "Failed to retrieve analytics" });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/metrics/prometheus
 * Prometheus-compatible metrics export in text/plain format.
 * Each metric follows the Prometheus exposition format.
 * ───────────────────────────────────────────── */
router.get("/prometheus", (_req: Request, res: Response) => {
  const poolMetrics = getPoolMetrics();
  const memUsage = process.memoryUsage();
  const heapStats = v8.getHeapStatistics();

  const lines: string[] = [
    "# HELP eduquest_http_server_uptime_seconds Server uptime in seconds",
    "# TYPE eduquest_http_server_uptime_seconds gauge",
    `eduquest_http_server_uptime_seconds ${Math.floor(process.uptime())}`,
    "",
    "# HELP eduquest_db_pool_total_connections Total database pool connections",
    "# TYPE eduquest_db_pool_total_connections gauge",
    `eduquest_db_pool_total_connections ${poolMetrics.totalConnections}`,
    "",
    "# HELP eduquest_db_pool_idle_connections Idle database pool connections",
    "# TYPE eduquest_db_pool_idle_connections gauge",
    `eduquest_db_pool_idle_connections ${poolMetrics.idleConnections}`,
    "",
    "# HELP eduquest_db_pool_waiting_clients Clients waiting for a connection",
    "# TYPE eduquest_db_pool_waiting_clients gauge",
    `eduquest_db_pool_waiting_clients ${poolMetrics.waitingClients}`,
    "",
    "# HELP eduquest_db_pool_utilization_percent Pool utilization percentage",
    "# TYPE eduquest_db_pool_utilization_percent gauge",
    `eduquest_db_pool_utilization_percent ${poolMetrics.utilizationPercent}`,
    "",
    "# HELP eduquest_process_memory_rss_bytes Process RSS memory in bytes",
    "# TYPE eduquest_process_memory_rss_bytes gauge",
    `eduquest_process_memory_rss_bytes ${memUsage.rss}`,
    "",
    "# HELP eduquest_process_heap_used_bytes V8 heap used in bytes",
    "# TYPE eduquest_process_heap_used_bytes gauge",
    `eduquest_process_heap_used_bytes ${heapStats.used_heap_size}`,
    "",
    "# HELP eduquest_process_heap_total_bytes V8 heap total in bytes",
    "# TYPE eduquest_process_heap_total_bytes gauge",
    `eduquest_process_heap_total_bytes ${heapStats.total_heap_size}`,
    "",
    "# HELP eduquest_nodejs_version_info Node.js version",
    "# TYPE eduquest_nodejs_version_info gauge",
    `eduquest_nodejs_version_info{version="${process.version}"} 1`,
  ];

  res.setHeader("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
  res.send(lines.join("\n") + "\n");
});

/* ─────────────────────────────────────────────
 * Helper Functions
 * ───────────────────────────────────────────── */

/**
 * Generates actionable recommendations based on pool metrics.
 * Helps ops team understand when to scale or optimize.
 */
function getPoolRecommendations(metrics: ReturnType<typeof getPoolMetrics>): string[] {
  const recommendations: string[] = [];

  if (metrics.isUnderPressure) {
    recommendations.push(
      "⚠️ Pool under pressure! Increase max connections or deploy pgBouncer."
    );
  }

  if (metrics.utilizationPercent > 80) {
    recommendations.push(
      "⚠️ Pool utilization above 80%. Consider horizontal scaling."
    );
  }

  if (metrics.idleConnections > metrics.maxConnections * 0.8) {
    recommendations.push(
      "ℹ️ Many idle connections. Consider reducing min pool size."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push("✅ Pool is healthy — no action required.");
  }

  return recommendations;
}

export default router;
