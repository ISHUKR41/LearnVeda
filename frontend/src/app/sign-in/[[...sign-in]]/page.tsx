"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import styles from "../SignIn.module.css";

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error?.message ?? "Invalid email or password.");
        return;
      }
      if (data?.data?.user) {
        setUser(data.data.user);
      }
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.panel}>
          <div className={styles.panelBadge}>🎓 EduQuest</div>
          <div className={styles.panelBody}>
            <h2 className={styles.panelTitle}>
              India&apos;s #1 Gamified Learning Platform
            </h2>
            <p className={styles.panelText}>
              Study smarter with day-wise plans, battle peers in real-time quizzes,
              earn XP, and climb the leaderboard.
            </p>
          </div>
          <div className={styles.panelStats}>
            <span>50K+ Students</span>
            <span>1200+ Questions</span>
            <span>Class 9–12</span>
          </div>
        </div>

        <div className={styles.card}>
          <h1 className={styles.formTitle}>Sign In</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">Email</label>
              <input
                id="email"
                className={styles.input}
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="password">Password</label>
              <input
                id="password"
                className={styles.input}
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error && <p className={styles.errorMsg}>{error}</p>}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <p className={styles.switchLink}>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
