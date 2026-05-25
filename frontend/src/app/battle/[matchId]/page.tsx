/**
 * FILE: page.tsx
 * LOCATION: src/app/battle/[matchId]/page.tsx
 * PURPOSE: Real-time Battle Room — the active 1v1 quiz duel arena.
 *          This page connects to the backend Socket.io server, syncs
 *          questions, timers, scores, and answer submissions in real-time
 *          between two matched players.
 *
 * FEATURES:
 *  - Connects to Socket.io room for the specific matchId
 *  - Displays side-by-side player scoreboard with live score updates
 *  - Renders timed questions (30s each) with interactive option buttons
 *  - Tracks opponent submission status ("Opponent answered!")
 *  - Reveals correct answer after both players submit or timer expires
 *  - Handles reconnection and opponent disconnection gracefully
 *  - Displays a full-screen match result overlay at the end
 *  - Applies useAntiCheat hook to prevent cheating
 *
 * USED BY: /battle/matchmaking (redirects here after match_found)
 * DEPENDENCIES: socket.io-client, BattleRoom.module.css, useAntiCheat, lucide-react
 * LAST UPDATED: 2026-05-22
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import {
  Swords, Trophy, Loader2, Star, Zap, ArrowRight,
  AlertTriangle, WifiOff, CheckCircle2, XCircle,
} from "lucide-react";
import { getAccessToken } from "@/lib/api/api";
import { useAuth } from "@/hooks/useAuth";
import { useAntiCheat } from "@/hooks/useAntiCheat";
import styles from "./BattleRoom.module.css";

/* ─────────────────────────────────────────────
 * CONSTANTS
 * ───────────────────────────────────────────── */

/** Backend WebSocket URL */
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000";

/** Option letter labels for A, B, C, D */
const OPTION_LETTERS = ["A", "B", "C", "D"];

/* ─────────────────────────────────────────────
 * TYPES
 * ───────────────────────────────────────────── */

interface QuestionData {
  id: string;
  content: string;
  type: string;
  options: string[] | null;
  difficulty: string;
  points: number;
  imageUrl?: string | null;
}

interface PlayerInfo {
  id: string;
  name: string;
  level: number;
}

interface MatchEndData {
  matchId: string;
  winnerId: string | null;
  loserId: string | null;
  isTie: boolean;
  isForfeit?: boolean;
  scores: Record<string, number>;
  xpEarned: Record<string, number>;
  wagerPayout: Record<string, number>;
}

/* ─────────────────────────────────────────────
 * HELPER: Get initials from a name
 * ───────────────────────────────────────────── */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ─────────────────────────────────────────────
 * COMPONENT
 * ───────────────────────────────────────────── */

export default function BattleRoomPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.matchId as string;

  /* ── Auth ── */
  const { user } = useAuth();
  const userId = user?.id ?? "";

  /* ── Socket reference ── */
  const socketRef = useRef<Socket | null>(null);

  /* ── Connection & Match State ── */
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState("");

  /* ── Match Data ── */
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [wager, setWager] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);

  /* ── Timer ── */
  const [timeRemaining, setTimeRemaining] = useState(30);

  /* ── Scores ── */
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  /* ── Answer Submission ── */
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [opponentSubmitted, setOpponentSubmitted] = useState(false);

  /* ── Question Result (revealed after both submit or timer expires) ── */
  const [showResult, setShowResult] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [myResult, setMyResult] = useState<{ isCorrect: boolean; scoreGained: number } | null>(null);

  /* ── Match End ── */
  const [matchEnded, setMatchEnded] = useState(false);
  const [matchEndData, setMatchEndData] = useState<MatchEndData | null>(null);

  /* ── Opponent Status ── */
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [opponent, setOpponent] = useState<PlayerInfo | null>(null);

  /* ── Cheat Warning ── */
  const [cheatWarning, setCheatWarning] = useState<string | null>(null);

  /* ── Anti-Cheat Hook ── */
  const handleCheatCallback = useCallback((type: string) => {
    setCheatWarning(`Warning: ${type.replace(/_/g, " ")} detected! -5 points`);
    setTimeout(() => setCheatWarning(null), 3000);
  }, []);

  useAntiCheat(matchId, socketRef.current, {
    enabled: isConnected && !matchEnded,
    onCheat: handleCheatCallback,
  });

  /* ──────────────────────────────────────────────
   * EFFECT: Connect to Socket.io battle room
   * ────────────────────────────────────────────── */
  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      setConnectionError("Authentication required. Please sign in.");
      return;
    }

    /* Create Socket.io connection */
    const socket = io(SOCKET_URL, {
      auth: { token },
      query: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socketRef.current = socket;

    /* ── Connection Events ── */

    socket.on("connect", () => {
      console.log("[BattleRoom] Connected:", socket.id);
      setIsConnected(true);
      setConnectionError("");
    });

    socket.on("connect_error", (error) => {
      console.error("[BattleRoom] Connection error:", error.message);
      setConnectionError(
        error.message.includes("Authentication")
          ? "Authentication failed. Please sign in again."
          : "Lost connection to battle server. Reconnecting..."
      );
    });

    socket.on("disconnect", (reason) => {
      console.warn("[BattleRoom] Disconnected:", reason);
      setIsConnected(false);
    });

    /* ── Match Events ── */

    /**
     * match_start: Received when the battle begins.
     * Contains all questions (without answers), player list, and wager info.
     */
    socket.on("match_start", (data: {
      matchId: string;
      questions: QuestionData[];
      players: PlayerInfo[];
      wager: number;
    }) => {
      console.log("[BattleRoom] Match started:", data.matchId);
      setQuestions(data.questions);
      setPlayers(data.players);
      setWager(data.wager);

      /* Identify opponent */
      const opp = data.players.find((p) => p.id !== userId);
      if (opp) setOpponent(opp);
    });

    /**
     * battle_reconnected: Received when the player reconnects mid-battle.
     * Restores the full match state.
     */
    socket.on("battle_reconnected", (data: any) => {
      console.log("[BattleRoom] Reconnected to battle:", data.matchId);
      setWager(data.wager);
      setCurrentQuestionIndex(data.currentQuestionIndex);
      setTimeRemaining(data.timeRemaining);
      if (data.currentQuestion) setCurrentQuestion(data.currentQuestion);
      if (data.opponent) setOpponent(data.opponent);
      if (data.scores) {
        setMyScore(data.scores[userId] ?? 0);
        const oppId = Object.keys(data.scores).find((id) => id !== userId) ?? "";
        setOpponentScore(data.scores[oppId] ?? 0);
      }
      setHasSubmitted(data.hasSubmitted ?? false);
      setOpponentSubmitted(data.opponentSubmitted ?? false);
    });

    /**
     * question_start: Received at the beginning of each question round.
     * Resets local answer state and sets the new question.
     */
    socket.on("question_start", (data: {
      questionIndex: number;
      question: QuestionData;
      timeRemaining: number;
    }) => {
      console.log("[BattleRoom] Question", data.questionIndex + 1);
      setCurrentQuestionIndex(data.questionIndex);
      setCurrentQuestion(data.question);
      setTimeRemaining(data.timeRemaining);
      setSelectedAnswer(null);
      setHasSubmitted(false);
      setOpponentSubmitted(false);
      setShowResult(false);
      setCorrectAnswer(null);
      setMyResult(null);
    });

    /**
     * timer_tick: Received every second to sync the countdown timer.
     */
    socket.on("timer_tick", (data: { timeRemaining: number }) => {
      setTimeRemaining(data.timeRemaining);
    });

    /**
     * opponent_submitted: Received when the opponent submits their answer.
     */
    socket.on("opponent_submitted", () => {
      setOpponentSubmitted(true);
    });

    /**
     * question_result: Received after both players submit or timer expires.
     * Reveals the correct answer and score breakdown.
     */
    socket.on("question_result", (data: {
      questionIndex: number;
      correctAnswer: string;
      playerResults: Record<string, {
        answer: string | null;
        isCorrect: boolean;
        scoreGained: number;
        totalScore: number;
      }>;
    }) => {
      setCorrectAnswer(data.correctAnswer);
      setShowResult(true);

      /* Update local scores from server-authoritative results */
      const myRes = data.playerResults[userId];
      if (myRes) {
        setMyScore(myRes.totalScore);
        setMyResult({ isCorrect: myRes.isCorrect, scoreGained: myRes.scoreGained });
      }

      const oppId = Object.keys(data.playerResults).find((id) => id !== userId) ?? "";
      const oppRes = data.playerResults[oppId];
      if (oppRes) {
        setOpponentScore(oppRes.totalScore);
      }
    });

    /**
     * match_end: Received when all 10 questions are answered.
     * Contains final scores, winner, XP earned, and wager payouts.
     */
    socket.on("match_end", (data: MatchEndData) => {
      console.log("[BattleRoom] Match ended:", data);
      setMatchEnded(true);
      setMatchEndData(data);
    });

    /**
     * cheat_warning: Received when any player triggers anti-cheat detection.
     * Updates scores if the cheater is the local player.
     */
    socket.on("cheat_warning", (data: {
      userId: string;
      playerName: string;
      warningType: string;
      totalWarnings: number;
      updatedScore: number;
    }) => {
      if (data.userId === userId) {
        setMyScore(data.updatedScore);
      } else {
        setOpponentScore(data.updatedScore);
      }
    });

    /**
     * opponent_disconnected: Received when the opponent loses connection.
     */
    socket.on("opponent_disconnected", () => {
      setOpponentDisconnected(true);
    });

    /**
     * opponent_reconnected: Received when the opponent reconnects.
     */
    socket.on("opponent_reconnected", () => {
      setOpponentDisconnected(false);
    });

    /**
     * battle_error: Server-side error in the battle room.
     */
    socket.on("battle_error", (data: { message: string }) => {
      console.error("[BattleRoom] Battle error:", data.message);
    });

    /* ── Cleanup ── */
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [matchId, userId]);

  /* ──────────────────────────────────────────────
   * HANDLER: Submit Answer
   * ────────────────────────────────────────────── */
  const handleSubmitAnswer = useCallback(
    (answer: string) => {
      if (hasSubmitted || !currentQuestion || !socketRef.current?.connected) return;

      setSelectedAnswer(answer);
      setHasSubmitted(true);

      socketRef.current.emit("submit_answer", {
        matchId,
        questionId: currentQuestion.id,
        answer,
      });
    },
    [hasSubmitted, currentQuestion, matchId]
  );

  /* ──────────────────────────────────────────────
   * RENDER: Loading / Connecting State
   * ────────────────────────────────────────────── */
  if (!isConnected && !connectionError) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <Loader2 size={48} className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Connecting to battle room…</p>
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <AlertTriangle size={48} style={{ color: "#EF4444" }} />
          <p className={styles.loadingText}>{connectionError}</p>
          <button className={styles.resultBtn} onClick={() => router.push("/battle")}>
            Back to Lobby
          </button>
        </div>
      </div>
    );
  }

  /* Waiting for match_start event */
  if (!currentQuestion && !matchEnded) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <Swords size={48} style={{ color: "#FCA5A5" }} />
          <p className={styles.loadingText}>Preparing battle arena…</p>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────
   * DERIVED VALUES
   * ────────────────────────────────────────────── */
  const timerClass = timeRemaining <= 5
    ? styles.timerCritical
    : timeRemaining <= 10
    ? styles.timerWarning
    : "";

  const totalQuestions = questions.length || 10;

  /* ──────────────────────────────────────────────
   * RENDER: Main Battle UI
   * ────────────────────────────────────────────── */
  return (
    <div className={styles.page}>
      {/* ═══════ TOP BAR ═══════ */}
      <div className={styles.topBar}>
        <div className={styles.matchInfo}>
          <span className={styles.matchBadge}>
            <Swords size={12} /> LIVE BATTLE
          </span>
          <span className={styles.questionCounter}>
            Q{currentQuestionIndex + 1} / {totalQuestions}
          </span>
        </div>

        <div className={styles.timerSection}>
          <div className={`${styles.timerRing} ${timerClass}`}>
            {timeRemaining}
          </div>
        </div>
      </div>

      {/* ═══════ SCOREBOARD ═══════ */}
      <div className={styles.scoreboard}>
        {/* Player (You) */}
        <div className={`${styles.playerPanel} ${
          showResult && myResult
            ? myResult.isCorrect
              ? styles.playerPanelCorrect
              : styles.playerPanelWrong
            : ""
        }`}>
          <div className={`${styles.playerAvatar} ${styles.myAvatar}`}>
            {user ? getInitials(user.name) : "?"}
          </div>
          <div>
            <div className={styles.playerName}>
              {user ? user.name.split(" ")[0] : "You"}
            </div>
            <div className={styles.playerLevel}>Level {user?.level ?? 1}</div>
          </div>
          <div className={styles.playerScore}>{myScore}</div>
        </div>

        {/* VS Divider */}
        <div className={styles.vsDivider}>VS</div>

        {/* Opponent */}
        <div className={`${styles.playerPanel} ${styles.opponentPanel} ${
          showResult && correctAnswer
            ? opponentSubmitted
              ? styles.playerPanelCorrect
              : styles.playerPanelWrong
            : ""
        }`}>
          <div className={`${styles.playerAvatar} ${styles.oppAvatar}`}>
            {opponent ? getInitials(opponent.name) : "?"}
          </div>
          <div>
            <div className={styles.playerName}>
              {opponent?.name ?? "Opponent"}
              {opponentDisconnected && (
                <span className={styles.disconnectedBadge}>
                  <WifiOff size={8} /> Offline
                </span>
              )}
            </div>
            <div className={styles.playerLevel}>
              Level {opponent?.level ?? "?"}
            </div>
          </div>
          <div className={styles.playerScore}>{opponentScore}</div>
        </div>
      </div>

      {/* ═══════ QUESTION AREA ═══════ */}
      {currentQuestion && (
        <div className={styles.questionArea}>
          {/* Question Card */}
          <div className={styles.questionCard} key={currentQuestionIndex}>
            <p className={styles.questionText}>{currentQuestion.content}</p>
          </div>

          {/* Answer Options */}
          {currentQuestion.options && (
            <div className={styles.optionsGrid}>
              {currentQuestion.options.map((option, idx) => {
                const letter = OPTION_LETTERS[idx] || String(idx + 1);
                const isSelected = selectedAnswer === option;
                const isCorrectOption = showResult && correctAnswer === option;
                const isWrongSelection = showResult && isSelected && correctAnswer !== option;

                let optionClass = styles.optionBtn;
                if (isSelected && !showResult) optionClass += ` ${styles.optionSelected}`;
                if (isCorrectOption) optionClass += ` ${styles.optionCorrect}`;
                if (isWrongSelection) optionClass += ` ${styles.optionWrong}`;

                return (
                  <button
                    key={idx}
                    className={optionClass}
                    onClick={() => handleSubmitAnswer(option)}
                    disabled={hasSubmitted || showResult}
                  >
                    <span className={styles.optionLetter}>
                      {isCorrectOption ? (
                        <CheckCircle2 size={14} />
                      ) : isWrongSelection ? (
                        <XCircle size={14} />
                      ) : (
                        letter
                      )}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {/* Status Bar */}
          <div className={styles.statusBar}>
            {showResult && myResult ? (
              <>
                {myResult.isCorrect ? (
                  <CheckCircle2 size={14} style={{ color: "#10B981" }} />
                ) : (
                  <XCircle size={14} style={{ color: "#EF4444" }} />
                )}
                <span>
                  {myResult.isCorrect
                    ? `Correct! +${myResult.scoreGained} points`
                    : "Incorrect"
                  }
                </span>
              </>
            ) : hasSubmitted ? (
              <>
                <span className={styles.statusDot} />
                <span>
                  {opponentSubmitted
                    ? "Both answered! Revealing result…"
                    : "Answer submitted. Waiting for opponent…"
                  }
                </span>
              </>
            ) : (
              <>
                <Zap size={14} style={{ color: "#FBBF24" }} />
                <span>Select your answer</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══════ CHEAT WARNING TOAST ═══════ */}
      {cheatWarning && (
        <div className={styles.cheatWarning}>
          <AlertTriangle size={16} />
          {cheatWarning}
        </div>
      )}

      {/* ═══════ MATCH END OVERLAY ═══════ */}
      {matchEnded && matchEndData && (
        <div className={styles.overlay}>
          <div className={styles.resultCard}>
            {/* Result Icon */}
            {matchEndData.isTie ? (
              <div className={styles.resultIconTie}>
                <Swords size={36} />
              </div>
            ) : matchEndData.winnerId === userId ? (
              <div className={styles.resultIconWin}>
                <Trophy size={36} />
              </div>
            ) : (
              <div className={styles.resultIconLoss}>
                <Swords size={36} />
              </div>
            )}

            {/* Title */}
            <h2 className={`${styles.resultTitle} ${
              matchEndData.isTie
                ? styles.resultTitleTie
                : matchEndData.winnerId === userId
                ? styles.resultTitleWin
                : styles.resultTitleLoss
            }`}>
              {matchEndData.isTie
                ? "It's a Draw!"
                : matchEndData.winnerId === userId
                ? "Victory!"
                : matchEndData.isForfeit
                ? "Opponent Forfeited"
                : "Defeat"
              }
            </h2>

            <p className={styles.resultSubtitle}>
              {matchEndData.isTie
                ? "Both players performed equally. Wagers have been refunded."
                : matchEndData.winnerId === userId
                ? `You dominated the arena! Final score: ${matchEndData.scores[userId]} points.`
                : `Your opponent scored higher. Final score: ${matchEndData.scores[userId]} points.`
              }
            </p>

            {/* Score Breakdown */}
            <div className={styles.resultScores}>
              <div className={styles.resultScoreItem}>
                <span className={styles.resultScoreLabel}>Your Score</span>
                <span className={styles.resultScoreValue}>
                  {matchEndData.scores[userId] ?? 0}
                </span>
              </div>
              <div className={styles.resultScoreItem}>
                <span className={styles.resultScoreLabel}>Opponent Score</span>
                <span className={styles.resultScoreValue}>
                  {matchEndData.scores[
                    Object.keys(matchEndData.scores).find((id) => id !== userId) ?? ""
                  ] ?? 0}
                </span>
              </div>
            </div>

            {/* Rewards */}
            <div className={styles.resultRewards}>
              <span className={`${styles.rewardChip} ${styles.rewardXP}`}>
                <Zap size={14} />
                +{matchEndData.xpEarned[userId] ?? 0} XP
              </span>
              {(matchEndData.wagerPayout[userId] ?? 0) > 0 && (
                <span className={`${styles.rewardChip} ${styles.rewardStars}`}>
                  <Star size={14} />
                  +{matchEndData.wagerPayout[userId]} Stars
                </span>
              )}
            </div>

            {/* Back to Lobby */}
            <button
              className={styles.resultBtn}
              onClick={() => router.push("/battle")}
            >
              Back to Lobby
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
