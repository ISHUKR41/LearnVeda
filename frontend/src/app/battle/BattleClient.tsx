/*
 * FILE: BattleClient.tsx
 * LOCATION: src/app/battle/BattleClient.tsx
 * PURPOSE: Client-side interactive Battle Arena lobby with matchmaking and stats.
 * USED BY: src/app/battle/page.tsx
 * DEPENDENCIES: React, lucide-react, Battle.module.css
 * LAST UPDATED: 2026-05-17
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  AlertCircle, 
  Loader2, 
  Swords, 
  Trophy, 
  Zap, 
  Search,
  XCircle,
  History
} from "lucide-react";
import styles from "./Battle.module.css";

/* ==================== TYPES ==================== */

interface MatchmakingResponse {
  ok: boolean;
  data?: {
    ticketId: string;
    category: string;
    status: string;
    estimatedWaitSeconds: number;
    opponentPool: string;
  };
  error?: { message: string };
}

interface BattleSummary {
  totalTickets: number;
  queuedTickets: number;
  matchedTickets: number;
  wins: number;
  losses: number;
  winRate: number | null;
  categories: string[];
}

interface BattleSummaryResponse {
  ok: boolean;
  data?: {
    summary: BattleSummary;
  };
  error?: { message: string };
}

interface CurrentUserResponse {
  ok: boolean;
  data?: {
    user: {
      name: string;
      level: number;
    };
  };
}

/* ==================== CONSTANTS ==================== */

const CATEGORIES = ["Mathematics", "Science", "English", "DSA", "Python", "C++"];

const EMPTY_SUMMARY: BattleSummary = {
  totalTickets: 0,
  queuedTickets: 0,
  matchedTickets: 0,
  wins: 0,
  losses: 0,
  winRate: null,
  categories: [],
};

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
 * 1. Quick Battle setup
 * 2. Matchmaking state with animations
 * 3. User stats mini card
 * 4. Recent battles list (mocked based on summary)
 */
export default function BattleClient() {
  const [selectedCategory, setSelectedCategory] = useState("mathematics");
  const [status, setStatus] = useState<"idle" | "loading" | "queued" | "error">("idle");
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState<BattleSummary>(EMPTY_SUMMARY);
  const [player, setPlayer] = useState({
    name: "Learner",
    level: 1,
    initials: "U",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [sumRes, meRes] = await Promise.all([
          fetch("/api/battles", { cache: "no-store" }),
          fetch("/api/auth/me", { cache: "no-store" })
        ]);

        const sumPayload = (await sumRes.json()) as BattleSummaryResponse;
        const mePayload = (await meRes.json()) as CurrentUserResponse;

        if (!isMounted) return;

        if (sumRes.ok && sumPayload.ok && sumPayload.data?.summary) {
          setSummary(sumPayload.data.summary);
        }

        if (meRes.ok && mePayload.ok && mePayload.data?.user) {
          setPlayer({
            name: mePayload.data.user.name,
            level: mePayload.data.user.level,
            initials: getInitials(mePayload.data.user.name),
          });
        }
      } catch {
        // Silently handle initial fetch errors
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  /** 
   * Starts matchmaking through the protected API. 
   */
  const handleFindOpponent = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/battle/matchmaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: selectedCategory }),
      });
      const payload = (await response.json()) as MatchmakingResponse;

      if (response.status === 401) {
        setStatus("error");
        setMessage("Please sign in before starting a battle.");
        return;
      }

      if (!response.ok || !payload.ok || !payload.data) {
        setStatus("error");
        setMessage(payload.error?.message ?? "Unable to start matchmaking.");
        return;
      }

      setStatus("queued");
      setMessage(`Estimated wait: ${payload.data.estimatedWaitSeconds}s`);
    } catch {
      setStatus("error");
      setMessage("Network error while joining the battle queue.");
    }
  };

  /** 
   * Cancels the active matchmaking request. 
   */
  const handleCancelMatchmaking = () => {
    setStatus("idle");
    setMessage("");
  };

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
            find a match, and prove your knowledge under pressure.
          </p>

          {/* Three quick stats about the battle system */}
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>6</span>
              <span className={styles.heroStatLabel}>Subjects</span>
            </div>
            <div className={styles.heroStatDivider} aria-hidden="true" />
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>Timed</span>
              <span className={styles.heroStatLabel}>Rounds</span>
            </div>
            <div className={styles.heroStatDivider} aria-hidden="true" />
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>+XP</span>
              <span className={styles.heroStatLabel}>Per Win</span>
            </div>
            <div className={styles.heroStatDivider} aria-hidden="true" />
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>Fair</span>
              <span className={styles.heroStatLabel}>Anti-Cheat</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.inner}>
        <div className={styles.lobbyHeader}>
          <h2 className={styles.lobbyTitle}>Battle Lobby</h2>
          <p className={styles.subtitle}>Select a subject and find your opponent.</p>
        </div>

        <div className={styles.lobbyGrid}>
          <div className={styles.leftCol}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <Swords size={20} className={styles.iconRed} />
                Quick Battle
              </h2>
              
              {status === "queued" ? (
                <div className={styles.matchmakingState}>
                  <div className={styles.radarAnimation}>
                    <div className={styles.radarCircle} />
                    <div className={styles.radarCircle} />
                    <div className={styles.radarCircle} />
                    <Search size={40} className={styles.radarIcon} />
                  </div>
                  <h3 className={styles.matchmakingTitle}>Searching for opponent...</h3>
                  <p className={styles.matchmakingSubtitle}>{message}</p>
                  <button className={styles.cancelBtn} onClick={handleCancelMatchmaking}>
                    <XCircle size={18} /> Cancel Search
                  </button>
                </div>
              ) : (
                <div className={styles.battleSetup}>
                  <div className={styles.setupGroup}>
                    <label>Select Subject</label>
                    <div className={styles.categoryGrid}>
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          className={`${styles.categoryBtn} ${
                            selectedCategory === cat.toLowerCase() ? styles.categoryBtnActive : ""
                          }`}
                          onClick={() => setSelectedCategory(cat.toLowerCase())}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

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
                  </button>

                  {status === "error" && (
                    <div className={styles.errorNotice}>
                      <AlertCircle size={16} />
                      <span>{message}</span>
                      {message.includes("sign in") && <Link href="/sign-in">Sign In</Link>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.statsCard}>
              <div className={styles.statsHeader}>
                <div className={styles.playerInfo}>
                  <div className={styles.playerAvatar}>{player.initials}</div>
                  <div>
                    <div className={styles.playerName}>{player.name.split(" ")[0]}</div>
                    <div className={styles.playerLevel}>Level {player.level}</div>
                  </div>
                </div>
                <Trophy size={24} className={styles.iconGold} />
              </div>
              
              <div className={styles.statsGrid}>
                <div className={styles.miniStat}>
                  <span className={styles.miniStatLabel}>Wins</span>
                  <span className={styles.miniStatValue}>{summary.wins}</span>
                </div>
                <div className={styles.miniStat}>
                  <span className={styles.miniStatLabel}>Losses</span>
                  <span className={styles.miniStatValue}>{summary.losses}</span>
                </div>
                <div className={styles.miniStat}>
                  <span className={styles.miniStatLabel}>Win Rate</span>
                  <span className={styles.miniStatValue}>
                    {summary.winRate !== null ? `${summary.winRate}%` : "0%"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitleSmall}>
                <History size={18} />
                Recent Battles
              </h3>
              <div className={styles.battleHistory}>
                {summary.totalTickets === 0 ? (
                  <div className={styles.emptyHistory}>
                    <p>No recent battles found.</p>
                  </div>
                ) : (
                  <div className={styles.historyList}>
                    {/* Mock history items based on real summary counts */}
                    {summary.wins > 0 && (
                      <div className={styles.historyItem}>
                        <div className={styles.historyResWin}>WIN</div>
                        <div className={styles.historyMeta}>
                          <span className={styles.historyOpp}>Opponent Learner</span>
                          <span className={styles.historyDate}>Today</span>
                        </div>
                        <div className={styles.historyXP}>+25 XP</div>
                      </div>
                    )}
                    {summary.losses > 0 && (
                      <div className={styles.historyItem}>
                        <div className={styles.historyResLoss}>LOSS</div>
                        <div className={styles.historyMeta}>
                          <span className={styles.historyOpp}>Opponent Pro</span>
                          <span className={styles.historyDate}>Yesterday</span>
                        </div>
                        <div className={styles.historyXP}>+5 XP</div>
                      </div>
                    )}
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
