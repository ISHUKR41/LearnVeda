/**
 * FILE: auth.store.ts
 * LOCATION: frontend/src/stores/auth.store.ts
 * PURPOSE: Global authentication state management using Zustand.
 *          Manages user session, login/logout actions, token lifecycle,
 *          and persistent session restoration on page load.
 *
 * STATE:
 *  - user: Current authenticated user object (or null)
 *  - isAuthenticated: Whether the user is logged in
 *  - isLoading: Whether an auth operation is in progress
 *  - error: Last auth error message (or null)
 *
 * ACTIONS:
 *  - login(email, password): Authenticate and set session
 *  - register(data): Create account and set session
 *  - logout(): Clear session and redirect
 *  - restoreSession(): Attempt to restore from refresh token
 *  - clearError(): Clear error state
 *
 * PERSISTENCE:
 *  - Access token: In-memory (secure, lost on tab close)
 *  - Refresh token: localStorage (allows session restoration)
 *  - User data: localStorage (for immediate hydration before API call)
 *
 * DEPENDENCIES: zustand, ../lib/api/api
 * USED BY: Navbar, Dashboard, ProtectedRoute, Settings, Profile
 * LAST UPDATED: 2026-05-19
 */

import { create } from "zustand";
import {
  authApi,
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearTokens,
} from "@/lib/api/api";

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

/** User object shape — matches the backend /auth/me response */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  level: number;
  xp: number;
  points: number;
  streak: number;
  highestStreak: number;
  classLevel: string | null;
  stream: string | null;
  board: string;
  isVerified: boolean;
  walletBalance: number;
  isPremium: boolean;
  createdAt: string;
}

/** Registration form data */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  classLevel?: string;
  stream?: string;
}

/** Auth store state shape */
interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  restoreSession: () => Promise<void>;
  clearError: () => void;
  setUser: (user: AuthUser | null) => void;
}

/* ─────────────────────────────────────────────
 * Auth Store
 * ───────────────────────────────────────────── */

export const useAuthStore = create<AuthState>((set) => ({
  /* ── Initial State ── */
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  /* ── Login Action ──
   * Authenticates with email/password, stores tokens, and fetches full user profile.
   * Returns true on success, false on failure.
   */
  login: async (email: string, password: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const { data: response } = await authApi.login({ email, password });

      if (!response.ok) {
        set({ isLoading: false, error: response.error?.message ?? "Login failed." });
        return false;
      }

      const { user, accessToken, refreshToken } = response.data;

      // Store tokens
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      // Persist user data for immediate hydration on next page load
      if (typeof window !== "undefined") {
        localStorage.setItem("eduquest_user", JSON.stringify(user));
      }

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? "Login failed. Please check your credentials.";

      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  /* ── Register Action ──
   * Creates a new account, stores tokens, and sets the user session.
   * Returns true on success, false on failure.
   */
  register: async (data: RegisterData): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const { data: response } = await authApi.register(data);

      if (!response.ok) {
        set({ isLoading: false, error: response.error?.message ?? "Registration failed." });
        return false;
      }

      const { user, accessToken, refreshToken } = response.data;

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      if (typeof window !== "undefined") {
        localStorage.setItem("eduquest_user", JSON.stringify(user));
      }

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? "Registration failed. Please try again.";

      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  /* ── Logout Action ──
   * Clears all tokens and user data, resets store to initial state.
   */
  logout: () => {
    clearTokens();
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  /* ── Restore Session Action ──
   * Called on app initialization (in Providers component).
   * Attempts to restore the user session from stored tokens.
   *
   * Flow:
   * 1. Check localStorage for cached user data (immediate hydration)
   * 2. Check for refresh token
   * 3. Call /auth/refresh to get a new access token
   * 4. Call /auth/me to get fresh user data
   * 5. Update store with latest user data
   */
  restoreSession: async () => {
    // Try immediate hydration from cached user data
    if (typeof window !== "undefined") {
      const cachedUser = localStorage.getItem("eduquest_user");
      if (cachedUser) {
        try {
          const user = JSON.parse(cachedUser);
          set({ user, isAuthenticated: true });
        } catch {
          // Invalid cached data — ignore
        }
      }
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) return;

    try {
      // Refresh the access token
      const { data: refreshResponse } = await authApi.refresh(refreshToken);

      if (refreshResponse.ok) {
        setAccessToken(refreshResponse.data.accessToken);
        setRefreshToken(refreshResponse.data.refreshToken);

        // Fetch fresh user data
        const { data: meResponse } = await authApi.me();

        if (meResponse.ok) {
          const user = meResponse.data.user;
          if (typeof window !== "undefined") {
            localStorage.setItem("eduquest_user", JSON.stringify(user));
          }
          set({ user, isAuthenticated: true });
        }
      }
    } catch {
      // Refresh failed — session is expired, clear everything
      clearTokens();
      set({ user: null, isAuthenticated: false });
    }
  },

  /* ── Clear Error ── */
  clearError: () => set({ error: null }),

  /* ── Set User (for profile updates) ── */
  setUser: (user: AuthUser | null) => {
    set({ user, isAuthenticated: !!user });
    if (user && typeof window !== "undefined") {
      localStorage.setItem("eduquest_user", JSON.stringify(user));
    }
  },
}));

export default useAuthStore;
