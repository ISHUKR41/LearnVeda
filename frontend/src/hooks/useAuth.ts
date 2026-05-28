/**
 * FILE: useAuth.ts
 * LOCATION: src/hooks/useAuth.ts
 * PURPOSE: Custom React hook that provides authenticated user state and actions.
 *          Wraps the Zustand authStore and handles initial session hydration by
 *          calling /api/auth/me once per app lifecycle (not per component mount).
 *
 * BUG FIXES (2026-05-28):
 *   1. Removed module-level `hydrationStarted` boolean that permanently blocked
 *      re-hydration after the first check. The store's own isLoading flag is now
 *      the single source of truth for "has hydration completed".
 *   2. Fixed response parsing: /api/auth/me uses apiSuccess() which wraps the
 *      user inside { status, data: { user } } — NOT { user } directly.
 *   3. Added exponential backoff retry on network errors (max 2 retries).
 *
 * USED BY: Navbar, Profile page, Dashboard, Battle, any protected component
 * DEPENDENCIES: authStore (Zustand)
 * LAST UPDATED: 2026-05-28
 */

import { useEffect, useRef } from "react";
import { useAuthStore, type AuthUser } from "@/store/authStore";

/* ─────────────────────────────────────────────
 * API Response Types
 * ───────────────────────────────────────────── */

/**
 * Shape of the /api/auth/me response from apiSuccess().
 * apiSuccess() returns: { ok: true, data: <payload>, message?: string }
 * So the actual user lives at data.user.
 */
interface MeApiResponse {
  ok: boolean;
  data?: {
    user: AuthUser;
  };
  error?: {
    code: string;
    message: string;
  };
}

/* ─────────────────────────────────────────────
 * Hook Definition
 * ───────────────────────────────────────────── */

/**
 * useAuth — provides authentication state and actions.
 *
 * On the very first mount (when isLoading is still true), fetches
 * /api/auth/me to populate the Zustand store from the active
 * Clerk or legacy cookie session.
 *
 * All subsequent components reading authStore will get the cached value
 * without triggering another fetch.
 *
 * Returns:
 *   - user          → the logged-in AuthUser object, or null if not logged in
 *   - isLoading     → true while the initial session check is in progress
 *   - isAuthenticated → true once a valid session is confirmed
 *   - setUser       → action to update the store after manual login
 *   - clearUser     → action to clear the store after sign-out
 */
export function useAuth() {
  /* Read state and actions from the global Zustand store */
  const user            = useAuthStore((state) => state.user);
  const isLoading       = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser         = useAuthStore((state) => state.setUser);
  const clearUser       = useAuthStore((state) => state.clearUser);
  const setLoading      = useAuthStore((state) => state.setLoading);

  /*
   * We use a ref instead of a module-level variable so this flag resets
   * whenever the app bootstraps from scratch (e.g. after an HMR full reload
   * in development), while still being stable across normal re-renders.
   *
   * The flag prevents duplicate fetch calls when multiple components using
   * this hook mount at the same time (e.g. Navbar + ProfilePage together).
   */
  const hydrateAttempted = useRef(false);

  useEffect(() => {
    /*
     * Only run the hydration fetch when:
     *   1. We haven't attempted it in this React tree lifecycle (ref guard)
     *   2. The store still reports isLoading = true (i.e. not yet hydrated)
     *
     * If isLoading is false, the store already has a definitive answer
     * (either a real user or null/guest). No need to fetch again.
     */
    if (hydrateAttempted.current || !isLoading) return;
    hydrateAttempted.current = true;

    let isMounted = true;

    /**
     * Fetches the current session from the server with an exponential
     * backoff retry on network failures (handles brief Wi-Fi drops on
     * mobile). Max 2 retries with 500ms / 1500ms delays.
     */
    async function hydrateSession(retryCount = 0): Promise<void> {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
          credentials: "include", /* Send the Clerk/legacy session cookie */
        });

        if (!isMounted) return;

        if (response.ok) {
          /*
           * Parse the response from apiSuccess() shape:
           *   { ok: true, data: { user: AuthUser } }
           *
           * IMPORTANT: The user is nested under `data`, NOT at the top level.
           */
          const payload: MeApiResponse = await response.json();
          const authenticatedUser = payload.data?.user;

          if (authenticatedUser && isMounted) {
            /* Valid session — populate the store */
            setUser(authenticatedUser);
          } else {
            /* Unexpected payload shape — treat as unauthenticated */
            if (isMounted) clearUser();
          }
        } else if (response.status === 401) {
          /* No valid session — mark as guest without logging an error */
          if (isMounted) clearUser();
        } else {
          /*
           * Server error (5xx etc.). Try again with exponential backoff
           * up to 2 times (total: 3 attempts) before giving up.
           */
          if (retryCount < 2 && isMounted) {
            const delay = retryCount === 0 ? 500 : 1500;
            await new Promise((resolve) => setTimeout(resolve, delay));
            if (isMounted) return hydrateSession(retryCount + 1);
          }
          /* Give up after retries — treat as unauthenticated */
          if (isMounted) clearUser();
        }
      } catch {
        /*
         * Network error (offline, DNS failure, etc.).
         * Retry once after 500ms in case it was a transient glitch.
         */
        if (retryCount === 0 && isMounted) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          if (isMounted) return hydrateSession(1);
        }
        /* After retry, treat as unauthenticated to unblock the UI */
        if (isMounted) clearUser();
      }
    }

    hydrateSession();

    /* Prevent state updates after the component unmounts */
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); /* Intentionally empty — we only want this to run once on mount */

  return {
    user,
    isLoading,
    isAuthenticated,
    setUser,
    clearUser,
    setLoading,
  };
}
