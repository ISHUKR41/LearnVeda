/**
 * FILE: page.tsx
 * LOCATION: src/app/sign-up/[[...sign-up]]/page.tsx
 * PURPOSE: Clerk-powered sign-up page. [[...sign-up]] catch-all lets Clerk handle
 *          OAuth callbacks and multi-step email verification. Left panel shows
 *          EduQuest benefits; right panel renders Clerk's <SignUp> component.
 * LAST UPDATED: 2026-06-01
 */

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import { BookOpen, Brain, Star, Users } from "lucide-react";
import styles from "../SignUp.module.css";

export const metadata = {
  title: "Create Account — EduQuest",
  description: "Join thousands of Indian students on EduQuest. Study smarter with gamified learning, XP, streaks, and live quiz battles.",
};

/* Clerk component appearance — matches EduQuest dark design system */
const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary:         "#2563EB",
    colorBackground:      "#0d1b2e",
    colorInputBackground: "#0a1628",
    colorText:            "#E2E8F0",
    colorTextSecondary:   "#94A3B8",
    colorInputText:       "#E2E8F0",
    borderRadius:         "12px",
    fontFamily:           "Inter, system-ui, sans-serif",
  },
  elements: {
    rootBox:  { width: "100%" },
    card:     { background: "transparent", boxShadow: "none", border: "none", padding: 0 },
    socialButtonsBlockButton: {
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "10px",
      color: "#E2E8F0",
    },
  },
};

/* Benefits shown in left panel — maps to existing .promiseCard/.promiseIcon CSS classes */
const BENEFITS: { icon: typeof Brain; cls: "blue" | "amber" | "green"; title: string; desc: string }[] = [
  { icon: Brain,  cls: "blue",  title: "CBSE Class 9–12",   desc: "Full NCERT-aligned curriculum with 1,000+ questions" },
  { icon: Star,   cls: "amber", title: "XP & Level System", desc: "Earn XP for every correct answer and level up" },
  { icon: Users,  cls: "green", title: "Real-time Battles", desc: "Challenge peers in timed live quiz battles" },
];

export default function SignUpPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>

        {/* ── Left branding panel (desktop only) ─────────────────── */}
        <div className={styles.promisePanel}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#34D399", textDecoration: "none", fontWeight: 700, fontSize: 18 }}>
            <BookOpen size={22} aria-hidden="true" />
            <span>EduQuest</span>
          </Link>

          {/* Middle: benefit cards */}
          <div className={styles.promiseMid}>
            {BENEFITS.map((b) => (
              <div key={b.title} className={styles.promiseCard}>
                <div className={`${styles.promiseIcon} ${styles[b.cls]}`}>
                  <b.icon size={18} aria-hidden="true" />
                </div>
                <p className={styles.promiseCardTitle}>{b.title}</p>
                <p className={styles.promiseCardDesc}>{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom tagline */}
          <div className={styles.promiseBottom}>
            <p className={styles.promiseTitle}>India's most gamified learning platform</p>
            <p className={styles.switchLink} style={{ marginTop: 8 }}>
              Already have an account?{" "}
              <Link href="/sign-in" style={{ color: "#34D399", textDecoration: "none" }}>Sign in →</Link>
            </p>
          </div>
        </div>

        {/* ── Right: Clerk sign-up component ─────────────────────── */}
        <div className={styles.card}>
          <SignUp
            appearance={clerkAppearance}
            redirectUrl="/dashboard"
            afterSignUpUrl="/dashboard"
            afterSignInUrl="/dashboard"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
}
