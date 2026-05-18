/**
 * FILE: redis.ts
 * LOCATION: src/lib/server/cache/redis.ts
 * PURPOSE: Central Redis connection helper for distributed backend state.
 *          The first production use is rate limiting; the same client can later
 *          support matchmaking queues, leaderboard rankings, and workers.
 * USED BY: rate-limit.ts, runtime-health.ts
 * DEPENDENCIES: ioredis, Node.js process environment
 * LAST UPDATED: 2026-05-12
 */

import Redis from "ioredis";

type RedisGlobal = typeof globalThis & {
  __eduquestRedisClient?: Redis;
};

/** Returns true when the deployment has a Redis connection string. */
export function isRedisConfigured(): boolean {
  return Boolean(process.env.REDIS_URL);
}

/**
 * Creates one shared Redis client per server process.
 * The client uses lazy connection so importing backend modules does not open a
 * network connection until a route actually needs Redis.
 */
export function getRedisClient(): Redis {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is required when the Redis adapter is active.");
  }

  const globalForRedis = globalThis as RedisGlobal;

  globalForRedis.__eduquestRedisClient ??= new Redis(process.env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 2,
    enableReadyCheck: true,
    connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT_MS ?? 3_000),
  });

  return globalForRedis.__eduquestRedisClient;
}

/**
 * Ensures the shared Redis client has an open connection before commands run.
 * ioredis can stay in "wait" state with lazyConnect, so this helper makes the
 * connection step explicit and easy to comment/test.
 */
export async function ensureRedisConnected(): Promise<Redis> {
  const client = getRedisClient();

  if (client.status === "wait" || client.status === "end") {
    await client.connect();
  }

  return client;
}

/** Pings Redis for readiness checks without exposing URLs or secrets. */
export async function probeRedis(): Promise<boolean> {
  if (!isRedisConfigured()) {
    return false;
  }

  try {
    const client = await ensureRedisConnected();
    return (await client.ping()) === "PONG";
  } catch {
    return false;
  }
}
