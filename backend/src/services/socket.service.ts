/**
 * FILE: socket.service.ts
 * LOCATION: backend/src/services/socket.service.ts
 * PURPOSE: Real-time Socket.io matchmaking queues and active battle room synchronization.
 *          Handles user authentication, validation of wager limits, matching algorithms
 *          (±3 levels widening to ±5 levels after 15s), simultaneous quiz execution,
 *          response time grading, wallet wagers deduction, payouts, and anti-cheat tracking.
 *
 * DEPENDENCIES: socket.io, http, ./battle.service, ../config/database, ../utils/jwt
 * LAST UPDATED: 2026-05-22
 */

import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyAccessToken } from "../utils/jwt";
import pool from "../config/database";
import {
  validateWagerRequirements,
  deductWager,
  distributeWagerPayout,
  completeMatch
} from "./battle.service";
import { createAdapter } from "@socket.io/redis-adapter";
import { getRedisClient, isRedisConfigured } from "../config/redis";

/* ─────────────────────────────────────────────
 * Types & Interfaces
 * ───────────────────────────────────────────── */

interface QueuedPlayer {
  socketId: string;
  userId: string;
  name: string;
  level: number;
  classLevel: string;
  subjectId: string;
  wager: number;
  joinedAt: number;
}

interface PlayerState {
  socketId: string;
  userId: string;
  name: string;
  level: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  responseTimes: number[]; // in milliseconds
  submittedAnswer: string | null;
  submittedTime: number | null;
  cheatWarnings: number;
  disconnectedAt: number | null;
}

interface RoomState {
  matchId: string;
  subjectId: string;
  wager: number;
  questions: any[]; // 10 questions with correct answer included for grading
  currentQuestionIndex: number;
  questionTimer: NodeJS.Timeout | null;
  timeRemaining: number;
  questionStartTime: number;
  players: { [userId: string]: PlayerState };
}

/* ─────────────────────────────────────────────
 * In-Memory State
 * ───────────────────────────────────────────── */

// Socket.io instance
let io: Server | null = null;

// Matchmaking queue
const matchmakingQueue: QueuedPlayer[] = [];

// Active rooms map: matchId -> RoomState
const activeRooms: Map<string, RoomState> = new Map();

// Map to track which match/room a socket belongs to: socketId -> matchId
const socketToRoomMap: Map<string, string> = new Map();

// Map to track user to socket mapping: userId -> socketId
const userToSocketMap: Map<string, string> = new Map();

/* ─────────────────────────────────────────────
 * Socket Server Initialization
 * ───────────────────────────────────────────── */

/**
 * Initializes the Socket.io server and registers connection handlers.
 * 
 * @param server - HTTP server instance
 */
export function initSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:5000",
        "http://127.0.0.1:3000",
        process.env.FRONTEND_URL ?? "https://eduquest.vercel.app"
      ],
      credentials: true,
      methods: ["GET", "POST"]
    },
    pingInterval: 10000,
    pingTimeout: 5000
  });

  // Configure Redis Pub/Sub adapter for horizontal scalability under 10k concurrent users
  if (isRedisConfigured()) {
    try {
      const pubClient = getRedisClient();
      const subClient = pubClient.duplicate();
      
      Promise.all([
        pubClient.status === "wait" ? pubClient.connect() : Promise.resolve(),
        subClient.status === "wait" ? subClient.connect() : Promise.resolve()
      ]).then(() => {
        io?.adapter(createAdapter(pubClient, subClient));
        console.log("[Socket.IO] Redis Pub/Sub adapter successfully configured for horizontal scaling.");
      }).catch(err => {
        console.error("[Socket.IO] Failed to connect Redis Pub/Sub adapter clients:", err);
      });
    } catch (err) {
      console.error("[Socket.IO] Redis adapter configuration error:", err);
    }
  }

  // Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;

      if (!token) {
        return next(new Error("Authentication failed: No token provided."));
      }

      const decoded = verifyAccessToken(token);
      if (!decoded) {
        return next(new Error("Authentication failed: Invalid or expired token."));
      }

      // Query complete user info from database to use for matching and stats
      const userResult = await pool.query(
        `SELECT id, name, "currentLevel", "classLevel" FROM "User" WHERE id = $1`,
        [decoded.userId]
      );

      if (userResult.rows.length === 0) {
        return next(new Error("Authentication failed: User not found in database."));
      }

      const dbUser = userResult.rows[0];
      socket.data = {
        userId: dbUser.id,
        name: dbUser.name,
        level: dbUser.currentLevel,
        classLevel: dbUser.classLevel || "class-10" // default fallback
      };

      next();
    } catch (err) {
      console.error("[Socket Auth Middleware] Error:", err);
      next(new Error("Authentication failed: Internal server error."));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`[Socket Connected] User: ${socket.data.name} (${userId}), Socket: ${socket.id}`);

    // Map user to current active socket
    userToSocketMap.set(userId, socket.id);

    // Reconnection handling: check if user is already in an active battle room
    handleReconnection(socket);

    // Register event listeners
    socket.on("join_queue", (data) => handleJoinQueue(socket, data));
    socket.on("leave_queue", () => handleLeaveQueue(socket));
    socket.on("submit_answer", (data) => handleSubmitAnswer(socket, data));
    socket.on("cheat_detected", (data) => handleCheatDetected(socket, data));
    socket.on("disconnect", () => handleDisconnect(socket));
  });

  // Start the matchmaking loop periodically
  setInterval(runMatchmakingLoop, 3000);

  return io;
}

/* ─────────────────────────────────────────────
 * Event Handlers
 * ───────────────────────────────────────────── */

/**
 * Handles a user's request to join the matchmaking queue.
 */
async function handleJoinQueue(socket: Socket, data: { subjectId: string; wager?: number }) {
  const userId = socket.data.userId;
  const { subjectId, wager = 0 } = data;

  if (!subjectId) {
    socket.emit("queue_error", { message: "Subject ID is required." });
    return;
  }

  try {
    // 1. Verify level gate & wallet balance requirements
    const validation = await validateWagerRequirements(userId, wager);
    if (!validation.success) {
      socket.emit("queue_error", { message: validation.error || "Wager validation failed." });
      return;
    }

    // 2. Ensure player is not already in the queue or in an active room
    const isQueued = matchmakingQueue.some((p) => p.userId === userId);
    if (isQueued) {
      socket.emit("queue_error", { message: "You are already in the matchmaking queue." });
      return;
    }

    // Check database to ensure user doesn't have active matches
    const activeMatchCheck = await pool.query(
      `SELECT id FROM "Match" m
       JOIN "MatchParticipant" mp ON mp."matchId" = m.id
       WHERE mp."userId" = $1 AND m.status = 'ACTIVE'`,
      [userId]
    );
    if (activeMatchCheck.rows.length > 0) {
      socket.emit("queue_error", { message: "You are currently in an active battle match." });
      return;
    }

    // 3. Add to matchmaking queue
    const queuedPlayer: QueuedPlayer = {
      socketId: socket.id,
      userId,
      name: socket.data.name,
      level: socket.data.level,
      classLevel: socket.data.classLevel,
      subjectId,
      wager,
      joinedAt: Date.now()
    };

    matchmakingQueue.push(queuedPlayer);
    socket.emit("queue_joined", { subjectId, wager, classLevel: socket.data.classLevel });
    console.log(`[Matchmaking Queue] User joined: ${queuedPlayer.name} (wager: ${wager} Stars)`);

  } catch (err) {
    console.error("[handleJoinQueue] Error:", err);
    socket.emit("queue_error", { message: "Failed to join matchmaking queue." });
  }
}

/**
 * Handles leaving the matchmaking queue.
 */
function handleLeaveQueue(socket: Socket) {
  const userId = socket.data.userId;
  const index = matchmakingQueue.findIndex((p) => p.userId === userId);

  if (index !== -1) {
    matchmakingQueue.splice(index, 1);
    socket.emit("queue_left");
    console.log(`[Matchmaking Queue] User left: ${socket.data.name}`);
  }
}

/**
 * Handles client submitting an answer for the current question.
 */
function handleSubmitAnswer(socket: Socket, data: { matchId: string; questionId: string; answer: string }) {
  const userId = socket.data.userId;
  const { matchId, questionId, answer } = data;

  const room = activeRooms.get(matchId);
  if (!room) {
    socket.emit("battle_error", { message: "Battle room not found." });
    return;
  }

  const player = room.players[userId];
  if (!player) {
    socket.emit("battle_error", { message: "You are not a participant in this battle." });
    return;
  }

  if (player.submittedAnswer !== null) {
    socket.emit("battle_error", { message: "You have already submitted an answer for this question." });
    return;
  }

  // Get current question
  const currentQuestion = room.questions[room.currentQuestionIndex];
  if (!currentQuestion || currentQuestion.id !== questionId) {
    socket.emit("battle_error", { message: "Invalid question submission." });
    return;
  }

  // Calculate response time (capped at 30 seconds max)
  const responseTime = Math.min(30000, Date.now() - room.questionStartTime);

  // Store player answer
  player.submittedAnswer = answer;
  player.submittedTime = Date.now();
  player.responseTimes.push(responseTime);

  // Grade answer
  const isCorrect = answer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
  
  if (isCorrect) {
    const points = currentQuestion.points || 10;
    // Time bonus: faster answer yields more points (0 to 10 extra points)
    const timeBonus = Math.max(0, Math.floor((30000 - responseTime) / 3000));
    player.score += points + timeBonus;
    player.correctAnswers++;
  } else {
    player.wrongAnswers++;
  }

  // Notify opponent that this player has submitted
  const opponentId = Object.keys(room.players).find((id) => id !== userId);
  if (opponentId && io) {
    const opponentSocketId = room.players[opponentId].socketId;
    io.to(opponentSocketId).emit("opponent_submitted", { responseTime });
  }

  // Check if both players have submitted answers
  const allSubmitted = Object.values(room.players).every((p) => p.submittedAnswer !== null);
  if (allSubmitted) {
    if (room.questionTimer) {
      clearTimeout(room.questionTimer);
      room.questionTimer = null;
    }
    endQuestion(room);
  }
}

/**
 * Handles cheat detection events reported by the anti-cheat hook.
 */
function handleCheatDetected(socket: Socket, data: { matchId: string; type: string }) {
  const userId = socket.data.userId;
  const { matchId, type } = data;

  const room = activeRooms.get(matchId);
  if (!room) return;

  const player = room.players[userId];
  if (!player) return;

  // Increment warning count and apply score penalty (-5 per check event)
  player.cheatWarnings++;
  player.score = Math.max(0, player.score - 5);

  console.warn(`[Anti-Cheat] Cheat detected for user ${player.name} in match ${matchId} (type: ${type}, total warnings: ${player.cheatWarnings})`);

  // Broadcast cheat warning to the match room
  if (io) {
    io.to(`match_${matchId}`).emit("cheat_warning", {
      userId,
      playerName: player.name,
      warningType: type,
      totalWarnings: player.cheatWarnings,
      updatedScore: player.score
    });
  }
}

/**
 * Handles client disconnects. Cleanly cancels queues or triggers forfeit timers.
 */
function handleDisconnect(socket: Socket) {
  const userId = socket.data.userId;
  console.log(`[Socket Disconnected] User: ${socket.data.name}, Socket: ${socket.id}`);

  // Remove from matchmaking queue if present
  const queueIndex = matchmakingQueue.findIndex((p) => p.socketId === socket.id);
  if (queueIndex !== -1) {
    matchmakingQueue.splice(queueIndex, 1);
    console.log(`[Matchmaking Queue] Removed disconnected user: ${socket.data.name}`);
  }

  // Handle active battles
  const matchId = socketToRoomMap.get(socket.id);
  if (matchId) {
    const room = activeRooms.get(matchId);
    if (room) {
      const player = room.players[userId];
      if (player) {
        player.disconnectedAt = Date.now();
        
        // Broadcast disconnect to opponent
        socket.to(`match_${matchId}`).emit("opponent_disconnected", {
          userId,
          name: player.name,
          reconnectTimeoutMs: 10000 // 10 second reconnect grace period
        });

        // Set timeout to handle forfeit if they do not reconnect within 10 seconds
        setTimeout(() => {
          const currentRoom = activeRooms.get(matchId);
          if (currentRoom) {
            const currentPlayer = currentRoom.players[userId];
            // If still disconnected and hasn't reconnected/joined with a new socketId
            if (currentPlayer && currentPlayer.disconnectedAt !== null) {
              console.log(`[Battle Forfeit] User ${currentPlayer.name} failed to reconnect within 10s.`);
              handleForfeit(currentRoom, userId);
            }
          }
        }, 10000);
      }
    }
    socketToRoomMap.delete(socket.id);
  }

  userToSocketMap.delete(userId);
}

/* ─────────────────────────────────────────────
 * Matchmaking & Battle Management
 * ───────────────────────────────────────────── */

/**
 * Periodic matchmaking loop. Compares waiting players and groups matches.
 */
async function runMatchmakingLoop() {
  if (matchmakingQueue.length < 2) return;

  const processedUserIds = new Set<string>();

  for (let i = 0; i < matchmakingQueue.length; i++) {
    const player1 = matchmakingQueue[i];
    if (processedUserIds.has(player1.userId)) continue;

    // Search for a suitable opponent
    let matchIndex = -1;
    for (let j = i + 1; j < matchmakingQueue.length; j++) {
      const player2 = matchmakingQueue[j];
      
      if (processedUserIds.has(player2.userId) || player1.userId === player2.userId) {
        continue;
      }

      // Match constraints: Same subject, classLevel, and wager
      if (
        player1.subjectId === player2.subjectId &&
        player1.classLevel === player2.classLevel &&
        player1.wager === player2.wager
      ) {
        // Calculate matchmaking duration
        const waitTime1 = Date.now() - player1.joinedAt;
        const waitTime2 = Date.now() - player2.joinedAt;
        const maxWaitTime = Math.max(waitTime1, waitTime2);

        // Matchmaking gate: ±3 levels initially. Widens to ±5 levels if waiting > 15s.
        const maxLevelDifference = maxWaitTime > 15000 ? 5 : 3;
        const levelDifference = Math.abs(player1.level - player2.level);

        if (levelDifference <= maxLevelDifference) {
          matchIndex = j;
          break;
        }
      }
    }

    if (matchIndex !== -1) {
      const player2 = matchmakingQueue[matchIndex];

      // Mark as matched to avoid double-processing
      processedUserIds.add(player1.userId);
      processedUserIds.add(player2.userId);

      // Remove from matchmakingQueue (splice larger index first to preserve indices)
      matchmakingQueue.splice(matchIndex, 1);
      matchmakingQueue.splice(i, 1);
      i--; // adjust outer loop index due to removal

      // Launch the match in the background
      setupActiveBattleMatch(player1, player2).catch((err) => {
        console.error("[setupActiveBattleMatch] Match setup failed:", err);
      });
    }
  }
}

/**
 * Sets up the match database records, debits wagers, fetches questions,
 * and notifies matched sockets.
 */
async function setupActiveBattleMatch(p1: QueuedPlayer, p2: QueuedPlayer) {
  const matchId = `match_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  console.log(`[Matchmaking Success] Match: ${matchId} for ${p1.name} vs ${p2.name} (Wager: ${p1.wager} Stars)`);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Create Match database record in ACTIVE status
    await client.query(
      `INSERT INTO "Match" (id, "subjectId", status, mode, "questionsCount", "timePerQuestion", wager, "startTime")
       VALUES ($1, $2, 'ACTIVE', 'RANKED', 10, 30, $3, NOW())`,
      [matchId, p1.subjectId, p1.wager]
    );

    // 2. Create MatchParticipant records for both players
    await client.query(
      `INSERT INTO "MatchParticipant" (id, "matchId", "userId", score, "correctAnswers", "wrongAnswers", "isWinner", "xpEarned")
       VALUES 
       (gen_random_uuid()::text, $1, $2, 0, 0, 0, FALSE, 0),
       (gen_random_uuid()::text, $1, $3, 0, 0, 0, FALSE, 0)`,
      [matchId, p1.userId, p2.userId]
    );

    // 3. Deduct wagers from wallets atomically
    if (p1.wager > 0) {
      await deductWager(p1.userId, matchId, p1.wager);
      await deductWager(p2.userId, matchId, p1.wager);
    }

    await client.query("COMMIT");

    // 4. Fetch 10 random questions WITH correct answers for grading on the server
    const questionsResult = await pool.query(
      `SELECT q.id, q.content, q.type, q.options, q.difficulty, q.points, q."imageUrl", q.answer
       FROM "Question" q
       JOIN "Topic" t ON q."topicId" = t.id
       JOIN "Chapter" ch ON t."chapterId" = ch.id
       WHERE ch."subjectId" = $1
       ORDER BY RANDOM()
       LIMIT 10`,
      [p1.subjectId]
    );

    if (questionsResult.rows.length === 0) {
      throw new Error(`No questions found in subject ${p1.subjectId} to build match.`);
    }

    const questions = questionsResult.rows.map((q) => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : null
    }));

    // 5. Initialize the RoomState
    const roomState: RoomState = {
      matchId,
      subjectId: p1.subjectId,
      wager: p1.wager,
      questions,
      currentQuestionIndex: 0,
      questionTimer: null,
      timeRemaining: 30,
      questionStartTime: 0,
      players: {
        [p1.userId]: {
          socketId: p1.socketId,
          userId: p1.userId,
          name: p1.name,
          level: p1.level,
          score: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          responseTimes: [],
          submittedAnswer: null,
          submittedTime: null,
          cheatWarnings: 0,
          disconnectedAt: null
        },
        [p2.userId]: {
          socketId: p2.socketId,
          userId: p2.userId,
          name: p2.name,
          level: p2.level,
          score: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          responseTimes: [],
          submittedAnswer: null,
          submittedTime: null,
          cheatWarnings: 0,
          disconnectedAt: null
        }
      }
    };

    activeRooms.set(matchId, roomState);
    socketToRoomMap.set(p1.socketId, matchId);
    socketToRoomMap.set(p2.socketId, matchId);

    // 6. Notify clients via WebSockets
    if (io) {
      const s1 = io.sockets.sockets.get(p1.socketId);
      const s2 = io.sockets.sockets.get(p2.socketId);

      if (s1) s1.join(`match_${matchId}`);
      if (s2) s2.join(`match_${matchId}`);

      // Emit match_found
      io.to(p1.socketId).emit("match_found", {
        matchId,
        wager: p1.wager,
        opponent: { id: p2.userId, name: p2.name, level: p2.level }
      });

      io.to(p2.socketId).emit("match_found", {
        matchId,
        wager: p1.wager,
        opponent: { id: p1.userId, name: p1.name, level: p1.level }
      });

      // Start battle sequence after a brief countdown
      setTimeout(() => {
        const checkRoom = activeRooms.get(matchId);
        if (checkRoom) {
          startBattle(checkRoom);
        }
      }, 2500);
    }

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[setupActiveBattleMatch] Transaction rolled back due to error:", err);

    // Notify users that matching failed
    if (io) {
      io.to(p1.socketId).emit("queue_error", { message: "Failed to establish match. Refunds issued if applicable." });
      io.to(p2.socketId).emit("queue_error", { message: "Failed to establish match. Refunds issued if applicable." });
    }
  } finally {
    client.release();
  }
}

/**
 * Handle user reconnection to active battles.
 */
function handleReconnection(socket: Socket) {
  const userId = socket.data.userId;

  // Search if player belongs to an active match room
  for (const [matchId, room] of activeRooms.entries()) {
    const player = room.players[userId];
    if (player) {
      console.log(`[Reconnection Detected] User ${player.name} reconnected to match ${matchId}`);
      
      // Update with new socket details
      player.socketId = socket.id;
      player.disconnectedAt = null;
      socketToRoomMap.set(socket.id, matchId);

      // Re-join the room
      socket.join(`match_${matchId}`);

      // Notify opponent of reconnection
      socket.to(`match_${matchId}`).emit("opponent_reconnected", {
        userId,
        name: player.name
      });

      // Send the current battle state details to the reconnecting player
      const opponentId = Object.keys(room.players).find((id) => id !== userId) || "";
      const opponent = room.players[opponentId];
      
      // Build sanitized questions array (hide answers)
      const sanitizedQuestions = room.questions.map((q) => {
        const { answer, ...sanitized } = q;
        return sanitized;
      });

      socket.emit("battle_reconnected", {
        matchId,
        wager: room.wager,
        currentQuestionIndex: room.currentQuestionIndex,
        timeRemaining: room.timeRemaining,
        questionsCount: room.questions.length,
        currentQuestion: sanitizedQuestions[room.currentQuestionIndex],
        opponent: opponent ? { id: opponent.userId, name: opponent.name, level: opponent.level } : null,
        scores: {
          [userId]: player.score,
          [opponentId]: opponent ? opponent.score : 0
        },
        hasSubmitted: player.submittedAnswer !== null,
        opponentSubmitted: opponent ? opponent.submittedAnswer !== null : false
      });
      return;
    }
  }
}

/**
 * Starts the battle and broadcasts initial parameters.
 */
function startBattle(room: RoomState) {
  if (!io) return;

  const sanitizedQuestions = room.questions.map((q) => {
    const { answer, ...sanitized } = q;
    return sanitized;
  });

  const playersList = Object.values(room.players).map((p) => ({
    id: p.userId,
    name: p.name,
    level: p.level
  }));

  io.to(`match_${room.matchId}`).emit("match_start", {
    matchId: room.matchId,
    questions: sanitizedQuestions,
    players: playersList,
    wager: room.wager
  });

  // Start first question after a brief delay
  setTimeout(() => {
    startQuestion(room);
  }, 2000);
}

/**
 * Starts a specific question inside the battle arena.
 */
function startQuestion(room: RoomState) {
  if (!io) return;

  const question = room.questions[room.currentQuestionIndex];
  if (!question) {
    endMatch(room);
    return;
  }

  // Reset player answer submissions for this question
  for (const userId of Object.keys(room.players)) {
    const p = room.players[userId];
    p.submittedAnswer = null;
    p.submittedTime = null;
  }

  room.timeRemaining = 30;
  room.questionStartTime = Date.now();

  const { answer, ...sanitizedQuestion } = question;

  io.to(`match_${room.matchId}`).emit("question_start", {
    questionIndex: room.currentQuestionIndex,
    question: sanitizedQuestion,
    timeRemaining: room.timeRemaining
  });

  // Setup interval tick timer
  room.questionTimer = setInterval(() => {
    room.timeRemaining--;

    io!.to(`match_${room.matchId}`).emit("timer_tick", {
      timeRemaining: room.timeRemaining
    });

    if (room.timeRemaining <= 0) {
      if (room.questionTimer) {
        clearInterval(room.questionTimer);
        room.questionTimer = null;
      }
      endQuestion(room);
    }
  }, 1000);
}

/**
 * Ends the current question, reveals results, and schedules the next transition.
 */
function endQuestion(room: RoomState) {
  if (!io) return;

  if (room.questionTimer) {
    clearInterval(room.questionTimer);
    room.questionTimer = null;
  }

  const question = room.questions[room.currentQuestionIndex];
  
  const playerResults: { [userId: string]: any } = {};
  for (const userId of Object.keys(room.players)) {
    const p = room.players[userId];
    const isCorrect = p.submittedAnswer !== null &&
      p.submittedAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();

    playerResults[userId] = {
      answer: p.submittedAnswer,
      isCorrect,
      scoreGained: isCorrect ? (p.responseTimes[p.responseTimes.length - 1] < 30000 ? 10 + Math.max(0, Math.floor((30000 - p.responseTimes[p.responseTimes.length - 1]) / 3000)) : 10) : 0,
      totalScore: p.score
    };
  }

  io.to(`match_${room.matchId}`).emit("question_result", {
    questionIndex: room.currentQuestionIndex,
    correctAnswer: question.answer,
    playerResults
  });

  // Move to next question after 4s visual evaluation buffer
  setTimeout(() => {
    room.currentQuestionIndex++;
    const checkRoom = activeRooms.get(room.matchId);
    if (checkRoom) {
      startQuestion(checkRoom);
    }
  }, 4000);
}

/**
 * Ends the match, computes tie-breakers, saves stats, processes payouts, and ends room lifecycle.
 */
async function endMatch(room: RoomState) {
  if (!io) return;

  if (room.questionTimer) {
    clearInterval(room.questionTimer);
    room.questionTimer = null;
  }

  const userIds = Object.keys(room.players);
  if (userIds.length < 2) return;

  const p1 = room.players[userIds[0]];
  const p2 = room.players[userIds[1]];

  let winnerId: string | null = null;
  let loserId: string | null = null;
  let isTie = false;

  // Compute average response times (fallback to 30s cap if none recorded)
  const avg1 = p1.responseTimes.length > 0
    ? p1.responseTimes.reduce((a, b) => a + b, 0) / p1.responseTimes.length
    : 30000;
  const avg2 = p2.responseTimes.length > 0
    ? p2.responseTimes.reduce((a, b) => a + b, 0) / p2.responseTimes.length
    : 30000;

  if (p1.score > p2.score) {
    winnerId = p1.userId;
    loserId = p2.userId;
  } else if (p2.score > p1.score) {
    winnerId = p2.userId;
    loserId = p1.userId;
  } else {
    // Tied score -> resolve via response time tiebreaker
    if (avg1 < avg2) {
      winnerId = p1.userId;
      loserId = p2.userId;
      p1.score += 1; // bump DB score to force completeMatch resolution to choose p1
    } else if (avg2 < avg1) {
      winnerId = p2.userId;
      loserId = p1.userId;
      p2.score += 1; // bump DB score to force completeMatch resolution to choose p2
    } else {
      isTie = true;
    }
  }

  try {
    // 1. Save participant stats to database
    for (const userId of userIds) {
      const p = room.players[userId];
      const avgResponseSec = p.responseTimes.length > 0
        ? (p.responseTimes.reduce((a, b) => a + b, 0) / p.responseTimes.length) / 1000
        : null;

      await pool.query(
        `UPDATE "MatchParticipant"
         SET score = $1, "correctAnswers" = $2, "wrongAnswers" = $3, "avgResponseTime" = $4
         WHERE "matchId" = $5 AND "userId" = $6`,
        [p.score, p.correctAnswers, p.wrongAnswers, avgResponseSec, room.matchId, userId]
      );
    }

    // 2. Complete match and award default XP rewards
    const completionResult = await completeMatch(room.matchId);

    // 3. Resolve wallet wager payouts (draw refunds or winner-takes-all)
    if (room.wager > 0) {
      await distributeWagerPayout(room.matchId, isTie ? null : winnerId, isTie ? null : loserId, room.wager);
    }

    // 4. Emit match_end results
    io.to(`match_${room.matchId}`).emit("match_end", {
      matchId: room.matchId,
      winnerId: isTie ? null : winnerId,
      loserId: isTie ? null : loserId,
      isTie,
      scores: {
        [p1.userId]: p1.score,
        [p2.userId]: p2.score
      },
      xpEarned: {
        [p1.userId]: winnerId === p1.userId ? 90 : (isTie ? 45 : 30),
        [p2.userId]: winnerId === p2.userId ? 90 : (isTie ? 45 : 30)
      },
      wagerPayout: {
        [p1.userId]: winnerId === p1.userId ? room.wager * 2 : (isTie ? room.wager : 0),
        [p2.userId]: winnerId === p2.userId ? room.wager * 2 : (isTie ? room.wager : 0)
      }
    });

  } catch (err) {
    console.error("[endMatch] Error completing battle room:", err);
    io.to(`match_${room.matchId}`).emit("battle_error", { message: "Error finalising battle score records. Refunds processed." });
  } finally {
    // Cleanup state maps
    socketToRoomMap.delete(p1.socketId);
    socketToRoomMap.delete(p2.socketId);
    activeRooms.delete(room.matchId);
  }
}

/**
 * Handles a forfeit when a player disconnects and fails to return.
 */
async function handleForfeit(room: RoomState, disconnectedUserId: string) {
  if (!io) return;

  if (room.questionTimer) {
    clearInterval(room.questionTimer);
    room.questionTimer = null;
  }

  const remainingUserId = Object.keys(room.players).find((id) => id !== disconnectedUserId);
  if (!remainingUserId) return;

  const disconnectedPlayer = room.players[disconnectedUserId];
  const remainingPlayer = room.players[remainingUserId];

  console.log(`[Battle Forfeit] Running forfeit routine. Winner: ${remainingPlayer.name}, Leaver: ${disconnectedPlayer.name}`);

  try {
    // 1. Declare remaining player as winner
    await pool.query(
      `UPDATE "MatchParticipant"
       SET score = score + 10, "isWinner" = TRUE
       WHERE "matchId" = $1 AND "userId" = $2`,
      [room.matchId, remainingUserId]
    );

    // 2. completeMatch
    await completeMatch(room.matchId);

    // 3. Wager payout: winner-takes-all
    if (room.wager > 0) {
      await distributeWagerPayout(room.matchId, remainingUserId, disconnectedUserId, room.wager);
    }

    // 4. Emit forfeit match end
    io.to(`match_${room.matchId}`).emit("match_end", {
      matchId: room.matchId,
      winnerId: remainingUserId,
      loserId: disconnectedUserId,
      isForfeit: true,
      scores: {
        [remainingUserId]: remainingPlayer.score + 10,
        [disconnectedUserId]: disconnectedPlayer.score
      },
      xpEarned: {
        [remainingUserId]: 90,
        [disconnectedUserId]: 0
      },
      wagerPayout: {
        [remainingUserId]: room.wager * 2,
        [disconnectedUserId]: 0
      }
    });

  } catch (err) {
    console.error("[handleForfeit] Error executing forfeit transaction:", err);
  } finally {
    socketToRoomMap.delete(disconnectedPlayer.socketId);
    socketToRoomMap.delete(remainingPlayer.socketId);
    activeRooms.delete(room.matchId);
  }
}
