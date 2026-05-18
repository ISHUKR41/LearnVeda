/*
 * FILE: page.tsx
 * LOCATION: src/app/wallet/page.tsx
 * PURPOSE: Wallet / Stars page — shows the student's virtual currency balance (Stars),
 *          how to earn Stars, transaction history, and the Level 10 gate for wagering.
 *          Stars are EduQuest's non-purchasable virtual currency earned ONLY through
 *          learning and competing (per MCP Section 10 — Monetisation).
 *
 *          Stars balance and transaction history are fetched from the backend.
 *          If the user is not signed in, they are redirected to /sign-in.
 *
 * USED BY: Next.js App Router — accessible at /wallet
 * DEPENDENCIES: lucide-react, Wallet.module.css, /api/auth/me
 * LAST UPDATED: 2026-05-17
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star, TrendingUp, Lock, Zap, Swords, Users,
  CheckCircle, ArrowLeft, Loader2, BookOpen, Trophy,
  Shield, AlertCircle, ChevronRight
} from "lucide-react";
import styles from "./Wallet.module.css";

/* ─────────────────────────────────────────────
 * Data
 * ───────────────────────────────────────────── */

/** How to earn Stars — static explanatory list */
const EARN_METHODS = [
  {
    icon: BookOpen,
    title: "Complete daily plans",
    description: "Finish all questions for a day to earn bonus XP that converts to Stars.",
    stars: "Up to 50 Stars/day",
    colorClass: "earnLearn",
  },
  {
    icon: Swords,
    title: "Win battles",
    description: "Defeating an opponent in a quiz battle earns Stars — especially at high levels.",
    stars: "20–75 Stars/win",
    colorClass: "earnBattle",
  },
  {
    icon: Trophy,
    title: "Participate in events",
    description: "Competing in institutional events rewards Stars based on your ranking.",
    stars: "100–1000 Stars",
    colorClass: "earnEvent",
  },
  {
    icon: Users,
    title: "Community recognition",
    description: "Posts with 10+ upvotes earn Stars. Best answers earn bonus Stars.",
    stars: "10–50 Stars",
    colorClass: "earnCommunity",
  },
] as const;

/** Level milestones with Stars rewards */
const LEVEL_MILESTONES = [
  { level: 3,  reward: "+50 Stars bonus",   unlocks: "—" },
  { level: 7,  reward: "+100 Stars bonus",  unlocks: "—" },
  { level: 9,  reward: "+150 Stars bonus",  unlocks: "—" },
  { level: 10, reward: "+500 Stars bonus",  unlocks: "Stars wagering in battles" },
  { level: 15, reward: "+500 Stars bonus",  unlocks: "Raised daily limit" },
  { level: 20, reward: "+1000 Stars bonus", unlocks: "Skill Pack earnings" },
];

/* ─────────────────────────────────────────────
 * Component
 * ───────────────────────────────────────────── */

interface UserWallet {
  stars: number;
  level: number;
  name: string;
}

export default function WalletPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });

        if (res.status === 401) {
          router.push("/sign-in");
          return;
        }

        if (!res.ok) {
          setError("Could not load wallet data.");
          return;
        }

        const data = await res.json();
        if (!mounted) return;

        setWallet({
          stars: data.user?.stars ?? 0,
          level: data.user?.level ?? 1,
          name:  data.user?.name  ?? "Student",
        });
      } catch {
        if (mounted) setError("Network error. Please try again.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [router]);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className={styles.loadingPage}>
        <Loader2 size={28} className={styles.spinner} />
        <span>Loading wallet…</span>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !wallet) {
    return (
      <div className={styles.errorPage}>
        <AlertCircle size={24} />
        <p>{error || "Could not load wallet."}</p>
        <Link href="/sign-in" className={styles.backLink}>Sign In</Link>
      </div>
    );
  }

  const canWager = wallet.level >= 10;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* BACK LINK */}
        <Link href="/dashboard" className={styles.backBtn}>
          <ArrowLeft size={16} /> Dashboard
        </Link>

        {/* HERO BALANCE CARD */}
        <div className={styles.balanceCard}>
          {/* Decorative glow */}
          <div className={styles.balanceGlow} aria-hidden="true" />

          <div className={styles.balanceHeader}>
            <Star size={18} className={styles.starIcon} />
            <span className={styles.balanceLabel}>Your Stars Balance</span>
          </div>

          <div className={styles.balanceAmount}>
            <Star size={32} className={styles.balanceStar} fill="currentColor" />
            <span className={styles.balanceNumber}>{wallet.stars.toLocaleString("en-IN")}</span>
            <span className={styles.balanceCurrency}>Stars</span>
          </div>

          <p className={styles.balanceHint}>
            Stars are earned only through learning — never purchased.
          </p>

          {/* Level-10 wager gate */}
          {canWager ? (
            <div className={styles.wagersUnlocked}>
              <CheckCircle size={16} />
              Stars wagering is unlocked! Use them in battle.
              <Link href="/battle" className={styles.battleLink}>
                Go to Battle <ChevronRight size={14} />
              </Link>
            </div>
          ) : (
            <div className={styles.wagersLocked}>
              <Lock size={14} />
              Reach Level 10 to unlock Stars wagering in battles.
              <span className={styles.lockProgress}>
                Current: Level {wallet.level} · {10 - wallet.level} levels to go
              </span>
            </div>
          )}
        </div>

        {/* STATS ROW */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <Zap size={18} className={styles.statIcon} />
            <span className={styles.statValue}>Level {wallet.level}</span>
            <span className={styles.statLabel}>Current Level</span>
          </div>
          <div className={styles.statCard}>
            <Star size={18} className={`${styles.statIcon} ${styles.statIconStar}`} />
            <span className={styles.statValue}>{canWager ? "Unlocked" : "Level 10"}</span>
            <span className={styles.statLabel}>Wager Status</span>
          </div>
          <div className={styles.statCard}>
            <Shield size={18} className={`${styles.statIcon} ${styles.statIconShield}`} />
            <span className={styles.statValue}>100/day</span>
            <span className={styles.statLabel}>Daily Earn Limit</span>
          </div>
        </div>

        {/* HOW TO EARN SECTION */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <TrendingUp size={18} className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>How to Earn Stars</h2>
          </div>

          <div className={styles.earnGrid}>
            {EARN_METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <div key={method.title} className={styles.earnCard}>
                  <div className={`${styles.earnIconBox} ${styles[method.colorClass]}`}>
                    <Icon size={20} />
                  </div>
                  <div className={styles.earnContent}>
                    <h3 className={styles.earnTitle}>{method.title}</h3>
                    <p className={styles.earnDesc}>{method.description}</p>
                  </div>
                  <div className={styles.earnBadge}>{method.stars}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* LEVEL MILESTONES SECTION */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Trophy size={18} className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Level Milestone Rewards</h2>
          </div>

          <div className={styles.milestonesTable}>
            <div className={styles.milestonesHeader}>
              <span>Level</span>
              <span>Stars Reward</span>
              <span>Unlock</span>
            </div>
            {LEVEL_MILESTONES.map((ms) => (
              <div
                key={ms.level}
                className={`${styles.milestoneRow} ${wallet.level >= ms.level ? styles.milestoneReached : ""}`}
              >
                {wallet.level >= ms.level && (
                  <CheckCircle size={12} className={styles.milestoneCheck} />
                )}
                <span className={styles.milestoneLevel}>Level {ms.level}</span>
                <span className={styles.milestoneReward}>{ms.reward}</span>
                <span className={styles.milestoneUnlock}>{ms.unlocks}</span>
              </div>
            ))}
          </div>
        </section>

        {/* IMPORTANT RULES */}
        <div className={styles.rulesCard}>
          <h3 className={styles.rulesTitle}>Important Rules</h3>
          <ul className={styles.rulesList}>
            <li>Stars can NEVER be purchased with real money</li>
            <li>Stars cannot be transferred between accounts</li>
            <li>Stars earned from community are capped at 50/post/day</li>
            <li>Battle wagering is capped at ₹100 equivalent per day</li>
            <li>Viewing a hint video does NOT earn or deduct Stars</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
