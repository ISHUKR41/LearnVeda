/**
 * FILE: page.tsx
 * LOCATION: src/app/sign-in/[[...sign-in]]/page.tsx
 * PURPOSE: Clerk-powered sign-in page. [[...sign-in]] catch-all lets Clerk handle
 *          OAuth callbacks. Left panel shows EduQuest branding with feature highlights;
 *          right panel renders Clerk's <SignIn> component with dark theme appearance.
 * LAST UPDATED: 2026-06-01
 */

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import { BookOpen, Flame, Trophy, Zap } from "lucide-react";
import styles from "../SignIn.module.css";

export const metadata = {
  title: "Sign In — EduQuest",
  description: "Sign in to your EduQuest account to continue learning, competing, and levelling up.",
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
    rootBox:              { width: "100%" },
    card:                 { background: "transparent", boxShadow: "none", border: "none", padding: 0 },
    socialButtonsBlockButton: {
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "10px",
      color: "#E2E8F0",
    },
  },
};

/* Feature highlights shown in left panel */
const FEATURES = [
  { icon: Flame,  bg: "rgba(245,158,11,0.15)", color: "#F59E0B", title: "Daily Streaks",  desc: "Streak multipliers up to 3× XP" },
  { icon: Trophy, bg: "rgba(37,99,235,0.15)",  color: "#60A5FA", title: "Live Battles",   desc: "Compete with peers in real-time" },
  { icon: Zap,    bg: "rgba(16,185,129,0.15)", color: "#10B981", title: "XP System",      desc: "10 XP for every correct answer" },
];

export default function SignInPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>

        {/* ── Left branding panel (desktop only) ─────────────────── */}
        <div className={styles.panel}>
          {/* Logo badge at top */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#60A5FA", textDecoration: "none", fontWeight: 700, fontSize: 18, marginBottom: 24 }}>
            <BookOpen size={22} aria-hidden="true" />
            <span>EduQuest</span>
          </Link>

          {/* Body content */}
          <div className={styles.panelBody}>
            <h1 className={styles.panelTitle}>Resume your<br />learning journey</h1>
            <p className={styles.panelText}>
              Sign in with Google or your email to continue earning XP, maintaining
              your streak, and climbing the leaderboard.
            </p>

            {/* Feature highlight items */}
            <div className={styles.panelStats}>
              {FEATURES.map((f) => (
                <div key={f.title} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: f.bg, color: f.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <f.icon size={16} aria-hidden="true" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{f.title}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#64748B" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className={styles.switchLink} style={{ marginTop: "auto" }}>
            New to EduQuest?{" "}
            <Link href="/sign-up" style={{ color: "#60A5FA", textDecoration: "none" }}>
              Create a free account →
            </Link>
          </p>
        </div>

        {/* ── Right: Clerk sign-in component ─────────────────────── */}
        <div className={styles.card}>
          <SignIn
            appearance={clerkAppearance}
            redirectUrl="/dashboard"
            afterSignInUrl="/dashboard"
            afterSignUpUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
}
