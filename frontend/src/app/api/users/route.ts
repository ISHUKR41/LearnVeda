/**
 * FILE: route.ts
 * LOCATION: src/app/api/users/route.ts
 * PURPOSE: Safe user lookup endpoint for authenticated account surfaces.
 *          This route never returns password hashes and no longer accepts
 *          direct public user creation. New accounts must go through
 *          /api/auth/sign-up so passwords are validated and hashed correctly.
 * USED BY: Future profile/settings/admin surfaces
 * DEPENDENCIES: current-user helper, repository adapter, API response helpers
 * LAST UPDATED: 2026-05-16
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { getPlatformRepository } from "@/lib/server/repositories/get-platform-repository";
import { apiError, apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/** Returns the current user, or an admin-approved lookup by email. */
export async function GET(request: NextRequest) {
  const currentUser = await getAuthenticatedUser(request);

  if (!currentUser) {
    return apiError("UNAUTHENTICATED", "Please sign in to view user data.", 401, undefined, NO_STORE_HEADERS);
  }

  const { searchParams } = new URL(request.url);
  const requestedEmail = searchParams.get("email")?.trim().toLowerCase();

  if (!requestedEmail || requestedEmail === currentUser.email) {
    return apiSuccess({ user: currentUser }, { headers: NO_STORE_HEADERS });
  }

  /*
   * Only admins may search for another user. This protects student email,
   * progress, and role data from enumeration by normal accounts.
   */
  if (currentUser.role !== "admin") {
    return apiError("FORBIDDEN", "Only admins can look up another user.", 403, undefined, NO_STORE_HEADERS);
  }

  const repository = getPlatformRepository();
  const storedUser = await repository.users.findByEmail(requestedEmail);

  if (!storedUser) {
    return apiError("USER_NOT_FOUND", "No user exists for that email.", 404, undefined, NO_STORE_HEADERS);
  }

  return apiSuccess({ user: repository.users.toPublic(storedUser) }, { headers: NO_STORE_HEADERS });
}

/** Blocks unsafe direct user creation and points clients to the validated auth flow. */
export async function POST() {
  return apiError(
    "USE_AUTH_SIGN_UP",
    "Create users through /api/auth/sign-up so passwords are validated, hashed, and audited.",
    405,
    undefined,
    { ...NO_STORE_HEADERS, Allow: "GET" },
  );
}
