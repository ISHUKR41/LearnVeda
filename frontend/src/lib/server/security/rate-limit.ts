/**
 * FILE: rate-limit.ts
 * LOCATION: src/lib/server/security/rate-limit.ts
 * PURPOSE: Rate limiting for sensitive API routes. It can use Redis for
 *          distributed production limits and falls back to in-memory buckets for
 *          local development where Redis is not configured.
 * USED BY: Auth, battle matchmaking, community post, and event registration APIs
 * LAST UPDATED: 2026-05-12
 */

import { ensureRedisConnected } from "@/lib/server/cache/redis";
import { getLogger } from "@/lib/server/observability/logger";

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

type RateLimitGlobal = typeof globalThis & {
  __eduquestRateLimits?: Map<string, RateLimitBucket>;
};

export type RateLimiterAdapterName = "memory-fixed-window" | "redis-fixed-window";

/**
 * Resolves which rate limiter should run in this environment.
 * Production defaults to Redis so rate limits work across multiple server
 * instances. Local development keeps memory buckets unless Redis is requested.
 */
export function getRateLimiterAdapterName(): RateLimiterAdapterName {
  if (process.env.EDUQUEST_RATE_LIMIT_ADAPTER === "redis") {
    return "redis-fixed-window";
  }

  if (process.env.EDUQUEST_RATE_LIMIT_ADAPTER === "memory") {
    return "memory-fixed-window";
  }

  if (process.env.NODE_ENV === "production") {
    return "redis-fixed-window";
  }

  return "memory-fixed-window";
}

/** Lazily creates one shared bucket map for the current server process. */
function getBuckets(): Map<string, RateLimitBucket> {
  const globalForRateLimit = globalThis as RateLimitGlobal;
  globalForRateLimit.__eduquestRateLimits ??= new Map();
  return globalForRateLimit.__eduquestRateLimits;
}

/** Removes expired buckets when the process-local limiter grows meaningfully. */
function pruneExpiredBuckets(now: number, buckets: Map<string, RateLimitBucket>): void {
  if (buckets.size < 250) {
    return;
  }

  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

/** Builds a stable best-effort client key from proxy headers with a local fallback. */
export function getClientKey(request: Request, suffix: string): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedChain = forwardedFor
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const ip = realIp || forwardedChain?.at(-1) || "local-development";
  return `${suffix}:${ip}`;
}

/**
 * Checks and updates a fixed-window rate limit bucket.
 * This memory implementation is safe for local development but does not protect
 * multiple production instances because each process has its own bucket map.
 */
function checkMemoryRateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const buckets = getBuckets();
  pruneExpiredBuckets(now, buckets);
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - current.count),
    retryAfterSeconds: 0,
  };
}

/**
 * Checks and updates a Redis-backed fixed-window bucket.
 * The Lua script keeps increment and expiration atomic so multiple production
 * instances cannot race each other when the same student sends rapid requests.
 */
async function checkRedisRateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  const client = await ensureRedisConnected();
  const redisKey = `eduquest:rate-limit:${key}`;
  const result = (await client.eval(
    `
      local current = redis.call("INCR", KEYS[1])
      if current == 1 then
        redis.call("PEXPIRE", KEYS[1], ARGV[1])
      end
      local ttl = redis.call("PTTL", KEYS[1])
      return { current, ttl }
    `,
    1,
    redisKey,
    windowMs,
  )) as [number, number];
  const currentCount = Number(result[0]);
  const ttlMs = Math.max(0, Number(result[1]));

  if (currentCount > limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil(ttlMs / 1000)),
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - currentCount),
    retryAfterSeconds: 0,
  };
}

/**
 * Checks the active rate limiter adapter.
 * In production, a requested Redis limiter fails closed when Redis is
 * unavailable so sensitive routes are not accidentally unprotected across many
 * app instances. Local development still falls back to memory for convenience.
 */
export async function checkRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  if (getRateLimiterAdapterName() === "redis-fixed-window") {
    try {
      return await checkRedisRateLimit(options);
    } catch (error) {
      getLogger().error({ error }, "Redis rate limiter failed.");

      if (process.env.NODE_ENV === "production" && process.env.EDUQUEST_RATE_LIMIT_FAIL_OPEN !== "true") {
        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds: 60,
        };
      }

      getLogger().warn("Falling back to memory rate limiter outside strict production mode.");
    }
  }

  return checkMemoryRateLimit(options);
}
