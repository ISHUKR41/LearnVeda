"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/clerk-shim/client";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";

const LevelUpModal = dynamic(
  () => import("@/components/gamification/LevelUpModal"),
  { ssr: false },
);

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

function ThemeInitializer() {
  const setTheme = useUIStore((state) => state.setTheme);
  useEffect(() => {
    const stored = localStorage.getItem("learnova-theme");
    const shouldBeDark = stored ? stored === "dark" : true;
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.dataset.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.dataset.theme = "light";
    }
    setTheme(shouldBeDark);
  }, [setTheme]);
  return null;
}

/*
 * AuthHydrator — Syncs Clerk session state with the Zustand auth store.
 *
 * KEY DESIGN RULE (fixes the auth redirect loop):
 *   - Clerk's `isSignedIn` is the ONLY source of truth for "is user logged in".
 *   - `/api/auth/me` is used to ENRICH the user object (XP, level, streak),
 *     NOT to determine auth status.
 *   - If Clerk says signed in but API returns 401, we RETRY (server might be
 *     slow to sync the JWT). We NEVER call clearUser() in this scenario.
 *   - clearUser() is ONLY called when Clerk itself says `isSignedIn === false`.
 *
 * This prevents the infinite loop:
 *   sign-in → dashboard → API 401 → clearUser → Navbar shows "Sign In" →
 *   click → /sign-in → Clerk redirects back → repeat forever.
 */
function AuthHydrator() {
  const { isLoaded, isSignedIn } = useAuth();
  const { setUser, setLoading, clearUser } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) return;

    /* Clerk says NOT signed in → clear everything, done. */
    if (!isSignedIn) {
      clearUser();
      return;
    }

    /* Clerk says SIGNED IN → fetch user profile to enrich the store. */
    let cancelled = false;

    async function hydrate() {
      /* Try up to 3 times with exponential backoff.
       * First-time Clerk users need JIT provisioning in the DB, which
       * can fail on the first attempt if the DB is cold. */
      const MAX_RETRIES = 3;
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          const res = await fetch("/api/auth/me", {
            cache: "no-store",
            headers: { "x-retry": String(attempt) },
          });

          if (cancelled) return;

          if (res.ok) {
            const body = await res.json();
            const user = body?.data?.user ?? body?.user;
            if (user) {
              setUser(user);
              return; /* Success — done */
            }
          }

          /* Non-200 response but Clerk says signed in:
           * This is a transient server issue. Wait and retry.
           * DO NOT call clearUser() here — that causes the redirect loop. */
          if (attempt < MAX_RETRIES - 1) {
            await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
          }
        } catch {
          if (cancelled) return;
          if (attempt < MAX_RETRIES - 1) {
            await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
          }
        }
      }

      /* All retries exhausted but Clerk says user IS signed in.
       * Set loading=false so the UI renders, but keep isAuthenticated=false
       * so the dashboard shows a "Refresh" prompt (not a sign-in link). */
      if (!cancelled) {
        setLoading(false);
      }
    }

    hydrate();

    return () => { cancelled = true; };
  }, [isLoaded, isSignedIn, setUser, setLoading, clearUser]);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeInitializer />
      <AuthHydrator />
      {children}
      <LevelUpModal />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={10}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "10px",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            maxWidth: "380px",
            padding: "12px 16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
          },
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
