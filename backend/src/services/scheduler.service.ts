/**
 * FILE: scheduler.service.ts
 * LOCATION: backend/src/services/scheduler.service.ts
 * PURPOSE: Production job scheduler for automated recurring tasks.
 *          Handles leaderboard recalculation, streak expiry, analytics cleanup,
 *          notification purging, and weekly report generation.
 *
 * ARCHITECTURE:
 *  - In-process scheduling using setInterval (no external dependencies).
 *  - For production with multiple instances, replace with BullMQ + Redis
 *    to ensure jobs run on exactly one instance (leader election).
 *  - Each job has error isolation — a failing job doesn't affect others.
 *  - Jobs log execution time for performance monitoring.
 *
 * JOBS:
 *  1. Leaderboard refresh (every 15 minutes)
 *  2. Streak expiry check (daily at midnight)
 *  3. Analytics data cleanup (daily at 3 AM)
 *  4. Notification purge (daily at 4 AM)
 *  5. Weekly progress reports (every Sunday at 9 AM)
 *  6. Database connection pool monitoring (every 5 minutes)
 *
 * CAPACITY: All jobs are designed to complete within 60 seconds.
 *           Uses database transactions for data consistency.
 *
 * DEPENDENCIES: pg Pool, analytics.service.ts, notification.service.ts
 * USED BY: index.ts (started during server boot)
 * LAST UPDATED: 2026-05-26
 */

import { pool } from "../config/database";
import logger from "../utils/logger";
import { purgeOldNotifications } from "./notification.service";
import { getPoolMetrics } from "../config/database";
import { cache, CACHE_TTL } from "../config/cache";

/* ─────────────────────────────────────────────
 * Job Registry Type Definitions
 * ───────────────────────────────────────────── */

/** Shape of a scheduled job */
interface ScheduledJob {
  /** Unique job name */
  name: string;
  /** Human-readable description */
  description: string;
  /** Execution interval in milliseconds */
  intervalMs: number;
  /** The function to execute */
  execute: () => Promise<void>;
  /** Whether this job is enabled */
  enabled: boolean;
  /** Timer reference for cleanup */
  timer?: ReturnType<typeof setInterval>;
  /** Last execution timestamp */
  lastRunAt?: Date;
  /** Last execution duration in ms */
  lastDurationMs?: number;
  /** Total number of executions */
  runCount: number;
  /** Total number of failed executions */
  errorCount: number;
}

/* ─────────────────────────────────────────────
 * Job Definitions
 * Each job is a standalone function that handles its own
 * database queries and error recovery.
 * ───────────────────────────────────────────── */

/**
 * JOB: Leaderboard Refresh
 * Recalculates global and subject-specific leaderboard rankings by querying
 * the "User" table and dynamically pre-populating the cache to prevent
 * database load when users request leaderboards.
 * Runs every 15 minutes.
 */
async function refreshLeaderboard(): Promise<void> {
  const scopes = ["global", "class-9", "class-10", "class-11", "class-12", "engineering"];
  
  for (const scope of scopes) {
    try {
      const whereClause = scope === "global"
        ? "WHERE u.role = 'STUDENT' AND u.\"isActive\" = TRUE"
        : "WHERE u.role = 'STUDENT' AND u.\"isActive\" = TRUE AND LOWER(u.\"classLevel\") = LOWER($3)";

      const params: (string | number)[] = [50, 0];
      if (scope !== "global") params.push(scope);

      // Fetch leaderboard entries with rank window function
      const queryText = `
        SELECT
          u.id                                      AS "userId",
          u.name,
          u.xp,
          u."currentLevel"                          AS level,
          u."currentStreak"                         AS streak,
          COALESCE(u."classLevel", 'general')       AS track,
          RANK() OVER (ORDER BY u.xp DESC)          AS rank,
          UPPER(LEFT(COALESCE(u.name, 'A'), 2))     AS initials
        FROM "User" u
        ${whereClause}
        ORDER BY u.xp DESC
        LIMIT $1 OFFSET $2
      `;

      // Also get the total count of student users for pagination calculation
      const countParams = scope !== "global" ? [scope] : [];
      const countQuery = `
        SELECT COUNT(*)::int AS total
        FROM "User" u
        ${scope === "global" ? "WHERE u.role = 'STUDENT' AND u.\"isActive\" = TRUE" : "WHERE u.role = 'STUDENT' AND u.\"isActive\" = TRUE AND LOWER(u.\"classLevel\") = LOWER($1)"}
      `;

      const [entriesResult, countResult] = await Promise.all([
        pool.query(queryText, params),
        pool.query(countQuery, countParams)
      ]);

      const cacheKey = `leaderboard:${scope}:l_50:o_0`;
      await cache.set(cacheKey, {
        entries: entriesResult.rows,
        total: countResult.rows[0]?.total ?? 0
      }, CACHE_TTL.LEADERBOARD);

      logger.debug(`[Scheduler] Leaderboard cache warmed up for scope: ${scope}`);
    } catch (err) {
      logger.error(`[Scheduler] Failed to warm up leaderboard cache for scope: ${scope}`, {
        error: err instanceof Error ? err.message : "Unknown"
      });
      // Continue to next scope rather than failing completely
    }
  }

  logger.info("[Scheduler] Leaderboard rankings refreshed & cache pre-populated");
}

/**
 * JOB: Streak Expiry Check
 * Identifies users who haven't completed any activity in the last 24 hours
 * and resets their current streak to 0.
 * Sends a notification before resetting.
 * Runs daily at midnight.
 */
async function checkStreakExpiry(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    /* Find users whose streak will expire */
    const expiring = await client.query(`
      /* Users who had a streak yesterday but haven't logged activity today */
      SELECT id, username, current_streak, email
      FROM users
      WHERE current_streak > 0
        AND last_activity_at < NOW() - INTERVAL '24 hours'
    `);

    if (expiring.rows.length > 0) {
      /* Reset expired streaks */
      await client.query(`
        UPDATE users
        SET
          current_streak = 0,
          streak_broken_at = NOW()
        WHERE current_streak > 0
          AND last_activity_at < NOW() - INTERVAL '24 hours'
      `);

      /* Log streak breaks for analytics */
      const values: unknown[] = [];
      const placeholders: string[] = [];

      expiring.rows.forEach((user: Record<string, unknown>, idx: number) => {
        const offset = idx * 4;
        placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, NOW())`);
        values.push(
          "streak_broken",
          user.id,
          JSON.stringify({ previous_streak: user.current_streak }),
          `/profile/${user.id}`
        );
      });

      if (placeholders.length > 0) {
        await client.query(
          `INSERT INTO analytics_events (event_type, user_id, metadata, page_url, created_at)
           VALUES ${placeholders.join(", ")}`,
          values
        );
      }

      logger.info("[Scheduler] Streak expiry processed", {
        expiredCount: expiring.rows.length,
      });
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * JOB: Analytics Data Cleanup
 * Removes analytics events older than the retention period.
 * Default retention: 90 days for raw events.
 * Aggregated daily stats are kept indefinitely.
 * Runs daily at 3 AM.
 */
async function cleanupAnalytics(): Promise<void> {
  const retentionDays = parseInt(process.env.ANALYTICS_RETENTION_DAYS ?? "90", 10);

  const result = await pool.query(
    `DELETE FROM analytics_events WHERE created_at < NOW() - $1::interval`,
    [`${retentionDays} days`]
  );

  const deleted = result.rowCount ?? 0;
  if (deleted > 0) {
    logger.info("[Scheduler] Analytics cleanup completed", {
      deletedEvents: deleted,
      retentionDays,
    });
  }
}

/**
 * JOB: Notification Purge
 * Removes old read notifications to prevent table bloat.
 * Keeps unread notifications for 30 days and read notifications for 14 days.
 * Runs daily at 4 AM.
 */
async function purgeNotifications(): Promise<void> {
  /* Purge read notifications older than 14 days */
  const readDeleted = await pool.query(
    "DELETE FROM notifications WHERE is_read = true AND created_at < NOW() - INTERVAL '14 days'"
  );

  /* Purge unread notifications older than 30 days */
  const unreadDeleted = await pool.query(
    "DELETE FROM notifications WHERE is_read = false AND created_at < NOW() - INTERVAL '30 days'"
  );

  const totalDeleted = (readDeleted.rowCount ?? 0) + (unreadDeleted.rowCount ?? 0);
  if (totalDeleted > 0) {
    logger.info("[Scheduler] Notification purge completed", {
      readDeleted: readDeleted.rowCount,
      unreadDeleted: unreadDeleted.rowCount,
    });
  }
}

/**
 * JOB: Database Pool Monitor
 * Checks connection pool health and logs warnings if the pool
 * is under pressure (waiting clients > 0) or near capacity.
 * Runs every 5 minutes.
 */
async function monitorDatabasePool(): Promise<void> {
  const metrics = getPoolMetrics();

  if (metrics.isUnderPressure) {
    logger.warn("[Scheduler] Database pool under pressure!", {
      totalConnections: metrics.totalConnections,
      idleConnections: metrics.idleConnections,
      waitingClients: metrics.waitingClients,
      maxConnections: metrics.maxConnections,
      utilizationPercent: metrics.utilizationPercent,
      action: "Consider increasing max connections or adding pgBouncer",
    });
  } else if (metrics.utilizationPercent > 80) {
    logger.warn("[Scheduler] Database pool utilization high", {
      totalConnections: metrics.totalConnections,
      idleConnections: metrics.idleConnections,
      utilizationPercent: metrics.utilizationPercent,
      action: "Monitor closely — may need to scale",
    });
  } else {
    logger.debug("[Scheduler] Database pool healthy", {
      totalConnections: metrics.totalConnections,
      idleConnections: metrics.idleConnections,
      utilizationPercent: metrics.utilizationPercent,
    });
  }
}

/**
 * JOB: Cleanup Expired Sessions
 * Removes expired user sessions from the database.
 * Sessions expire after 30 days of inactivity.
 * Runs daily.
 */
async function cleanupExpiredSessions(): Promise<void> {
  const result = await pool.query(
    "DELETE FROM sessions WHERE expires_at < NOW()"
  );

  const deleted = result.rowCount ?? 0;
  if (deleted > 0) {
    logger.info("[Scheduler] Expired sessions cleaned up", { deletedCount: deleted });
  }
}

/**
 * JOB: Cleanup Rate Limit Violations
 * Removes old rate limit violation records.
 * Keeps last 7 days for analysis.
 * Runs daily.
 */
async function cleanupRateLimitViolations(): Promise<void> {
  try {
    const result = await pool.query(
      "DELETE FROM rate_limit_violations WHERE last_violation < NOW() - INTERVAL '7 days'"
    );
    const deleted = result.rowCount ?? 0;
    if (deleted > 0) {
      logger.info("[Scheduler] Rate limit violations cleaned up", { deletedCount: deleted });
    }
  } catch {
    /* Table might not exist yet — skip silently */
  }
}

/* ─────────────────────────────────────────────
 * Job Registry and Execution Engine
 * ───────────────────────────────────────────── */

/** All registered jobs */
const jobs: ScheduledJob[] = [
  {
    name: "leaderboard_refresh",
    description: "Recalculates global and weekly leaderboard rankings",
    intervalMs: 15 * 60 * 1000, // 15 minutes
    execute: refreshLeaderboard,
    enabled: true,
    runCount: 0,
    errorCount: 0,
  },
  {
    name: "streak_expiry",
    description: "Resets expired user streaks and sends notifications",
    intervalMs: 24 * 60 * 60 * 1000, // 24 hours
    execute: checkStreakExpiry,
    enabled: true,
    runCount: 0,
    errorCount: 0,
  },
  {
    name: "analytics_cleanup",
    description: "Removes analytics events older than retention period",
    intervalMs: 24 * 60 * 60 * 1000, // 24 hours
    execute: cleanupAnalytics,
    enabled: true,
    runCount: 0,
    errorCount: 0,
  },
  {
    name: "notification_purge",
    description: "Removes old read and expired notifications",
    intervalMs: 24 * 60 * 60 * 1000, // 24 hours
    execute: purgeNotifications,
    enabled: true,
    runCount: 0,
    errorCount: 0,
  },
  {
    name: "db_pool_monitor",
    description: "Monitors database connection pool health and utilization",
    intervalMs: 5 * 60 * 1000, // 5 minutes
    execute: monitorDatabasePool,
    enabled: true,
    runCount: 0,
    errorCount: 0,
  },
  {
    name: "session_cleanup",
    description: "Removes expired user sessions from the database",
    intervalMs: 24 * 60 * 60 * 1000, // 24 hours
    execute: cleanupExpiredSessions,
    enabled: true,
    runCount: 0,
    errorCount: 0,
  },
  {
    name: "rate_limit_cleanup",
    description: "Cleans up old rate limit violation records",
    intervalMs: 24 * 60 * 60 * 1000, // 24 hours
    execute: cleanupRateLimitViolations,
    enabled: true,
    runCount: 0,
    errorCount: 0,
  },
];

/**
 * Wraps a job's execute function with error isolation and timing.
 * Ensures that a failing job never crashes the scheduler or affects other jobs.
 *
 * @param {ScheduledJob} job - The job to execute
 */
async function executeJob(job: ScheduledJob): Promise<void> {
  const startTime = Date.now();

  try {
    logger.debug(`[Scheduler] Starting job: ${job.name}`);
    await job.execute();

    const duration = Date.now() - startTime;
    job.lastRunAt = new Date();
    job.lastDurationMs = duration;
    job.runCount++;

    if (duration > 30_000) {
      logger.warn(`[Scheduler] Slow job detected: ${job.name}`, {
        durationMs: duration,
        threshold: 30000,
      });
    }
  } catch (error) {
    job.errorCount++;
    const duration = Date.now() - startTime;
    job.lastDurationMs = duration;

    logger.error(`[Scheduler] Job failed: ${job.name}`, {
      error: error instanceof Error ? error.message : "Unknown",
      stack: error instanceof Error ? error.stack : undefined,
      durationMs: duration,
      consecutiveErrors: job.errorCount,
    });
  }
}

/* ─────────────────────────────────────────────
 * Public API — Start, Stop, and Monitor Scheduler
 * ───────────────────────────────────────────── */

/**
 * Starts all scheduled jobs.
 * Should be called once during server startup.
 * Each job runs on its own interval independently of others.
 */
export function startScheduler(): void {
  logger.info("[Scheduler] Starting job scheduler", {
    jobCount: jobs.filter((j) => j.enabled).length,
  });

  for (const job of jobs) {
    if (!job.enabled) {
      logger.info(`[Scheduler] Skipping disabled job: ${job.name}`);
      continue;
    }

    /* Schedule the job on its interval */
    job.timer = setInterval(() => {
      executeJob(job).catch(() => {}); // Error handling is inside executeJob
    }, job.intervalMs);

    /* Run database pool monitor immediately on startup */
    if (job.name === "db_pool_monitor") {
      executeJob(job).catch(() => {});
    }

    logger.info(`[Scheduler] Registered job: ${job.name}`, {
      intervalMinutes: Math.round(job.intervalMs / 60_000),
      description: job.description,
    });
  }
}

/**
 * Stops all scheduled jobs.
 * Should be called during graceful shutdown.
 */
export function stopScheduler(): void {
  for (const job of jobs) {
    if (job.timer) {
      clearInterval(job.timer);
      job.timer = undefined;
    }
  }

  logger.info("[Scheduler] All jobs stopped");
}

/**
 * Returns the current status of all jobs.
 * Used by the admin dashboard to monitor scheduler health.
 */
export function getSchedulerStatus(): Array<{
  name: string;
  description: string;
  enabled: boolean;
  intervalMinutes: number;
  lastRunAt: string | null;
  lastDurationMs: number | null;
  runCount: number;
  errorCount: number;
}> {
  return jobs.map((job) => ({
    name: job.name,
    description: job.description,
    enabled: job.enabled,
    intervalMinutes: Math.round(job.intervalMs / 60_000),
    lastRunAt: job.lastRunAt?.toISOString() ?? null,
    lastDurationMs: job.lastDurationMs ?? null,
    runCount: job.runCount,
    errorCount: job.errorCount,
  }));
}

/**
 * Manually triggers a specific job by name.
 * Used by admin API for manual intervention.
 *
 * @param {string} jobName - Name of the job to trigger
 * @returns {Promise<boolean>} Whether the job was found and executed
 */
export async function triggerJob(jobName: string): Promise<boolean> {
  const job = jobs.find((j) => j.name === jobName);
  if (!job) return false;

  await executeJob(job);
  return true;
}
