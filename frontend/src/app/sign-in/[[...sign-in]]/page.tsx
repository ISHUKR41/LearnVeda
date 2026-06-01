/**
 * FILE: page.tsx
 * LOCATION: src/app/sign-in/[[...sign-in]]/page.tsx
 * PURPOSE: Sign-in page with custom email/password form.
 *          Posts to /api/auth/sign-in which sets an httpOnly session cookie.
 * LAST UPDATED: 2026-06-01
 */

"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, LogIn, Mail, Lock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import styles from "../SignIn.module.css";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") ?? "/dashboard";
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: "include",
      });

      const body = await res.json();

      if (!res.ok) {
        setError(body?.error?.message ?? "Sign in failed. Please try again.");
        return;
      }

      const user = body?.data?.user ?? body?.user;
      if (user) setUser(user);

      router.push(redirectUrl);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>

        {/* Left panel */}
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

        {/* Right panel: sign-in form */}
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <BookOpen size={20} />
            </div>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {error && (
              <div className={styles.formError} role="alert">
                {error}
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Email</label>
              <div className={styles.inputWrap}>
                <Mail size={16} className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">Password</label>
              <div className={styles.inputWrap}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  placeholder="Your password"
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <><span className={styles.spinner}>⟳</span> Signing in…</>
              ) : (
                <><LogIn size={16} /> Sign In</>
              )}
            </button>
          </form>

          <p className={styles.footerText}>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className={styles.footerLink}>Create one free</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
