/**
 * FILE: current-user.ts
 * LOCATION: src/lib/server/auth/current-user.ts
 * PURPOSE: Resolves the currently authenticated user from ANY valid auth source.
 *          Priority order:
 *            1. Clerk session (primary) — via @clerk/nextjs/server auth()
 *            2. Legacy eduquest_session cookie (fallback)
 *
 *          When a Clerk user signs in for the first time, this function
 *          auto-provisions their row in eduquest_users using gen_random_uuid()
 *          so the rest of the app always has a real DB user record to work with.
 *
 * USED BY: All API route handlers, /api/auth/me, /api/dashboard, etc.
 * DEPENDENCIES: @clerk/nextjs/server, postgres helper, session helper
 * LAST UPDATED: 2026-05-31
 */

import type { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getSessionFromRequest } from "@/lib/server/auth/session";
import { getPostgresPool } from "@/lib/server/database/postgres";
import type { PublicUser, LearningTrack, UserRole } from "@/types/auth";

/* ─────────────────────────────────────────────────────────────────────────
 * Constants for new user provisioning
 * ───────────────────────────────────────────────────────────────────────── */
const DEFAULT_TRACK: LearningTrack = "class-9";
const DEFAULT_ROLE: UserRole       = "student";

/* ─────────────────────────────────────────────────────────────────────────
 * DB row shape from eduquest_users queries
 * ───────────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────
 * Convert DB row → safe PublicUser (never exposes password hash)
 * ───────────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────
 * findOrCreateClerkUser
 * Looks up an existing eduquest_users row by clerk_id or email.
 * If none exists, inserts a brand-new row using gen_random_uuid()
 * so we never have a type mismatch with the uuid primary key column.
 * ───────────────────────────────────────────────────────────────────────── */
async function findOrCreateClerkUser(
  clerkId: string,
  email:   string,
  name:    string,
): Promise<PublicUser | null> {
  try {
    const pool = getPostgresPool();

    /* 1. Try to find by clerk_id (exact match) or by email (first sign-in) */
    const existing = await pool.query<EduQuestUserRow>(
      `SELECT id, name, email, track, role, level, xp, streak, created_at
         FROM eduquest_users
        WHERE clerk_id = $1
           OR email    = $2
        LIMIT 1`,
      [clerkId, email],
    );

    if (existing.rows.length > 0) {
      const row = existing.rows[0];

      /* Back-fill clerk_id in case the user registered before Clerk was added */
      await pool.query(
        `UPDATE eduquest_users
            SET clerk_id = $1
          WHERE id = $2
            AND (clerk_id IS NULL OR clerk_id <> $1)`,
        [clerkId, row.id],
      ).catch(() => { /* safe to ignore if clerk_id column doesn't exist yet */ });

      return rowToPublicUser(row);
    }

    /* 2. No existing row — provision a brand-new user.
     *    NOTE: we do NOT provide an id value here; we let PostgreSQL call
     *    gen_random_uuid() via the column DEFAULT so the uuid type is always valid.
     */
    const inserted = await pool.query<EduQuestUserRow>(
      `INSERT INTO eduquest_users
         (name, email, password_hash, track, role, level, xp, streak, clerk_id)
       VALUES ($1, $2, 'clerk_managed', $3, $4, 1, 0, 0, $5)
       ON CONFLICT (email) DO UPDATE
         SET clerk_id = EXCLUDED.clerk_id,
             name     = COALESCE(NULLIF(EXCLUDED.name, ''), eduquest_users.name)
       RETURNING id, name, email, track, role, level, xp, streak, created_at`,
      [name, email, DEFAULT_TRACK, DEFAULT_ROLE, clerkId],
    );

    return inserted.rows.length > 0 ? rowToPublicUser(inserted.rows[0]) : null;

  } catch (err) {
    console.error("[current-user] DB error during findOrCreateClerkUser:", err);
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 * getAuthenticatedUser — PRIMARY EXPORT
 * Tries Clerk auth first; falls back to legacy session cookie.
 * Returns null if the request is unauthenticated.
 * ───────────────────────────────────────────────────────────────────────── */
export async function getAuthenticatedUser(_request: NextRequest): Promise<PublicUser | null> {

  /* ── Strategy 1: Clerk (primary) ─────────────────────────────────── */
  try {
    const { userId } = await auth();

    if (userId) {
      const clerkUser = await currentUser();
      if (clerkUser) {
        const email =
          clerkUser.emailAddresses[0]?.emailAddress ??
          `${clerkUser.id}@clerk.local`;

        const name =
          [clerkUser.firstName, clerkUser.lastName]
            .filter(Boolean)
            .join(" ")
            .trim() ||
          clerkUser.username ||
          email.split("@")[0];

        return findOrCreateClerkUser(clerkUser.id, email, name);
      }
    }
  } catch {
    /* Clerk unavailable (Edge runtime, missing env var, etc.) — fall through */
  }

  /* ── Strategy 2: Legacy eduquest_session cookie (fallback) ──────── */
  try {
    const session = getSessionFromRequest(_request);
    if (!session) return null;

    const pool   = getPostgresPool();
    const result = await pool.query<EduQuestUserRow>(
      `SELECT id, name, email, track, role, level, xp, streak, created_at
         FROM eduquest_users
        WHERE id = $1`,
      [session.sub],
    );

    return result.rows.length > 0 ? rowToPublicUser(result.rows[0]) : null;

  } catch (err) {
    console.error("[current-user] Legacy session lookup error:", err);
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 * getAuthenticatedUserFromToken
 * Token-only variant for server-action contexts where no NextRequest is available.
 * ───────────────────────────────────────────────────────────────────────── */
export async function getAuthenticatedUserFromToken(
  token: string | undefined,
): Promise<PublicUser | null> {
  if (!token) return null;

  try {
    const { verifySessionToken } = await import("@/lib/server/auth/session");
    const session = verifySessionToken(token);
    if (!session) return null;

    const pool   = getPostgresPool();
    const result = await pool.query<EduQuestUserRow>(
      `SELECT id, name, email, track, role, level, xp, streak, created_at
         FROM eduquest_users
        WHERE id = $1`,
      [session.sub],
    );

    return result.rows.length > 0 ? rowToPublicUser(result.rows[0]) : null;
  } catch {
    return null;
  }
}
