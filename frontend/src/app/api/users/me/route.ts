/**
 * FILE: route.ts
 * LOCATION: src/app/api/users/me/route.ts
 * PURPOSE: Authenticated user self-service PATCH and GET endpoint.
 *          GET  /api/users/me — returns the current user's full public profile
 *          PATCH /api/users/me — updates display name and/or learning track
 *
 *          This is the only endpoint that allows a user to mutate their own
 *          profile data without admin privileges. All changes are validated
 *          server-side and written to PostgreSQL atomically.
 *
 *          Security controls:
 *          - Session cookie required (401 if missing or expired)
 *          - Name: 1–60 characters, trimmed
 *          - Track: must be one of the five valid Zingpath learning tracks
 *          - All SQL queries use parameterised inputs (no SQL injection risk)
 *
 * USED BY: src/app/settings/page.tsx, src/app/profile/page.tsx
 * DEPENDENCIES: getAuthenticatedUser, postgres pool, api-response utils
 * LAST UPDATED: 2026-05-18
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { getPostgresPool } from "@/lib/server/database/postgres";
import { requireSameOriginRequest } from "@/lib/server/security/origin-guard";
import { apiError, apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/* ─────────────────────────────────────────────
 * Constants
 * ───────────────────────────────────────────── */

/**
 * All valid learning tracks on the Zingpath platform.
 * A user's track determines their subject list, day plan, and dashboard shortcuts.
 */
const VALID_TRACKS = [
  "class-9",
  "class-10",
  "class-11",
  "class-12",
  "engineering",
] as const;

type ValidTrack = (typeof VALID_TRACKS)[number];

/** Type-guard that narrows a string to a valid track identifier. */
function isValidTrack(value: string): value is ValidTrack {
  return (VALID_TRACKS as readonly string[]).includes(value);
}

/* ─────────────────────────────────────────────
 * GET /api/users/me
 * Returns the current authenticated user's public profile.
 * ───────────────────────────────────────────── */

/**
 * GET /api/users/me
 *
 * Returns the full public user object for the currently authenticated session.
 * Used by the profile page and anywhere the latest user state is needed.
 * Returns 401 when the session cookie is missing or expired.
 */
export async function GET(request: NextRequest) {
  /* Verify session cookie and look up the user */
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError(
      "UNAUTHENTICATED",
      "Please sign in to view your profile.",
      401,
      undefined,
      NO_STORE_HEADERS,
    );
  }

  return apiSuccess({ user }, { headers: NO_STORE_HEADERS });
}

/* ─────────────────────────────────────────────
 * PATCH /api/users/me
 * Updates the current user's display name and/or learning track.
 * ───────────────────────────────────────────── */

/**
 * PATCH /api/users/me
 *
 * Accepts a JSON body with any subset of:
 *   { name?: string, track?: string }
 *
 * Both fields are optional — you can update name only, track only, or both.
 * Returns the updated user object on success.
 * Returns 400 if validation fails, 401 if not authenticated.
 *
 * Example request body:
 *   { "name": "Aryan Sharma", "track": "class-12" }
 */
export async function PATCH(request: NextRequest) {
  const originError = requireSameOriginRequest(request);

  if (originError) {
    return originError;
  }

  /* ── 1. Verify the session cookie ── */
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError(
      "UNAUTHENTICATED",
      "Please sign in to update your profile.",
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
    return apiError(
      "INVALID_JSON",
      "Request body must be valid JSON.",
      400,
      undefined,
      NO_STORE_HEADERS,
    );
  }

  /* ── 3. Extract and validate individual fields ── */
  const { name, track } = body as { name?: unknown; track?: unknown };

  /* Name validation — 1 to 60 characters, non-empty after trimming */
  let newName: string | undefined;

  if (name !== undefined) {
    if (typeof name !== "string") {
      return apiError("INVALID_NAME", "Name must be a string.", 400, undefined, NO_STORE_HEADERS);
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 1) {
      return apiError("NAME_EMPTY", "Display name cannot be empty.", 400, undefined, NO_STORE_HEADERS);
    }

    if (trimmedName.length > 60) {
      return apiError("NAME_TOO_LONG", "Display name must be 60 characters or fewer.", 400, undefined, NO_STORE_HEADERS);
    }

    newName = trimmedName;
  }

  /* Track validation — must be one of the five valid track identifiers */
  let newTrack: ValidTrack | undefined;

  if (track !== undefined) {
    if (typeof track !== "string" || !isValidTrack(track)) {
      return apiError(
        "INVALID_TRACK",
        `Track must be one of: ${VALID_TRACKS.join(", ")}.`,
        400,
        undefined,
        NO_STORE_HEADERS,
      );
    }

    newTrack = track;
  }

  /* Ensure at least one field is being updated */
  if (!newName && !newTrack) {
    return apiError(
      "NO_CHANGES",
      "Provide at least one field to update (name or track).",
      400,
      undefined,
      NO_STORE_HEADERS,
    );
  }

  /* ── 4. Build the dynamic UPDATE query ── */
  const pool = getPostgresPool();

  try {
    /* Build SET clause dynamically based on which fields were provided */
    const setClauses: string[] = [];
    const values: (string | number)[] = [];
    let paramIndex = 1;

    if (newName) {
      setClauses.push(`name = $${paramIndex++}`);
      values.push(newName);
    }

    if (newTrack) {
      setClauses.push(`track = $${paramIndex++}`);
      values.push(newTrack);
    }

    /* The WHERE clause always uses the authenticated user's ID (never user-supplied) */
    values.push(user.id);

    const sql = `
      UPDATE eduquest_users
      SET    ${setClauses.join(", ")}
      WHERE  id = $${paramIndex}
      RETURNING id, name, email, track, level, xp, streak, role, created_at
    `;

    const result = await pool.query<{
      id: string;
      name: string;
      email: string;
      track: string;
      level: number;
      xp: number;
      streak: number;
      role: string;
      created_at: string;
    }>(sql, values);

    if (result.rows.length === 0) {
      /* Should never happen — the session is always tied to a real user */
      return apiError("USER_NOT_FOUND", "User record not found.", 404, undefined, NO_STORE_HEADERS);
    }

    const updatedRow = result.rows[0];

    /* Map the database row to the public user shape the frontend expects */
    const updatedUser = {
      id:        updatedRow.id,
      name:      updatedRow.name,
      email:     updatedRow.email,
      track:     updatedRow.track,
      level:     updatedRow.level,
      xp:        updatedRow.xp,
      streak:    updatedRow.streak,
      role:      updatedRow.role as "student" | "admin",
      createdAt: updatedRow.created_at,
    };

    return apiSuccess(
      { user: updatedUser },
      {
        status: 200,
        message: "Profile updated successfully.",
        headers: NO_STORE_HEADERS,
      },
    );

  } catch (err) {
    /* Log the error server-side but return a safe message to the client */
    console.error("[PATCH /api/users/me] Database error:", err);

    return apiError(
      "UPDATE_FAILED",
      "Failed to update your profile. Please try again.",
      500,
      undefined,
      NO_STORE_HEADERS,
    );
  }
}
