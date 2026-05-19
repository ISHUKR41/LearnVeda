/**
 * FILE: route.ts
 * LOCATION: src/app/api/auth/sign-out/route.ts
 * PURPOSE: Clears the signed session cookie. This route keeps logout behavior
 *          centralized and works for all future account surfaces.
 * USED BY: Navbar account actions and future settings page
 * DEPENDENCIES: session cookie helper, origin guard, API response helper
 * LAST UPDATED: 2026-05-19
 */

import type { NextRequest } from "next/server";
import { clearSessionCookie } from "@/lib/server/auth/session";
import { requireSameOriginRequest } from "@/lib/server/security/origin-guard";
import { apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/** Clears the session cookie and confirms sign-out to the client. */
export async function POST(request: NextRequest) {
  const originError = requireSameOriginRequest(request);

  if (originError) {
    return originError;
  }

  const response = apiSuccess({ signedOut: true }, { message: "Signed out successfully.", headers: NO_STORE_HEADERS });
  clearSessionCookie(response);
  return response;
}
