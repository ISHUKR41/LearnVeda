/**
 * FILE: postgres-platform-repository.ts
 * LOCATION: src/lib/server/repositories/postgres-platform-repository.ts
 * PURPOSE: PostgreSQL implementation of the EduQuest backend repository
 *          contracts. It stores durable production data while preserving the
 *          same service-facing API used by the local JSON adapter.
 * USED BY: get-platform-repository.ts when EDUQUEST_PERSISTENCE_ADAPTER=postgres
 * DEPENDENCIES: postgres.ts, platform-repository.ts, shared auth/store types
 * LAST UPDATED: 2026-05-12
 */

import { queryPostgres } from "@/lib/server/database/postgres";
import type {
  CommunityPost,
  EventRegistration,
} from "@/lib/server/data/platform-store";
import type { AuditLogEntry, AuditMetadata, CreateAuditLogInput } from "@/lib/server/audit/audit-log";
import type {
  BackgroundJobIntent,
  BackgroundJobPayload,
  CreateBackgroundJobInput,
} from "@/lib/server/jobs/job-intents";
import type { PlatformRepository } from "@/lib/server/repositories/platform-repository";
import type { LearningTrack, PublicUser, StoredUser, UserRole } from "@/types/auth";

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  track: LearningTrack;
  role: UserRole;
  level: number;
  xp: number;
  streak: number;
  created_at: Date | string;
}

interface CommunityPostRow {
  id: string;
  author_id: string | null;
  author_name: string;
  title: string;
  body: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  created_at: Date | string;
}

interface EventRegistrationRow {
  id: string;
  event_id: string;
  user_id: string;
  created_at: Date | string;
}

interface PlatformEventRow {
  id: string;
  title: string;
  description: string;
  event_date_label: string;
  location: string;
  participant_count: number;
  status: "live" | "upcoming" | "completed";
  gradient: string;
}

interface MatchmakingTicketRow {
  id: string;
  user_id: string;
  category: string;
  status: "queued" | "matched" | "cancelled";
  created_at: Date | string;
}

interface LeaderboardRow {
  id: string;
  name: string;
  track: LearningTrack;
  level: number;
  xp: number;
  global_rank: string | number;
}

interface IdRow {
  id: string;
}

interface EventIdRow {
  event_id: string;
}

interface AuditLogRow {
  id: string;
  action: AuditLogEntry["action"];
  actor_id: string | null;
  actor_type: AuditLogEntry["actorType"];
  target_type: string;
  target_id: string | null;
  severity: AuditLogEntry["severity"];
  metadata: unknown;
  created_at: Date | string;
}

interface BackgroundJobRow {
  id: string;
  kind: BackgroundJobIntent["kind"];
  subject_type: string;
  subject_id: string;
  status: BackgroundJobIntent["status"];
  payload: unknown;
  attempts: number;
  created_at: Date | string;
  run_after: Date | string;
}

/** Converts database timestamp values to the ISO strings expected by the UI. */
function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

/** Safely maps JSONB objects to the primitive metadata shape used by services. */
function mapJsonObject<T extends Record<string, string | number | boolean | null>>(
  value: unknown,
): T {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as T
    : {} as T;
}

/** Converts one database user row into the server-side StoredUser contract. */
function mapUserRow(row: UserRow): StoredUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    track: row.track,
    role: row.role,
    level: row.level,
    xp: row.xp,
    streak: row.streak,
    createdAt: toIsoString(row.created_at),
  };
}

/** Converts one database post row into the community feed contract. */
function mapCommunityPostRow(row: CommunityPostRow): CommunityPost {
  return {
    id: row.id,
    authorId: row.author_id ?? "deleted-user",
    authorName: row.author_name,
    title: row.title,
    body: row.body,
    tags: row.tags,
    likes: row.likes,
    comments: row.comments,
    views: row.views,
    createdAt: toIsoString(row.created_at),
  };
}

/** Converts one database event registration row into the API contract. */
function mapEventRegistrationRow(row: EventRegistrationRow): EventRegistration {
  return {
    id: row.id,
    eventId: row.event_id,
    userId: row.user_id,
    createdAt: toIsoString(row.created_at),
  };
}

/** Converts a database event catalog row into the browser-safe event card shape. */
function mapPlatformEventRow(row: PlatformEventRow) {
  return {
    id: row.id,
    title: row.title,
    desc: row.description,
    date: row.event_date_label,
    location: row.location,
    participants: row.participant_count,
    status: row.status,
    gradient: row.gradient,
  };
}

/** Converts a database matchmaking row into the battle ticket contract. */
function mapMatchmakingTicketRow(row: MatchmakingTicketRow) {
  return {
    id: row.id,
    userId: row.user_id,
    category: row.category,
    status: row.status,
    createdAt: toIsoString(row.created_at),
  };
}

/** Converts one database audit row into the shared audit entry contract. */
function mapAuditLogRow(row: AuditLogRow): AuditLogEntry {
  return {
    id: row.id,
    action: row.action,
    actorId: row.actor_id ?? undefined,
    actorType: row.actor_type,
    targetType: row.target_type,
    targetId: row.target_id ?? undefined,
    severity: row.severity,
    metadata: mapJsonObject<AuditMetadata>(row.metadata),
    createdAt: toIsoString(row.created_at),
  };
}

/** Converts one database job row into the shared background job contract. */
function mapBackgroundJobRow(row: BackgroundJobRow): BackgroundJobIntent {
  return {
    id: row.id,
    kind: row.kind,
    subjectType: row.subject_type,
    subjectId: row.subject_id,
    status: row.status,
    payload: mapJsonObject<BackgroundJobPayload>(row.payload),
    attempts: row.attempts,
    createdAt: toIsoString(row.created_at),
    runAfter: toIsoString(row.run_after),
  };
}

/** Builds compact initials for leaderboard avatars without another profile query. */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Removes password hashes before user data is sent to browser clients. */
function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    track: user.track,
    role: user.role,
    level: user.level,
    xp: user.xp,
    streak: user.streak,
    createdAt: user.createdAt,
  };
}

/** Production repository implementation backed by PostgreSQL tables. */
export const postgresPlatformRepository: PlatformRepository = {
  users: {
    async findByEmail(email) {
      const result = await queryPostgres<UserRow>(
        `SELECT id, name, email, password_hash, track, role, level, xp, streak, created_at
         FROM eduquest_users
         WHERE email = $1
         LIMIT 1`,
        [email.toLowerCase()],
      );

      return result.rows[0] ? mapUserRow(result.rows[0]) : null;
    },

    async findById(id) {
      const result = await queryPostgres<UserRow>(
        `SELECT id, name, email, password_hash, track, role, level, xp, streak, created_at
         FROM eduquest_users
         WHERE id = $1
         LIMIT 1`,
        [id],
      );

      return result.rows[0] ? mapUserRow(result.rows[0]) : null;
    },

    async create(input) {
      try {
        const result = await queryPostgres<UserRow>(
          `INSERT INTO eduquest_users (name, email, password_hash, track)
           VALUES ($1, $2, $3, $4)
           RETURNING id, name, email, password_hash, track, role, level, xp, streak, created_at`,
          [input.name, input.email.toLowerCase(), input.passwordHash, input.track],
        );

        return toPublicUser(mapUserRow(result.rows[0]));
      } catch (error) {
        /*
         * PostgreSQL unique_violation means the normalized email already exists.
         * The service layer already knows how to translate USER_ALREADY_EXISTS
         * into a safe public API message.
         */
        if (error instanceof Error && "code" in error && error.code === "23505") {
          throw new Error("USER_ALREADY_EXISTS");
        }

        throw error;
      }
    },

    toPublic: toPublicUser,
  },

  battles: {
    async createMatchmakingTicket(userId, category) {
      const result = await queryPostgres<IdRow>(
        `INSERT INTO eduquest_matchmaking_tickets (user_id, category)
         VALUES ($1, $2)
         RETURNING id`,
        [userId, category],
      );

      return result.rows[0].id;
    },

    async listTicketsForUser(userId) {
      const result = await queryPostgres<MatchmakingTicketRow>(
        `SELECT id, user_id, category, status, created_at
         FROM eduquest_matchmaking_tickets
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 100`,
        [userId],
      );

      return result.rows.map(mapMatchmakingTicketRow);
    },
  },

  community: {
    async listPosts() {
      const result = await queryPostgres<CommunityPostRow>(
        `SELECT id, author_id, author_name, title, body, tags, likes, comments, views, created_at
         FROM eduquest_community_posts
         ORDER BY created_at DESC
         LIMIT 100`,
      );

      return result.rows.map(mapCommunityPostRow);
    },

    async createPost(input) {
      const result = await queryPostgres<CommunityPostRow>(
        `INSERT INTO eduquest_community_posts (author_id, author_name, title, body, tags)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, author_id, author_name, title, body, tags, likes, comments, views, created_at`,
        [input.author.id, input.author.name, input.title, input.body, input.tags],
      );

      return mapCommunityPostRow(result.rows[0]);
    },
  },

  events: {
    async listCatalog() {
      const result = await queryPostgres<PlatformEventRow>(
        `SELECT id, title, description, event_date_label, location, participant_count, status, gradient
         FROM eduquest_events
         WHERE is_public = TRUE
         ORDER BY sort_order ASC, created_at ASC`,
      );

      return result.rows.map(mapPlatformEventRow);
    },

    async findCatalogEventById(eventId) {
      const result = await queryPostgres<PlatformEventRow>(
        `SELECT id, title, description, event_date_label, location, participant_count, status, gradient
         FROM eduquest_events
         WHERE id = $1 AND is_public = TRUE
         LIMIT 1`,
        [eventId],
      );

      return result.rows[0] ? mapPlatformEventRow(result.rows[0]) : null;
    },

    async register(eventId, userId) {
      const result = await queryPostgres<EventRegistrationRow>(
        `INSERT INTO eduquest_event_registrations (event_id, user_id)
         VALUES ($1, $2)
         ON CONFLICT (event_id, user_id)
         DO UPDATE SET event_id = EXCLUDED.event_id
         RETURNING id, event_id, user_id, created_at`,
        [eventId, userId],
      );

      return mapEventRegistrationRow(result.rows[0]);
    },

    async listRegisteredEventIds(userId) {
      const result = await queryPostgres<EventIdRow>(
        `SELECT event_id
         FROM eduquest_event_registrations
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId],
      );

      return result.rows.map((row) => row.event_id);
    },
  },
  leaderboard: {
    async listTopUsers(scope, currentUserId) {
      const values: unknown[] = [];
      const scopeWhere = scope === "global" ? "" : "WHERE track = $1";

      if (scope !== "global") {
        values.push(scope);
      }

      const result = await queryPostgres<LeaderboardRow>(
        `WITH ranked_users AS (
           SELECT
             id,
             name,
             track,
             level,
             xp,
             ROW_NUMBER() OVER (ORDER BY xp DESC, level DESC, created_at ASC) AS global_rank
           FROM eduquest_users
           ${scopeWhere}
         )
         SELECT id, name, track, level, xp, global_rank
         FROM ranked_users
         WHERE global_rank <= 100 OR id = $${values.length + 1}
         ORDER BY global_rank ASC`,
        [...values, currentUserId ?? "00000000-0000-0000-0000-000000000000"],
      );

      return result.rows.map((row) => ({
        rank: Number(row.global_rank),
        userId: row.id,
        name: row.name,
        initials: getInitials(row.name),
        level: row.level,
        xp: row.xp,
        track: row.track,
        isSelf: row.id === currentUserId,
      }));
    },
  },

  /**
   * Dashboard Repository — PostgreSQL Implementation
   * Uses efficient SQL aggregate queries to compute all dashboard metrics
   * in a single round-trip where possible. Falls back to individual queries
   * where the ranking CTE makes a combined query impractical.
   */
  dashboard: {
    async getMetricsForUser(userId: string, track: LearningTrack) {
      /**
       * Run all metric queries concurrently for the fastest possible
       * dashboard load time. Each query is small and indexed.
       */
      const [ticketResult, postResult, eventResult, globalRankResult, trackRankResult] = await Promise.all([
        /* Total and queued battle tickets for this user */
        queryPostgres<{ total: string; queued: string }>(
          `SELECT
             COUNT(*) AS total,
             COUNT(*) FILTER (WHERE status = 'queued') AS queued
           FROM eduquest_matchmaking_tickets
           WHERE user_id = $1`,
          [userId],
        ),

        /* Count of community posts authored by this user */
        queryPostgres<{ count: string }>(
          `SELECT COUNT(*) AS count
           FROM eduquest_community_posts
           WHERE author_id = $1`,
          [userId],
        ),

        /* Count of event registrations for this user */
        queryPostgres<{ count: string }>(
          `SELECT COUNT(*) AS count
           FROM eduquest_event_registrations
           WHERE user_id = $1`,
          [userId],
        ),

        /* Global rank based on XP descending */
        queryPostgres<{ rank: string }>(
          `SELECT rank FROM (
             SELECT id, ROW_NUMBER() OVER (ORDER BY xp DESC, level DESC) AS rank
             FROM eduquest_users
           ) sub
           WHERE id = $1`,
          [userId],
        ),

        /* Track-specific rank based on XP descending */
        queryPostgres<{ rank: string }>(
          `SELECT rank FROM (
             SELECT id, ROW_NUMBER() OVER (ORDER BY xp DESC, level DESC) AS rank
             FROM eduquest_users
             WHERE track = $1
           ) sub
           WHERE id = $2`,
          [track, userId],
        ),
      ]);

      const ticketRow = ticketResult.rows[0];
      const globalRankRow = globalRankResult.rows[0];
      const trackRankRow = trackRankResult.rows[0];

      return {
        battleTickets: Number(ticketRow?.total ?? 0),
        queuedBattleTickets: Number(ticketRow?.queued ?? 0),
        communityPosts: Number(postResult.rows[0]?.count ?? 0),
        eventRegistrations: Number(eventResult.rows[0]?.count ?? 0),
        globalRank: globalRankRow ? Number(globalRankRow.rank) : null,
        trackRank: trackRankRow ? Number(trackRankRow.rank) : null,
      };
    },
  },
  audit: {
    async create(input: CreateAuditLogInput) {
      const result = await queryPostgres<AuditLogRow>(
        `INSERT INTO eduquest_audit_logs (
           action, actor_id, actor_type, target_type, target_id, severity, metadata
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
         RETURNING id, action, actor_id, actor_type, target_type, target_id, severity, metadata, created_at`,
        [
          input.action,
          input.actorId ?? null,
          input.actorType,
          input.targetType,
          input.targetId ?? null,
          input.severity,
          JSON.stringify(input.metadata ?? {}),
        ],
      );

      return mapAuditLogRow(result.rows[0]);
    },
  },
  jobs: {
    async create(input: CreateBackgroundJobInput) {
      const result = await queryPostgres<BackgroundJobRow>(
        `INSERT INTO eduquest_background_jobs (
           kind, subject_type, subject_id, payload, run_after
         )
         VALUES ($1, $2, $3, $4::jsonb, COALESCE($5::timestamptz, NOW()))
         RETURNING id, kind, subject_type, subject_id, status, payload, attempts, created_at, run_after`,
        [
          input.kind,
          input.subjectType,
          input.subjectId,
          JSON.stringify(input.payload ?? {}),
          input.runAfter ?? null,
        ],
      );

      return mapBackgroundJobRow(result.rows[0]);
    },
  },
};
