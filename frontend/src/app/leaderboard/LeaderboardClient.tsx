/*
 * FILE: LeaderboardClient.tsx
 * LOCATION: src/app/leaderboard/LeaderboardClient.tsx
 * PURPOSE: Client-side interactive Leaderboard component with filter tabs and top 3 highlights.
 * USED BY: src/app/leaderboard/page.tsx
 * DEPENDENCIES: React, lucide-react, Leaderboard.module.css
 * LAST UPDATED: 2026-05-17
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Crown, Loader2, Flame, Zap } from "lucide-react";
import styles from "./Leaderboard.module.css";

/* ==================== CONSTANTS ==================== */

/** Filter options for the leaderboard — each maps to a backend scope */
const FILTERS = [
  { label: "Global", scope: "global" },
  { label: "Class 9", scope: "class-9" },
  { label: "Class 10", scope: "class-10" },
  { label: "Class 11", scope: "class-11" },
  { label: "Class 12", scope: "class-12" },
  { label: "Engineering", scope: "engineering" },
] as const;

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  initials: string;
  level: number;
  xp: number;
  track: string;
  isSelf: boolean;
  streak?: number;
}

interface LeaderboardApiResponse {
  ok: boolean;
  data?: {
    scope: string;
    entries: LeaderboardEntry[];
    currentUserId: string | null;
  };
  error?: { message: string };
}

/* ==================== COMPONENT ==================== */

/**
 * LeaderboardClient Component
 *
 * The complete leaderboard experience — includes:
 * 1. Filter tabs (Global, Class 9-12, Engineering)
 * 2. Top 3 podium with cards
 * 3. Full rankings table with avatars and mini XP bars
 */
export default function LeaderboardClient() {
  const [activeScope, setActiveScope] = useState("global");
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [status, setStatus] = useState<"loading" | "idle" | "error">("loading");
  const [message, setMessage] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  const podiumLeaders = useMemo(() => {
    const top3 = leaders.filter((leader) => leader.rank <= 3);
    // Reorder to 2, 1, 3 for podium display
    const podium = [null, null, null] as (LeaderboardEntry | null)[];
    top3.forEach(l => {
      if (l.rank === 1) podium[1] = l;
      if (l.rank === 2) podium[0] = l;
      if (l.rank === 3) podium[2] = l;
    });
    return podium.filter(Boolean) as LeaderboardEntry[];
  }, [leaders]);

  const tableLeaders = useMemo(() => leaders.filter((leader) => leader.rank > 3).slice(0, visibleCount), [leaders, visibleCount]);

  useEffect(() => {
    let isMounted = true;

    async function loadLeaderboard() {
      setStatus("loading");
      setMessage("");

      try {
        const response = await fetch(`/api/leaderboard?scope=${activeScope}`, { cache: "no-store" });
        const payload = (await response.json()) as LeaderboardApiResponse;

        if (!isMounted) return;

        if (!response.ok || !payload.ok || !payload.data) {
          setStatus("error");
          setMessage(payload.error?.message ?? "Unable to load leaderboard.");
          return;
        }

        setLeaders(payload.data.entries);
        setStatus("idle");
      } catch {
        if (isMounted) {
          setStatus("error");
          setMessage("Network error while loading leaderboard.");
        }
      }
    }

    loadLeaderboard();

    return () => {
      isMounted = false;
    };
  }, [activeScope]);

  /**
   * Increases the number of visible rows in the table.
   */
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 20);
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Global Leaderboard</h1>
          <p className={styles.subtitle}>Competition is the best way to accelerate your learning.</p>
        </div>

        <div className={styles.filters}>
          <div className={styles.filterScroll}>
            {FILTERS.map((filter) => (
              <button
                key={filter.scope}
                className={`${styles.filterBtn} ${
                  activeScope === filter.scope ? styles.filterBtnActive : ""
                }`}
                onClick={() => setActiveScope(filter.scope)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {status === "loading" ? (
          <div className={styles.statePanel} aria-busy="true" aria-live="polite">
            <Loader2 className={styles.spinner} size={24} />
            <p>Fetching rankings...</p>
          </div>
        ) : status === "error" ? (
          <div className={styles.statePanel} role="alert">
            <AlertCircle size={24} color="var(--color-danger)" />
            <p>{message}</p>
          </div>
        ) : leaders.length === 0 ? (
          <div className={styles.statePanel}>
            <p>No ranked learners yet in this category.</p>
          </div>
        ) : (
          <>
            <div className={styles.podiumContainer}>
              <div className={styles.podium}>
                {podiumLeaders.map((user) => (
                  <div
                    key={user.userId}
                    className={`${styles.podiumItem} ${styles[`podiumRank${user.rank}`]} ${user.isSelf ? styles.podiumSelf : ""}`}
                  >
                    <div className={styles.podiumBadge}>
                      {user.rank === 1 && <Crown size={24} className={styles.crownGold} />}
                      {user.rank === 2 && <Crown size={20} className={styles.crownSilver} />}
                      {user.rank === 3 && <Crown size={18} className={styles.crownBronze} />}
                    </div>
                    <div className={`${styles.podiumAvatar} ${styles[`avatarGrad${((user.rank - 1) % 6) + 1}`]}`}>
                      {user.initials}
                    </div>
                    <div className={styles.podiumName}>{user.name.split(" ")[0]}</div>
                    <div className={styles.podiumLevel}>Level {user.level}</div>
                    <div className={styles.podiumXP}>
                      <Zap size={12} />
                      {user.xp.toLocaleString()} XP
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span className={styles.colRank}>Rank</span>
                <span className={styles.colUser}>User</span>
                <span className={styles.colLevel}>Level</span>
                <span className={styles.colXP}>Total XP</span>
                <span className={styles.colStreak}>Streak</span>
              </div>
              {tableLeaders.map((user) => (
                <div
                  key={user.userId}
                  className={`${styles.tableRow} ${user.isSelf ? styles.tableRowSelf : ""}`}
                >
                  <span className={styles.colRank}>
                    <span className={`${styles.rankBadge} ${user.rank <= 10 ? styles.rankTop : ""}`}>
                      #{user.rank}
                    </span>
                  </span>
                  <div className={styles.colUser}>
                    <div className={`${styles.userAvatar} ${styles[`avatarGrad${((user.rank - 1) % 6) + 1}`]}`}>
                      {user.initials}
                    </div>
                    <span className={styles.userName}>
                      {user.name}
                      {user.isSelf && <span className={styles.selfLabel}>YOU</span>}
                    </span>
                  </div>
                  <span className={styles.colLevel}>
                    <div className={styles.levelProgressCell}>
                      <span className={styles.levelText}>Lv.{user.level}</span>
                      <div className={styles.miniXPBar}>
                        <div className={styles.miniXPFill} />
                      </div>
                    </div>
                  </span>
                  <span className={styles.colXP}>
                    <div className={styles.xpValue}>
                      <Zap size={14} className={styles.xpIcon} />
                      {user.xp.toLocaleString()}
                    </div>
                  </span>
                  <span className={styles.colStreak}>
                    <div className={styles.streakValue}>
                      <Flame size={14} className={styles.streakIcon} />
                      {user.streak ?? user.level}d
                    </div>
                  </span>
                </div>
              ))}
            </div>

            {leaders.length > visibleCount + 3 && (
              <div className={styles.loadMoreContainer}>
                <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
                  Load More Rankings
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
