/**
 * FILE: route.ts
 * LOCATION: src/app/api/auth/me/route.ts
 * PURPOSE: Returns the currently authenticated user from the signed session
 *          cookie. Frontend surfaces can call this to hydrate account state.
 * USED BY: Future auth provider, dashboard widgets, profile/settings pages
 * DEPENDENCIES: current-user helper and API response helpers
 * LAST UPDATED: 2026-05-11
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { apiError, apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/** Returns the public account profile for the active session. */
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError("UNAUTHENTICATED", "Please sign in to continue.", 401, undefined, NO_STORE_HEADERS);
  }

  return apiSuccess({ user }, { headers: NO_STORE_HEADERS });
}
