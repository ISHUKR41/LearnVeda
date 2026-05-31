"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import styles from "../SignUp.module.css";

const TRACKS = [
  { value: "class-9",     label: "Class 9" },
  { value: "class-10",    label: "Class 10" },
  { value: "class-11",    label: "Class 11" },
  { value: "class-12",    label: "Class 12" },
  { value: "engineering", label: "Engineering" },
] as const;

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [track, setTrack] = useState<string>("class-9");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, track }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error?.message ?? "Could not create account. Please try again.");
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

        <div className={styles.card}>
          <h1 className={styles.formTitle}>Create Account</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="name">Full Name</label>
              <input
                id="name"
                className={styles.input}
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
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
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="track">Learning Track</label>
              <select
                id="track"
                className={styles.input}
                value={track}
                onChange={(e) => setTrack(e.target.value)}
              >
                {TRACKS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            {error && <p className={styles.errorMsg}>{error}</p>}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
          <p className={styles.switchLink}>
            Already have an account?{" "}
            <Link href="/sign-in">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
