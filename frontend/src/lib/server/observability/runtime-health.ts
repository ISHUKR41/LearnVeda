/**
 * FILE: runtime-health.ts
 * LOCATION: src/lib/server/observability/runtime-health.ts
 * PURPOSE: Builds a safe backend readiness snapshot for the health endpoint.
 *          It reports which runtime adapters are active without exposing secrets.
 * USED BY: src/app/api/health/route.ts
 * DEPENDENCIES: database/cache probes, repository adapter selection, rate limiter selection
 * LAST UPDATED: 2026-05-12
 */

import { isRedisConfigured, probeRedis } from "@/lib/server/cache/redis";
import { isPostgresConfigured, probePostgres } from "@/lib/server/database/postgres";
import { getPersistenceAdapterName } from "@/lib/server/repositories/get-platform-repository";
import { getRateLimiterAdapterName } from "@/lib/server/security/rate-limit";

export interface RuntimeHealthSnapshot {
  environment: "development" | "production" | "test";
  activeAdapters: {
    persistence: "json-file-mvp" | "postgresql";
    rateLimiter: "memory-fixed-window" | "redis-fixed-window";
    session: "signed-http-only-cookie";
  };
  productionConfig: {
    sessionSecretConfigured: boolean;
    databaseUrlConfigured: boolean;
    redisUrlConfigured: boolean;
  };
  connectivity: {
    postgresReachable: boolean;
    redisReachable: boolean;
  };
  scalingReadiness: {
    multiInstancePersistenceReady: boolean;
    distributedRateLimitReady: boolean;
    recommendedNextStep: string;
  };
  readiness: {
    status: "ready" | "degraded" | "blocked";
    blockers: string[];
  };
}

/** Normalizes NODE_ENV into the values we expose from the public health route. */
function getRuntimeEnvironment(): RuntimeHealthSnapshot["environment"] {
  if (process.env.NODE_ENV === "production") {
    return "production";
  }

  if (process.env.NODE_ENV === "test") {
    return "test";
  }

  return "development";
}

/** Checks that the configured session secret is not the documented placeholder. */
function hasStrongSessionSecret(): boolean {
  const secret = process.env.EDUQUEST_SESSION_SECRET;
  return Boolean(secret && secret.length >= 32 && !secret.includes("replace-with"));
}

/** Returns non-secret backend readiness signals for uptime checks and release reviews. */
export async function getRuntimeHealthSnapshot(): Promise<RuntimeHealthSnapshot> {
  const environment = getRuntimeEnvironment();
  const persistenceAdapter = getPersistenceAdapterName();
  const rateLimiterAdapter = getRateLimiterAdapterName();
  const sessionSecretConfigured = hasStrongSessionSecret();
  const databaseUrlConfigured = isPostgresConfigured();
  const redisUrlConfigured = isRedisConfigured();
  const postgresReachable = persistenceAdapter === "postgresql" ? await probePostgres() : false;
  const redisReachable = rateLimiterAdapter === "redis-fixed-window" ? await probeRedis() : false;
  const multiInstancePersistenceReady = persistenceAdapter === "postgresql" && postgresReachable;
  const distributedRateLimitReady = rateLimiterAdapter === "redis-fixed-window" && redisReachable;
  const blockers = [
    !sessionSecretConfigured ? "EDUQUEST_SESSION_SECRET must be configured with a strong non-placeholder value." : "",
    persistenceAdapter !== "postgresql" ? "EDUQUEST_PERSISTENCE_ADAPTER is not set to postgres." : "",
    persistenceAdapter === "postgresql" && !databaseUrlConfigured ? "DATABASE_URL is not configured." : "",
    persistenceAdapter === "postgresql" && databaseUrlConfigured && !postgresReachable ? "PostgreSQL is configured but not reachable." : "",
    rateLimiterAdapter !== "redis-fixed-window" ? "EDUQUEST_RATE_LIMIT_ADAPTER is not set to redis." : "",
    rateLimiterAdapter === "redis-fixed-window" && !redisUrlConfigured ? "REDIS_URL is not configured." : "",
    rateLimiterAdapter === "redis-fixed-window" && redisUrlConfigured && !redisReachable ? "Redis is configured but not reachable." : "",
  ].filter(Boolean);
  const readinessStatus =
    blockers.length === 0
      ? "ready"
      : environment === "production"
        ? "blocked"
        : "degraded";

  return {
    environment,
    activeAdapters: {
      persistence: persistenceAdapter,
      rateLimiter: rateLimiterAdapter,
      session: "signed-http-only-cookie",
    },
    productionConfig: {
      sessionSecretConfigured,
      databaseUrlConfigured,
      redisUrlConfigured,
    },
    connectivity: {
      postgresReachable,
      redisReachable,
    },
    scalingReadiness: {
      multiInstancePersistenceReady,
      distributedRateLimitReady,
      recommendedNextStep:
        multiInstancePersistenceReady && distributedRateLimitReady
          ? "Run production smoke tests, then promote the deployment behind monitoring."
          : "Enable PostgreSQL persistence and Redis rate limiting before multi-instance production traffic.",
    },
    readiness: {
      status: readinessStatus,
      blockers,
    },
  };
}
