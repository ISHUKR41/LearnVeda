/**
 * FILE: route.ts
 * LOCATION: src/app/api/battles/route.ts
 * PURPOSE: Safe battle summary endpoint. Match creation must happen through
 *          /api/battle/matchmaking so the backend uses the authenticated user
 *          instead of trusting a userId sent by the browser.
 * USED BY: Battle page statistics and legacy route compatibility
 * DEPENDENCIES: current-user helper, battle service, API response helpers
 * LAST UPDATED: 2026-05-16
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { getBattleSummaryForUser } from "@/lib/server/services/battle-service";
import { apiError, apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/** Returns battle statistics derived from the signed-in user's stored tickets. */
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError("UNAUTHENTICATED", "Please sign in to view battle data.", 401, undefined, NO_STORE_HEADERS);
  }

  const summary = await getBattleSummaryForUser(user.id);
  return apiSuccess({ summary }, { headers: NO_STORE_HEADERS });
}

/** Blocks unsafe direct battle creation with browser-supplied user ids. */
export async function POST() {
  return apiError(
    "USE_MATCHMAKING",
    "Create battle queue tickets through /api/battle/matchmaking so the user comes from the secure session.",
    405,
    undefined,
    { ...NO_STORE_HEADERS, Allow: "GET" },
  );
}
