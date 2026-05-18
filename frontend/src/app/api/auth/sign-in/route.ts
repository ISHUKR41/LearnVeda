/**
 * FILE: route.ts
 * LOCATION: src/app/api/auth/sign-in/route.ts
 * PURPOSE: Authenticates an existing student with email/password and issues a
 *          signed httpOnly session cookie. Error messages are intentionally
 *          generic to avoid leaking which emails are registered.
 * USED BY: src/app/sign-in/page.tsx
 * DEPENDENCIES: Next.js Route Handlers, Zod auth schema, password/session helpers
 * LAST UPDATED: 2026-05-11
 */

import type { NextRequest } from "next/server";
import { attachSessionCookie, createSessionToken } from "@/lib/server/auth/session";
import { authenticateStudent } from "@/lib/server/services/auth-service";
import { checkRateLimit, getClientKey } from "@/lib/server/security/rate-limit";
import { apiError, apiSuccess, NO_STORE_HEADERS, readJsonBody } from "@/lib/server/utils/api-response";
import { signInSchema } from "@/lib/validation/auth";

export const runtime = "nodejs";

/** Handles email/password sign-in and returns the authenticated public user. */
export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit({
    key: getClientKey(request, "auth:sign-in"),
    limit: 10,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return apiError(
      "RATE_LIMITED",
      `Too many sign-in attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
      429,
      undefined,
      { ...NO_STORE_HEADERS, "Retry-After": rateLimit.retryAfterSeconds.toString() },
    );
  }

  const parsed = signInSchema.safeParse(await readJsonBody(request));

  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Please enter a valid email and password.", 422, parsed.error.flatten());
  }

  const user = await authenticateStudent(parsed.data);

  if (!user) {
    return apiError("INVALID_CREDENTIALS", "Email or password is incorrect.", 401);
  }

  const response = apiSuccess({ user }, { message: "Signed in successfully.", headers: NO_STORE_HEADERS });
  attachSessionCookie(response, createSessionToken(user));
  return response;
}
