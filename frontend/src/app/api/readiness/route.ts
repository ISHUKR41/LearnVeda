/**
 * FILE: route.ts
 * LOCATION: src/app/api/readiness/route.ts
 * PURPOSE: Deployment readiness endpoint. Unlike the liveness-focused health
 *          route, this endpoint returns 503 in production when the configured
 *          backend is not ready for a serious multi-instance release.
 * USED BY: CI smoke tests, deployment gates, infrastructure monitors
 * DEPENDENCIES: runtime health snapshot, shared API response helper
 * LAST UPDATED: 2026-05-12
 */

import { apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";
import { getRuntimeHealthSnapshot } from "@/lib/server/observability/runtime-health";

export const runtime = "nodejs";

/** Returns a machine-readable readiness report for deployment gates. */
export async function GET() {
  const backend = await getRuntimeHealthSnapshot();
  const shouldFailProductionGate =
    backend.environment === "production" && backend.readiness.status !== "ready";

  return apiSuccess(
    {
      status: backend.readiness.status,
      service: "eduquest-web",
      checkedAt: new Date().toISOString(),
      backend,
    },
    {
      status: shouldFailProductionGate ? 503 : 200,
      headers: NO_STORE_HEADERS,
    },
  );
}
