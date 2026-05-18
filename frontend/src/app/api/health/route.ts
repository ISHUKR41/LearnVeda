/**
 * FILE: route.ts
 * LOCATION: src/app/api/health/route.ts
 * PURPOSE: Lightweight health-check endpoint for deployment platforms,
 *          uptime monitors, and smoke tests.
 * USED BY: Production monitoring and local verification
 * DEPENDENCIES: API response helper
 * LAST UPDATED: 2026-05-11
 */

import { apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";
import { getRuntimeHealthSnapshot } from "@/lib/server/observability/runtime-health";

export const runtime = "nodejs";

/** Returns process health and timestamp without exposing sensitive details. */
export async function GET() {
  const backend = await getRuntimeHealthSnapshot();

  return apiSuccess({
    status: backend.readiness.status === "ready" ? "ok" : "degraded",
    service: "eduquest-web",
    checkedAt: new Date().toISOString(),
    backend,
  }, { headers: NO_STORE_HEADERS });
}
