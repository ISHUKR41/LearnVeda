/**
 * FILE: page.tsx
 * LOCATION: src/app/battle/matchmaking/page.tsx
 * PURPOSE: Real-time battle matchmaking waiting room powered by Socket.io.
 *          This page is shown after a student selects their battle preferences
 *          (subject, wager) and enters the matchmaking queue.
 *
 * FEATURES:
 *  - Connects to the backend Socket.io server at http://localhost:4000
 *  - Sends the user's accessToken for authentication
 *  - Emits "join_queue" with subjectId and wager from URL search params
 *  - Listens for "match_found" event and navigates to /battle/[matchId]
 *  - Shows an animated radar scanning for an opponent
 *  - Shows a live timer counting elapsed search time
 *  - Shows a "Match Found!" transition with countdown before redirect
 *  - Handles queue errors and cancellation
 *
 * USED BY: src/app/battle/BattleClient.tsx — navigates here after user selects preferences
 * DEPENDENCIES: socket.io-client, Matchmaking.module.css, lucide-react, next/navigation
 * LAST UPDATED: 2026-05-22
 */

"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  X, Swords, BookOpen, Star, Zap, AlertCircle,
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import { getAccessToken } from "@/lib/api/api";
import styles from "./Matchmaking.module.css";

/* ─────────────────────────────────────────────
 * CONSTANTS
 * ───────────────────────────────────────────── */

/**
 * Backend WebSocket server URL.
 * In production, this should come from an environment variable.
 */
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000";

/* ─────────────────────────────────────────────
 * Helper: Format timer as MM:SS
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
 * Reads URL params for the selected battle subject and wager.
 * Connects to Socket.io for real-time matchmaking.
 */
function MatchmakingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* Read the battle preferences from URL params */
  const subjectId = searchParams.get("subjectId") ?? "";
  const wager = parseInt(searchParams.get("wager") ?? "0", 10);

  /* Timer: counts how many seconds we've been searching */
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  /* State machine: "connecting" → "searching" → "found" → (navigate to battle) */
  const [matchState, setMatchState] = useState<
    "connecting" | "searching" | "found" | "error"
  >("connecting");

  /* Countdown before battle starts after opponent is found */
  const [countdown, setCountdown] = useState(3);

  /* Opponent info shown when match is found */
  const [opponent, setOpponent] = useState<{
    id: string;
    name: string;
    level: number;
  } | null>(null);

  /* Match ID received from socket — used for navigation */
  const [matchId, setMatchId] = useState<string>("");

  /* Error message from socket server */
  const [errorMsg, setErrorMsg] = useState<string>("");

  /* Socket reference — persisted across renders */
  const socketRef = useRef<Socket | null>(null);

  /* Timer interval reference */
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ──────────────────────────────────────────────
   * EFFECT: Connect to Socket.io and join matchmaking queue
   * ────────────────────────────────────────────── */
  useEffect(() => {
    /* Get the JWT access token from in-memory storage */
    const token = getAccessToken();

    if (!token) {
      setMatchState("error");
      setErrorMsg("You must be signed in to join matchmaking. Please sign in first.");
      return;
    }

    if (!subjectId) {
      setMatchState("error");
      setErrorMsg("No subject selected. Please go back and choose a subject.");
      return;
    }

    /* Create Socket.io connection with authentication */
    const socket = io(SOCKET_URL, {
      auth: { token },
      query: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 10000,
    });

    socketRef.current = socket;

    /* ── Connection Events ── */

    socket.on("connect", () => {
      console.log("[Matchmaking] Connected to Socket.io server:", socket.id);
      setMatchState("searching");

      /* Join the matchmaking queue */
      socket.emit("join_queue", {
        subjectId,
        wager,
      });
    });

    socket.on("connect_error", (error) => {
      console.error("[Matchmaking] Connection error:", error.message);
      setMatchState("error");
      setErrorMsg(
        error.message.includes("Authentication")
          ? "Authentication failed. Please sign in again."
          : "Could not connect to the matchmaking server. Please try again."
      );
    });

    /* ── Queue Events ── */

    socket.on("queue_joined", (data: { subjectId: string; wager: number }) => {
      console.log("[Matchmaking] Queue joined:", data);
      setMatchState("searching");
    });

    socket.on("queue_error", (data: { message: string }) => {
      console.error("[Matchmaking] Queue error:", data.message);
      setMatchState("error");
      setErrorMsg(data.message);
    });

    /* ── Match Found Event ── */

    socket.on("match_found", (data: {
      matchId: string;
      wager: number;
      opponent: { id: string; name: string; level: number };
    }) => {
      console.log("[Matchmaking] Match found!", data);

      /* Stop the search timer */
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      /* Transition to "found" state */
      setMatchId(data.matchId);
      setOpponent(data.opponent);
      setMatchState("found");
    });

    /* ── Cleanup on unmount ── */
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);

      if (socket.connected) {
        socket.emit("leave_queue");
        socket.disconnect();
      }

      socketRef.current = null;
    };
  }, [subjectId, wager]);

  /* ──────────────────────────────────────────────
   * EFFECT: Search timer (ticks every second while searching)
   * ────────────────────────────────────────────── */
  useEffect(() => {
    if (matchState !== "searching") return;

    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [matchState]);

  /* ──────────────────────────────────────────────
   * EFFECT: Countdown after match found → navigate to battle room
   * ────────────────────────────────────────────── */
  useEffect(() => {
    if (matchState !== "found" || !matchId) return;

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          /* Navigate to the actual battle room */
          router.push(`/battle/${matchId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [matchState, matchId, router]);

  /* ──────────────────────────────────────────────
   * HANDLER: Cancel matchmaking search
   * ────────────────────────────────────────────── */
  const handleCancel = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    /* Tell the server to remove us from the queue */
    if (socketRef.current?.connected) {
      socketRef.current.emit("leave_queue");
      socketRef.current.disconnect();
    }

    router.push("/battle");
  }, [router]);

  /* ─────────────────────────────────────────────
   * RENDER: Error State
   * ───────────────────────────────────────────── */
  if (matchState === "error") {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.errorWrap}>
            <AlertCircle size={48} className={styles.errorIcon} />
            <h1 className={styles.errorTitle}>Matchmaking Error</h1>
            <p className={styles.errorMsg}>{errorMsg}</p>
            <button className={styles.cancelBtn} onClick={() => router.push("/battle")}>
              <X size={16} /> Back to Lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
   * RENDER: Found Match State
   * ───────────────────────────────────────────── */
  if (matchState === "found" && opponent) {
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
            You are battling <strong className={styles.opponentName}>{opponent.name}</strong>
            {" "}(Level {opponent.level})
          </p>

          {/* Wager indicator */}
          {wager > 0 && (
            <div className={styles.wagerIndicator}>
              <Star size={14} className={styles.wagerStar} />
              <span>{wager} Stars wagered</span>
            </div>
          )}

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
   * RENDER: Connecting / Searching State
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
          {matchState === "connecting" ? "Connecting to server" : "Finding your opponent"}
          <span className={styles.dots}>
            <span>.</span><span>.</span><span>.</span>
          </span>
        </h1>
        <p className={styles.statusSubtitle}>
          {matchState === "connecting"
            ? "Establishing a secure connection to the matchmaking server."
            : "Looking for a student in the same class and level range. This usually takes under 20 seconds."
          }
        </p>

        {/* ── Search Timer ── */}
        {matchState === "searching" && (
          <div className={styles.timer}>{formatTimer(secondsElapsed)}</div>
        )}

        {/* ── Battle Preferences ── */}
        <div className={styles.preferenceChips}>
          <span className={styles.chip}>
            <BookOpen size={12} />
            {subjectId || "Any Subject"}
          </span>
          <span className={styles.chip}>
            <Zap size={12} />
            10 Questions
          </span>
          {wager > 0 && (
            <span className={`${styles.chip} ${styles.chipWager}`}>
              <Star size={12} />
              {wager} Stars Wager
            </span>
          )}
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
