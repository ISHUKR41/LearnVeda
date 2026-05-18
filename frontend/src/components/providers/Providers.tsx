/**
 * FILE: Providers.tsx
 * LOCATION: src/components/providers/Providers.tsx
 * PURPOSE: Root provider wrapper for the entire EduQuest application.
 *          Wraps all children with the necessary context providers:
 *          1. TanStack Query — server state management and caching
 *          2. React Hot Toast — beautiful toast notification system
 *          3. Theme initialization — restores dark/light preference from localStorage
 *          This component is a client component so that providers can use
 *          browser APIs (localStorage, window, etc.) safely.
 * USED BY: src/app/layout.tsx — wraps the entire application shell
 * DEPENDENCIES: @tanstack/react-query, react-hot-toast, zustand uiStore
 * LAST UPDATED: 2026-05-16
 * AUTHOR NOTE: All providers must be lightweight — they run on every page load.
 *              Avoid heavy computation or blocking calls in this component.
 */

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import { useUIStore } from "@/store/uiStore";

/*
 * Dynamically import the LevelUpModal so it is only loaded when needed.
 * This keeps the initial bundle smaller — the modal is rarely visible.
 */
const LevelUpModal = dynamic(
  () => import("@/components/gamification/LevelUpModal"),
  { ssr: false },
);

/* ─────────────────────────────────────────────
 * TanStack Query Client Configuration
 * ───────────────────────────────────────────── */

/**
 * Creates the TanStack Query client with sensible production defaults.
 *
 * - staleTime: 60 seconds — data stays fresh for 1 minute before background refetch
 * - retry: 2 — retry failed requests up to 2 times before showing an error
 * - refetchOnWindowFocus: false — prevents aggressive refetching when user
 *   switches browser tabs (this can be noisy during battles/tests)
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,       // 60 seconds before data is considered stale
        retry: 2,                   // retry failed API calls up to 2 times
        refetchOnWindowFocus: false, // don't aggressively refetch on tab focus
      },
    },
  });
}

/* ─────────────────────────────────────────────
 * Singleton Query Client for SSR Compatibility
 * ───────────────────────────────────────────── */

/**
 * We keep a browser-side singleton so the same client persists across
 * route navigations. A new client is created on the server per-request
 * to prevent data leaking between users.
 */
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    /* Server side — always create a new client to avoid shared state */
    return makeQueryClient();
  }
  /* Browser side — reuse the same client across navigations */
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

/* ─────────────────────────────────────────────
 * Theme Initializer (inner component)
 * ───────────────────────────────────────────── */

/**
 * ThemeInitializer — reads the saved theme preference from localStorage
 * and applies it to both the Zustand store and the document element.
 * This runs once on mount, after the first render, to avoid hydration mismatches.
 *
 * We use a separate component so the effect doesn't re-run on every
 * state change in the parent Providers component.
 */
function ThemeInitializer() {
  const setTheme = useUIStore((state) => state.setTheme);

  useEffect(() => {
    /* Read saved theme from localStorage.
     * EduQuest defaults to DARK MODE — the premium dark navy interface is the brand
     * identity. Users who previously chose light mode keep their preference.
     * If no preference is stored at all, always default to dark. */
    const stored = localStorage.getItem("eduquest-theme");
    const shouldBeDark = stored ? stored === "dark" : true; /* dark by default */

    /* Apply theme to document element for CSS variable switching */
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.dataset.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.dataset.theme = "light";
    }

    /* Sync to Zustand store so any component can read the theme */
    setTheme(shouldBeDark);
  }, [setTheme]);

  /* This component renders nothing — it only runs a side effect */
  return null;
}

/* ─────────────────────────────────────────────
 * Main Providers Component
 * ───────────────────────────────────────────── */

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Providers — wraps the entire app with all required context providers.
 *
 * Provider order matters:
 * 1. QueryClientProvider — must be outermost of the data fetching stack
 * 2. ThemeInitializer — applies saved theme after first paint
 * 3. Toaster — renders toast notifications above all other content
 */
export default function Providers({ children }: ProvidersProps) {
  /*
   * We use useState to ensure the query client is only created once per
   * render cycle. This prevents recreation on re-renders while keeping
   * Next.js streaming/Suspense compatibility.
   */
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* Restore the saved theme preference on first mount */}
      <ThemeInitializer />

      {/* The actual page/layout content */}
      {children}

      {/* Level-up celebration modal — auto-shows when Zustand levelStore triggers it */}
      <LevelUpModal />

      {/* Toast notification renderer — floats above all other UI */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={10}
        toastOptions={{
          /* Default duration for all toasts (milliseconds) */
          duration: 4000,

          /* Default styles applied to all toast types */
          style: {
            borderRadius: "10px",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            maxWidth: "380px",
            padding: "12px 16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
          },

          /* Per-type color overrides */
          success: {
            iconTheme: { primary: "#10B981", secondary: "#ECFDF5" },
            style: { background: "#ECFDF5", color: "#065F46", border: "1px solid #A7F3D0" },
          },
          error: {
            iconTheme: { primary: "#EF4444", secondary: "#FEF2F2" },
            style: { background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" },
          },
        }}
      />
    </QueryClientProvider>
  );
}
