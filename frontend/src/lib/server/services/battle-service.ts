/**
 * FILE: battle-service.ts
 * LOCATION: src/lib/server/services/battle-service.ts
 * PURPOSE: Backend battle orchestration. The current REST-first flow stores a
 *          queue ticket today and leaves one stable service boundary for future
 *          Redis-backed matchmaking and WebSocket battle room creation.
 * USED BY: src/app/api/battle/matchmaking/route.ts
 * DEPENDENCIES: platform store, shared validation types
 * LAST UPDATED: 2026-05-12
 */

import { getPlatformRepository } from "@/lib/server/repositories/get-platform-repository";
import type { BattleMatchmakingInput } from "@/lib/validation/auth";

export interface QueuedBattleMatch {
  ticketId: string;
  category: string;
  status: "queued";
  estimatedWaitSeconds: number;
  opponentPool: string;
}

/** Creates the current matchmaking ticket response returned to the client. */
/**
 * BattleSummary Type
 * Represents a high-level overview of a user's battle activity.
 * Used by the /api/battles GET endpoint to show battle statistics
 * on the battle page and dashboard widgets.
 */
export interface BattleSummary {
  /** Total number of matchmaking tickets ever created by this user */
  totalTickets: number;
  /** Number of tickets still in the "queued" state awaiting an opponent */
  queuedTickets: number;
  /** Number of tickets that have already been matched by future realtime workers */
  matchedTickets: number;
  /** Win count is currently reserved for the future battle result table */
  wins: number;
  /** Loss count is currently reserved for the future battle result table */
  losses: number;
  /** Percentage of completed battles won; null means no completed result data yet */
  winRate: number | null;
  /** The categories that the user has participated in */
  categories: string[];
}

/**
 * getBattleSummaryForUser
 * Fetches all matchmaking tickets for a given user and compiles a
 * summary with total counts and category breakdown.
 *
 * @param userId - The unique identifier of the authenticated user
 * @returns A BattleSummary object with ticket statistics
 */
export async function getBattleSummaryForUser(
  userId: string,
): Promise<BattleSummary> {
  const repository = getPlatformRepository();
  const tickets = await repository.battles.listTicketsForUser(userId);

  /* Derive unique categories from all tickets for this user */
  const categories = [...new Set(tickets.map((t) => t.category))];

  /* Count only tickets that are still waiting for a match */
  const queuedTickets = tickets.filter((t) => t.status === "queued").length;
  const matchedTickets = tickets.filter((t) => t.status === "matched").length;

  return {
    totalTickets: tickets.length,
    queuedTickets,
    matchedTickets,
    wins: 0,
    losses: 0,
    winRate: null,
    categories,
  };
}

/** Creates the current matchmaking ticket response returned to the client. */
export async function queueBattleMatch(
  userId: string,
  input: BattleMatchmakingInput,
): Promise<QueuedBattleMatch> {
  const repository = getPlatformRepository();
  const ticketId = await repository.battles.createMatchmakingTicket(userId, input.category);

  return {
    ticketId,
    category: input.category,
    status: "queued",
    estimatedWaitSeconds: 18,
    opponentPool: "same-track-similar-level",
  };
}
