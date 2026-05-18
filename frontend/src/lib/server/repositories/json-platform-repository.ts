/**
 * FILE: json-platform-repository.ts
 * LOCATION: src/lib/server/repositories/json-platform-repository.ts
 * PURPOSE: Concrete repository adapter that maps the current durable JSON store
 *          onto the repository contracts used by backend services.
 * USED BY: get-platform-repository.ts
 * DEPENDENCIES: platform-store helpers
 * LAST UPDATED: 2026-05-12
 */

import {
  createAuditLog,
  createBackgroundJob,
  createCommunityPost,
  createMatchmakingTicket,
  createUser,
  findUserByEmail,
  findUserById,
  listCommunityPosts,
  listMatchmakingTicketsForUser,
  listPublicUsersByRank,
  listRegisteredEventIds,
  registerForEvent,
  toPublicUser,
} from "@/lib/server/data/platform-store";
import { getSerializableEvents } from "@/lib/events/event-catalog";
import type { PlatformRepository } from "@/lib/server/repositories/platform-repository";
import type { LearningTrack, PublicUser } from "@/types/auth";

/** Builds compact initials for avatars without exposing extra profile data. */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Converts ranked public users into the leaderboard contract consumed by the UI. */
function mapLeaderboardEntries(
  users: PublicUser[],
  currentUserId?: string,
) {
  return users.map((user, index) => ({
    rank: index + 1,
    userId: user.id,
    name: user.name,
    initials: getInitials(user.name),
    level: user.level,
    xp: user.xp,
    track: user.track,
    isSelf: user.id === currentUserId,
  }));
}

/** Current working repository implementation backed by the serialized JSON MVP store. */
export const jsonPlatformRepository: PlatformRepository = {
  users: {
    findByEmail: findUserByEmail,
    findById: findUserById,
    create: createUser,
    toPublic: toPublicUser,
  },
  battles: {
    createMatchmakingTicket,
    listTicketsForUser: listMatchmakingTicketsForUser,
  },
  community: {
    listPosts: listCommunityPosts,
    createPost: createCommunityPost,
  },
  events: {
    async listCatalog() {
      return getSerializableEvents();
    },
    async findCatalogEventById(eventId) {
      return getSerializableEvents().find((event) => event.id === eventId) ?? null;
    },
    register: registerForEvent,
    listRegisteredEventIds,
  },
  leaderboard: {
    async listTopUsers(scope: "global" | LearningTrack, currentUserId?: string) {
      const users = await listPublicUsersByRank();
      const scopedUsers = scope === "global"
        ? users
        : users.filter((user) => user.track === scope);

      /*
       * Keep the response bounded for browser rendering while still ensuring the
       * signed-in student appears if they are outside the top 100.
       */
      const topUsers = scopedUsers.slice(0, 100);
      const currentUser = currentUserId
        ? scopedUsers.find((user) => user.id === currentUserId)
        : undefined;
      const mergedUsers = currentUser && !topUsers.some((user) => user.id === currentUser.id)
        ? [...topUsers, currentUser]
        : topUsers;

      return mapLeaderboardEntries(mergedUsers, currentUserId);
    },
  },

  /**
   * Dashboard Repository — JSON Store Implementation
   * Aggregates real user-owned counts from the existing store helpers.
   * Provides battle ticket counts, community posts, event registrations,
   * and global/track ranking for the authenticated user's dashboard.
   */
  dashboard: {
    async getMetricsForUser(userId: string, track: LearningTrack) {
      /* Fetch all data sources concurrently for faster response */
      const [tickets, posts, registeredIds, allUsers] = await Promise.all([
        listMatchmakingTicketsForUser(userId),
        listCommunityPosts(),
        listRegisteredEventIds(userId),
        listPublicUsersByRank(),
      ]);

      /* Count only the community posts authored by this specific user */
      const userPostCount = posts.filter((p) => p.authorId === userId).length;

      /* Compute queued (still waiting) tickets */
      const queuedTickets = tickets.filter((t) => t.status === "queued").length;

      /* Derive the user's global and track-specific rankings */
      const globalIndex = allUsers.findIndex((u) => u.id === userId);
      const trackUsers = allUsers.filter((u) => u.track === track);
      const trackIndex = trackUsers.findIndex((u) => u.id === userId);

      return {
        battleTickets: tickets.length,
        queuedBattleTickets: queuedTickets,
        communityPosts: userPostCount,
        eventRegistrations: registeredIds.length,
        globalRank: globalIndex >= 0 ? globalIndex + 1 : null,
        trackRank: trackIndex >= 0 ? trackIndex + 1 : null,
      };
    },
  },
  audit: {
    create: createAuditLog,
  },
  jobs: {
    create: createBackgroundJob,
  },
};
