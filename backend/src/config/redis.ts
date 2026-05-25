/**
 * FILE: redis.ts
 * LOCATION: backend/src/config/redis.ts
 * PURPOSE: Manages the Redis connection lifecycle for the Express backend.
 *          Provides a singleton ioredis client using lazy connection,
 *          meaning the connection is only established when a route actively
 *          needs to query Redis (e.g. rate limiting or matchmaking).
 *          Includes liveness/readiness probes and graceful shutdown helpers.
 *
 * ARCHITECTURE:
 *  - Singleton Pattern: Reuses a single Redis client across the process.
 *  - Lazy Connection: Prevents blocking Express server startup when Redis is slow.
 *  - Fallback Ready: Designed to work alongside in-memory database fallback modes.
 *
 * USED BY: backend/src/middlewares/rateLimiter.ts, backend/src/index.ts
 * DEPENDENCIES: ioredis, Node.js process environment (REDIS_URL)
 * LAST UPDATED: 2026-05-21
 * AUTHOR NOTE: Fully commented to explain lazy connection, global caching, and error handling.
 */

import Redis from "ioredis";

/**
 * Global interface augmentation to allow caching the Redis client on globalThis.
 * This prevents creating multiple connection pools during hot-reloads in development.
 */
type RedisGlobal = typeof globalThis & {
  __eduquestRedisClient?: Redis;
};

/**
 * Checks if a Redis URL is provided in the environment variables.
 * Used to determine if the Redis adapter is configured and active.
 *
 * @returns {boolean} True if REDIS_URL environment variable is set.
 */
export function isRedisConfigured(): boolean {
  return Boolean(process.env.REDIS_URL);
}

/**
 * Returns the singleton Redis client instance.
 * Initializes the client with lazy connection options if it doesn't exist.
 *
 * @returns {Redis} The ioredis client instance.
 * @throws {Error} If REDIS_URL is not set when calling this function.
 */
export function getRedisClient(): Redis {
  if (!process.env.REDIS_URL) {
    throw new Error(
      "REDIS_URL is required when the Redis rate limiting or caching adapter is active."
    );
  }

  const globalForRedis = globalThis as RedisGlobal;

  // Lazily initialize the Redis client if it doesn't already exist on globalThis
  if (!globalForRedis.__eduquestRedisClient) {
    console.log("[Redis] Initializing ioredis client singleton...");
    globalForRedis.__eduquestRedisClient = new Redis(process.env.REDIS_URL, {
      lazyConnect: true, // Do not connect to the Redis server on creation
      maxRetriesPerRequest: 2, // Fail quickly instead of queuing commands indefinitely
      enableReadyCheck: true, // Verify server status before flagging client as ready
      connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT_MS ?? 3_000), // Timeout after 3s
    });

    // Register basic logging hooks for connection status changes
    globalForRedis.__eduquestRedisClient.on("connect", () => {
      console.log("[Redis] Client connected to server.");
    });

    globalForRedis.__eduquestRedisClient.on("ready", () => {
      console.log("[Redis] Client ready to receive commands.");
    });

    globalForRedis.__eduquestRedisClient.on("error", (err) => {
      console.error("[Redis] Client error occurred:", err.message);
    });

    globalForRedis.__eduquestRedisClient.on("end", () => {
      console.log("[Redis] Connection closed.");
    });
  }

  return globalForRedis.__eduquestRedisClient;
}

/**
 * Ensures the ioredis client is connected.
 * Since lazyConnect is enabled, the client starts in a "wait" or "connecting" state.
 * This helper makes the connection step explicit and resolves when the client is ready.
 *
 * @returns {Promise<Redis>} Resolves with the connected Redis client.
 */
export async function ensureRedisConnected(): Promise<Redis> {
  const client = getRedisClient();

  // If the client has not attempted connection yet or has been disconnected, connect explicitly
  if (client.status === "wait" || client.status === "end") {
    console.log("[Redis] Explicitly initiating lazy connection...");
    await client.connect();
  }

  return client;
}

/**
 * Performs a lightweight health check (PING) on the Redis instance.
 * Safe to call; it catches all exceptions and returns a simple boolean status.
 *
 * @returns {Promise<boolean>} True if the Redis server responds with "PONG".
 */
export async function probeRedis(): Promise<boolean> {
  if (!isRedisConfigured()) {
    return false;
  }

  try {
    const client = await ensureRedisConnected();
    const response = await client.ping();
    return response === "PONG";
  } catch (error) {
    const err = error as Error;
    console.error("[Redis Probe] Health check failed:", err.message);
    return false;
  }
}

/**
 * Closes the active Redis client connection cleanly.
 * Must be called during server graceful shutdown to avoid leaking TCP connections.
 *
 * @returns {Promise<void>} Resolves when the connection is fully terminated.
 */
export async function closeRedisClient(): Promise<void> {
  const globalForRedis = globalThis as RedisGlobal;
  const client = globalForRedis.__eduquestRedisClient;

  if (client) {
    console.log("[Redis] Closing client connection pool...");
    await client.quit();
    globalForRedis.__eduquestRedisClient = undefined;
    console.log("[Redis] Connection pool closed.");
  }
}
