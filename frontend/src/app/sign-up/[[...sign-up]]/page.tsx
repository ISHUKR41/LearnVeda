"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Mail, Lock, User, Loader2, AlertCircle, Zap, BookOpenCheck, Trophy, Flame } from "lucide-react";
import styles from "../SignUp.module.css";

const TRACKS = [
  { value: "class-9",  label: "Class 9",  desc: "CBSE Science & Maths" },
  { value: "class-10", label: "Class 10", desc: "Board exam prep" },
  { value: "class-11", label: "Class 11", desc: "Science stream" },
  { value: "class-12", label: "Class 12", desc: "Board + entrance" },
  { value: "engineering", label: "Engineering", desc: "B.Tech / JEE" },
];

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [track, setTrack] = useState("class-9");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("Please accept the terms to continue.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, track }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data?.error?.message ?? "Could not create your account. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        {/* Left branding panel */}
        <div className={styles.promisePanel}>
          <div className={styles.promiseBadge}>⚡ Start Free</div>

          <div className={styles.promiseMid}>
            <div className={styles.promiseCard}>
              <div className={`${styles.promiseIcon} ${styles.blue}`}><Zap size={18} /></div>
              <div>
                <p className={styles.promiseCardTitle}>Day-wise Study Plans</p>
                <p className={styles.promiseCardDesc}>Structured CBSE curriculum, topic by topic</p>
              </div>
            </div>
            <div className={styles.promiseCard}>
              <div className={`${styles.promiseIcon} ${styles.amber}`}><Trophy size={18} /></div>
              <div>
                <p className={styles.promiseCardTitle}>Live Quiz Battles</p>
                <p className={styles.promiseCardDesc}>Compete with peers in real-time MCQ battles</p>
              </div>
            </div>
            <div className={styles.promiseCard}>
              <div className={`${styles.promiseIcon} ${styles.green}`}><BookOpenCheck size={18} /></div>
              <div>
                <p className={styles.promiseCardTitle}>1200+ Practice Questions</p>
                <p className={styles.promiseCardDesc}>MCQ, short, long, and HOTS coverage</p>
              </div>
            </div>
            <div className={styles.promiseCard}>
              <div className={`${styles.promiseIcon} ${styles.purple}`}><Flame size={18} /></div>
              <div>
                <p className={styles.promiseCardTitle}>XP &amp; Streaks</p>
                <p className={styles.promiseCardDesc}>Gamified learning that keeps you consistent</p>
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

        {/* Sign-up form */}
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <BookOpen size={24} />
            </div>
            <h1 className={styles.title}>Create your account</h1>
            <p className={styles.subtitle}>Free forever — no credit card required</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">Full Name</label>
              <div className={styles.inputWrap}>
                <User size={16} className={styles.inputIcon} />
                <input
                  id="name"
                  type="text"
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Email</label>
              <div className={styles.inputWrap}>
                <Mail size={16} className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
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
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Learning Track</label>
              <div className={styles.trackGrid}>
                {TRACKS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    className={`${styles.trackOption} ${track === t.value ? styles.trackOptionActive : ""}`}
                    onClick={() => setTrack(t.value)}
                  >
                    <div>
                      <strong>{t.label}</strong>
                      <small>{t.desc}</small>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.consentRow}>
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
              </label>
            </div>

            {error && (
              <div className={styles.formError}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? <Loader2 size={18} className={styles.spinner} /> : null}
              {isLoading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className={styles.footerText}>
            Already have an account?{" "}
            <Link href="/sign-in" className={styles.footerLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
