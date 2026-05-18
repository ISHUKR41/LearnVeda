/**
 * FILE: route.ts
 * LOCATION: src/app/api/auth/sign-out/route.ts
 * PURPOSE: Clears the signed session cookie. This route keeps logout behavior
 *          centralized and works for all future account surfaces.
 * USED BY: Navbar account actions and future settings page
 * DEPENDENCIES: session cookie helper and API response helper
 * LAST UPDATED: 2026-05-11
 */

import { clearSessionCookie } from "@/lib/server/auth/session";
import { apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/** Clears the session cookie and confirms sign-out to the client. */
export async function POST() {
  const response = apiSuccess({ signedOut: true }, { message: "Signed out successfully.", headers: NO_STORE_HEADERS });
  clearSessionCookie(response);
  return response;
}
