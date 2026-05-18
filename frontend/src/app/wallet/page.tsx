/*
 * FILE: page.tsx
 * LOCATION: src/app/wallet/page.tsx
 * PURPOSE: Wallet / Stars page — shows the authenticated student's virtual
 *          currency balance, how to earn Stars, level milestone rewards,
 *          and the Level 10 gate for wagering Stars in battles.
 *
 *          Stars are EduQuest's non-purchasable virtual currency earned ONLY
 *          through learning and competing (per MCP Section 10 — Monetisation).
 *          They are separate from XP; Stars unlock premium battle features
 *          while XP drives levelling and leaderboard rank.
 *
 *          Data flow:
 *            GET /api/auth/me → user.stars, user.level, user.name
 *            If 401 → redirect to /sign-in
 *
 *          Sections:
 *            1. Hero balance card with decorative glow
 *            2. Three stat pills (level, wager status, daily limit)
 *            3. How to earn Stars — four earn methods
 *            4. Level milestone rewards table
 *            5. Important rules notice
 *
 * USED BY: Navbar profile menu → /wallet, Dashboard quick actions
 * DEPENDENCIES: lucide-react, Wallet.module.css, /api/auth/me
 * LAST UPDATED: 2026-05-18
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star, TrendingUp, Lock, Zap, Swords, Users,
  CheckCircle, ArrowLeft, Loader2, BookOpen, Trophy,
  Shield, AlertCircle, ChevronRight, Info,
  Flame, BarChart3,
} from "lucide-react";
import styles from "./Wallet.module.css";

/* ─────────────────────────────────────────────
 * Static Data — Earn Methods
 * Explains to students how they can accumulate Stars
 * ───────────────────────────────────────────── */

const EARN_METHODS = [
  {
    icon: BookOpen,
    title: "Complete daily plans",
    description:
      "Finish all questions for a study day. Bonus XP from a complete day converts to Stars automatically.",
    stars: "Up to 50 Stars/day",
    colorClass: "earnLearn",
    accent: "#2563EB",
  },
  {
    icon: Swords,
    title: "Win battles",
    description:
      "Defeat an opponent in a quiz battle to earn Stars. Higher-level opponents give bigger rewards.",
    stars: "20–75 Stars/win",
    colorClass: "earnBattle",
    accent: "#DC2626",
  },
  {
    icon: Trophy,
    title: "Participate in events",
    description:
      "Compete in institutional events and olympiads. Stars are awarded based on your final ranking.",
    stars: "100–1000 Stars",
    colorClass: "earnEvent",
    accent: "#D97706",
  },
  {
    icon: Users,
    title: "Community recognition",
    description:
      "Post answers that receive 10+ upvotes. Best-answer badges earn an automatic Stars bonus.",
    stars: "10–50 Stars",
    colorClass: "earnCommunity",
    accent: "#059669",
  },
] as const;

/* ─────────────────────────────────────────────
 * Static Data — Level Milestone Rewards
 * Stars bonuses tied to reaching specific levels
 * ───────────────────────────────────────────── */

const LEVEL_MILESTONES = [
  { level: 3,  reward: "+50 Stars",   unlocks: "Community posting" },
  { level: 5,  reward: "+75 Stars",   unlocks: "Custom avatar" },
  { level: 7,  reward: "+100 Stars",  unlocks: "Battle history" },
  { level: 9,  reward: "+150 Stars",  unlocks: "Skill Pack access" },
  { level: 10, reward: "+500 Stars",  unlocks: "Stars wagering in battles" },
  { level: 15, reward: "+500 Stars",  unlocks: "Raised daily Stars limit" },
  { level: 20, reward: "+1000 Stars", unlocks: "Skill Pack earnings boost" },
  { level: 25, reward: "+1500 Stars", unlocks: "Event hosting rights" },
] as const;

/* ─────────────────────────────────────────────
 * Type for the wallet data fetched from /api/auth/me
 * ───────────────────────────────────────────── */

interface UserWallet {
  stars: number;
  level: number;
  xp: number;
  streak: number;
  name: string;
}

/* ═══════════════════════════════════════════════════════
 * WalletPage Component
 * ═══════════════════════════════════════════════════════ */

export default function WalletPage() {
  const router = useRouter();

  /* Wallet data fetched from the backend */
  const [wallet, setWallet]     = useState<UserWallet | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState("");

  /* Fetch the user's wallet data from /api/auth/me on mount */
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });

        /* Not signed in — redirect to sign-in */
        if (res.status === 401) {
          router.push("/sign-in?next=/wallet");
          return;
        }

        if (!res.ok) {
          setError("Could not load wallet data. Please try again.");
          return;
        }

        const data = (await res.json()) as { user?: UserWallet };
        if (!mounted) return;

        setWallet({
          stars:  data.user?.stars   ?? 0,
          level:  data.user?.level   ?? 1,
          xp:     data.user?.xp      ?? 0,
          streak: data.user?.streak  ?? 0,
          name:   data.user?.name    ?? "Student",
        });
      } catch {
        if (mounted) setError("Network error. Please check your connection.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [router]);

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <div className={styles.loadingPage}>
        <Loader2 size={28} className={styles.spinner} />
        <span>Loading your wallet…</span>
      </div>
    );
  }

  /* ── Error state ── */
  if (error || !wallet) {
    return (
      <div className={styles.errorPage}>
        <AlertCircle size={24} />
        <p>{error || "Could not load wallet."}</p>
        <Link href="/sign-in" className={styles.backLink}>Go to Sign In</Link>
      </div>
    );
  }

  /* Wager unlock is available from Level 10 onwards */
  const canWager = wallet.level >= 10;

  /* ─────────────────────────────────────────────
   * Render
   * ───────────────────────────────────────────── */
  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* ── Back navigation ── */}
        <Link href="/dashboard" className={styles.backBtn}>
          <ArrowLeft size={15} />
          Back to Dashboard
        </Link>

        {/* ══════════════════════════════════════
         * SECTION 1 — Hero Balance Card
         * Large card with gold glow, Stars count,
         * and the Level-10 wager gate.
         * ══════════════════════════════════════ */}
        <div className={styles.balanceCard}>
          {/* Decorative radial glow — visible only when Stars > 0 */}
          <div className={styles.balanceGlow} aria-hidden="true" />

          {/* Label row */}
          <div className={styles.balanceHeader}>
            <Star size={16} className={styles.starIcon} fill="currentColor" />
            <span className={styles.balanceLabel}>Stars Balance</span>
            <span className={styles.balanceName}>— {wallet.name}</span>
          </div>

          {/* Large balance number */}
          <div className={styles.balanceAmount}>
            <Star size={36} className={styles.balanceStar} fill="currentColor" />
            <span className={styles.balanceNumber}>
              {wallet.stars.toLocaleString("en-IN")}
            </span>
            <span className={styles.balanceCurrency}>Stars</span>
          </div>

          <p className={styles.balanceHint}>
            Stars are earned only through learning and competing — they cannot be purchased with real money.
          </p>

          {/* Level-10 wager gate */}
          {canWager ? (
            <div className={styles.wagersUnlocked}>
              <CheckCircle size={15} />
              <span>Stars wagering unlocked! You can stake Stars in battles.</span>
              <Link href="/battle" className={styles.battleLink}>
                Enter Battle <ChevronRight size={13} />
              </Link>
            </div>
          ) : (
            <div className={styles.wagersLocked}>
              <Lock size={13} />
              <div>
                <span>Reach Level 10 to unlock Stars wagering in battles.</span>
                <span className={styles.lockProgress}>
                  You are Level {wallet.level} · {10 - wallet.level} level{10 - wallet.level !== 1 ? "s" : ""} to go
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════
         * SECTION 2 — Stat Chips
         * Four small stat cards: Level, Wager, Streak, Daily Limit
         * ══════════════════════════════════════ */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrap} style={{ "--stat-color": "#2563EB" } as React.CSSProperties}>
              <Zap size={15} />
            </div>
            <span className={styles.statValue}>Level {wallet.level}</span>
            <span className={styles.statLabel}>Current Level</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrap} style={{ "--stat-color": "#D97706" } as React.CSSProperties}>
              <Star size={15} />
            </div>
            <span className={styles.statValue}>{canWager ? "Unlocked" : "Level 10"}</span>
            <span className={styles.statLabel}>Wager Gate</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrap} style={{ "--stat-color": "#DC2626" } as React.CSSProperties}>
              <Flame size={15} />
            </div>
            <span className={styles.statValue}>{wallet.streak} days</span>
            <span className={styles.statLabel}>Active Streak</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrap} style={{ "--stat-color": "#059669" } as React.CSSProperties}>
              <BarChart3 size={15} />
            </div>
            <span className={styles.statValue}>100/day</span>
            <span className={styles.statLabel}>Daily Limit</span>
          </div>
        </div>

        {/* ══════════════════════════════════════
         * SECTION 3 — How to Earn Stars
         * Four earn-method cards explaining each source
         * ══════════════════════════════════════ */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIconWrap}>
              <TrendingUp size={16} strokeWidth={2} />
            </div>
            <h2 className={styles.sectionTitle}>How to Earn Stars</h2>
          </div>

          <div className={styles.earnGrid}>
            {EARN_METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.title}
                  className={styles.earnCard}
                  style={{ "--earn-accent": method.accent } as React.CSSProperties}
                >
                  {/* Coloured icon box */}
                  <div className={styles.earnIconBox}>
                    <Icon size={18} strokeWidth={1.75} />
                  </div>

                  <div className={styles.earnContent}>
                    <h3 className={styles.earnTitle}>{method.title}</h3>
                    <p className={styles.earnDesc}>{method.description}</p>
                  </div>

                  {/* Stars amount badge */}
                  <div className={styles.earnBadge}>{method.stars}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════
         * SECTION 4 — Level Milestones Table
         * Shows each milestone with Stars reward and unlock
         * ══════════════════════════════════════ */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIconWrap}>
              <Trophy size={16} strokeWidth={2} />
            </div>
            <h2 className={styles.sectionTitle}>Level Milestone Rewards</h2>
          </div>

          <div className={styles.milestonesTable}>
            {/* Column headers */}
            <div className={styles.milestonesHeader}>
              <span>Level</span>
              <span>Stars Reward</span>
              <span>Unlock</span>
            </div>

            {/* Milestone rows — reached milestones are highlighted green */}
            {LEVEL_MILESTONES.map((ms) => {
              const reached = wallet.level >= ms.level;
              return (
                <div
                  key={ms.level}
                  className={`${styles.milestoneRow} ${reached ? styles.milestoneReached : ""}`}
                >
                  {reached && <CheckCircle size={12} className={styles.milestoneCheck} />}
                  {!reached && <div className={styles.milestoneLock} />}
                  <span className={styles.milestoneLevel}>Level {ms.level}</span>
                  <span className={styles.milestoneReward}>{ms.reward}</span>
                  <span className={styles.milestoneUnlock}>{ms.unlocks}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════
         * SECTION 5 — Important Rules
         * Non-negotiable policy notice
         * ══════════════════════════════════════ */}
        <div className={styles.rulesCard}>
          <div className={styles.rulesHeader}>
            <Info size={15} />
            <h3 className={styles.rulesTitle}>Important Rules</h3>
          </div>
          <ul className={styles.rulesList}>
            <li>Stars can <strong>never</strong> be purchased with real money</li>
            <li>Stars cannot be transferred between accounts</li>
            <li>Stars earned from community posts are capped at 50 per post per day</li>
            <li>Battle wagering is capped at ₹100 equivalent per day to prevent addiction</li>
            <li>Viewing a hint video does <strong>not</strong> earn or deduct Stars</li>
            <li>EduQuest reserves the right to adjust Stars balances for policy violations</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
