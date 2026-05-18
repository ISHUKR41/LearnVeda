/**
 * FILE: postgres.ts
 * LOCATION: src/lib/server/database/postgres.ts
 * PURPOSE: Central PostgreSQL connection helper for production persistence.
 *          Keeping all Pool setup in one file prevents every repository from
 *          creating its own database connections and makes scaling safer.
 * USED BY: PostgreSQL repository adapter, migration runner, readiness checks
 * DEPENDENCIES: pg, Node.js process environment
 * LAST UPDATED: 2026-05-12
 */

import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";

type DatabaseGlobal = typeof globalThis & {
  __eduquestPostgresPool?: Pool;
};

/** Returns true when the deployment has a PostgreSQL connection string. */
export function isPostgresConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * Creates one shared PostgreSQL pool per server process.
 * A singleton pool avoids exhausting database connections during hot reloads,
 * API bursts, or multiple repository imports inside the same runtime.
 */
export function getPostgresPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required when the PostgreSQL adapter is active.");
  }

  const globalForDatabase = globalThis as DatabaseGlobal;

  globalForDatabase.__eduquestPostgresPool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    max: Number(process.env.POSTGRES_POOL_MAX ?? 10),
    idleTimeoutMillis: Number(process.env.POSTGRES_IDLE_TIMEOUT_MS ?? 30_000),
    connectionTimeoutMillis: Number(process.env.POSTGRES_CONNECT_TIMEOUT_MS ?? 3_000),
    ssl:
      process.env.POSTGRES_SSL === "true"
        ? { rejectUnauthorized: process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED !== "false" }
        : undefined,
  });

  return globalForDatabase.__eduquestPostgresPool;
}

/**
 * Runs one SQL query through the shared pool.
 * Repository files use this helper so query typing and connection handling stay
 * consistent across auth, community, events, and battle features.
 */
export async function queryPostgres<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: unknown[] = [],
): Promise<QueryResult<T>> {
  return getPostgresPool().query<T>(text, values);
}

/**
 * Runs several statements inside one transaction.
 * If any statement fails, the transaction rolls back so partial writes do not
 * leave the database in a confusing state.
 */
export async function withPostgresTransaction<T>(
  work: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await getPostgresPool().connect();

  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Pings PostgreSQL for readiness checks.
 * This does not expose query results or secrets; it only confirms that a basic
 * connection can be created and answered.
 */
export async function probePostgres(): Promise<boolean> {
  if (!isPostgresConfigured()) {
    return false;
  }

  try {
    await queryPostgres("SELECT 1 AS ok");
    return true;
  } catch {
    return false;
  }
}

/** Closes the shared pool after CLI scripts, tests, or controlled shutdowns. */
export async function closePostgresPool(): Promise<void> {
  const globalForDatabase = globalThis as DatabaseGlobal;
  const pool = globalForDatabase.__eduquestPostgresPool;

  if (pool) {
    await pool.end();
    globalForDatabase.__eduquestPostgresPool = undefined;
  }
}
