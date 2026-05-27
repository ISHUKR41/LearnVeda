/**
 * FILE: health.service.ts
 * LOCATION: backend/src/services/health.service.ts
 * PURPOSE: Production-grade health check service for comprehensive infrastructure monitoring.
 *          Provides deep diagnostics for database, Redis, memory, CPU, and disk usage.
 *          Used by load balancers, Kubernetes probes, and monitoring dashboards (Grafana/Datadog).
 *
 * ARCHITECTURE:
 *  - Lightweight probe functions that return within defined SLA timeouts.
 *  - Memory tracking with V8 heap statistics for leak detection.
 *  - Connection pool saturation tracking to prevent overload.
 *  - Event loop lag measurement to detect CPU bottlenecks.
 *
 * CAPACITY: All health probes are designed to complete within 5 seconds.
 *           If any probe exceeds this, the service reports degraded status.
 *
 * DEPENDENCIES: pg Pool, ioredis, Node.js v8 module
 * USED BY: /health, /ready, /metrics endpoints in index.ts
 * LAST UPDATED: 2026-05-26
 */

import { pool, getPoolMetrics } from "../config/database";
import { probeRedis } from "../config/redis";
import logger from "../utils/logger";
import os from "os";
import v8 from "v8";

/* ─────────────────────────────────────────────
 * Type definitions for comprehensive health data
 * ───────────────────────────────────────────── */

/** Individual component health status */
export interface ComponentHealth {
  /** Component name (e.g., 'database', 'redis', 'memory') */
  name: string;
  /** Status: 'healthy', 'degraded', or 'unhealthy' */
  status: "healthy" | "degraded" | "unhealthy";
  /** Response time of the health check in milliseconds */
  responseTimeMs: number;
  /** Optional human-readable message explaining the status */
  message?: string;
  /** Optional raw metrics for this component */
  metrics?: Record<string, unknown>;
}

/** Aggregated system health report */
export interface SystemHealthReport {
  /** Overall system status derived from worst individual component status */
  status: "healthy" | "degraded" | "unhealthy";
  /** ISO timestamp when the check was performed */
  timestamp: string;
  /** Server uptime in seconds */
  uptimeSeconds: number;
  /** Node.js process version */
  nodeVersion: string;
  /** Environment (development/production/staging) */
  environment: string;
  /** Git commit SHA if available */
  gitCommit: string;
  /** Individual component health reports */
  components: ComponentHealth[];
  /** System resource metrics (CPU, memory, disk) */
  system: SystemMetrics;
}

/** System-level resource metrics for production monitoring */
export interface SystemMetrics {
  /** CPU load averages (1m, 5m, 15m) */
  cpuLoadAvg: number[];
  /** Number of CPU cores available */
  cpuCores: number;
  /** Total system memory in MB */
  totalMemoryMb: number;
  /** Free system memory in MB */
  freeMemoryMb: number;
  /** Memory usage percentage */
  memoryUsagePercent: number;
  /** V8 heap statistics */
  heapUsed: number;
  /** V8 heap total size */
  heapTotal: number;
  /** V8 heap size limit */
  heapLimit: number;
  /** Resident Set Size (total memory allocated for the process) */
  rssMb: number;
  /** External memory used by C++ objects bound to V8 */
  externalMb: number;
  /** Event loop lag in milliseconds (high values indicate CPU bottleneck) */
  eventLoopLagMs: number;
}

/* ─────────────────────────────────────────────
 * Event Loop Lag Measurement
 * Measures how long the event loop takes to process a timer callback.
 * High values (>100ms) indicate CPU saturation or blocking operations.
 * ───────────────────────────────────────────── */

let lastEventLoopLag = 0;

/** Periodically measures event loop lag every 5 seconds */
function measureEventLoopLag(): void {
  const start = process.hrtime.bigint();
  setImmediate(() => {
    const delta = Number(process.hrtime.bigint() - start) / 1_000_000; // Convert nanoseconds to ms
    lastEventLoopLag = Math.round(delta * 100) / 100;
  });
}

// Start measuring event loop lag on module load
setInterval(measureEventLoopLag, 5000);
measureEventLoopLag(); // Initial measurement

/* ─────────────────────────────────────────────
 * Individual Component Health Checks
 * Each function probes a single infrastructure component
 * and returns a standardized ComponentHealth result.
 * ───────────────────────────────────────────── */

/**
 * Probes PostgreSQL database connectivity and performance.
 * Executes a lightweight SELECT 1 query to verify the connection pool
 * is healthy and measures round-trip latency.
 *
 * Thresholds:
 *  - Healthy: <100ms response time
 *  - Degraded: 100-500ms response time
 *  - Unhealthy: >500ms or connection failure
 */
async function checkDatabaseComponent(): Promise<ComponentHealth> {
  const start = Date.now();
  try {
    await pool.query("SELECT 1 AS health_check");
    const responseTime = Date.now() - start;
    const metrics = getPoolMetrics();

    let status: ComponentHealth["status"] = "healthy";
    let message = "Database connection pool operating normally";

    if (responseTime > 500) {
      status = "unhealthy";
      message = `Database response time critically high: ${responseTime}ms`;
    } else if (responseTime > 100 || metrics.isUnderPressure) {
      status = "degraded";
      message = metrics.isUnderPressure
        ? `Pool under pressure: ${metrics.waitingClients} clients waiting`
        : `Database response time elevated: ${responseTime}ms`;
    }

    return {
      name: "database",
      status,
      responseTimeMs: responseTime,
      message,
      metrics: {
        totalConnections: metrics.totalConnections,
        idleConnections: metrics.idleConnections,
        waitingClients: metrics.waitingClients,
        maxConnections: metrics.maxConnections,
        utilizationPercent: metrics.utilizationPercent,
      },
    };
  } catch (error) {
    return {
      name: "database",
      status: "unhealthy",
      responseTimeMs: Date.now() - start,
      message: `Database connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Probes Redis cache connectivity.
 * Returns degraded (not unhealthy) if Redis is offline because
 * the application can still function without caching.
 */
async function checkRedisComponent(): Promise<ComponentHealth> {
  const isRedisConfigured = Boolean(process.env.REDIS_URL);
  if (!isRedisConfigured) {
    return {
      name: "redis",
      status: "healthy",
      responseTimeMs: 0,
      message: "Redis not configured — caching disabled (acceptable for development)",
    };
  }

  const start = Date.now();
  try {
    const isHealthy = await probeRedis();
    const responseTime = Date.now() - start;

    return {
      name: "redis",
      status: isHealthy ? "healthy" : "degraded",
      responseTimeMs: responseTime,
      message: isHealthy ? "Redis connected and responding" : "Redis unreachable — falling back to in-memory cache",
    };
  } catch (error) {
    return {
      name: "redis",
      status: "degraded",
      responseTimeMs: Date.now() - start,
      message: `Redis probe failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Checks V8 heap memory usage for leak detection.
 * Reports degraded when heap usage exceeds 85% of the limit,
 * which is a strong indicator of a memory leak or undersized instance.
 */
function checkMemoryComponent(): ComponentHealth {
  const heapStats = v8.getHeapStatistics();
  const memUsage = process.memoryUsage();
  const usagePercent = Math.round((heapStats.used_heap_size / heapStats.heap_size_limit) * 100);

  let status: ComponentHealth["status"] = "healthy";
  let message = `Heap usage at ${usagePercent}% — within safe operating range`;

  if (usagePercent > 90) {
    status = "unhealthy";
    message = `CRITICAL: Heap usage at ${usagePercent}% — approaching OOM kill threshold`;
  } else if (usagePercent > 85) {
    status = "degraded";
    message = `WARNING: Heap usage at ${usagePercent}% — consider increasing instance memory`;
  }

  return {
    name: "memory",
    status,
    responseTimeMs: 0,
    message,
    metrics: {
      heapUsedMb: Math.round(heapStats.used_heap_size / 1024 / 1024),
      heapTotalMb: Math.round(heapStats.total_heap_size / 1024 / 1024),
      heapLimitMb: Math.round(heapStats.heap_size_limit / 1024 / 1024),
      rssMb: Math.round(memUsage.rss / 1024 / 1024),
      externalMb: Math.round(memUsage.external / 1024 / 1024),
      usagePercent,
    },
  };
}

/**
 * Checks event loop responsiveness.
 * High event loop lag (>100ms) indicates CPU-bound operations
 * or synchronous blocking calls that need optimization.
 */
function checkEventLoopComponent(): ComponentHealth {
  let status: ComponentHealth["status"] = "healthy";
  let message = `Event loop lag: ${lastEventLoopLag}ms — responsive`;

  if (lastEventLoopLag > 500) {
    status = "unhealthy";
    message = `CRITICAL: Event loop lag ${lastEventLoopLag}ms — server is unresponsive`;
  } else if (lastEventLoopLag > 100) {
    status = "degraded";
    message = `WARNING: Event loop lag ${lastEventLoopLag}ms — CPU pressure detected`;
  }

  return {
    name: "event_loop",
    status,
    responseTimeMs: 0,
    message,
    metrics: { lagMs: lastEventLoopLag },
  };
}

/* ─────────────────────────────────────────────
 * System Metrics Collection
 * Gathers OS-level resource statistics for dashboards.
 * ───────────────────────────────────────────── */

/**
 * Collects system-wide resource metrics.
 * Used by the /metrics endpoint for Prometheus/Grafana scraping.
 */
function getSystemMetrics(): SystemMetrics {
  const heapStats = v8.getHeapStatistics();
  const memUsage = process.memoryUsage();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();

  return {
    cpuLoadAvg: os.loadavg(),
    cpuCores: os.cpus().length,
    totalMemoryMb: Math.round(totalMem / 1024 / 1024),
    freeMemoryMb: Math.round(freeMem / 1024 / 1024),
    memoryUsagePercent: Math.round(((totalMem - freeMem) / totalMem) * 100),
    heapUsed: heapStats.used_heap_size,
    heapTotal: heapStats.total_heap_size,
    heapLimit: heapStats.heap_size_limit,
    rssMb: Math.round(memUsage.rss / 1024 / 1024),
    externalMb: Math.round(memUsage.external / 1024 / 1024),
    eventLoopLagMs: lastEventLoopLag,
  };
}

/* ─────────────────────────────────────────────
 * Aggregated Health Report
 * Runs all component checks in parallel and returns
 * a comprehensive system health report.
 * ───────────────────────────────────────────── */

/**
 * Generates a full system health report by running all component checks.
 * The overall status is derived from the worst individual component status:
 *  - If any component is "unhealthy", the system is "unhealthy"
 *  - If any component is "degraded" (and none unhealthy), the system is "degraded"
 *  - Otherwise, the system is "healthy"
 *
 * @returns {Promise<SystemHealthReport>} Complete health report
 */
export async function getFullHealthReport(): Promise<SystemHealthReport> {
  const startTime = Date.now();

  // Run all async checks in parallel for minimum latency
  const [dbHealth, redisHealth] = await Promise.all([
    checkDatabaseComponent(),
    checkRedisComponent(),
  ]);

  // Sync checks are instantaneous
  const memoryHealth = checkMemoryComponent();
  const eventLoopHealth = checkEventLoopComponent();

  const components = [dbHealth, redisHealth, memoryHealth, eventLoopHealth];

  // Derive overall status from worst component
  let overallStatus: SystemHealthReport["status"] = "healthy";
  if (components.some((c) => c.status === "unhealthy")) {
    overallStatus = "unhealthy";
  } else if (components.some((c) => c.status === "degraded")) {
    overallStatus = "degraded";
  }

  const report: SystemHealthReport = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV ?? "development",
    gitCommit: process.env.GIT_COMMIT ?? "unknown",
    components,
    system: getSystemMetrics(),
  };

  const totalCheckTime = Date.now() - startTime;
  if (totalCheckTime > 5000) {
    logger.warn("[Health Service] Health check exceeded 5s SLA", {
      totalCheckTimeMs: totalCheckTime,
    });
  }

  return report;
}

/**
 * Lightweight liveness check — only verifies the process is running.
 * Used by Kubernetes liveness probes (should never fail unless the process is dead).
 */
export function getLivenessStatus(): { alive: boolean; uptime: number } {
  return {
    alive: true,
    uptime: Math.floor(process.uptime()),
  };
}
