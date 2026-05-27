/**
 * FILE: database.ts
 * LOCATION: backend/src/config/database.ts
 * PURPOSE: Central database configuration and connection management.
 *          Creates and exports a PostgreSQL connection pool that all
 *          services and routes use for database operations.
 *
 * ARCHITECTURE:
 *  - Singleton Pattern: One pool instance shared across the entire process.
 *  - Connection Lifecycle:
 *      1. Creates connections on demand (up to `max`)
 *      2. Reuses idle connections from the pool
 *      3. Closes idle connections after `idleTimeoutMillis`
 *      4. Validates connections with `statement_timeout`
 *  - Retry Logic: Exponential backoff on initial connection failures
 *  - Monitoring: Exports pool metrics for the /metrics health endpoint
 *
 * CAPACITY:
 *  - Development: max=10 connections (conservative for local testing)
 *  - Production: max=100 connections (supports 10,000+ concurrent users)
 *  - For extreme scale (50k+ users), deploy pgBouncer as a connection pooler
 *    in front of PostgreSQL and set max=20 per Express instance.
 *
 * DEPENDENCIES: pg (PostgreSQL driver)
 * USED BY: All route handlers, services, and controllers
 * LAST UPDATED: 2026-05-26
 */

import { Pool, PoolConfig, PoolClient } from "pg";
import logger from "../utils/logger";

/* ─────────────────────────────────────────────
 * Environment-aware database configuration
 * Uses DATABASE_URL env var or falls back to local defaults
 * ───────────────────────────────────────────── */

const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Pool configuration — tuned for production workloads at scale.
 *
 * max:
 *   Maximum concurrent connections to PostgreSQL. Each connection uses ~10MB
 *   RAM on the DB server. Production uses 100 connections to handle 10k+ users.
 *   In development, we keep it at 10 to avoid overwhelming local PostgreSQL.
 *
 * idleTimeoutMillis:
 *   How long (ms) an idle connection stays open before the pool closes it.
 *   30 seconds balances connection reuse vs resource conservation.
 *   Shorter values free resources faster but increase connection churn.
 *
 * connectionTimeoutMillis:
 *   Maximum time (ms) to wait for a new connection from the pool.
 *   10 seconds in production prevents requests from hanging indefinitely.
 *   5 seconds in development for faster failure feedback.
 *
 * statement_timeout:
 *   Set on each connection via the "connect" event handler.
 *   Kills queries running longer than 30 seconds in production
 *   or 60 seconds in development (for debugging slow queries).
 *
 * idle_in_transaction_session_timeout:
 *   Kills transactions left idle for too long (e.g., forgotten COMMIT/ROLLBACK).
 *   30 seconds in production prevents connection leaks from hung transactions.
 *
 * application_name:
 *   Tags this application in PostgreSQL's pg_stat_activity view.
 *   Critical for identifying which app is using connections in production
 *   when multiple services share the same database.
 */
const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,

  /* Connection pool sizing — scales based on environment */
  max: IS_PRODUCTION ? 100 : 10,
  min: IS_PRODUCTION ? 5 : 1,

  /* Timeout configuration — prevents resource starvation */
  idleTimeoutMillis: IS_PRODUCTION ? 30_000 : 60_000,
  connectionTimeoutMillis: IS_PRODUCTION ? 10_000 : 5_000,

  /* SSL required in production (most managed PostgreSQL services require it) */
  ssl: IS_PRODUCTION ? { rejectUnauthorized: false } : undefined,

  /* Application identification — visible in pg_stat_activity */
  application_name: "eduquest-backend",
};

/* ─────────────────────────────────────────────
 * Singleton Pool Instance
 * Created once at module load time and reused across all imports.
 * ───────────────────────────────────────────── */

export const pool = new Pool(poolConfig);

/* ─────────────────────────────────────────────
 * Pool Event Handlers — Essential for production debugging
 * These handlers fire on pool-level lifecycle events.
 * ───────────────────────────────────────────── */

/**
 * Fires when a new client is created in the pool.
 * Sets session-level parameters for safety and observability:
 * - statement_timeout: Kill runaway queries
 * - idle_in_transaction_session_timeout: Kill hung transactions
 * - application_name: Tag in pg_stat_activity
 */
pool.on("connect", (client: PoolClient) => {
  /* Set schema search path to support Prisma's backend schema and public schema cohabitation */
  client.query("SET search_path TO backend, public");

  /* Set statement timeout to prevent runaway queries from consuming connections */
  const statementTimeout = IS_PRODUCTION ? "30s" : "60s";
  client.query(`SET statement_timeout = '${statementTimeout}'`);

  /* Kill idle-in-transaction connections after 30 seconds in production.
   * This prevents a forgotten BEGIN without COMMIT from holding a connection forever. */
  if (IS_PRODUCTION) {
    client.query("SET idle_in_transaction_session_timeout = '30s'");
  }

  /* Set application name for monitoring in pg_stat_activity */
  client.query("SET application_name = 'eduquest-backend'");

  logger.debug("[DB Pool] New client connected", {
    totalConnections: pool.totalCount,
    idleConnections: pool.idleCount,
    waitingClients: pool.waitingCount,
  });
});

/**
 * Fires when a client encounters an error while idle in the pool.
 * This does NOT crash the server — the pool automatically removes
 * the broken client and creates a new one when needed.
 */
pool.on("error", (err: Error) => {
  logger.error("[DB Pool] Unexpected idle client error", {
    message: err.message,
    stack: IS_PRODUCTION ? undefined : err.stack,
  });
});

/**
 * Fires when a client is returned to the pool after use.
 * Useful for debugging connection usage patterns.
 */
pool.on("release", () => {
  logger.debug("[DB Pool] Client released back to pool", {
    totalConnections: pool.totalCount,
    idleConnections: pool.idleCount,
  });
});

/* ─────────────────────────────────────────────
 * Pool Metrics — Exported for /metrics and /ready endpoints
 * Provides real-time visibility into connection pool health.
 * ───────────────────────────────────────────── */

/**
 * Interface defining the shape of pool metrics data.
 * Used by the /metrics endpoint and health checks.
 */
export interface PoolMetrics {
  /** Total number of clients in the pool (active + idle) */
  totalConnections: number;
  /** Number of clients currently idle in the pool */
  idleConnections: number;
  /** Number of requests waiting for a connection */
  waitingClients: number;
  /** Maximum allowed connections in the pool */
  maxConnections: number;
  /** Pool utilization percentage (active / max * 100) */
  utilizationPercent: number;
  /** Whether the pool is under pressure (waiting > 0) */
  isUnderPressure: boolean;
}

/**
 * Returns real-time connection pool metrics.
 * Called by the /metrics endpoint to expose pool health to monitoring tools
 * like Prometheus, Grafana, or Datadog.
 *
 * @returns {PoolMetrics} Current snapshot of pool state
 */
export function getPoolMetrics(): PoolMetrics {
  const total = pool.totalCount;
  const idle = pool.idleCount;
  const waiting = pool.waitingCount;
  const max = poolConfig.max ?? 10;
  const active = total - idle;

  return {
    totalConnections: total,
    idleConnections: idle,
    waitingClients: waiting,
    maxConnections: max,
    utilizationPercent: max > 0 ? Math.round((active / max) * 100) : 0,
    isUnderPressure: waiting > 0,
  };
}

/* ─────────────────────────────────────────────
 * Health Check — Used by /ready endpoint
 * Verifies database connectivity with a lightweight query.
 * ───────────────────────────────────────────── */

/**
 * Checks if the database is reachable by executing a simple query.
 * Returns true if the query succeeds, false otherwise.
 *
 * This function is called by the /ready health check endpoint to tell
 * load balancers (AWS ALB, Kubernetes, etc.) whether this server instance
 * can handle requests that require database access.
 *
 * The query "SELECT 1 AS health" is the lightest possible database round-trip.
 * It verifies: DNS resolution → TCP connection → TLS handshake → SQL execution.
 *
 * @returns {Promise<boolean>} True if the database responds successfully
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const result = await pool.query("SELECT 1 AS health");
    return result.rows[0]?.health === 1;
  } catch (err) {
    logger.error("[DB Health] Database health check failed", {
      message: (err as Error).message,
    });
    return false;
  }
}

/* ─────────────────────────────────────────────
 * Connection Retry — Exponential backoff for initial connection
 * Prevents the server from crashing immediately if the database
 * is temporarily unavailable during startup (e.g., cloud cold start).
 * ───────────────────────────────────────────── */

/**
 * Attempts to establish the initial database connection with retry logic.
 * Uses exponential backoff: 1s → 2s → 4s → 8s → 16s.
 *
 * This is called during server startup (optional) to verify database
 * connectivity before accepting requests. If all retries fail, the server
 * will still start but the /ready endpoint will report unhealthy.
 *
 * @param maxRetries - Maximum number of connection attempts (default: 5)
 * @returns {Promise<boolean>} True if connection was established
 */
export async function connectWithRetry(maxRetries: number = 5): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = await pool.connect();
      await client.query("SELECT 1");
      client.release();

      logger.info("[DB Pool] Database connection established", {
        attempt,
        maxConnections: poolConfig.max,
        environment: IS_PRODUCTION ? "production" : "development",
      });

      return true;
    } catch (err) {
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 16_000);

      logger.warn("[DB Pool] Connection attempt failed, retrying...", {
        attempt,
        maxRetries,
        nextRetryMs: delay,
        error: err as Error,
      });

      /* Wait before next retry using exponential backoff */
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  logger.error("[DB Pool] All connection attempts failed. Server will start but database is unavailable.", {
    maxRetries,
    databaseUrl: process.env.DATABASE_URL ? "configured" : "NOT_SET",
  });

  return false;
}

/* ─────────────────────────────────────────────
 * Transaction Helper — Simplifies multi-step database operations
 * Ensures proper BEGIN/COMMIT/ROLLBACK handling.
 * ───────────────────────────────────────────── */

/**
 * Executes a function within a database transaction.
 * Automatically handles BEGIN, COMMIT, and ROLLBACK.
 *
 * This eliminates the risk of forgetting to ROLLBACK on errors,
 * which would leave connections in a broken "idle in transaction" state.
 *
 * Usage:
 * ```typescript
 * const result = await withTransaction(async (client) => {
 *   await client.query("INSERT INTO ...");
 *   await client.query("UPDATE ...");
 *   return { success: true };
 * });
 * ```
 *
 * @param fn - Async function that receives a PoolClient for query execution
 * @returns {Promise<T>} The return value of the provided function
 * @throws Re-throws the original error after ROLLBACK
 */
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("[DB Transaction] Transaction rolled back", {
      error: err as Error,
    });
    throw err;
  } finally {
    client.release();
  }
}

/* ─────────────────────────────────────────────
 * Graceful Shutdown — Closes all connections cleanly
 * Called when the server receives SIGTERM/SIGINT
 * ───────────────────────────────────────────── */

/**
 * Closes all database connections in the pool.
 * Must be called during graceful shutdown to prevent connection leaks.
 *
 * This function:
 *  1. Stops accepting new connection requests
 *  2. Waits for active queries to complete
 *  3. Closes all idle connections
 *  4. Resolves when all connections are fully closed
 */
export async function closeDatabasePool(): Promise<void> {
  const metrics = getPoolMetrics();
  logger.info("[DB Pool] Closing all connections...", {
    activeConnections: metrics.totalConnections - metrics.idleConnections,
    idleConnections: metrics.idleConnections,
  });

  await pool.end();
  logger.info("[DB Pool] All connections closed. Database pool shut down.");
}

export default pool;
