import { SignIn } from "@/lib/clerk-shim/client";
import Link from "next/link";
import { BookOpen, Flame, Trophy, Zap } from "lucide-react";
import styles from "../SignIn.module.css";

export const metadata = {
  title: "Sign In — VidyaBolt",
  description: "Sign in to your VidyaBolt account to continue learning, competing, and levelling up.",
};

const FEATURES = [
  { icon: Flame,  bg: "rgba(245,158,11,0.15)", color: "#F59E0B", title: "Daily Streaks",  desc: "Streak multipliers up to 3× XP" },
  { icon: Trophy, bg: "rgba(37,99,235,0.15)",  color: "#60A5FA", title: "Live Battles",   desc: "Compete with peers in real-time" },
  { icon: Zap,    bg: "rgba(16,185,129,0.15)", color: "#10B981", title: "XP System",      desc: "15–35 XP per question + chapter milestones" },
];

export default function SignInPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.panel}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#60A5FA", textDecoration: "none", fontWeight: 700, fontSize: 18, marginBottom: 24 }}>
            <BookOpen size={22} aria-hidden="true" />
            <span>VidyaBolt</span>
          </Link>
          <div className={styles.panelBody}>
            <h1 className={styles.panelTitle}>Resume your<br />learning journey</h1>
            <p className={styles.panelText}>
              Sign in with your email to continue earning XP, maintaining
              your streak, and climbing the leaderboard.
            </p>
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
          <p className={styles.switchLink} style={{ marginTop: "auto" }}>
            New to VidyaBolt?{" "}
            <Link href="/sign-up" style={{ color: "#60A5FA", textDecoration: "none" }}>
              Create a free account →
            </Link>
          </p>
        </div>
        <div className={styles.card}>
          <SignIn
            fallbackRedirectUrl="/dashboard"
            signUpFallbackRedirectUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
}
