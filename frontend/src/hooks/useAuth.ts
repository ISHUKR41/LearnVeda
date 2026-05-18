/**
 * FILE: useAuth.ts
 * LOCATION: src/hooks/useAuth.ts
 * PURPOSE: Custom React hook that provides authenticated user state and actions.
 *          Wraps the Zustand authStore and adds the initial session hydration
 *          logic — fetching /api/auth/me on first mount to populate the store
 *          from the server-side cookie session.
 *          Components should use this hook instead of accessing the authStore
 *          directly, so session hydration happens automatically.
 * USED BY: Navbar, Profile page, Dashboard, any protected component
 * DEPENDENCIES: authStore (Zustand), TanStack Query
 * LAST UPDATED: 2026-05-16
 * AUTHOR NOTE: The session check happens once per page load (not per mount).
 *              Subsequent components reading authStore will get the cached value.
 */

import { useEffect } from "react";
import { useAuthStore, type AuthUser } from "@/store/authStore";

/* ─────────────────────────────────────────────
 * API Response Types
 * ───────────────────────────────────────────── */

/**
 * Shape of the /api/auth/me response when the user is logged in.
 * Must match the fields returned by the server-side API route.
 */
interface MeResponse {
  user: AuthUser;
}

/* ─────────────────────────────────────────────
 * Module-level guard
 * Prevents multiple concurrent session hydration calls if several components
 * using this hook mount at the same time (e.g. Navbar + ProfilePage together).
 * ───────────────────────────────────────────── */
let hydrationStarted = false;

/* ─────────────────────────────────────────────
 * Hook Definition
 * ───────────────────────────────────────────── */

/**
 * useAuth — provides authentication state and actions.
 *
 * Returns:
 *   - user          → the logged-in AuthUser object, or null if not logged in
 *   - isLoading     → true while the initial session check is in progress
 *   - isAuthenticated → true once a valid session is confirmed
 *   - setUser       → action to update the store after login
 *   - clearUser     → action to clear the store after sign-out
 *
 * Usage:
 *   const { user, isAuthenticated } = useAuth();
 */
export function useAuth() {
  /* Read state and actions from the global Zustand store */
  const user           = useAuthStore((state) => state.user);
  const isLoading      = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser        = useAuthStore((state) => state.setUser);
  const clearUser      = useAuthStore((state) => state.clearUser);
  const setLoading     = useAuthStore((state) => state.setLoading);

  /**
   * On first mount (and only once per page load), fetch the current session
   * from /api/auth/me. This tells us whether the user is already logged in
   * via a server-side httpOnly cookie.
   *
   * We use a module-level boolean (hydrationStarted) to prevent duplicate
   * fetch calls when multiple components using this hook mount simultaneously.
   */
  useEffect(() => {
    /* Skip if we have already started or completed hydration this session */
    if (hydrationStarted || !isLoading) return;
    hydrationStarted = true;

    let isMounted = true;

    async function hydrateSession() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
          credentials: "include",
        });

        if (!isMounted) return;

        if (response.ok) {
          /* The user has a valid session — parse and store their data */
          const data: MeResponse = await response.json();
          setUser(data.user);
        } else {
          /* No valid session (401 or other error) — mark as guest */
          clearUser();
        }
      } catch {
        /* Network error — treat as logged out to avoid blocking the UI */
        if (isMounted) clearUser();
      }
    }

    hydrateSession();

    /* Cleanup — prevents state updates if the component unmounts mid-fetch */
    return () => {
      isMounted = false;
    };
  }, [isLoading, setUser, clearUser, setLoading]);

  return {
    user,
    isLoading,
    isAuthenticated,
    setUser,
    clearUser,
  };
}
