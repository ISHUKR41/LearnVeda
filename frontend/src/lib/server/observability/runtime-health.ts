/**
 * FILE: runtime-health.ts
 * LOCATION: src/lib/server/observability/runtime-health.ts
 * PURPOSE: Builds a safe backend readiness snapshot for the health endpoint.
 *          It reports runtime adapters, connectivity, and migration integrity
 *          without exposing secrets.
 * USED BY: src/app/api/health/route.ts
 * DEPENDENCIES: database/cache probes, migration checks, adapter selection
 * LAST UPDATED: 2026-05-19
 */

import { isRedisConfigured, probeRedis } from "@/lib/server/cache/redis";
import { getDatabaseMigrationStatus, type DatabaseMigrationStatus } from "@/lib/server/database/migration-status";
import { isPostgresConfigured, probePostgres } from "@/lib/server/database/postgres";
import { shouldAllowStaticFallbackData } from "@/lib/server/env";
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
    staticFallbacksAllowed: boolean;
  };
  connectivity: {
    postgresReachable: boolean;
    redisReachable: boolean;
  };
  database: {
    migrations: DatabaseMigrationStatus;
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
  const staticFallbacksAllowed = shouldAllowStaticFallbackData();
  const postgresReachable = persistenceAdapter === "postgresql" ? await probePostgres() : false;
  const redisReachable = rateLimiterAdapter === "redis-fixed-window" ? await probeRedis() : false;
  const migrations = persistenceAdapter === "postgresql"
    ? await getDatabaseMigrationStatus()
    : {
        available: false,
        expectedCount: 0,
        appliedCount: 0,
        pending: [],
        missingChecksums: [],
        checksumMismatches: [],
        unknownApplied: [],
        requiredTablesMissing: [],
      };
  const migrationsReady =
    persistenceAdapter === "postgresql"
    && migrations.available
    && migrations.pending.length === 0
    && migrations.missingChecksums.length === 0
    && migrations.checksumMismatches.length === 0
    && migrations.requiredTablesMissing.length === 0;
  const multiInstancePersistenceReady = persistenceAdapter === "postgresql" && postgresReachable;
  const distributedRateLimitReady = rateLimiterAdapter === "redis-fixed-window" && redisReachable;
  const blockers = [
    !sessionSecretConfigured ? "EDUQUEST_SESSION_SECRET must be configured with a strong non-placeholder value." : "",
    persistenceAdapter !== "postgresql" ? "EDUQUEST_PERSISTENCE_ADAPTER is not set to postgres." : "",
    persistenceAdapter === "postgresql" && !databaseUrlConfigured ? "DATABASE_URL is not configured." : "",
    persistenceAdapter === "postgresql" && databaseUrlConfigured && !postgresReachable ? "PostgreSQL is configured but not reachable." : "",
    persistenceAdapter === "postgresql" && postgresReachable && !migrations.available ? "Database migration status could not be read." : "",
    persistenceAdapter === "postgresql" && migrations.pending.length > 0 ? `Pending database migrations: ${migrations.pending.join(", ")}.` : "",
    persistenceAdapter === "postgresql" && migrations.missingChecksums.length > 0 ? `Database migrations missing checksums: ${migrations.missingChecksums.join(", ")}.` : "",
    persistenceAdapter === "postgresql" && migrations.checksumMismatches.length > 0 ? `Database migration checksum mismatch: ${migrations.checksumMismatches.join(", ")}.` : "",
    persistenceAdapter === "postgresql" && migrations.requiredTablesMissing.length > 0 ? `Required database tables missing: ${migrations.requiredTablesMissing.join(", ")}.` : "",
    rateLimiterAdapter !== "redis-fixed-window" ? "EDUQUEST_RATE_LIMIT_ADAPTER is not set to redis." : "",
    rateLimiterAdapter === "redis-fixed-window" && !redisUrlConfigured ? "REDIS_URL is not configured." : "",
    rateLimiterAdapter === "redis-fixed-window" && redisUrlConfigured && !redisReachable ? "Redis is configured but not reachable." : "",
    environment === "production" && staticFallbacksAllowed ? "Static fallback data is still allowed. Disable EDUQUEST_ALLOW_STATIC_FALLBACKS before public production traffic." : "",
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
      staticFallbacksAllowed,
    },
    connectivity: {
      postgresReachable,
      redisReachable,
    },
    database: {
      migrations,
    },
    scalingReadiness: {
      multiInstancePersistenceReady: multiInstancePersistenceReady && migrationsReady,
      distributedRateLimitReady,
      recommendedNextStep:
        multiInstancePersistenceReady && migrationsReady && distributedRateLimitReady
          ? "Run production smoke tests, then promote the deployment behind monitoring."
          : "Enable PostgreSQL persistence and Redis rate limiting before multi-instance production traffic.",
    },
    readiness: {
      status: readinessStatus,
      blockers,
    },
  };
}
