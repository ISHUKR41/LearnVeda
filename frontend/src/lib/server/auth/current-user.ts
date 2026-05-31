/**
 * FILE: current-user.ts
 * LOCATION: src/lib/server/auth/current-user.ts
 * PURPOSE: Resolves the currently authenticated user from ANY valid auth source.
 *          Priority order:
 *            1. Clerk session (primary) — via @clerk/nextjs/server auth()
 *            2. Legacy eduquest_session cookie (fallback)
 *
 * USED BY: All API route handlers, /api/auth/me, /api/dashboard, etc.
 */

import type { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getSessionFromRequest } from "@/lib/server/auth/session";
import { getPostgresPool } from "@/lib/server/database/postgres";
import type { PublicUser, LearningTrack, UserRole } from "@/types/auth";

const DEFAULT_TRACK: LearningTrack = "class-9";
const DEFAULT_ROLE: UserRole       = "student";

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

async function findOrCreateClerkUser(
  clerkId: string,
  email:   string,
  name:    string,
): Promise<PublicUser | null> {
  try {
    const pool = getPostgresPool();

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
      await pool.query(
        `UPDATE eduquest_users SET clerk_id = $1
          WHERE id = $2 AND (clerk_id IS NULL OR clerk_id <> $1)`,
        [clerkId, row.id],
      ).catch(() => {});
      return rowToPublicUser(row);
    }

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

export async function getAuthenticatedUser(_request: NextRequest): Promise<PublicUser | null> {
  /* ── Strategy 1: Clerk (primary) ── */
  try {
    const { userId } = await auth();
    if (userId) {
      const clerkUser = await currentUser();
      if (clerkUser) {
        const email = clerkUser.emailAddresses[0]?.emailAddress ?? `${clerkUser.id}@clerk.local`;
        const name =
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
          clerkUser.username ||
          email.split("@")[0];
        return findOrCreateClerkUser(clerkUser.id, email, name);
      }
    }
  } catch {
    /* Clerk unavailable — fall through */
  }

  /* ── Strategy 2: Legacy session cookie (fallback) ── */
  try {
    const session = getSessionFromRequest(_request);
    if (!session) return null;
    const pool   = getPostgresPool();
    const result = await pool.query<EduQuestUserRow>(
      `SELECT id, name, email, track, role, level, xp, streak, created_at
         FROM eduquest_users WHERE id = $1`,
      [session.sub],
    );
    return result.rows.length > 0 ? rowToPublicUser(result.rows[0]) : null;
  } catch (err) {
    console.error("[current-user] Legacy session lookup error:", err);
    return null;
  }
}

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
         FROM eduquest_users WHERE id = $1`,
      [session.sub],
    );
    return result.rows.length > 0 ? rowToPublicUser(result.rows[0]) : null;
  } catch {
    return null;
  }
}
