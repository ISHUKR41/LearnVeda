/**
 * FILE: logger.ts
 * LOCATION: src/lib/server/observability/logger.ts
 * PURPOSE: Shared structured logger for backend routes, services, and adapters.
 *          Pino emits JSON in production so logs can be searched, filtered, and
 *          shipped to external monitoring tools without fragile string parsing.
 * USED BY: Backend infrastructure and route handlers
 * DEPENDENCIES: pino
 * LAST UPDATED: 2026-05-12
 */

import pino from "pino";

type LoggerGlobal = typeof globalThis & {
  __eduquestLogger?: pino.Logger;
};

/**
 * Returns one process-level logger.
 * Keeping this singleton avoids noisy duplicate logger instances during local
 * hot reloads and keeps server logs consistent across backend modules.
 */
export function getLogger(): pino.Logger {
  const globalForLogger = globalThis as LoggerGlobal;

  globalForLogger.__eduquestLogger ??= pino({
    name: "eduquest-web",
    level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "production" ? "info" : "debug"),
    base: {
      service: "eduquest-web",
      environment: process.env.NODE_ENV ?? "development",
    },
  });

  return globalForLogger.__eduquestLogger;
}
