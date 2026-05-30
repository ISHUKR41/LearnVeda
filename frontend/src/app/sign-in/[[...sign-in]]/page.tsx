"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../SignIn.module.css";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error?.message || "Invalid email or password.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Welcome back
          </h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
            Sign in to continue your learning journey
          </p>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 360, margin: "0 auto" }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-bg-card)", color: "inherit", fontSize: "1rem" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-bg-card)", color: "inherit", fontSize: "1rem" }}
            />
            {error && (
              <p style={{ color: "#ef4444", fontSize: "0.875rem", margin: 0 }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{ padding: "0.75rem 1rem", borderRadius: "8px", background: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "1rem", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p style={{ marginTop: "1.5rem", color: "var(--color-text-secondary)" }}>
            Don&apos;t have an account?{" "}
            <a href="/sign-up" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
              Create one free
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
