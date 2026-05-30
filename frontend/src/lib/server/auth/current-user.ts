/**
 * FILE: current-user.ts
 * LOCATION: src/lib/server/auth/current-user.ts
 * PURPOSE: Resolves the authenticated user from the current request.
 *
 *          AUTH STRATEGY (priority order):
 *            1. Clerk session — Uses `auth()` from @clerk/nextjs/server to get
 *               the Clerk userId. Looks up the user in the database by
 *               clerk_user_id. If not found, auto-creates the user (first sign-in).
 *            2. Legacy session cookie — Falls back to the signed `eduquest_session`
 *               cookie for backward compatibility with any existing sessions.
 *
 *          This dual strategy ensures zero disruption: Clerk-managed sessions work
 *          immediately, while any remaining legacy sessions stay valid until they
 *          expire naturally.
 *
 * USED BY: All API routes via `getAuthenticatedUser(request)`
 * DEPENDENCIES: @clerk/nextjs/server, pg, platform-repository
 * LAST UPDATED: 2026-05-30
 */

import type { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getSessionFromRequest, verifySessionToken } from "@/lib/server/auth/session";
import { getPlatformRepository } from "@/lib/server/repositories/get-platform-repository";
import { queryPostgres } from "@/lib/server/database/postgres";
import { isPostgresConfigured } from "@/lib/server/database/postgres";
import type { PublicUser, LearningTrack, UserRole } from "@/types/auth";

/* ── Database row shape for Clerk user lookups ── */
interface UserRow {
  id: string;
  name: string;
  email: string;
  track: LearningTrack;
  role: UserRole;
  level: number;
  xp: number;
  streak: number;
  created_at: Date | string;
}

/**
 * Main entry point: resolves the authenticated user from the incoming request.
 *
 * 1. Try Clerk auth first (preferred — handles all new sign-ins)
 * 2. Fall back to legacy session cookie (backward compatibility)
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<PublicUser | null> {
  /* ── Strategy 1: Clerk session ── */
  const clerkUser = await getClerkAuthenticatedUser();
  if (clerkUser) {
    return clerkUser;
  }

  /* ── Strategy 2: Legacy session cookie ── */
  const session = getSessionFromRequest(request);
  return getAuthenticatedUserFromPayload(session);
}

/**
 * Alternate entry for contexts where only a raw token string is available.
 * Tries Clerk first, then falls back to legacy token verification.
 */
export async function getAuthenticatedUserFromToken(token: string | undefined): Promise<PublicUser | null> {
  /* ── Strategy 1: Clerk session ── */
  const clerkUser = await getClerkAuthenticatedUser();
  if (clerkUser) {
    return clerkUser;
  }

  /* ── Strategy 2: Legacy token ── */
  return getAuthenticatedUserFromPayload(verifySessionToken(token));
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  CLERK AUTH HELPERS
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Attempts to resolve the current user via Clerk's server-side `auth()`.
 *
 * If the user exists in Clerk but NOT in the EduQuest database, we auto-create
 * them with sensible defaults (level 1, 0 XP, student role, class-9 track).
 * This ensures seamless onboarding — a user signs up via Clerk and immediately
 * has a fully functional dashboard without any manual registration step.
 */
async function getClerkAuthenticatedUser(): Promise<PublicUser | null> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    /* If Postgres isn't configured, we can't look up or create users */
    if (!isPostgresConfigured()) {
      return null;
    }

    /* ── Look up user by Clerk ID in the database ── */
    let user = await findUserByClerkId(userId);

    if (user) {
      return user;
    }

    /* ── First sign-in: auto-create the user in EduQuest database ── */
    const clerkProfile = await currentUser();
    const name = clerkProfile?.firstName
      ? `${clerkProfile.firstName}${clerkProfile.lastName ? " " + clerkProfile.lastName : ""}`
      : clerkProfile?.username || "Student";
    const email = clerkProfile?.emailAddresses?.[0]?.emailAddress || `${userId}@clerk.user`;

    user = await createUserFromClerk(userId, name, email);
    return user;
  } catch (error) {
    /* Clerk auth() can throw in contexts where headers aren't available.
     * This is expected — fall through to legacy auth silently. */
    console.warn("[current-user] Clerk auth() failed, falling through to legacy:", (error as Error).message);
    return null;
  }
}

/**
 * Finds an EduQuest user by their Clerk user ID.
 *
 * We store Clerk's user_id in the `clerk_user_id` column of `eduquest_users`.
 * If the column doesn't exist yet (pre-migration), we catch the error and
 * return null so the legacy path can take over.
 */
async function findUserByClerkId(clerkUserId: string): Promise<PublicUser | null> {
  try {
    const result = await queryPostgres<UserRow>(
      `SELECT id, name, email, track, role, level, xp, streak, created_at
       FROM eduquest_users
       WHERE clerk_user_id = $1
       LIMIT 1`,
      [clerkUserId],
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      track: row.track,
      role: row.role,
      level: row.level,
      xp: row.xp,
      streak: row.streak,
      createdAt: row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(row.created_at).toISOString(),
    };
  } catch {
    /* Column clerk_user_id may not exist yet — return null so legacy path works */
    return null;
  }
}

/**
 * Creates a new EduQuest user from Clerk profile data.
 * Uses INSERT ... ON CONFLICT to handle race conditions (two concurrent
 * requests for the same brand-new Clerk user).
 */
async function createUserFromClerk(
  clerkUserId: string,
  name: string,
  email: string,
): Promise<PublicUser | null> {
  try {
    /* First ensure the clerk_user_id column exists */
    await ensureClerkColumn();

    /*
     * IMPORTANT: The user may already exist from legacy auth (same email).
     * We must check by email first and LINK the Clerk ID to the existing row,
     * rather than INSERT which would violate the email unique constraint.
     */
    const existing = await queryPostgres<UserRow>(
      `UPDATE eduquest_users
          SET clerk_user_id = $1,
              name = CASE WHEN name = 'Student' OR name = '' THEN $2 ELSE name END
        WHERE LOWER(email) = LOWER($3) AND (clerk_user_id IS NULL OR clerk_user_id = $1)
        RETURNING id, name, email, track, role, level, xp, streak, created_at`,
      [clerkUserId, name, email],
    );

    if (existing.rows[0]) {
      const row = existing.rows[0];
      console.log(`[current-user] Linked existing user ${row.id} to Clerk ID ${clerkUserId}`);
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        track: row.track,
        role: row.role,
        level: row.level,
        xp: row.xp,
        streak: row.streak,
        createdAt: row.created_at instanceof Date
          ? row.created_at.toISOString()
          : new Date(row.created_at).toISOString(),
      };
    }

    /* No existing user with this email — create a new one */
    const result = await queryPostgres<UserRow>(
      `INSERT INTO eduquest_users (name, email, password_hash, track, clerk_user_id)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (clerk_user_id) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, name, email, track, role, level, xp, streak, created_at`,
      [name, email.toLowerCase(), "clerk-managed", "class-9", clerkUserId],
    );

    const row = result.rows[0];
    if (!row) return null;

    console.log(`[current-user] Auto-created EduQuest user for Clerk ID ${clerkUserId}: ${row.id}`);

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      track: row.track,
      role: row.role,
      level: row.level,
      xp: row.xp,
      streak: row.streak,
      createdAt: row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(row.created_at).toISOString(),
    };
  } catch (error) {
    console.error("[current-user] Failed to auto-create user from Clerk:", error);
    return null;
  }
}

/**
 * Ensures the `clerk_user_id` column exists on the `eduquest_users` table.
 * Uses IF NOT EXISTS so this is safe to call repeatedly.
 * Also creates a unique index for fast lookups and conflict handling.
 */
let clerkColumnEnsured = false;
async function ensureClerkColumn(): Promise<void> {
  if (clerkColumnEnsured) return;

  try {
    await queryPostgres(
      `ALTER TABLE eduquest_users
       ADD COLUMN IF NOT EXISTS clerk_user_id TEXT UNIQUE`,
    );
    clerkColumnEnsured = true;
  } catch {
    /* Column may already exist or table may not support ALTER — proceed anyway */
    clerkColumnEnsured = true;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  LEGACY AUTH HELPERS (backward compatibility)
 * ═══════════════════════════════════════════════════════════════════════════ */

async function getAuthenticatedUserFromPayload(
  session: ReturnType<typeof verifySessionToken>,
): Promise<PublicUser | null> {
  if (!session) {
    return null;
  }

  const repository = getPlatformRepository();
  const user = await repository.users.findById(session.sub);
  return user ? repository.users.toPublic(user) : null;
}
