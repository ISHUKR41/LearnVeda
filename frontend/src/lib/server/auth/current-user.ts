/**
 * FILE: current-user.ts
 * LOCATION: src/lib/server/auth/current-user.ts
 * PURPOSE: Resolves the currently authenticated user from the session cookie.
 * USED BY: All API route handlers, /api/auth/me, /api/dashboard, etc.
 * DEPENDENCIES: session helper, postgres helper
 */

import type { NextRequest } from "next/server";
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

/**
 * getAuthenticatedUser — resolves the user from the session cookie.
 * Returns null if the request is unauthenticated.
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<PublicUser | null> {
  try {
    const session = getSessionFromRequest(request);
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
    console.error("[current-user] Session lookup error:", err);
    return null;
  }
}

/**
 * getAuthenticatedUserFromToken
 * Token-only variant for server-action contexts where no NextRequest is available.
 */
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
