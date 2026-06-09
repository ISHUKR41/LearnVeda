"use client";

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  track: string;
  role: string;
  level: number;
  xp: number;
  streak: number;
}

interface AuthContextValue {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  user: AuthUser | null;
  signOut: (opts?: { redirectUrl?: string }) => Promise<void>;
  reload: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  isLoaded: false,
  isSignedIn: false,
  userId: null,
  user: null,
  signOut: async () => {},
  reload: async () => {},
});

export function ClerkProvider({ children }: {
  children: ReactNode;
  afterSignOutUrl?: string;
  signInUrl?: string;
  signUpUrl?: string;
  signInFallbackRedirectUrl?: string;
  signUpFallbackRedirectUrl?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const body = await res.json();
        const u = body?.data?.user ?? body?.user;
        if (u) {
          setUser(u);
          setUserId(u.id);
          setIsSignedIn(true);
          setIsLoaded(true);
          return;
        }
      }
    } catch {}
    setUser(null);
    setUserId(null);
    setIsSignedIn(false);
    setIsLoaded(true);
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const signOut = useCallback(async (opts?: { redirectUrl?: string }) => {
    try {
      await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" });
    } catch {}
    setUser(null);
    setUserId(null);
    setIsSignedIn(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("eduquest_user");
      localStorage.removeItem("eduquest_refresh_token");
      localStorage.removeItem("eduquest_session");
    }
    router.replace(opts?.redirectUrl ?? "/");
  }, [router]);

  return (
    <AuthContext.Provider value={{ isLoaded, isSignedIn, userId, user, signOut, reload: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  return {
    isLoaded: ctx.isLoaded,
    isSignedIn: ctx.isSignedIn,
    userId: ctx.userId,
  };
}

export function useUser() {
  const ctx = useContext(AuthContext);
  return {
    isLoaded: ctx.isLoaded,
    isSignedIn: ctx.isSignedIn,
    user: ctx.user ? {
      id: ctx.user.id,
      fullName: ctx.user.name,
      firstName: ctx.user.name?.split(" ")[0] ?? null,
      lastName: ctx.user.name?.split(" ").slice(1).join(" ") || null,
      primaryEmailAddress: { emailAddress: ctx.user.email },
      emailAddresses: [{ emailAddress: ctx.user.email }],
      username: ctx.user.email?.split("@")[0] ?? null,
    } : null,
  };
}

export function useClerk() {
  const ctx = useContext(AuthContext);
  return {
    signOut: ctx.signOut,
    user: ctx.user,
  };
}

export function SignIn({
  fallbackRedirectUrl = "/dashboard",
}: {
  appearance?: unknown;
  routing?: string;
  path?: string;
  fallbackRedirectUrl?: string;
  signUpFallbackRedirectUrl?: string;
  signUpUrl?: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { reload } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const body = await res.json();
      if (res.ok) {
        await reload();
        router.replace(fallbackRedirectUrl);
      } else {
        setError(body?.message ?? "Invalid email or password.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      <div>
        <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#94A3B8" }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: "100%", background: "#0a1628", border: "1px solid #1e2d3d", color: "#E2E8F0", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box" }}
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#94A3B8" }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: "100%", background: "#0a1628", border: "1px solid #1e2d3d", color: "#E2E8F0", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box" }}
          placeholder="••••••••"
        />
      </div>
      {error && (
        <p style={{ color: "#EF4444", fontSize: 13, margin: 0 }}>{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "#fff", borderRadius: 10, padding: "11px 0", fontWeight: 600, fontSize: 14, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <p style={{ textAlign: "center", fontSize: 13, color: "#64748B", margin: 0 }}>
        Don&apos;t have an account?{" "}
        <a href="/sign-up" style={{ color: "#60A5FA", textDecoration: "none" }}>Sign up →</a>
      </p>
    </form>
  );
}

export function SignUp({
  fallbackRedirectUrl = "/dashboard",
}: {
  appearance?: unknown;
  routing?: string;
  path?: string;
  fallbackRedirectUrl?: string;
  signInFallbackRedirectUrl?: string;
  signInUrl?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { reload } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });
      const body = await res.json();
      if (res.ok) {
        await reload();
        router.replace(fallbackRedirectUrl);
      } else {
        setError(body?.message ?? "Could not create account.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      <div>
        <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#94A3B8" }}>Full name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ width: "100%", background: "#0a1628", border: "1px solid #1e2d3d", color: "#E2E8F0", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box" }}
          placeholder="Your name"
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#94A3B8" }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: "100%", background: "#0a1628", border: "1px solid #1e2d3d", color: "#E2E8F0", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box" }}
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#94A3B8" }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={8}
          style={{ width: "100%", background: "#0a1628", border: "1px solid #1e2d3d", color: "#E2E8F0", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box" }}
          placeholder="Min. 8 characters"
        />
      </div>
      {error && (
        <p style={{ color: "#EF4444", fontSize: 13, margin: 0 }}>{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        style={{ background: "linear-gradient(135deg,#10B981,#059669)", color: "#fff", borderRadius: 10, padding: "11px 0", fontWeight: 600, fontSize: 14, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
      <p style={{ textAlign: "center", fontSize: 13, color: "#64748B", margin: 0 }}>
        Already have an account?{" "}
        <a href="/sign-in" style={{ color: "#34D399", textDecoration: "none" }}>Sign in →</a>
      </p>
    </form>
  );
}
