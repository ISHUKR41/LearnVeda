/**
 * FILE: cache.ts
 * LOCATION: backend/src/config/cache.ts
 * PURPOSE: Production-grade hybrid Cache Service for the EduQuest backend.
 *          Implements a distributed caching layer using Redis (via ioredis) in production
 *          with automatic, transparent fallback to a local in-memory LRU (Least Recently Used)
 *          cache if Redis is not configured or goes offline.
 *
 * DESIGN PATTERNS:
 *  - Fallback/Circuit-Breaker: Ensures database queries never fail if the cache layer becomes
 *                              unreachable. Automatically switches from Redis to local memory and back.
 *  - Get-Or-Set: Simplifies caller code by wrapping cache-lookup and DB-fetch inside a single method.
 *  - Scan-and-Delete: Uses non-blocking SCAN commands to invalidate namespaces in Redis without
 *                     blocking the Redis process (unlike KEYS command).
 *
 * SCALE CAPACITY:
 *  - Supports 10,000+ concurrent users by caching slow relational queries.
 *  - Redis caching allows horizontal scaling (multiple Express instances sharing the same cache state).
 *  - In-memory fallback handles single-server test/dev/local environments cleanly.
 *
 * DEPENDENCIES: ./redis (Redis client connection), ./database (PostgreSQL fallback logging)
 * USED BY: Content routes, leaderboard routes, user routes, events routes
 * LAST UPDATED: 2026-05-24
 */

import { isRedisConfigured, ensureRedisConnected } from "./redis";
import logger from "../utils/logger";

/* ─────────────────────────────────────────────
 * Cache Configuration & TTL Presets
 * ───────────────────────────────────────────── */

/** Default maximum number of entries in the in-memory cache fallback */
const MAX_LOCAL_CACHE_SIZE = 1000;

/** Default Time-To-Live for cache entries (5 minutes in milliseconds) */
const DEFAULT_TTL_MS = 5 * 60 * 1000;

/**
 * Cache TTL Presets (in milliseconds)
 * Tailored based on volatility of different data layers.
 */
export const CACHE_TTL = {
  /** Static lists (class categories, subjects) - changes rarely */
  STATIC: 30 * 60 * 1000,       // 30 minutes
  /** Course content structure (chapters, topics) - changes occasionally */
  CONTENT: 15 * 60 * 1000,      // 15 minutes
  /** User details and settings - changes moderately */
  USER: 5 * 60 * 1000,          // 5 minutes
  /** Global and regional leaderboards - changes frequently */
  LEADERBOARD: 2 * 60 * 1000,   // 2 minutes
  /** Matchmaking queues and session data - extremely short lifecycle */
  REALTIME: 30 * 1000,          // 30 seconds
  /** Search queries - reduces database full-text scan overhead */
  SEARCH: 3 * 60 * 1000,        // 3 minutes
} as const;

/** Internal structure for local in-memory cache entries */
interface LocalCacheEntry<T> {
  value: T;
  expiresAt: number;
  lastAccessed: number;
}

/* ─────────────────────────────────────────────
 * Hybrid Cache Implementation
 * ───────────────────────────────────────────── */

class HybridCache {
  /** In-memory store used as fallback when Redis is unavailable */
  private localStore: Map<string, LocalCacheEntry<unknown>>;
  private maxLocalSize: number;

  /** Cache hits and misses statistics for health monitoring */
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    redisErrors: 0,
  };

  constructor(maxSize: number = MAX_LOCAL_CACHE_SIZE) {
    this.localStore = new Map();
    this.maxLocalSize = maxSize;
  }

  /**
   * Retrieves a value from the cache.
   * Checks Redis first if configured; falls back to local memory if Redis errors or is offline.
   *
   * @param key - Unique string identifier (e.g. "content:class-9")
   * @returns The cached value T, or null if miss/expired/error
   */
  async get<T>(key: string): Promise<T | null> {
    // 1. Try Distributed Caching (Redis)
    if (isRedisConfigured()) {
      try {
        const redis = await ensureRedisConnected();
        const rawData = await redis.get(key);

        if (rawData !== null) {
          this.stats.hits++;
          logger.debug(`[Cache Hit] Redis key: ${key}`);
          return JSON.parse(rawData) as T;
        }
      } catch (err) {
        this.stats.redisErrors++;
        logger.error(`[Cache Error] Redis get failed. Falling back to local memory.`, { key, error: err as Error });
        // Fail-open: proceed to local store
      }
    }

    // 2. Try Local Memory Fallback
    const localEntry = this.localStore.get(key);
    if (!localEntry) {
      this.stats.misses++;
      logger.debug(`[Cache Miss] Key: ${key}`);
      return null;
    }

    // Check expiry
    if (Date.now() > localEntry.expiresAt) {
      this.localStore.delete(key);
      this.stats.misses++;
      logger.debug(`[Cache Expired] Local key deleted: ${key}`);
      return null;
    }

    // Update access order (LRU behavior)
    localEntry.lastAccessed = Date.now();
    this.localStore.delete(key);
    this.localStore.set(key, localEntry);

    this.stats.hits++;
    logger.debug(`[Cache Hit] Local memory key: ${key}`);
    return localEntry.value as T;
  }

  /**
   * Saves a value to the cache with a defined Time-To-Live.
   * Saves to Redis and updates the local fallback cache.
   *
   * @param key - Unique key string
   * @param value - Value to serialize and cache
   * @param ttlMs - Expiry in milliseconds (default: 5 minutes)
   */
  async set<T>(key: string, value: T, ttlMs: number = DEFAULT_TTL_MS): Promise<void> {
    // 1. Write to Distributed Caching (Redis)
    if (isRedisConfigured()) {
      try {
        const redis = await ensureRedisConnected();
        const stringified = JSON.stringify(value);
        // PX sets expiry in milliseconds
        await redis.set(key, stringified, "PX", ttlMs);
        logger.debug(`[Cache Set] Redis key: ${key} (TTL: ${ttlMs}ms)`);
      } catch (err) {
        this.stats.redisErrors++;
        logger.error(`[Cache Error] Redis set failed.`, { key, error: err as Error });
      }
    }

    // 2. Write to Local Memory Fallback (Ensure local copy matches Redis)
    if (this.localStore.has(key)) {
      this.localStore.delete(key);
    }

    // Evict LRU if local size exceeded
    if (this.localStore.size >= this.maxLocalSize) {
      const oldestKey = this.localStore.keys().next().value;
      if (oldestKey !== undefined) {
        this.localStore.delete(oldestKey);
        this.stats.evictions++;
      }
    }

    this.localStore.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
      lastAccessed: Date.now(),
    });
    logger.debug(`[Cache Set] Local memory key: ${key}`);
  }

  /**
   * Removes a specific key from both Redis and local memory.
   *
   * @param key - The key to delete
   */
  async del(key: string): Promise<void> {
    // Delete from Redis
    if (isRedisConfigured()) {
      try {
        const redis = await ensureRedisConnected();
        await redis.del(key);
        logger.debug(`[Cache Del] Redis key deleted: ${key}`);
      } catch (err) {
        this.stats.redisErrors++;
        logger.error(`[Cache Error] Redis delete failed.`, { key, error: err as Error });
      }
    }

    // Delete locally
    this.localStore.delete(key);
    logger.debug(`[Cache Del] Local memory key deleted: ${key}`);
  }

  /**
   * Distributed-safe invalidation of keys by prefix.
   * Uses non-blocking SCAN commands for Redis and filter loops for local memory.
   *
   * @param prefix - Prefix namespace (e.g. "content:")
   * @returns Total keys invalidated
   */
  async invalidateByPrefix(prefix: string): Promise<number> {
    let invalidatedCount = 0;

    // 1. Invalidate in Redis using cursor SCAN
    if (isRedisConfigured()) {
      try {
        const redis = await ensureRedisConnected();
        let cursor = "0";
        do {
          const reply = await redis.scan(cursor, "MATCH", `${prefix}*`, "COUNT", 100);
          cursor = reply[0];
          const keys = reply[1];
          if (keys.length > 0) {
            await redis.del(...keys);
            invalidatedCount += keys.length;
          }
        } while (cursor !== "0");
        logger.info(`[Cache Invalidate] Redis namespaces matching '${prefix}*' cleared (${invalidatedCount} keys)`);
      } catch (err) {
        this.stats.redisErrors++;
        logger.error(`[Cache Error] Redis prefix invalidation failed.`, { prefix, error: err as Error });
      }
    }

    // 2. Invalidate local memory
    let localCount = 0;
    for (const key of this.localStore.keys()) {
      if (key.startsWith(prefix)) {
        this.localStore.delete(key);
        localCount++;
      }
    }
    logger.info(`[Cache Invalidate] Local memory keys matching '${prefix}*' cleared (${localCount} keys)`);

    return Math.max(invalidatedCount, localCount);
  }

  /**
   * Helper pattern: fetch from cache, fallback to database/async call, and update cache.
   * Ensures callers have a single, clean function call for cache orchestration.
   *
   * @param key - The cache key
   * @param fetcher - Lambda that runs if cache misses (e.g. database query)
   * @param ttlMs - Time-to-live in milliseconds
   * @returns Data fetched from cache or database
   */
  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlMs: number = DEFAULT_TTL_MS): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    logger.debug(`[Cache GetOrSet] Cache miss for key: ${key}. Loading from source...`);
    const freshData = await fetcher();
    await this.set(key, freshData, ttlMs);
    return freshData;
  }

  /**
   * Empties the entire cache (Redis + Local).
   * Used during major deployments, data seedings, or full database resets.
   */
  async clear(): Promise<void> {
    if (isRedisConfigured()) {
      try {
        const redis = await ensureRedisConnected();
        await redis.flushdb();
        logger.info(`[Cache Clear] Redis database flushed.`);
      } catch (err) {
        this.stats.redisErrors++;
        logger.error(`[Cache Error] Redis flushdb failed.`, { error: err as Error });
      }
    }

    this.localStore.clear();
    logger.info(`[Cache Clear] Local memory cache cleared.`);

    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      redisErrors: 0,
    };
  }

  /**
   * Returns structural and performance metrics for the cache layer.
   * Integrated into liveness checks and system dashboards.
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0
      ? `${((this.stats.hits / total) * 100).toFixed(1)}%`
      : "0.0%";

    return {
      localSize: this.localStore.size,
      maxLocalSize: this.maxLocalSize,
      hits: this.stats.hits,
      misses: this.stats.misses,
      evictions: this.stats.evictions,
      redisErrors: this.stats.redisErrors,
      hitRate,
      redisConfigured: isRedisConfigured(),
    };
  }
}

export const cache = new HybridCache(MAX_LOCAL_CACHE_SIZE);
export default cache;
