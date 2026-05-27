/**
 * FILE: current-user.ts
 * LOCATION: src/lib/server/auth/current-user.ts
 * PURPOSE: Backend helper for resolving the current authenticated user.
 *          Supports TWO authentication strategies:
 *            1. Clerk Auth (primary) — reads the Clerk session from the request
 *               headers via @clerk/nextjs/server. If the user exists in the DB
 *               (matched by email), it returns them. If not, it auto-provisions
 *               a new user row so first-time Clerk sign-ins are seamless.
 *            2. Legacy session cookie (fallback) — reads the signed httpOnly
 *               eduquest_session cookie. Kept for backwards compatibility with
 *               existing API routes and admin tools.
 *          API routes should call getAuthenticatedUser(request) and never read
 *          cookies or Clerk headers directly.
 * USED BY: All protected API route handlers, dashboard page server guard
 * DEPENDENCIES: @clerk/nextjs/server, session helpers, platform-store repository
 * LAST UPDATED: 2026-05-27
 */

import type { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getSessionFromRequest, verifySessionToken } from "@/lib/server/auth/session";
import { getPlatformRepository } from "@/lib/server/repositories/get-platform-repository";
import type { PublicUser, LearningTrack } from "@/types/auth";

/**
 * In-memory cache mapping Clerk user IDs to local EduQuest user IDs.
 * This avoids repeated Clerk profile fetches and email lookups on every request.
 * The cache lives for the lifetime of the Node.js process and resets on restart.
 */
const clerkToLocalUserCache = new Map<string, PublicUser>();

/**
 * Primary auth resolver for API route handlers.
 * Tries Clerk auth first (since that's the active sign-in provider),
 * then falls back to the legacy custom session cookie.
 *
 * @param request - The incoming Next.js API request object
 * @returns The authenticated user or null if no valid session exists
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<PublicUser | null> {
  // Strategy 1: Try Clerk authentication (primary)
  const clerkUser = await getClerkAuthenticatedUser();
  if (clerkUser) {
    return clerkUser;
  }

  // Strategy 2: Fallback to legacy custom session cookie
  const session = getSessionFromRequest(request);
  return getAuthenticatedUserFromPayload(session);
}

/**
 * Server component auth resolver.
 * Used by server-rendered pages (like dashboard/page.tsx) that cannot pass
 * a NextRequest object. Tries Clerk first, then legacy token.
 *
 * @param token - Optional legacy session cookie value
 * @returns The authenticated user or null
 */
export async function getAuthenticatedUserFromToken(token: string | undefined): Promise<PublicUser | null> {
  // Strategy 1: Try Clerk authentication (primary)
  const clerkUser = await getClerkAuthenticatedUser();
  if (clerkUser) {
    return clerkUser;
  }

  // Strategy 2: Fallback to legacy token
  return getAuthenticatedUserFromPayload(verifySessionToken(token));
}

/**
 * Resolves the current Clerk session into a local EduQuest user.
 * Uses an in-memory cache to avoid repeated Clerk API calls.
 * If the user signed in via Clerk but doesn't have a DB record yet,
 * auto-provisions one so the first login is seamless.
 *
 * Flow:
 *   1. Check Clerk session → get clerkUserId
 *   2. Check in-memory cache → return cached user if found
 *   3. Fetch full Clerk profile → get email and name
 *   4. Find user in DB by email → return if found
 *   5. Auto-create new user → return the new public profile
 *
 * @returns The authenticated user from Clerk session, or null
 */
async function getClerkAuthenticatedUser(): Promise<PublicUser | null> {
  try {
    // Get Clerk auth state from the request headers (set by clerkMiddleware)
    const { userId: clerkUserId } = await auth();

    // No Clerk session active — bail early
    if (!clerkUserId) {
      return null;
    }

    // Check in-memory cache first to avoid repeated DB lookups
    const cachedUser = clerkToLocalUserCache.get(clerkUserId);
    if (cachedUser) {
      return cachedUser;
    }

    // Fetch the full Clerk user profile to get their name and email
    const clerkProfile = await currentUser();

    if (!clerkProfile) {
      // Edge case: Clerk session is valid but user profile is unavailable
      return null;
    }

    // Build a display name from Clerk's profile fields
    const displayName = [clerkProfile.firstName, clerkProfile.lastName]
      .filter(Boolean)
      .join(" ") || clerkProfile.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Student";

    // Get the primary email from Clerk
    const primaryEmail = clerkProfile.emailAddresses?.[0]?.emailAddress || `${clerkUserId}@clerk.user`;

    const repository = getPlatformRepository();

    // Check if a user with this email already exists in our database
    const existingUser = await repository.users.findByEmail(primaryEmail);
    if (existingUser) {
      // Cache the mapping so future requests are fast
      const publicUser = repository.users.toPublic(existingUser);
      clerkToLocalUserCache.set(clerkUserId, publicUser);
      return publicUser;
    }

    // No user found — auto-provision a new account for this Clerk user
    // Default learning track for new auto-provisioned users
    const defaultTrack: LearningTrack = "class-9";

    const newUser = await repository.users.create({
      name: displayName,
      email: primaryEmail,
      passwordHash: `clerk:${clerkUserId}`, // Marker: this user uses Clerk auth (no local password)
      track: defaultTrack,
    });

    // Cache the new user for future requests
    clerkToLocalUserCache.set(clerkUserId, newUser);

    return newUser;
  } catch (error) {
    // Log the error but don't crash — fall through to legacy auth
    console.error("[current-user] Clerk auth resolution failed:", error);
    return null;
  }
}

/**
 * Legacy auth path: resolves a custom signed session token payload
 * into a user from the database.
 *
 * @param session - Decoded session payload from the custom cookie
 * @returns The authenticated user or null
 */
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
