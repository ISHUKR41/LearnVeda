/**
 * FILE: cache.ts
 * LOCATION: backend/src/middlewares/cache.ts
 * PURPOSE: High-performance caching middleware for Express routes.
 *          Intercepts GET requests, checks Redis for a cached response,
 *          and returns it immediately. If not cached, it captures the
 *          outgoing response, stores it in Redis with a configurable TTL,
 *          and forwards it. Safely falls back if Redis is offline.
 * USED BY: All slow GET endpoints (curriculum, leaderboards)
 * DEPENDENCIES: express, ../config/redis
 * LAST UPDATED: 2026-05-26
 */

import { Request, Response, NextFunction } from "express";
import { getRedisClient, isRedisConfigured, ensureRedisConnected } from "../config/redis";

interface CacheOptions {
  /** Time-to-live in seconds. Default is 300 seconds (5 minutes). */
  ttlSeconds?: number;
  /** Custom key generator. Default uses the raw request URL. */
  keyGenerator?: (req: Request) => string;
}

/**
 * Creates an Express middleware that caches GET responses in Redis.
 *
 * @param options - Cache options (TTL, custom keys)
 */
export function cacheMiddleware(options: CacheOptions = {}) {
  const ttl = options.ttlSeconds ?? 300; // default 5 minutes
  const generateKey = options.keyGenerator ?? ((req: Request) => `cache:${req.originalUrl || req.url}`);

  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    if (!isRedisConfigured()) {
      return next();
    }

    const key = generateKey(req);

    try {
      const redis = await ensureRedisConnected();
      const cachedResponse = await redis.get(key);

      if (cachedResponse) {
        if (process.env.NODE_ENV !== "production") {
          console.log(`[Cache Hit] Serving: ${key}`);
        }
        res.setHeader("X-Cache", "HIT");
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(cachedResponse);
        return;
      }

      // Intercept res.send to cache the payload
      const originalSend = res.send;
      res.send = function (body): Response {
        res.send = originalSend; // restore original function

        // Only cache 200 OK responses
        if (res.statusCode === 200 && body) {
          redis.setex(key, ttl, typeof body === "string" ? body : JSON.stringify(body))
            .catch(err => console.error(`[Cache Error] Failed to store key ${key}:`, err.message));
        }

        res.setHeader("X-Cache", "MISS");
        return originalSend.call(this, body);
      };

      next();
    } catch (err) {
      const error = err as Error;
      console.warn(`[Cache Bypass] Redis error, bypassing cache: ${error.message}`);
      res.setHeader("X-Cache", "BYPASS");
      next();
    }
  };
}
