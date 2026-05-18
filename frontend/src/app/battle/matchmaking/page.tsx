/**
 * FILE: page.tsx
 * LOCATION: src/app/battle/matchmaking/page.tsx
 * PURPOSE: Real-time battle matchmaking waiting room.
 *          This page is shown after a student selects their battle preferences
 *          (class, subject, chapter) and enters the matchmaking queue.
 *          It shows:
 *            - An animated radar scanning for an opponent
 *            - A live timer counting how long the search has been running
 *            - The selected battle preferences as chips
 *            - A "Found Match!" transition when an opponent is found
 *            - A cancel button to leave the queue
 *          The page uses URL search params to know what subject/class was selected.
 *          In production this connects to Socket.IO for real-time matchmaking events.
 *          Currently uses a simulated match (for demo) that finds after 8–15 seconds.
 * USED BY: src/app/battle/page.tsx — navigates here after user selects preferences
 * DEPENDENCIES: Matchmaking.module.css, lucide-react, next/navigation
 * LAST UPDATED: 2026-05-16
 */

"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  X, Swords, BookOpen, GraduationCap, Zap,
} from "lucide-react";
import styles from "./Matchmaking.module.css";

/* ─────────────────────────────────────────────
 * Format timer as MM:SS
 * ───────────────────────────────────────────── */

/**
 * Converts total seconds to a MM:SS display string.
 * Used for the search timer shown on screen.
 *
 * @param seconds - Total seconds elapsed
 * @returns Formatted string like "01:23"
 */
function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* ─────────────────────────────────────────────
 * Matchmaking Inner Component (needs useSearchParams)
 * ───────────────────────────────────────────── */

/**
 * MatchmakingInner — the actual page logic wrapped in Suspense.
 * Reads URL params for the selected battle subject and class.
 */
function MatchmakingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* Read the battle preferences from URL params */
  const classParam   = searchParams.get("class")   ?? "Class 9";
  const subjectParam = searchParams.get("subject")  ?? "Mathematics";
  const chapterParam = searchParams.get("chapter")  ?? "Number Systems";

  /* Timer: counts how many seconds we've been searching */
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  /* State machine: "searching" → "found" → (navigate to battle) */
  const [matchState, setMatchState] = useState<"searching" | "found">("searching");

  /* Countdown before battle starts after opponent is found */
  const [countdown, setCountdown] = useState(3);

  /* Fake opponent name shown when match is found */
  const [opponentName, setOpponentName] = useState("");

  /* Reference to the interval so we can clear it on unmount */
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const matchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Search Timer ── */
  useEffect(() => {
    /* Tick every second to update the elapsed timer */
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    /*
     * Simulate finding a match after 8–15 seconds.
     * In production, this would be replaced by a Socket.IO event:
     * socket.on("match_found", (data) => { setMatchState("found"); ... })
     */
    const matchDelay = 8000 + Math.random() * 7000;

    const FAKE_OPPONENTS = [
      "Arjun Patel", "Priya Sharma", "Rohan Kumar", "Ananya Singh",
      "Karthik Nair", "Ishaan Mehta", "Divya Reddy", "Aakash Verma",
    ];

    matchTimerRef.current = setTimeout(() => {
      /* Clear the search timer when match is found */
      if (timerRef.current) clearInterval(timerRef.current);

      /* Pick a random fake opponent */
      setOpponentName(FAKE_OPPONENTS[Math.floor(Math.random() * FAKE_OPPONENTS.length)]);
      setMatchState("found");
    }, matchDelay);

    /* Cleanup — clear both timers if the component unmounts */
    return () => {
      if (timerRef.current)  clearInterval(timerRef.current);
      if (matchTimerRef.current) clearTimeout(matchTimerRef.current);
    };
  }, []);

  /* ── Countdown After Match Found ── */
  useEffect(() => {
    if (matchState !== "found") return;

    /* Count down 3 → 2 → 1 then navigate to the battle room */
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          /*
           * In production, navigate to the real battle room:
           * router.push(`/battle/${battleId}`);
           * For now, go back to the battle lobby.
           */
          router.push("/battle");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [matchState, router]);

  /* ── Cancel Handler ── */
  /**
   * Called when user clicks "Cancel Search".
   * In production, this would emit a cancel event to the Socket.IO server
   * to remove the user from the matchmaking queue.
   */
  const handleCancel = () => {
    if (timerRef.current)  clearInterval(timerRef.current);
    if (matchTimerRef.current) clearTimeout(matchTimerRef.current);
    router.push("/battle");
  };

  /* ─────────────────────────────────────────────
   * RENDER: Found Match State
   * ───────────────────────────────────────────── */
  if (matchState === "found") {
    return (
      <div className={styles.page}>
        <div className={`${styles.card} ${styles.foundCard}`}>
          {/* Celebration swords icon */}
          <div className={styles.matchAvatarWrap}>
            <div className={styles.matchAvatar}>
              <Swords size={32} />
            </div>
          </div>

          <h1 className={styles.foundTitle}>Match Found!</h1>
          <p className={styles.foundOpponent}>
            You are battling <strong className={styles.opponentName}>{opponentName}</strong> in {subjectParam}
          </p>

          {/* Countdown before battle starts */}
          <div className={styles.countdown}>{countdown}</div>
          <p className={styles.countdownHint}>
            Battle starts in {countdown} second{countdown !== 1 ? "s" : ""}…
          </p>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
   * RENDER: Searching State
   * ───────────────────────────────────────────── */
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* ── Radar Animation ── */}
        <div className={styles.radarWrap}>
          <div className={styles.radarCircle}>
            {/* Blinking radar dots simulating scanned opponents */}
            <div className={styles.radarDot} />
            <div className={styles.radarDot} />
            <div className={styles.radarDot} />
          </div>
          <div className={styles.radarSweep} />
          <div className={styles.radarCenter} />
        </div>

        {/* ── Status Text ── */}
        <h1 className={styles.statusTitle}>
          Finding your opponent
          <span className={styles.dots}>
            <span>.</span><span>.</span><span>.</span>
          </span>
        </h1>
        <p className={styles.statusSubtitle}>
          Looking for a student in the same class and level range.
          This usually takes under 20 seconds.
        </p>

        {/* ── Search Timer ── */}
        <div className={styles.timer}>{formatTimer(secondsElapsed)}</div>

        {/* ── Battle Preferences ── */}
        <div className={styles.preferenceChips}>
          <span className={styles.chip}>
            <GraduationCap size={12} />
            {classParam}
          </span>
          <span className={styles.chip}>
            <BookOpen size={12} />
            {subjectParam}
          </span>
          <span className={styles.chip}>
            <Zap size={12} />
            {chapterParam}
          </span>
        </div>

        {/* ── Cancel Button ── */}
        <button className={styles.cancelBtn} onClick={handleCancel}>
          <X size={16} />
          Cancel Search
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * Page Export with Suspense
 * useSearchParams requires a Suspense boundary in Next.js App Router
 * ───────────────────────────────────────────── */

/**
 * MatchmakingPage — exported page component.
 * Wraps MatchmakingInner in Suspense because useSearchParams()
 * requires it in Next.js 13+ App Router.
 */
export default function MatchmakingPage() {
  return (
    <Suspense fallback={
      <div className={styles.page}>
        <div className={`${styles.card} ${styles.suspenseCard}`}>
          <div className={styles.suspenseText}>
            Loading matchmaking…
          </div>
        </div>
      </div>
    }>
      <MatchmakingInner />
    </Suspense>
  );
}
