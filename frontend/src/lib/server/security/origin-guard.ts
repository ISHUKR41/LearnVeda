/**
 * FILE: origin-guard.ts
 * LOCATION: src/lib/server/security/origin-guard.ts
 * PURPOSE: Same-origin protection for cookie-authenticated write requests.
 *          SameSite=Lax helps browsers, but explicit Origin/Referer checks add
 *          a clear backend boundary before profile, auth, event, and battle
 *          mutations accept a request.
 * USED BY: Sensitive POST/PATCH API route handlers
 * DEPENDENCIES: next/server, api-response helpers
 * LAST UPDATED: 2026-05-19
 */

import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";
import { apiError, NO_STORE_HEADERS, type ApiFailure } from "@/lib/server/utils/api-response";

/** Returns the request's origin from Origin, Referer, or the request URL itself. */
function getRequestOrigin(request: NextRequest): string | null {
  const origin = request.headers.get("origin");

  if (origin) {
    return origin;
  }

  const referer = request.headers.get("referer");

  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      return null;
    }
  }

  return request.nextUrl.origin;
}

/**
 * Blocks cross-site write attempts.
 * API clients without browser Origin/Referer still pass when the request URL is
 * the same origin, which keeps local smoke tests and server-to-server jobs sane.
 */
export function requireSameOriginRequest(request: NextRequest): NextResponse<ApiFailure> | null {
  const requestOrigin = getRequestOrigin(request);

  if (!requestOrigin || requestOrigin !== request.nextUrl.origin) {
    return apiError(
      "INVALID_ORIGIN",
      "This action must be submitted from the EduQuest website.",
      403,
      undefined,
      NO_STORE_HEADERS,
    );
  }

  return null;
}
