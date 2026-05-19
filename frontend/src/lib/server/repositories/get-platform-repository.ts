/**
 * FILE: get-platform-repository.ts
 * LOCATION: src/lib/server/repositories/get-platform-repository.ts
 * PURPOSE: Single backend storage entry point. Services call this getter so the
 *          concrete adapter can change without route-level or service-level
 *          rewrites. Production intentionally fails closed to PostgreSQL.
 * USED BY: Backend services and current-user lookup
 * LAST UPDATED: 2026-05-19
 */

import { jsonPlatformRepository } from "@/lib/server/repositories/json-platform-repository";
import { postgresPlatformRepository } from "@/lib/server/repositories/postgres-platform-repository";
import type { PlatformRepository } from "@/lib/server/repositories/platform-repository";

export type PersistenceAdapterName = "json-file-mvp" | "postgresql";

/**
 * Resolves which persistence adapter this runtime should use.
 * Production only allows PostgreSQL because local JSON files are not safe for
 * multiple server instances, deploy rollbacks, or real student data. Local
 * development keeps the JSON adapter by default so the app remains easy to run.
 */
export function getPersistenceAdapterName(): PersistenceAdapterName {
  if (process.env.NODE_ENV === "production" && process.env.EDUQUEST_PERSISTENCE_ADAPTER === "json") {
    throw new Error("The JSON persistence adapter is blocked in production. Set EDUQUEST_PERSISTENCE_ADAPTER=postgres.");
  }

  if (process.env.EDUQUEST_PERSISTENCE_ADAPTER === "postgres") {
    return "postgresql";
  }

  if (process.env.EDUQUEST_PERSISTENCE_ADAPTER === "json") {
    return "json-file-mvp";
  }

  if (process.env.NODE_ENV === "production") {
    return "postgresql";
  }

  return "json-file-mvp";
}

/** Returns the active repository adapter for the current deployment. */
export function getPlatformRepository(): PlatformRepository {
  if (getPersistenceAdapterName() === "postgresql") {
    return postgresPlatformRepository;
  }

  return jsonPlatformRepository;
}
