/**
 * FILE: route.ts
 * LOCATION: src/app/api/auth/change-password/route.ts
 * PURPOSE: Authenticated password-change endpoint.
 *          Accepts the current password and the desired new password,
 *          verifies the current password against the stored argon2id hash,
 *          and replaces it with a newly hashed version.
 *
 *          Security controls:
 *          - Session cookie required — 401 if missing or expired
 *          - Current password is verified with argon2.verify before any change
 *          - New password must be ≥ 8 characters
 *          - New and current password must differ
 *          - The new hash is written atomically in a single UPDATE query
 *          - No plain-text passwords are ever logged or stored
 *
 * USED BY: src/app/settings/page.tsx (Security section → change password form)
 * DEPENDENCIES: getAuthenticatedUser, argon2, postgres pool, api-response utils
 * LAST UPDATED: 2026-05-18
 */

import type { NextRequest } from "next/server";
import { hashPassword, verifyPassword } from "@/lib/server/auth/password";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { getPostgresPool } from "@/lib/server/database/postgres";
import { apiError, apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/* ─────────────────────────────────────────────
 * POST /api/auth/change-password
 * ───────────────────────────────────────────── */

/**
 * POST /api/auth/change-password
 *
 * Request body:
 *   { "currentPassword": "...", "newPassword": "..." }
 *
 * Response on success:
 *   { ok: true, data: { message: "Password changed." } }
 *
 * Possible error codes:
 *   UNAUTHENTICATED     — no valid session cookie
 *   INVALID_JSON        — malformed request body
 *   MISSING_FIELDS      — currentPassword or newPassword not provided
 *   PASSWORD_TOO_SHORT  — newPassword is fewer than 8 characters
 *   SAME_PASSWORD       — newPassword is identical to currentPassword
 *   WRONG_PASSWORD      — currentPassword does not match the stored hash
 *   UPDATE_FAILED       — database error while writing the new hash
 */
export async function POST(request: NextRequest) {
  /* ── 1. Verify the session ── */
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError(
      "UNAUTHENTICATED",
      "Please sign in to change your password.",
      401,
      undefined,
      NO_STORE_HEADERS,
    );
  }

  /* ── 2. Parse the request body ── */
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError("INVALID_JSON", "Request body must be valid JSON.", 400, undefined, NO_STORE_HEADERS);
  }

  const { currentPassword, newPassword } = body as {
    currentPassword?: unknown;
    newPassword?: unknown;
  };

  /* ── 3. Input validation ── */
  if (typeof currentPassword !== "string" || !currentPassword) {
    return apiError("MISSING_FIELDS", "currentPassword is required.", 400, undefined, NO_STORE_HEADERS);
  }

  if (typeof newPassword !== "string" || !newPassword) {
    return apiError("MISSING_FIELDS", "newPassword is required.", 400, undefined, NO_STORE_HEADERS);
  }

  if (newPassword.length < 8) {
    return apiError(
      "PASSWORD_TOO_SHORT",
      "New password must be at least 8 characters.",
      400,
      undefined,
      NO_STORE_HEADERS,
    );
  }

  if (newPassword === currentPassword) {
    return apiError(
      "SAME_PASSWORD",
      "New password must be different from your current password.",
      400,
      undefined,
      NO_STORE_HEADERS,
    );
  }

  const pool = getPostgresPool();

  try {
    /* ── 4. Fetch the current password hash from the database ── */
    const hashResult = await pool.query<{ password_hash: string }>(
      "SELECT password_hash FROM eduquest_users WHERE id = $1",
      [user.id],
    );

    if (hashResult.rows.length === 0) {
      /* Should not happen — session is always tied to a real user */
      return apiError("USER_NOT_FOUND", "User record not found.", 404, undefined, NO_STORE_HEADERS);
    }

    const storedHash = hashResult.rows[0].password_hash;

    /*
     * Skip verification for seeded demo accounts whose hash is a placeholder
     * string that verifyPassword would reject outright.
     */
    if (storedHash.includes("DEMO_PLACEHOLDER")) {
      return apiError(
        "WRONG_PASSWORD",
        "Incorrect current password.",
        401,
        undefined,
        NO_STORE_HEADERS,
      );
    }

    /* ── 5. Verify the current password using verifyPassword ── */
    const isValid = await verifyPassword(currentPassword, storedHash);

    if (!isValid) {
      return apiError(
        "WRONG_PASSWORD",
        "Incorrect current password.",
        401,
        undefined,
        NO_STORE_HEADERS,
      );
    }

    /* ── 6. Hash the new password with scrypt ── */
    const newHash = await hashPassword(newPassword);

    /* ── 7. Write the new hash to the database ── */
    await pool.query(
      "UPDATE eduquest_users SET password_hash = $1 WHERE id = $2",
      [newHash, user.id],
    );

    return apiSuccess(
      { message: "Password changed successfully." },
      { status: 200, headers: NO_STORE_HEADERS },
    );

  } catch (err) {
    /* Log server-side but return a safe message to the client */
    console.error("[POST /api/auth/change-password] Error:", err);

    return apiError(
      "UPDATE_FAILED",
      "Failed to change password. Please try again.",
      500,
      undefined,
      NO_STORE_HEADERS,
    );
  }
}
