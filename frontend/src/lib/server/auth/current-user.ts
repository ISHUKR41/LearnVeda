/**
 * FILE: current-user.ts
 * LOCATION: src/lib/server/auth/current-user.ts
 * PURPOSE: Resolves the currently authenticated user from ANY valid auth source.
 *          Priority order:
 *            1. Clerk session (primary) — via @clerk/nextjs/server auth()
 *            2. Legacy eduquest_session cookie (fallback for API-key clients)
 *
 *          When a Clerk user is found for the first time, this function
 *          automatically provisions their row in eduquest_users so the rest
 *          of the app can always assume a DB user record exists.
 *
 * USED BY: All API route handlers, /api/auth/me, /api/dashboard, etc.
 * DEPENDENCIES: @clerk/nextjs/server, postgres helper, session helper
 * LAST UPDATED: 2026-05-31
 */

import type { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getSessionFromRequest, verifySessionToken } from "@/lib/server/auth/session";
import { getPostgresPool } from "@/lib/server/database/postgres";
import type { PublicUser, LearningTrack, UserRole } from "@/types/auth";

/* ─────────────────────────────────────────────────────────────────────────
 * Default track assigned to brand-new Clerk users until they choose their own.
 * ───────────────────────────────────────────────────────────────────────── */
const DEFAULT_TRACK: LearningTrack = "class-9";
const DEFAULT_ROLE: UserRole = "student";

/* ─────────────────────────────────────────────────────────────────────────
 * Row shape returned from eduquest_users queries
 * ───────────────────────────────────────────────────────────────────────── */
interface EduQuestUserRow {
  id: string;
  name: string;
  email: string;
  track: string;
  role: string;
  level: number;
  xp: number;
  streak: number;
  created_at: string;
}

/* ─────────────────────────────────────────────────────────────────────────
 * Convert a DB row → PublicUser (safe to return to browser)
 * ───────────────────────────────────────────────────────────────────────── */
function rowToPublicUser(row: EduQuestUserRow): PublicUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    track: (row.track as LearningTrack) ?? DEFAULT_TRACK,
    role: (row.role as UserRole) ?? DEFAULT_ROLE,
    level: row.level ?? 1,
    xp: row.xp ?? 0,
    streak: row.streak ?? 0,
    createdAt: row.created_at,
  };
}

/* ─────────────────────────────────────────────────────────────────────────
 * Find an existing user by clerk_id or email, or create a brand-new row.
 * This ensures every Clerk sign-in always maps to a real eduquest_users row.
 * ───────────────────────────────────────────────────────────────────────── */
async function findOrCreateClerkUser(
  clerkId: string,
  email: string,
  name: string,
): Promise<PublicUser | null> {
  try {
    const pool = getPostgresPool();

    /* 1. Try to find by clerk_id column (if the column exists) */
    const existing = await pool.query<EduQuestUserRow>(
      `SELECT id, name, email, track, role, level, xp, streak, created_at
         FROM eduquest_users
        WHERE clerk_id = $1
           OR email = $2
        LIMIT 1`,
      [clerkId, email],
    );

    if (existing.rows.length > 0) {
      const row = existing.rows[0];

      /* Back-fill clerk_id if the user was registered before Clerk was added */
      await pool.query(
        `UPDATE eduquest_users
            SET clerk_id   = $1,
                updated_at = NOW()
          WHERE id = $2
            AND (clerk_id IS NULL OR clerk_id <> $1)`,
        [clerkId, row.id],
      ).catch(() => { /* clerk_id column might not exist yet — safe to ignore */ });

      return rowToPublicUser(row);
    }

    /* 2. No row found — create a new user provisioned from Clerk data */
    const newUserId = `clerk_${clerkId}`;

    const inserted = await pool.query<EduQuestUserRow>(
      `INSERT INTO eduquest_users
         (id, name, email, password_hash, track, role, level, xp, streak, clerk_id)
       VALUES ($1, $2, $3, 'clerk_managed', $4, $5, 1, 0, 0, $6)
       ON CONFLICT (email) DO UPDATE
         SET clerk_id   = EXCLUDED.clerk_id,
             name       = EXCLUDED.name,
             updated_at = NOW()
       RETURNING id, name, email, track, role, level, xp, streak, created_at`,
      [newUserId, name, email, DEFAULT_TRACK, DEFAULT_ROLE, clerkId],
    );

    return inserted.rows.length > 0 ? rowToPublicUser(inserted.rows[0]) : null;
  } catch (err) {
    console.error("[current-user] DB error finding/creating Clerk user:", err);
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 * PRIMARY EXPORT — try Clerk first, fall back to legacy cookie
 * ───────────────────────────────────────────────────────────────────────── */
export async function getAuthenticatedUser(_request: NextRequest): Promise<PublicUser | null> {
  /* ── 1. Clerk (primary) ─────────────────────────────────────── */
  try {
    const { userId } = await auth();

    if (userId) {
      const clerkUser = await currentUser();
      if (clerkUser) {
        const email =
          clerkUser.emailAddresses[0]?.emailAddress ??
          `${clerkUser.id}@clerk.local`;
        const name =
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
          clerkUser.username ||
          email.split("@")[0];

        return findOrCreateClerkUser(clerkUser.id, email, name);
      }
    }
  } catch {
    /* Clerk not available (e.g. Edge runtime, missing env) — fall through */
  }

  /* ── 2. Legacy eduquest_session cookie (fallback) ───────────── */
  try {
    const session = getSessionFromRequest(_request);
    if (!session) return null;

    const pool = getPostgresPool();
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
 * Token-only variant (used by non-request contexts like server actions)
 * ───────────────────────────────────────────────────────────────────────── */
export async function getAuthenticatedUserFromToken(
  token: string | undefined,
): Promise<PublicUser | null> {
  if (!token) return null;

  try {
    const session = verifySessionToken(token);
    if (!session) return null;

    const pool = getPostgresPool();
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
