/**
 * FILE: BattleClient.tsx
 * LOCATION: src/app/battle/BattleClient.tsx
 * PURPOSE: Client-side interactive Battle Arena lobby with real-time Socket.io
 *          matchmaking, wager selection, level-10 gate enforcement, and player stats.
 *
 * FEATURES:
 *  1. Subject selector (fetched from the backend content API)
 *  2. Wager selector (0, 10, 50, 100, 200, 500 Stars) with Level 10 gate
 *  3. "Find Opponent" button that navigates to /battle/matchmaking with query params
 *  4. Player stats card (wins, losses, win rate)
 *  5. Recent battle history
 *
 * USED BY: src/app/battle/page.tsx
 * DEPENDENCIES: React, lucide-react, Battle.module.css, useAuth hook, api utility
 * LAST UPDATED: 2026-05-22
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Loader2,
  Swords,
  Trophy,
  Zap,
  History,
  Star,
  Lock,
  Coins,
  Shield,
  ChevronRight,
} from "lucide-react";
import styles from "./Battle.module.css";
import { useAuth } from "@/hooks/useAuth";

/* ==================== TYPES ==================== */

/**
 * Shape of the backend /api/content/subjects response.
 * Each subject has an ID and name used for matchmaking queue selection.
 */
interface SubjectOption {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

/**
 * Shape of the battle stats data fetched from /api/battle/history.
 * Used to populate the player stats card in the lobby sidebar.
 */
interface BattleStats {
  totalBattles: number;
  wins: number;
  losses: number;
  totalXPFromBattles: number;
}

/**
 * Shape of an individual match record in the battle history response.
 * Displayed in the "Recent Battles" list.
 */
interface MatchRecord {
  matchId: string;
  subjectName: string;
  myScore: number;
  opponentScore: number;
  opponentName: string;
  iWon: boolean;
  xpEarned: number;
  startTime: string;
}

/* ==================== CONSTANTS ==================== */

/**
 * Available wager tiers (in Stars).
 * The first option (0) is always free and available to everyone.
 * Wager options ≥ 10 require Level 10+ to unlock.
 */
const WAGER_OPTIONS = [0, 10, 50, 100, 200, 500] as const;

/**
 * Fallback subject categories used if the backend is unreachable.
 * These match the seeded CBSE subjects in the database.
 */
const FALLBACK_SUBJECTS: SubjectOption[] = [
  { id: "mathematics", name: "Mathematics", slug: "mathematics", icon: "calculator", color: "#3b82f6" },
  { id: "science", name: "Science", slug: "science", icon: "atom", color: "#10b981" },
  { id: "english", name: "English", slug: "english", icon: "book", color: "#ec4899" },
  { id: "social-science", name: "Social Science", slug: "social-science", icon: "globe", color: "#f59e0b" },
  { id: "physics", name: "Physics", slug: "physics", icon: "zap", color: "#f97316" },
  { id: "chemistry", name: "Chemistry", slug: "chemistry", icon: "flask", color: "#06b6d4" },
];

/**
 * Builds compact initials without exposing unnecessary profile details.
 */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ==================== COMPONENT ==================== */

/**
 * BattleClient Component
 *
 * Professional battle lobby experience including:
 * 1. Dynamic subject selector (from database or fallback)
 * 2. Wager selection with Level 10 gate lock
 * 3. "Find Opponent" button that routes to the matchmaking page
 * 4. Player stats mini card with win/loss/win-rate
 * 5. Recent battle history list
 */
export default function BattleClient() {
  /* ── Router for navigation ── */
  const router = useRouter();

  /* ── Auth state from global store ── */
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  /* ── Local component state ── */
  const [subjects, setSubjects] = useState<SubjectOption[]>(FALLBACK_SUBJECTS);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(FALLBACK_SUBJECTS[0].id);
  const [selectedWager, setSelectedWager] = useState<number>(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [stats, setStats] = useState<BattleStats>({
    totalBattles: 0, wins: 0, losses: 0, totalXPFromBattles: 0,
  });
  const [recentMatches, setRecentMatches] = useState<MatchRecord[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  /* ── Derived values ── */
  const playerLevel = user?.level ?? 1;
  const canWager = playerLevel >= 10;
  const winRate = stats.totalBattles > 0
    ? Math.round((stats.wins / stats.totalBattles) * 100)
    : 0;

  /* ──────────────────────────────────────────────
   * EFFECT: Load initial data (subjects, battle stats, wallet)
   * Runs once on mount, fetches all lobby data in parallel.
   * ────────────────────────────────────────────── */
  useEffect(() => {
    let isMounted = true;

    async function loadLobbyData() {
      try {
        /* Fetch subjects, battle history, and wallet balance in parallel */
        const [subjectsRes, historyRes, walletRes] = await Promise.allSettled([
          fetch("/api/content/subjects", { cache: "no-store" }),
          fetch("/api/battle/history?limit=5", { cache: "no-store" }),
          fetch("/api/wallet", { cache: "no-store" }),
        ]);

        if (!isMounted) return;

        /* Parse subjects if available */
        if (subjectsRes.status === "fulfilled" && subjectsRes.value.ok) {
          const subjectsData = await subjectsRes.value.json();
          if (subjectsData.ok && subjectsData.data?.subjects?.length > 0) {
            setSubjects(subjectsData.data.subjects);
            setSelectedSubjectId(subjectsData.data.subjects[0].id);
          }
        }

        /* Parse battle history and stats */
        if (historyRes.status === "fulfilled" && historyRes.value.ok) {
          const historyData = await historyRes.value.json();
          if (historyData.ok && historyData.data) {
            setRecentMatches(historyData.data.matches ?? []);
            if (historyData.data.stats) {
              setStats({
                totalBattles: parseInt(historyData.data.stats.totalBattles) || 0,
                wins: parseInt(historyData.data.stats.wins) || 0,
                losses: parseInt(historyData.data.stats.losses) || 0,
                totalXPFromBattles: parseInt(historyData.data.stats.totalXPFromBattles) || 0,
              });
            }
          }
        }

        /* Parse wallet balance */
        if (walletRes.status === "fulfilled" && walletRes.value.ok) {
          const walletData = await walletRes.value.json();
          if (walletData.ok && walletData.data?.balance !== undefined) {
            setWalletBalance(walletData.data.balance);
          }
        }
      } catch {
        /* Silently handle initial fetch errors — fallback data already set */
      }
    }

    loadLobbyData();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ──────────────────────────────────────────────
   * HANDLER: Find Opponent
   * Validates wager selection and navigates to the matchmaking page.
   * ────────────────────────────────────────────── */
  const handleFindOpponent = useCallback(() => {
    /* Check authentication */
    if (!isAuthenticated) {
      setStatus("error");
      setErrorMessage("Please sign in before starting a battle.");
      return;
    }

    /* Check wager eligibility */
    if (selectedWager > 0 && !canWager) {
      setStatus("error");
      setErrorMessage("You must be Level 10 or above to place wagers.");
      return;
    }

    /* Check wallet balance */
    if (selectedWager > walletBalance) {
      setStatus("error");
      setErrorMessage(`Insufficient Stars. You have ${walletBalance} but need ${selectedWager}.`);
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    /* Navigate to the matchmaking page with query parameters */
    const params = new URLSearchParams({
      subjectId: selectedSubjectId,
      wager: String(selectedWager),
    });

    router.push(`/battle/matchmaking?${params.toString()}`);
  }, [isAuthenticated, selectedWager, canWager, walletBalance, selectedSubjectId, router]);

  return (
    <div className={styles.page}>

      {/* ==================== HERO BANNER ==================== */}
      {/*
       * Full-width battle hero — dark red/orange gradient with decorative orbs
       * and a stat bar showing the battle system's competitive scale.
       * Intentionally different from other pages (red vs blue/amber) to signal
       * that the Battle Arena is a high-stakes competitive space.
       */}
      <div className={styles.hero} aria-label="Battle Arena introduction">
        {/* Decorative radial background orb — large, blurred, red tint */}
        <div className={styles.heroOrb} aria-hidden="true" />

        <div className={styles.heroInner}>
          {/* Eyebrow chip */}
          <div className={styles.eyebrow}>
            <Swords size={14} aria-hidden="true" /> Battle Arena · Live Matchmaking
          </div>

          <h1 className={styles.heroTitle}>Battle Arena</h1>

          <p className={styles.heroSubtitle}>
            Challenge opponents in real-time quiz duels. Choose a subject,
            place a wager, and prove your knowledge under pressure.
          </p>

          {/* Three quick stats about the battle system */}
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>6+</span>
              <span className={styles.heroStatLabel}>Subjects</span>
            </div>
            <div className={styles.heroStatDivider} aria-hidden="true" />
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>30s</span>
              <span className={styles.heroStatLabel}>Per Question</span>
            </div>
            <div className={styles.heroStatDivider} aria-hidden="true" />
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>2×</span>
              <span className={styles.heroStatLabel}>Wager Payout</span>
            </div>
            <div className={styles.heroStatDivider} aria-hidden="true" />
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>
                <Shield size={14} />
              </span>
              <span className={styles.heroStatLabel}>Anti-Cheat</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.inner}>
        <div className={styles.lobbyHeader}>
          <h2 className={styles.lobbyTitle}>Battle Lobby</h2>
          <p className={styles.subtitle}>
            Select a subject, choose your wager, and find your opponent.
          </p>
        </div>

        <div className={styles.lobbyGrid}>
          {/* ==================== LEFT COLUMN: Battle Setup ==================== */}
          <div className={styles.leftCol}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <Swords size={20} className={styles.iconRed} />
                Quick Battle
              </h2>

              <div className={styles.battleSetup}>
                {/* ── Subject Selector ── */}
                <div className={styles.setupGroup}>
                  <label>Select Subject</label>
                  <div className={styles.categoryGrid}>
                    {subjects.map((subj) => (
                      <button
                        key={subj.id}
                        className={`${styles.categoryBtn} ${
                          selectedSubjectId === subj.id ? styles.categoryBtnActive : ""
                        }`}
                        onClick={() => setSelectedSubjectId(subj.id)}
                      >
                        {subj.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Wager Selector ── */}
                <div className={styles.setupGroup}>
                  <label>
                    <Coins size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                    Wager Stars
                    {!canWager && (
                      <span className={styles.levelGateBadge}>
                        <Lock size={10} /> Level 10 Required
                      </span>
                    )}
                  </label>
                  <div className={styles.wagerGrid}>
                    {WAGER_OPTIONS.map((amount) => {
                      const isLocked = amount > 0 && !canWager;
                      const isActive = selectedWager === amount;
                      const insufficientBalance = amount > walletBalance && amount > 0;

                      return (
                        <button
                          key={amount}
                          className={`${styles.wagerBtn} ${
                            isActive ? styles.wagerBtnActive : ""
                          } ${isLocked ? styles.wagerBtnLocked : ""} ${
                            insufficientBalance ? styles.wagerBtnDisabled : ""
                          }`}
                          onClick={() => !isLocked && setSelectedWager(amount)}
                          disabled={isLocked}
                          title={
                            isLocked
                              ? "Reach Level 10 to unlock wagers"
                              : insufficientBalance
                              ? `Need ${amount} Stars (you have ${walletBalance})`
                              : `Wager ${amount} Stars`
                          }
                        >
                          {isLocked && <Lock size={10} className={styles.lockIcon} />}
                          {amount === 0 ? (
                            "Free"
                          ) : (
                            <>
                              <Star size={12} className={styles.starIcon} />
                              {amount}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {selectedWager > 0 && (
                    <p className={styles.wagerHint}>
                      Winner takes <strong>{selectedWager * 2} Stars</strong> · Draw refunds both
                    </p>
                  )}
                </div>

                {/* ── Find Opponent Button ── */}
                <button
                  className={styles.startBtn}
                  onClick={handleFindOpponent}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <Loader2 size={24} className={styles.spinner} />
                  ) : (
                    <Zap size={24} />
                  )}
                  {status === "loading" ? "Preparing..." : "Find Opponent"}
                  <ChevronRight size={18} />
                </button>

                {/* ── Error Message ── */}
                {status === "error" && (
                  <div className={styles.errorNotice}>
                    <AlertCircle size={16} />
                    <span>{errorMessage}</span>
                    {errorMessage.includes("sign in") && (
                      <Link href="/sign-in">Sign In</Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ==================== RIGHT COLUMN: Stats & History ==================== */}
          <div className={styles.rightCol}>
            {/* ── Player Stats Card ── */}
            <div className={styles.statsCard}>
              <div className={styles.statsHeader}>
                <div className={styles.playerInfo}>
                  <div className={styles.playerAvatar}>
                    {user ? getInitials(user.name) : "?"}
                  </div>
                  <div>
                    <div className={styles.playerName}>
                      {user ? user.name.split(" ")[0] : "Guest"}
                    </div>
                    <div className={styles.playerLevel}>
                      Level {playerLevel}
                      {walletBalance > 0 && (
                        <span className={styles.walletBadge}>
                          <Star size={10} /> {walletBalance}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Trophy size={24} className={styles.iconGold} />
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.miniStat}>
                  <span className={styles.miniStatLabel}>Wins</span>
                  <span className={styles.miniStatValue}>{stats.wins}</span>
                </div>
                <div className={styles.miniStat}>
                  <span className={styles.miniStatLabel}>Losses</span>
                  <span className={styles.miniStatValue}>{stats.losses}</span>
                </div>
                <div className={styles.miniStat}>
                  <span className={styles.miniStatLabel}>Win Rate</span>
                  <span className={styles.miniStatValue}>{winRate}%</span>
                </div>
              </div>
            </div>

            {/* ── Recent Battles ── */}
            <div className={styles.card}>
              <h3 className={styles.cardTitleSmall}>
                <History size={18} />
                Recent Battles
              </h3>
              <div className={styles.battleHistory}>
                {recentMatches.length === 0 ? (
                  <div className={styles.emptyHistory}>
                    <p>No recent battles found. Start your first duel!</p>
                  </div>
                ) : (
                  <div className={styles.historyList}>
                    {recentMatches.slice(0, 5).map((match) => (
                      <div key={match.matchId} className={styles.historyItem}>
                        <div
                          className={
                            match.iWon
                              ? styles.historyResWin
                              : styles.historyResLoss
                          }
                        >
                          {match.iWon ? "WIN" : "LOSS"}
                        </div>
                        <div className={styles.historyMeta}>
                          <span className={styles.historyOpp}>
                            vs {match.opponentName ?? "Unknown"}
                          </span>
                          <span className={styles.historyDate}>
                            {match.subjectName} · {match.myScore}-{match.opponentScore}
                          </span>
                        </div>
                        <div className={styles.historyXP}>
                          +{match.xpEarned} XP
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
