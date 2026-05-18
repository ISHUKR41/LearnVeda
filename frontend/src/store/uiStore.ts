/**
 * FILE: uiStore.ts
 * LOCATION: src/store/uiStore.ts
 * PURPOSE: Global Zustand store for UI state that must be shared across components.
 *          Manages theme (dark/light), global loading states, sidebar visibility,
 *          and notification dot visibility. This avoids prop drilling for UI state.
 * USED BY: Navbar, Layout, ThemeToggle, any component that needs dark mode state
 * DEPENDENCIES: zustand
 * LAST UPDATED: 2026-05-16
 */

import { create } from "zustand";

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

interface UIState {
  /** Whether the app is in dark mode */
  isDark: boolean;

  /** Whether there are unread notifications (shows a dot on the bell icon) */
  hasUnreadNotifications: boolean;

  /** Global page-level loading state (for top-loading bar indicator) */
  isPageLoading: boolean;

  /** Whether the mobile sidebar/drawer is currently open */
  isMobileMenuOpen: boolean;

  /* ── Actions ── */
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
  setHasUnreadNotifications: (hasUnread: boolean) => void;
  setPageLoading: (loading: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

/* ─────────────────────────────────────────────
 * Store Definition
 * ───────────────────────────────────────────── */

/**
 * useUIStore — global UI state.
 *
 * Usage example:
 *   const isDark = useUIStore((state) => state.isDark);
 *   const toggleTheme = useUIStore((state) => state.toggleTheme);
 */
export const useUIStore = create<UIState>((set) => ({
  /* ── Initial State ── */
  isDark: false,
  hasUnreadNotifications: false,
  isPageLoading: false,
  isMobileMenuOpen: false,

  /* ── Actions ── */

  /**
   * Flips the theme between light and dark.
   * The Navbar syncs this to localStorage and the document element.
   */
  toggleTheme: () =>
    set((state) => ({ isDark: !state.isDark })),

  /**
   * Directly sets the theme. Used during hydration to restore saved preference.
   */
  setTheme: (dark: boolean) =>
    set({ isDark: dark }),

  /**
   * Updates the notification badge on the bell icon.
   * Set to true when new notifications arrive, false after user reads them.
   */
  setHasUnreadNotifications: (hasUnread: boolean) =>
    set({ hasUnreadNotifications: hasUnread }),

  /**
   * Controls the top loading bar that appears during route transitions.
   */
  setPageLoading: (loading: boolean) =>
    set({ isPageLoading: loading }),

  /**
   * Opens or closes the mobile hamburger drawer.
   */
  setMobileMenuOpen: (open: boolean) =>
    set({ isMobileMenuOpen: open }),
}));
