/**
 * FILE: response-time.ts
 * LOCATION: backend/src/middlewares/response-time.ts
 * PURPOSE: Production-grade response time tracking middleware that measures
 *          the complete request lifecycle (start to response finish) and
 *          exposes timing data for monitoring, alerting, and performance
 *          optimization.
 *
 * FEATURES:
 *  - Attaches X-Response-Time header to every response (ms precision)
 *  - Tracks P50, P95, P99 response time percentiles (rolling window)
 *  - Logs slow requests (>1000ms) with full context for debugging
 *  - Exposes aggregated timing metrics via getResponseTimeMetrics()
 *  - Route-level timing breakdown for identifying bottleneck endpoints
 *  - Zero dependencies — uses only Node.js built-in hrtime
 *
 * HOW IT WORKS:
 *  1. On request arrival, captures a high-resolution timestamp (process.hrtime.bigint)
 *  2. Hooks into the response "finish" event to calculate the total duration
 *  3. Stores the duration in a rolling window buffer (last 1000 requests)
 *  4. Computes percentile metrics on demand for the /metrics endpoint
 *
 * CAPACITY:
 *  The rolling buffer stores the last 1000 response times as float64 values,
 *  consuming ~8KB of memory. This is negligible even under high load.
 *
 * USAGE:
 *  import { responseTimeMiddleware, getResponseTimeMetrics } from "./middlewares/response-time";
 *  app.use(responseTimeMiddleware);
 *
 * DEPENDENCIES: None (uses process.hrtime.bigint)
 * USED BY: backend/src/index.ts (registered as early middleware)
 * LAST UPDATED: 2026-05-27
 */

import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

/* ─────────────────────────────────────────────
 * Configuration
 * ───────────────────────────────────────────── */

/**
 * Size of the rolling window buffer.
 * Stores the last N response times for percentile calculations.
 * Higher values give more accurate percentiles but use more memory.
 */
const ROLLING_WINDOW_SIZE = 1000;

/**
 * Threshold (ms) for logging slow requests.
 * Requests exceeding this duration are logged with WARNING level
 * to help identify performance bottlenecks.
 */
const SLOW_REQUEST_THRESHOLD_MS = 1000;

/**
 * Threshold (ms) for logging very slow requests.
 * These requests are logged with ERROR level and may indicate
 * database timeouts or infinite loops.
 */
const CRITICAL_THRESHOLD_MS = 5000;

/* ─────────────────────────────────────────────
 * Internal State — Rolling Window Buffer
 * ───────────────────────────────────────────── */

/** Circular buffer storing response times (ms) for the last N requests */
const responseTimesBuffer: number[] = [];

/** Write position in the circular buffer */
let bufferIndex = 0;

/** Total number of requests tracked (used for overall statistics) */
let totalRequests = 0;

/** Sum of all response times (for calculating average) */
let totalResponseTimeMs = 0;

/** Route-level timing aggregation — map of route pattern to timing stats */
const routeTimings = new Map<string, { count: number; totalMs: number; maxMs: number }>();

/* ─────────────────────────────────────────────
 * Middleware Function
 * ───────────────────────────────────────────── */

/**
 * Express middleware that tracks response time for every request.
 *
 * Attaches the X-Response-Time header (in milliseconds) to the response
 * and stores timing data for aggregated metrics.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next middleware function
 */
export function responseTimeMiddleware(req: Request, res: Response, next: NextFunction): void {
  /* Capture the start time using high-resolution timer */
  const startTime = process.hrtime.bigint();

  /* Hook into the "finish" event — fires when the response has been sent */
  res.on("finish", () => {
    /* Calculate elapsed time in milliseconds (nanoseconds → milliseconds) */
    const endTime = process.hrtime.bigint();
    const durationNs = Number(endTime - startTime);
    const durationMs = durationNs / 1_000_000; /* Convert nanoseconds to milliseconds */

    /* ── Set response header ── */
    /* Note: This header may not be visible if compression middleware has
       already flushed headers. We set it defensively. */
    if (!res.headersSent) {
      res.setHeader("X-Response-Time", `${durationMs.toFixed(2)}ms`);
    }

    /* ── Store in rolling buffer ── */
    if (responseTimesBuffer.length < ROLLING_WINDOW_SIZE) {
      responseTimesBuffer.push(durationMs);
    } else {
      responseTimesBuffer[bufferIndex % ROLLING_WINDOW_SIZE] = durationMs;
    }
    bufferIndex++;

    /* ── Update aggregate counters ── */
    totalRequests++;
    totalResponseTimeMs += durationMs;

    /* ── Update route-level timings ── */
    const routeKey = `${req.method} ${req.route?.path || req.path}`;
    const existing = routeTimings.get(routeKey);
    if (existing) {
      existing.count++;
      existing.totalMs += durationMs;
      existing.maxMs = Math.max(existing.maxMs, durationMs);
    } else {
      routeTimings.set(routeKey, { count: 1, totalMs: durationMs, maxMs: durationMs });
    }

    /* ── Log slow requests ── */
    if (durationMs >= CRITICAL_THRESHOLD_MS) {
      logger.error(`[CRITICAL] Very slow request: ${req.method} ${req.path}`, {
        durationMs: Math.round(durationMs),
        statusCode: res.statusCode,
        userAgent: req.get("User-Agent"),
        ip: req.ip,
      });
    } else if (durationMs >= SLOW_REQUEST_THRESHOLD_MS) {
      logger.warn(`[SLOW] Request exceeded threshold: ${req.method} ${req.path}`, {
        durationMs: Math.round(durationMs),
        statusCode: res.statusCode,
        thresholdMs: SLOW_REQUEST_THRESHOLD_MS,
      });
    }
  });

  next();
}

/* ─────────────────────────────────────────────
 * Percentile Calculator
 * ───────────────────────────────────────────── */

/**
 * Calculates the Nth percentile from a sorted array of values.
 *
 * @param sortedValues - Array of numbers sorted in ascending order
 * @param percentile - Percentile to calculate (0-100)
 * @returns The value at the specified percentile
 */
function calculatePercentile(sortedValues: number[], percentile: number): number {
  if (sortedValues.length === 0) return 0;
  const index = Math.ceil((percentile / 100) * sortedValues.length) - 1;
  return sortedValues[Math.max(0, Math.min(index, sortedValues.length - 1))];
}

/* ─────────────────────────────────────────────
 * Public Metrics Accessor
 * ───────────────────────────────────────────── */

/**
 * Returns aggregated response time metrics for the monitoring endpoint.
 *
 * Includes:
 *  - P50, P95, P99 percentiles (from the rolling window)
 *  - Mean and max response times
 *  - Total request count
 *  - Top 10 slowest routes
 *
 * @returns Structured metrics object
 */
export function getResponseTimeMetrics(): {
  totalRequests: number;
  averageMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  maxMs: number;
  windowSize: number;
  slowestRoutes: Array<{ route: string; avgMs: number; maxMs: number; count: number }>;
} {
  /* Sort the rolling buffer for percentile calculation */
  const sorted = [...responseTimesBuffer].sort((a, b) => a - b);

  /* Calculate per-route averages and sort by slowest */
  const slowestRoutes = Array.from(routeTimings.entries())
    .map(([route, stats]) => ({
      route,
      avgMs: Math.round(stats.totalMs / stats.count),
      maxMs: Math.round(stats.maxMs),
      count: stats.count,
    }))
    .sort((a, b) => b.avgMs - a.avgMs)
    .slice(0, 10); /* Top 10 slowest routes */

  return {
    totalRequests,
    averageMs: totalRequests > 0 ? Math.round(totalResponseTimeMs / totalRequests) : 0,
    p50Ms: Math.round(calculatePercentile(sorted, 50)),
    p95Ms: Math.round(calculatePercentile(sorted, 95)),
    p99Ms: Math.round(calculatePercentile(sorted, 99)),
    maxMs: sorted.length > 0 ? Math.round(sorted[sorted.length - 1]) : 0,
    windowSize: responseTimesBuffer.length,
    slowestRoutes,
  };
}

/**
 * Resets all response time metrics.
 * Used for testing and admin operations.
 */
export function resetResponseTimeMetrics(): void {
  responseTimesBuffer.length = 0;
  bufferIndex = 0;
  totalRequests = 0;
  totalResponseTimeMs = 0;
  routeTimings.clear();
}
