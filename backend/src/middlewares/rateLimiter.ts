/**
 * FILE: rateLimiter.ts
 * LOCATION: backend/src/middlewares/rateLimiter.ts
 * PURPOSE: Express middleware to rate limit API requests. It supports
 *          distributed Redis-backed rate limiting for production scalability,
 *          and falls back to process-local in-memory rate limiting when Redis
 *          is not active or configured.
 *
 * ARCHITECTURE:
 *  - IP Detection: Resolves client IP address through proxy headers (X-Forwarded-For, X-Real-IP).
 *  - Atomic Lua Script: Evaluates rate limits in Redis atomically to prevent race conditions.
 *  - Fail-Safe Logic: Fails closed in production if Redis is down (to prevent abuse),
 *                      unless EDUQUEST_RATE_LIMIT_FAIL_OPEN is explicitly configured.
 *
 * USED BY: backend/src/index.ts
 * DEPENDENCIES: express, ioredis, backend/src/config/redis.ts
 * LAST UPDATED: 2026-05-21
 * AUTHOR NOTE: Highly commented for readability and adherence to enterprise standards.
 */

import { Request, Response, NextFunction } from "express";
import { isRedisConfigured, ensureRedisConnected } from "../config/redis";

/**
 * Interface representing a process-local fixed-window bucket.
 * Used when falling back to in-memory rate limiting.
 */
interface RateLimitBucket {
  count: number;
  resetAt: number;
}

/**
 * Options for configuring a specific rate limit window.
 */
interface RateLimitOptions {
  windowMs: number; // The size of the sliding/fixed window in milliseconds
  limit: number;    // Maximum number of connections allowed in the window
  keyPrefix: string; // Namespace prefix for separating limits (e.g. 'global', 'login')
}

// Module-level cache for in-memory rate limiting fallback
const inMemoryBuckets = new Map<string, RateLimitBucket>();

/**
 * Resolves the client IP address securely.
 * Inspects proxy headers first to support deployment behind load balancers/reverse proxies.
 *
 * @param {Request} req Express Request object
 * @returns {string} Clean client IP address
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    const ips = typeof forwardedFor === "string"
      ? forwardedFor.split(",")
      : forwardedFor;
    const clientIp = ips[0]?.trim();
    if (clientIp) {
      return clientIp;
    }
  }

  const realIp = req.headers["x-real-ip"];
  if (realIp && typeof realIp === "string") {
    return realIp.trim();
  }

  return req.ip ?? req.socket.remoteAddress ?? "local-development";
}

/**
 * Helper to clean up expired in-memory rate limiting buckets.
 * Prevents memory leaks by deleting records whose reset time has passed.
 */
function pruneExpiredInMemoryBuckets(): void {
  const now = Date.now();
  for (const [key, bucket] of inMemoryBuckets.entries()) {
    if (bucket.resetAt <= now) {
      inMemoryBuckets.delete(key);
    }
  }
}

// Periodically prune in-memory buckets every 5 minutes to keep footprint minimal
setInterval(pruneExpiredInMemoryBuckets, 5 * 60_000).unref();

/**
 * Checks in-memory rate limiting for a client.
 * Safe for single-process local development, but not multi-server production.
 */
function checkInMemoryLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  // Proactively prune if the bucket list grows too large
  if (inMemoryBuckets.size > 1000) {
    pruneExpiredInMemoryBuckets();
  }

  const current = inMemoryBuckets.get(key);

  // If no entry exists or the window expired, initialize a new bucket
  if (!current || current.resetAt <= now) {
    inMemoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  // Increment request count
  current.count += 1;

  // Block client if they cross the limit
  if (current.count > limit) {
    const retryAfter = Math.ceil((current.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds: Math.max(1, retryAfter) };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Checks Redis-backed rate limiting using an atomic Lua script.
 * Keeps increments and PEXPIRE atomic to prevent race conditions.
 */
async function checkRedisLimit(key: string, limit: number, windowMs: number): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const client = await ensureRedisConnected();
  const redisKey = `eduquest:rate-limit:${key}`;

  // Execute atomic Lua script
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
    windowMs
  )) as [number, number];

  const currentCount = Number(result[0]);
  const ttlMs = Math.max(0, Number(result[1]));

  if (currentCount > limit) {
    const retryAfter = Math.max(1, Math.ceil(ttlMs / 1000));
    return { allowed: false, retryAfterSeconds: retryAfter };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Resolves which rate limiting adapter should be used.
 * Production environments default to Redis to handle multiple concurrent server instances.
 * Local development defaults to process memory.
 */
function getRateLimiterAdapter(): "redis" | "memory" {
  const configuredAdapter = process.env.EDUQUEST_RATE_LIMIT_ADAPTER;

  if (configuredAdapter === "redis" || configuredAdapter === "memory") {
    return configuredAdapter;
  }

  // If in production, default to Redis. Otherwise, fallback to in-memory.
  return process.env.NODE_ENV === "production" ? "redis" : "memory";
}

/**
 * Factory that returns an Express middleware for rate limiting.
 *
 * @param {Partial<RateLimitOptions>} customOptions Custom limit and window settings
 * @returns {RequestHandler} Express middleware function
 */
export function rateLimiter(customOptions: Partial<RateLimitOptions> = {}) {
  const options: RateLimitOptions = {
    windowMs: customOptions.windowMs ?? 60_000, // 1 minute default
    limit: customOptions.limit ?? 100,          // 100 requests default
    keyPrefix: customOptions.keyPrefix ?? "global",
  };

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const clientIp = getClientIp(req);
    const rateLimitKey = `${options.keyPrefix}:${clientIp}`;
    const adapter = getRateLimiterAdapter();

    if (adapter === "redis" && isRedisConfigured()) {
      try {
        const { allowed, retryAfterSeconds } = await checkRedisLimit(
          rateLimitKey,
          options.limit,
          options.windowMs
        );

        if (!allowed) {
          res.status(429).json({
            ok: false,
            error: {
              code: "RATE_LIMITED",
              message: "Too many requests. Please wait a moment and try again.",
              retryAfter: retryAfterSeconds,
            },
          });
          return;
        }

        next();
        return;
      } catch (error) {
        const err = error as Error;
        console.error(`[Rate Limiter] Redis check failed for client ${clientIp}:`, err.message);

        const isProduction = process.env.NODE_ENV === "production";
        const failOpen = process.env.EDUQUEST_RATE_LIMIT_FAIL_OPEN === "true";

        // In production, block request if Redis rate limiter fails (fail-closed security default)
        if (isProduction && !failOpen) {
          console.warn("[Rate Limiter] Redis offline. Failing closed in production mode.");
          res.status(429).json({
            ok: false,
            error: {
              code: "RATE_LIMITED",
              message: "Rate limiting services are temporarily offline. Please try again shortly.",
              retryAfter: 60,
            },
          });
          return;
        }

        console.warn("[Rate Limiter] Redis offline. Falling back to process memory.");
      }
    }

    // Fallback to memory limit check
    const { allowed, retryAfterSeconds } = checkInMemoryLimit(
      rateLimitKey,
      options.limit,
      options.windowMs
    );

    if (!allowed) {
      res.status(429).json({
        ok: false,
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests. Please wait a moment and try again.",
          retryAfter: retryAfterSeconds,
        },
      });
      return;
    }

    next();
  };
}
