/**
 * FILE: route.ts
 * LOCATION: src/app/api/events/route.ts
 * PURPOSE: Events catalog API. It returns the shared public event catalog plus
 *          the signed-in student's registration state when a session exists.
 *          Event creation is intentionally blocked here until the organizer
 *          portal has role checks, validation, moderation, and audit review.
 * USED BY: src/app/events/EventsClient.tsx
 * DEPENDENCIES: current-user helper, events service, API response helpers
 * LAST UPDATED: 2026-05-16
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { buildEventCatalogSnapshot } from "@/lib/server/services/events-service";
import { apiError, apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/** Returns event cards and the current user's registration ids when available. */
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  const snapshot = await buildEventCatalogSnapshot(user?.id);

  return apiSuccess(snapshot, { headers: NO_STORE_HEADERS });
}

/** Blocks unaudited public event creation until the organizer portal is ready. */
export async function POST() {
  return apiError(
    "ORGANIZER_PORTAL_REQUIRED",
    "Create events through the organizer portal after role checks and audit logging are enabled.",
    405,
    undefined,
    { ...NO_STORE_HEADERS, Allow: "GET" },
  );
}
