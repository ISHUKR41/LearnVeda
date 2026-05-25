/**
 * FILE: session-records.ts
 * LOCATION: src/lib/server/auth/session-records.ts
 * PURPOSE: Shared server-side session registry contracts. The signed cookie
 *          proves that a browser owns a session token, while these records let
 *          the backend revoke, audit, and expire sessions centrally.
 * USED BY: Repository contracts, JSON adapter, PostgreSQL adapter, auth routes
 * LAST UPDATED: 2026-05-20
 */

/** Input stored whenever a user receives a newly signed session cookie. */
export interface CreateSessionRecordInput {
  tokenId: string;
  userId: string;
  expiresAt: string;
  clientKey?: string;
  userAgent?: string | null;
}

/** Durable session state returned by local and production adapters. */
export interface StoredSessionRecord extends CreateSessionRecordInput {
  createdAt: string;
  lastSeenAt: string;
  revokedAt: string | null;
  revokeReason: string | null;
}

/** Input used when a session should stop authenticating future requests. */
export interface RevokeSessionInput {
  tokenId: string;
  reason: string;
}

/** Returns whether a stored session has passed its server-side expiry time. */
export function isStoredSessionExpired(session: StoredSessionRecord): boolean {
  return Date.parse(session.expiresAt) <= Date.now();
}
