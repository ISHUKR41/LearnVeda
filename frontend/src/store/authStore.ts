/**
 * FILE: authStore.ts
 * LOCATION: src/store/authStore.ts
 * PURPOSE: Global Zustand store for authentication state.
 *          Tracks whether the user is logged in, their profile data,
 *          and provides actions to update auth state across the entire app.
 *          This is the single source of truth for "who is currently logged in".
 * USED BY: Navbar, Dashboard, Profile page, Battle, Community, any protected page
 * DEPENDENCIES: zustand
 * LAST UPDATED: 2026-05-16
 * AUTHOR NOTE: Use shallow equality checks when selecting slices of this store
 *              to avoid unnecessary re-renders in components that only need one field.
 */

import { create } from "zustand";

/* ─────────────────────────────────────────────
 * Type Definitions
 * ───────────────────────────────────────────── */

/**
 * Represents the logged-in user's core profile.
 * Only includes data that is safe to store on the client (no password hashes).
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  track: string;          // e.g. "class-9", "class-10", "engineering"
  role: string;           // e.g. "student", "admin", "organizer"
  level: number;          // current level (1–100)
  xp: number;             // accumulated XP points
  streak: number;         // consecutive days active
  avatarUrl?: string;     // optional profile picture URL
}

/**
 * The shape of the auth store.
 * Contains both the state values and the actions to mutate them.
 */
interface AuthState {
  /** null = not logged in, AuthUser object = logged in */
  user: AuthUser | null;

  /** Tracks whether we have finished checking the session cookie.
   *  true = we are still waiting for /api/auth/me to respond.
   *  false = the check is complete (user may or may not be logged in).
   */
  isLoading: boolean;

  /** True only when the user is logged in (derived convenience getter) */
  isAuthenticated: boolean;

  /* ── Actions ── */

  /** Call this after a successful sign-in or sign-up to populate the store */
  setUser: (user: AuthUser) => void;

  /** Call this after sign-out to clear the store */
  clearUser: () => void;

  /** Call this to signal that the initial auth check has finished */
  setLoading: (loading: boolean) => void;

  /** Update partial user fields (e.g. after levelling up or updating profile) */
  updateUser: (partial: Partial<AuthUser>) => void;
}

/* ─────────────────────────────────────────────
 * Store Definition
 * ───────────────────────────────────────────── */

/**
 * useAuthStore — global auth state accessible in any client component.
 *
 * Usage example:
 *   const user = useAuthStore((state) => state.user);
 *   const setUser = useAuthStore((state) => state.setUser);
 */
export const useAuthStore = create<AuthState>((set) => ({
  /* ── Initial State ── */
  user: null,
  isLoading: true,           // start as loading until we check the session
  isAuthenticated: false,

  /* ── Actions ── */

  /**
   * Stores the authenticated user and marks the session as active.
   * Called right after a successful login or page load with valid session.
   */
  setUser: (user: AuthUser) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    }),

  /**
   * Clears the user from the store after sign-out.
   * The actual cookie deletion is handled by the API route.
   */
  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  /**
   * Marks loading as false without changing the user.
   * Used after /api/auth/me returns a 401 (not logged in).
   */
  setLoading: (loading: boolean) =>
    set({ isLoading: loading }),

  /**
   * Applies a partial update to the current user object.
   * Useful when XP, level, or streak changes after an action.
   */
  updateUser: (partial: Partial<AuthUser>) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : null,
    })),
}));
