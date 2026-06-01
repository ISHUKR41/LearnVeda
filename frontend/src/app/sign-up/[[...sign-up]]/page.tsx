/**
 * FILE: page.tsx
 * LOCATION: src/app/sign-up/[[...sign-up]]/page.tsx
 * PURPOSE: Sign-up page with custom registration form.
 *          Posts to /api/auth/sign-up which sets an httpOnly session cookie.
 *          Fixed: sends selectedClass (not track) and acceptTerms:true to match schema.
 * LAST UPDATED: 2026-06-01
 */

"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, UserPlus, Mail, Lock, User, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import styles from "../SignUp.module.css";

const TRACKS = [
  { value: "class-9",     label: "Class 9  — CBSE Board" },
  { value: "class-10",    label: "Class 10 — Board Prep" },
  { value: "class-11",    label: "Class 11 — Stream Start" },
  { value: "class-12",    label: "Class 12 — Board + Entrance" },
  { value: "engineering", label: "Engineering — Coding Tracks" },
] as const;

export default function SignUpPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [name,          setName]          = useState("");
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("class-9");
  const [error,         setError]         = useState("");
  const [isLoading,     setIsLoading]     = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    /* Basic password strength: needs at least one letter and one number */
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must contain at least one letter and one number.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/sign-up", {
        method:      "POST",
        headers:     { "Content-Type": "application/json" },
        credentials: "include",
        /* FIX: schema expects selectedClass (not track) and acceptTerms:true */
        body: JSON.stringify({
          name:          name.trim(),
          email:         email.trim(),
          password,
          selectedClass,
          acceptTerms:   true,
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        const msg = body?.error?.message ?? "Registration failed. Please try again.";
        setError(msg);
        return;
      }

      /* Hydrate auth store from the response user object */
      const user = body?.data?.user ?? body?.user;
      if (user) setUser(user);

      router.push("/dashboard");
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>

        {/* ── Left panel: value propositions ── */}
        <div className={styles.promisePanel}>
          <div className={styles.promiseBadge}>⚡ Start Free</div>

          <div className={styles.promiseMid}>
            <div className={styles.promiseCard}>
              <div className={`${styles.promiseIcon} ${styles.blue}`}>⚡</div>
              <div>
                <p className={styles.promiseCardTitle}>Day-wise Study Plans</p>
                <p className={styles.promiseCardDesc}>Structured CBSE curriculum, topic by topic</p>
              </div>
            </div>
            <div className={styles.promiseCard}>
              <div className={`${styles.promiseIcon} ${styles.amber}`}>🏆</div>
              <div>
                <p className={styles.promiseCardTitle}>Live Quiz Battles</p>
                <p className={styles.promiseCardDesc}>Compete with peers in real-time MCQ battles</p>
              </div>
            </div>
            <div className={styles.promiseCard}>
              <div className={`${styles.promiseIcon} ${styles.green}`}>📚</div>
              <div>
                <p className={styles.promiseCardTitle}>1200+ Practice Questions</p>
                <p className={styles.promiseCardDesc}>MCQ, short, long, and HOTS coverage</p>
              </div>
            </div>
          </div>

          <div className={styles.promiseBottom}>
            <h2 className={styles.promiseTitle}>Join 50,000+ students on EduQuest</h2>
            <div className={styles.promiseList}>
              <span>✓ Free to start, no credit card needed</span>
              <span>✓ Class 9–12 CBSE + Engineering tracks</span>
              <span>✓ Global leaderboard ranking</span>
            </div>
          </div>
        </div>

        {/* ── Right panel: registration form ── */}
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <BookOpen size={20} />
            </div>
            <h1 className={styles.title}>Create your account</h1>
            <p className={styles.subtitle}>Free forever. Start in under 30 seconds.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {error && (
              <div className={styles.errorMsg} role="alert">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="name">Full Name</label>
              <div className={styles.inputWrap}>
                <User size={16} className={styles.inputIcon} />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div className={styles.fieldGroup}>
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

            {/* Password */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="password">Password</label>
              <div className={styles.inputWrap}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  placeholder="At least 8 chars, include a number"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Learning Track */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="selectedClass">Learning Track</label>
              <div className={styles.inputWrap} style={{ position: "relative" }}>
                <select
                  id="selectedClass"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className={styles.input}
                  disabled={isLoading}
                  style={{ paddingRight: "2.5rem", appearance: "none" }}
                >
                  {TRACKS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  style={{
                    position: "absolute", right: "0.85rem", top: "50%",
                    transform: "translateY(-50%)", pointerEvents: "none",
                    color: "var(--color-text-muted)"
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading || !name || !email || !password}
            >
              {isLoading
                ? <><span className={styles.spinner}>⟳</span> Creating account…</>
                : <><UserPlus size={16} /> Create Free Account</>
              }
            </button>
          </form>

          <p className={styles.switchLink}>
            Already have an account?{" "}
            <Link href="/sign-in">Sign in here</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
