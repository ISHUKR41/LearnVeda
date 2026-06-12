/**
 * FILE: origin-guard.ts
 * LOCATION: src/lib/server/security/origin-guard.ts
 * PURPOSE: Same-origin protection for cookie-authenticated write requests.
 *          SameSite=Lax helps browsers; explicit Origin/Referer checks add a
 *          clear backend boundary before auth, battle, and profile mutations.
 *
 *          Replit proxy note: The app runs behind Replit's HTTPS proxy.
 *          The proxy rewrites the Host header to the public *.replit.dev domain,
 *          so request.nextUrl.origin already reflects the public URL. Browser
 *          fetch() sends Origin with that same public URL, so the check passes.
 *          In development (NODE_ENV !== 'production') we log mismatches but allow
 *          the request through so local smoke-tests and the Replit Preview panel
 *          never get 403'd by a spurious header variance.
 *
 * LAST UPDATED: 2026-06-01
 */

import type { NextRequest, NextResponse } from "next/server";
import { apiError, NO_STORE_HEADERS, type ApiFailure } from "@/lib/server/utils/api-response";

/** Extracts the origin of the incoming request from headers or URL. */
function getRequestOrigin(request: NextRequest): string | null {
  /* 1. Prefer the explicit Origin header set by all modern browsers. */
  const origin = request.headers.get("origin");
  if (origin && origin !== "null") return origin;

  /* 2. Fall back to the Referer header (present for form submissions). */
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      /* malformed Referer — ignore */
    }
  }

  /* 3. No browser origin headers at all (server-to-server, curl, etc.).
   *    Return the request's own origin so it trivially passes the same-origin check,
   *    which is safe because CSRF attacks always come FROM a different browser origin. */
  return request.nextUrl.origin;
}

/**
 * Returns a 403 response when the request origin differs from the app origin.
 * Returns null when the request is same-origin and should proceed.
 *
 * In development/Replit Preview mode: logs a warning but does NOT block,
 * to prevent 403 errors caused by proxy header variance.
 */
export function requireSameOriginRequest(
  request: NextRequest,
): NextResponse<ApiFailure> | null {
  const requestOrigin = getRequestOrigin(request);
  const appOrigin     = request.nextUrl.origin;

  /* Origins match — safe to proceed */
  if (requestOrigin === appOrigin) return null;

  /* Development / Replit environment: log the mismatch, but allow through.
   * This prevents broken sign-in/sign-up in the preview iframe. */
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[origin-guard] Origin mismatch (allowed in dev): request="${requestOrigin}" app="${appOrigin}"`,
    );
    return null;
  }

  /* Production: enforce strict same-origin */
  return apiError(
    "INVALID_ORIGIN",
    "This action must be submitted from the Learnova website.",
    403,
    undefined,
    NO_STORE_HEADERS,
  );
}
