/**
 * FILE: auth.ts
 * LOCATION: src/types/auth.ts
 * PURPOSE: Shared authentication and user profile types used by the frontend,
 *          backend route handlers, session helpers, and dashboard services.
 *          Keeping these contracts in one file prevents the UI and API from
 *          silently drifting apart as the product grows.
 * USED BY: Auth API routes, dashboard API route, auth pages, middleware helpers
 * LAST UPDATED: 2026-05-11
 */

/** Learning tracks that a student can choose during registration. */
export const LEARNING_TRACKS = [
  "class-9",
  "class-10",
  "class-11",
  "class-12",
  "engineering",
] as const;

/** Union type generated from the allowed learning track list above. */
export type LearningTrack = (typeof LEARNING_TRACKS)[number];

/** Roles are intentionally small for the MVP but leave room for future portals. */
export type UserRole = "student" | "parent" | "teacher" | "organizer" | "admin";

/** Public user shape that can safely be returned to the browser. */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  track: LearningTrack;
  role: UserRole;
  level: number;
  xp: number;
  streak: number;
  createdAt: string;
}

/**
 * Stored user shape used by the server-side data adapter.
 * The password hash never leaves backend helpers or API routes.
 */
export interface StoredUser extends PublicUser {
  passwordHash: string;
}

/** Session payload stored inside the signed httpOnly cookie. */
export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  exp: number;
}
