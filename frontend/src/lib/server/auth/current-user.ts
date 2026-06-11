/**
 * FILE: current-user.ts
 * LOCATION: src/lib/server/auth/current-user.ts
 * PURPOSE: Resolves the currently authenticated user from either:
 *   1. A Clerk session (primary — used for Google login and new accounts)
 *   2. A legacy httpOnly cookie session (fallback — legacy email/password logins)
 *
 *   When a Clerk user is found whose email is not yet in the database, a new
 *   EduQuest user row is created just-in-time (JIT provisioning) so the student
 *   can immediately access their dashboard after first Google sign-in.
 *
 * CRITICAL NOTE: auth() and currentUser() MUST be statically imported at module
 * level. Dynamic imports break Next.js's request context cache that Clerk depends
 * on to read the session JWT inside API route handlers (Node.js runtime).
 *
 * USED BY: All API route handlers — /api/dashboard, /api/wallet, /api/achievements, etc.
 * LAST UPDATED: 2026-06-02
 */

import type { NextRequest } from "next/server";
/* Static imports — REQUIRED for Clerk's internal request-context cache to work.
 * DO NOT change to dynamic imports (await import(...)). Dynamic imports in API
 * routes cause auth() to lose the request context, returning userId: null even
 * when the user has a valid Clerk session in the browser. */
import { auth, currentUser } from "@/lib/clerk-shim/server";
import { getSessionFromRequest } from "@/lib/server/auth/session";
import { getPostgresPool } from "@/lib/server/database/postgres";
import type { PublicUser, LearningTrack, UserRole } from "@/types/auth";
import { randomUUID } from "crypto";

const DEFAULT_TRACK: LearningTrack = "class-9";
const DEFAULT_ROLE: UserRole       = "student";
const ENABLE_LEGACY_AUTH = process.env.EDUQUEST_ENABLE_LEGACY_AUTH === "true";

interface EduQuestUserRow {
  id:         string;
  name:       string;
  email:      string;
  track:      string;
  role:       string;
  level:      number;
  xp:         number;
  streak:     number;
  created_at: string;
}

function rowToPublicUser(row: EduQuestUserRow): PublicUser {
  return {
    id:        row.id,
    name:      row.name,
    email:     row.email,
    track:     (row.track as LearningTrack) ?? DEFAULT_TRACK,
    role:      (row.role  as UserRole)      ?? DEFAULT_ROLE,
    level:     row.level  ?? 1,
    xp:        row.xp     ?? 0,
    streak:    row.streak ?? 0,
    createdAt: row.created_at,
  };
}

/* ─────────────────────────────────────────────
 * findOrCreateClerkUser
 * Looks up an EduQuest user by email from Clerk data.
 * If no row exists, inserts one (JIT provisioning).
 * ───────────────────────────────────────────── */
async function findOrCreateClerkUser(
  email: string,
  displayName: string,
  clerkUserId: string,
): Promise<PublicUser | null> {
  try {
    const pool = getPostgresPool();

    /* Try to find an existing EduQuest account with this email */
    const existing = await pool.query<EduQuestUserRow & { password_hash?: string }>(
      `SELECT id, name, email, track, role, level, xp, streak, created_at, password_hash
         FROM eduquest_users
        WHERE lower(email) = lower($1)`,
      [email],
    );

    if (existing.rows.length > 0) {
      const userRow = existing.rows[0];
      /* Sync the Clerk user ID mapping if it has changed */
      if (userRow.password_hash !== `clerk-${clerkUserId}`) {
        await pool.query(
          `UPDATE eduquest_users SET password_hash = $1 WHERE id = $2`,
          [`clerk-${clerkUserId}`, userRow.id]
        );
      }
      return rowToPublicUser(userRow);
    }

    /*
     * No existing account → create one.
     * password_hash is set to clerk-<userId> so future fast lookups by Clerk ID work.
     * Clerk users never use password auth, so this placeholder is never read for login.
     */
    const newId = randomUUID();
    const inserted = await pool.query<EduQuestUserRow>(
      `INSERT INTO eduquest_users
         (id, name, email, password_hash, track, role, level, xp, streak)
       VALUES ($1, $2, $3, $4, $5, $6, 1, 0, 0)
       ON CONFLICT (email) DO UPDATE
         SET name = EXCLUDED.name
       RETURNING id, name, email, track, role, level, xp, streak, created_at`,
      [newId, displayName, email.toLowerCase(), `clerk-${clerkUserId}`, DEFAULT_TRACK, DEFAULT_ROLE],
    );

    return inserted.rows.length > 0 ? rowToPublicUser(inserted.rows[0]) : null;
  } catch (err) {
    console.error("[current-user] JIT provisioning error:", err);
    return null;
  }
}

/* ─────────────────────────────────────────────
 * getAuthenticatedUser  (main export)
 *
 * Priority 1: Clerk session (JWT via cookies or Authorization header)
 *   - First tries fast DB lookup by clerk-<userId> to avoid Clerk API roundtrip
 *   - Falls back to currentUser() for email/name, then JIT-provisions a DB row
 * Priority 2: Legacy httpOnly cookie session (disabled unless ENABLE_LEGACY_AUTH=true)
 *
 * The `request` param is accepted so legacy cookie auth can read the session
 * cookie. For Clerk auth, auth() reads the session from Next.js request context
 * (headers/cookies propagated automatically in App Router route handlers).
 * ───────────────────────────────────────────── */
export async function getAuthenticatedUser(request: NextRequest): Promise<PublicUser | null> {

  /* ── Attempt 1: Clerk session ─────────────────────── */
  try {
    /* auth() reads the Clerk session JWT from Next.js headers() / cookies() context.
     * This works correctly in App Router API route handlers when statically imported. */
    const { userId } = await auth();

    if (userId) {
      /* Fast path: check if this Clerk user already has a DB row (avoids Clerk API call) */
      try {
        const pool = getPostgresPool();
        const existing = await pool.query<EduQuestUserRow>(
          `SELECT id, name, email, track, role, level, xp, streak, created_at
             FROM eduquest_users
            WHERE password_hash = $1`,
          [`clerk-${userId}`],
        );
        if (existing.rows.length > 0) {
          return rowToPublicUser(existing.rows[0]);
        }
      } catch (dbErr) {
        console.error("[current-user] Fast Clerk ID lookup failed:", dbErr);
      }

      /* Slow path: fetch full Clerk user object to get email/name for provisioning */
      const clerkUser = await currentUser();
      if (clerkUser) {
        const email =
          clerkUser.primaryEmailAddress?.emailAddress ??
          clerkUser.emailAddresses[0]?.emailAddress;

        const displayName =
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
          clerkUser.username ||
          (email ? email.split("@")[0] : "Student");

        if (email) {
          return await findOrCreateClerkUser(email, displayName, userId);
        }
      }

      console.warn(`[current-user] Clerk userId=${userId} found but no email available`);
      return null;
    }
  } catch (err) {
    /* Log auth errors so we can see what's failing in the server console */
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.includes("NEXT_PUBLIC_CLERK") && !msg.includes("publishableKey")) {
      console.error("[current-user] Clerk auth error:", msg);
    }
    /* Fall through to legacy auth */
  }

  /* ── Attempt 2: Legacy httpOnly cookie session ─────────────────────── */
  if (!ENABLE_LEGACY_AUTH) {
    return null;
  }

  try {
    const session = await getSessionFromRequest(request);
    if (!session) return null;

    const pool   = getPostgresPool();
    const result = await pool.query<EduQuestUserRow>(
      `SELECT id, name, email, track, role, level, xp, streak, created_at
         FROM eduquest_users WHERE id = $1`,
      [session.sub],
    );
    return result.rows.length > 0 ? rowToPublicUser(result.rows[0]) : null;
  } catch (err) {
    console.error("[current-user] Cookie session lookup error:", err);
    return null;
  }
}

/* ─────────────────────────────────────────────
 * getAuthenticatedUserFromToken  (WebSocket / batch contexts)
 * Used when the Clerk session is passed as a bearer token instead of cookie.
 * ───────────────────────────────────────────── */
export async function getAuthenticatedUserFromToken(
  token: string | undefined,
): Promise<PublicUser | null> {
  if (!token) return null;
  try {
    const { verifySessionToken } = await import("@/lib/server/auth/session");
    const session = await verifySessionToken(token);
    if (!session) return null;
    const pool   = getPostgresPool();
    const result = await pool.query<EduQuestUserRow>(
      `SELECT id, name, email, track, role, level, xp, streak, created_at
         FROM eduquest_users WHERE id = $1`,
      [session.sub],
    );
    return result.rows.length > 0 ? rowToPublicUser(result.rows[0]) : null;
  } catch {
    return null;
  }
}
