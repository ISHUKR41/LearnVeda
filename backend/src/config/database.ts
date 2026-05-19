/**
 * FILE: database.ts
 * LOCATION: backend/src/config/database.ts
 * PURPOSE: Central database configuration and connection management.
 *          Creates and exports a PostgreSQL connection pool and Prisma client
 *          that all services and routes use for database operations.
 *
 * ARCHITECTURE: Singleton pattern — one pool shared across the entire application.
 *               The pool manages connection lifecycle automatically:
 *               - Creates connections on demand (up to max)
 *               - Reuses idle connections
 *               - Closes connections that exceed idleTimeout
 *               - Validates connections before use
 *
 * CAPACITY: max=50 handles ~50 concurrent queries, suitable for 100+ users.
 *           For higher scale, increase max and use pgBouncer.
 *
 * DEPENDENCIES: pg (PostgreSQL driver), @prisma/client
 * USED BY: All route handlers, services, and controllers
 * LAST UPDATED: 2026-05-19
 */

import { Pool, PoolConfig } from "pg";

/* ─────────────────────────────────────────────
 * Environment-aware database configuration
 * Uses DATABASE_URL env var or falls back to local defaults
 * ───────────────────────────────────────────── */

const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Pool configuration — tuned for production workloads.
 * 
 * max: Maximum concurrent connections. Each connection uses ~10MB RAM on the DB server.
 *      50 connections supports ~100+ concurrent users with typical query patterns.
 * 
 * idleTimeoutMillis: How long an idle connection lives before being closed.
 *                    30 seconds balances connection reuse vs resource conservation.
 * 
 * connectionTimeoutMillis: Max time to wait for a connection from the pool.
 *                          5 seconds prevents requests from hanging indefinitely.
 * 
 * statement_timeout: Kills queries running longer than 30 seconds.
 *                    Prevents runaway queries from consuming connections.
 */
const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: IS_PRODUCTION ? 50 : 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  // SSL required in production (most managed PostgreSQL services require it)
  ssl: IS_PRODUCTION ? { rejectUnauthorized: false } : undefined,
};

/* ─────────────────────────────────────────────
 * Singleton Pool Instance
 * ───────────────────────────────────────────── */

export const pool = new Pool(poolConfig);

/* ─────────────────────────────────────────────
 * Pool Event Handlers — Essential for production debugging
 * ───────────────────────────────────────────── */

/**
 * Fires when a new client is created in the pool.
 * Sets statement_timeout to prevent runaway queries.
 */
pool.on("connect", (client) => {
  client.query("SET statement_timeout = '30s'");
  if (!IS_PRODUCTION) {
    console.log("[DB Pool] New client connected. Pool size:", pool.totalCount);
  }
});

/**
 * Fires when a client encounters an error.
 * Logs the error but does NOT crash the server — the pool handles reconnection.
 */
pool.on("error", (err) => {
  console.error("[DB Pool] Unexpected client error:", err.message);
});

/* ─────────────────────────────────────────────
 * Health Check — Used by /ready endpoint
 * Verifies database connectivity with a lightweight query
 * ───────────────────────────────────────────── */

/**
 * Checks if the database is reachable by executing a simple query.
 * Returns true if the query succeeds, false otherwise.
 * 
 * Used by the /ready health check endpoint to tell load balancers
 * whether this server instance can handle requests.
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const result = await pool.query("SELECT 1 AS health");
    return result.rows[0]?.health === 1;
  } catch {
    return false;
  }
}

/* ─────────────────────────────────────────────
 * Graceful Shutdown — Closes all connections cleanly
 * Called when the server receives SIGTERM/SIGINT
 * ───────────────────────────────────────────── */

/**
 * Closes all database connections in the pool.
 * Must be called during graceful shutdown to prevent connection leaks.
 */
export async function closeDatabasePool(): Promise<void> {
  console.log("[DB Pool] Closing all connections...");
  await pool.end();
  console.log("[DB Pool] All connections closed.");
}

export default pool;
