/**
 * FILE: route.ts
 * LOCATION: src/app/api/events/register/route.ts
 * PURPOSE: Protected event registration API. It validates event ids against the
 *          shared event catalog and stores one registration per user/event.
 * USED BY: src/app/events/EventsClient.tsx
 * DEPENDENCIES: current-user, event catalog, platform-store, validation schemas
 * LAST UPDATED: 2026-05-11
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { registerStudentForEvent } from "@/lib/server/services/events-service";
import { checkRateLimit, getClientKey } from "@/lib/server/security/rate-limit";
import { apiError, apiSuccess, NO_STORE_HEADERS, readJsonBody } from "@/lib/server/utils/api-response";
import { eventRegistrationSchema } from "@/lib/validation/auth";

export const runtime = "nodejs";

/** Registers the current user for a live/upcoming event. */
export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError("UNAUTHENTICATED", "Please sign in before registering for an event.", 401, undefined, NO_STORE_HEADERS);
  }

  const rateLimit = await checkRateLimit({
    key: getClientKey(request, `events:register:${user.id}`),
    limit: 20,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return apiError(
      "RATE_LIMITED",
      `Too many registration requests. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
      429,
      undefined,
      { ...NO_STORE_HEADERS, "Retry-After": rateLimit.retryAfterSeconds.toString() },
    );
  }

  const parsed = eventRegistrationSchema.safeParse(await readJsonBody(request));

  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Please select a valid event.", 422, parsed.error.flatten());
  }

  try {
    const registration = await registerStudentForEvent(user.id, parsed.data);
    return apiSuccess(
      { registration },
      { status: 201, message: "Event registration saved.", headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "EVENT_NOT_AVAILABLE") {
      return apiError("EVENT_NOT_AVAILABLE", "This event is not available for registration.", 400);
    }

    throw error;
  }
}
