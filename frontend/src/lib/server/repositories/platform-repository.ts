/**
 * FILE: platform-repository.ts
 * LOCATION: src/lib/server/repositories/platform-repository.ts
 * PURPOSE: Storage contracts for backend services. These interfaces describe
 *          what the application needs from persistence without coupling the
 *          service layer to one concrete storage engine.
 * USED BY: Backend services, repository implementations, current-user lookup
 * LAST UPDATED: 2026-05-12
 */

import type {
  CommunityPost,
  EventRegistration,
  MatchmakingTicket,
} from "@/lib/server/data/platform-store";
import type { AuditLogEntry, CreateAuditLogInput } from "@/lib/server/audit/audit-log";
import type { BackgroundJobIntent, CreateBackgroundJobInput } from "@/lib/server/jobs/job-intents";
import type { LearningTrack, PublicUser, StoredUser } from "@/types/auth";

export interface CreateRepositoryUserInput {
  name: string;
  email: string;
  passwordHash: string;
  track: LearningTrack;
}

/** User persistence contract required by auth and session flows. */
export interface UserRepository {
  findByEmail(email: string): Promise<StoredUser | null>;
  findById(id: string): Promise<StoredUser | null>;
  create(input: CreateRepositoryUserInput): Promise<PublicUser>;
  toPublic(user: StoredUser): PublicUser;
}

/** Battle persistence contract required by matchmaking flows. */
export interface BattleRepository {
  createMatchmakingTicket(userId: string, category: string): Promise<string>;
  listTicketsForUser(userId: string): Promise<MatchmakingTicket[]>;
}

/** Community persistence contract required by the discussion feed. */
export interface CommunityRepository {
  listPosts(): Promise<CommunityPost[]>;
  createPost(input: {
    author: PublicUser;
    title: string;
    body: string;
    tags: string[];
  }): Promise<CommunityPost>;
}

/**
 * Database-safe event record sent to the browser.
 * The UI receives already-formatted date text so it does not need to know
 * whether events came from the local catalog or the production database.
 */
export interface PlatformEventRecord {
  id: string;
  title: string;
  desc: string;
  date: string;
  location: string;
  participants: number;
  status: "live" | "upcoming" | "completed";
  gradient: string;
}

/** Event persistence contract required by the catalog and registration flows. */
export interface EventRepository {
  listCatalog(): Promise<PlatformEventRecord[]>;
  findCatalogEventById(eventId: string): Promise<PlatformEventRecord | null>;
  register(eventId: string, userId: string): Promise<EventRegistration>;
  listRegisteredEventIds(userId: string): Promise<string[]>;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  initials: string;
  level: number;
  xp: number;
  track: LearningTrack;
  isSelf: boolean;
}

/** Ranking persistence contract required by the public leaderboard page. */
export interface LeaderboardRepository {
  listTopUsers(scope: "global" | LearningTrack, currentUserId?: string): Promise<LeaderboardEntry[]>;
}

export interface DashboardMetrics {
  battleTickets: number;
  queuedBattleTickets: number;
  communityPosts: number;
  eventRegistrations: number;
  globalRank: number | null;
  trackRank: number | null;
}

/** Dashboard persistence contract for real user-owned counts and ranks. */
export interface DashboardRepository {
  getMetricsForUser(userId: string, track: LearningTrack): Promise<DashboardMetrics>;
}

/** Audit persistence contract for security and moderation-critical events. */
export interface AuditRepository {
  create(input: CreateAuditLogInput): Promise<AuditLogEntry>;
}

/** Background job contract for durable async work that should not run in requests. */
export interface BackgroundJobRepository {
  create(input: CreateBackgroundJobInput): Promise<BackgroundJobIntent>;
}

/** Complete backend repository surface consumed by services. */
export interface PlatformRepository {
  users: UserRepository;
  battles: BattleRepository;
  community: CommunityRepository;
  events: EventRepository;
  leaderboard: LeaderboardRepository;
  dashboard: DashboardRepository;
  audit: AuditRepository;
  jobs: BackgroundJobRepository;
}
