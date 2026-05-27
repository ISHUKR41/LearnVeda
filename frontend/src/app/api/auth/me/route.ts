/**
 * FILE: route.ts
 * LOCATION: src/app/api/auth/me/route.ts
 * PURPOSE: Returns the currently authenticated user's public profile.
 *          Works with BOTH auth strategies:
 *            1. Clerk session (primary) — resolved via @clerk/nextjs/server auth()
 *            2. Legacy session cookie (fallback) — from the signed eduquest_session cookie
 *          Frontend components (Navbar, Dashboard, Profile) call this endpoint
 *          to hydrate the user's account state on the client side.
 * USED BY: Navbar.tsx session check, DashboardClient.tsx, ProfileClient.tsx
 * DEPENDENCIES: current-user helper (which bridges Clerk + legacy auth), API response helpers
 * LAST UPDATED: 2026-05-27
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { apiError, apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

/* Force Node.js runtime so we can use Clerk's server-side auth() */
export const runtime = "nodejs";

/**
 * GET /api/auth/me
 * Returns the public account profile for the active session.
 * The getAuthenticatedUser helper tries Clerk first, then legacy cookie.
 * 
 * Response shapes:
 *   200: { status: "success", data: { user: PublicUser } }
 *   401: { status: "error", code: "UNAUTHENTICATED", message: "..." }
 */
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError(
      "UNAUTHENTICATED",
      "Please sign in to continue.",
      401,
      undefined,
      NO_STORE_HEADERS,
    );
  }

  return apiSuccess({ user }, { headers: NO_STORE_HEADERS });
}
