/**
 * FILE: migration-status.ts
 * LOCATION: src/lib/server/database/migration-status.ts
 * PURPOSE: Shared migration inspection helpers for the CLI migration runner
 *          and deployment readiness checks. Keeping this logic in one file
 *          prevents the API and the CLI from disagreeing about database state.
 * USED BY: run-migrations.ts, runtime-health.ts
 * DEPENDENCIES: node:crypto, node:fs/promises, node:path, postgres.ts
 * LAST UPDATED: 2026-05-19
 */

import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { isPostgresConfigured, queryPostgres } from "./postgres";

export interface MigrationFileDefinition {
  name: string;
  checksum: string;
  sql: string;
}

export interface AppliedMigrationRecord {
  name: string;
  checksum: string | null;
}

export interface DatabaseMigrationStatus {
  available: boolean;
  expectedCount: number;
  appliedCount: number;
  pending: string[];
  missingChecksums: string[];
  checksumMismatches: string[];
  unknownApplied: string[];
  requiredTablesMissing: string[];
}

const MIGRATIONS_DIRECTORY = path.join(process.cwd(), "src", "lib", "server", "database", "migrations");

const REQUIRED_PRODUCTION_TABLES = [
  "eduquest_users",
  "eduquest_event_registrations",
  "eduquest_matchmaking_tickets",
  "eduquest_community_posts",

  /*
   * Curriculum and practice content are the real data backbone for the class
   * and subject pages. Missing any of these means students would see empty or
   * local-only fallback learning plans.
   */
  "eduquest_subjects",
  "eduquest_chapters",
  "eduquest_questions",
  "eduquest_user_progress",
  "eduquest_user_stats",
  "eduquest_notifications",

  /*
   * Event operations, auditability, and durable jobs are required before the
   * platform can safely run institution-hosted competitions.
   */
  "eduquest_events",
  "eduquest_host_applications",
  "eduquest_audit_logs",
  "eduquest_background_jobs",

  /*
   * Gamification and battle history tables make the dashboard and leaderboard
   * production-grade instead of relying on computed placeholders.
   */
  "eduquest_achievements",
  "eduquest_user_achievements",
  "eduquest_battle_history",
  "eduquest_daily_challenges",
  "eduquest_challenge_completions",

  "eduquest_schema_migrations",
];

/** Creates a stable SHA-256 checksum for a migration file's exact SQL text. */
export function createMigrationChecksum(sql: string): string {
  return createHash("sha256").update(sql, "utf8").digest("hex");
}

/** Returns every migration file with its SQL and checksum in deterministic order. */
export async function listMigrationDefinitions(): Promise<MigrationFileDefinition[]> {
  const entries = await readdir(MIGRATIONS_DIRECTORY);
  const migrationNames = entries
    .filter((entry) => /^\d+_.+\.sql$/.test(entry))
    .sort((left, right) => left.localeCompare(right));

  return Promise.all(
    migrationNames.map(async (name) => {
      const sql = await readFile(path.join(MIGRATIONS_DIRECTORY, name), "utf8");

      return {
        name,
        sql,
        checksum: createMigrationChecksum(sql),
      };
    }),
  );
}

/** Reads applied migrations, including checksum when older databases have that column. */
async function listAppliedMigrationRecords(): Promise<AppliedMigrationRecord[]> {
  const result = await queryPostgres<AppliedMigrationRecord>(`
    SELECT
      name,
      to_jsonb(eduquest_schema_migrations)->>'checksum' AS checksum
    FROM eduquest_schema_migrations
  `);

  return result.rows;
}

/** Checks which production-critical tables are missing from the active database. */
async function listMissingRequiredTables(): Promise<string[]> {
  const result = await queryPostgres<{ table_name: string }>(
    `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = ANY($1::text[])
    `,
    [REQUIRED_PRODUCTION_TABLES],
  );
  const present = new Set(result.rows.map((row) => row.table_name));

  return REQUIRED_PRODUCTION_TABLES.filter((tableName) => !present.has(tableName));
}

/** Builds a release-gate status object without exposing connection secrets. */
export async function getDatabaseMigrationStatus(): Promise<DatabaseMigrationStatus> {
  const migrationDefinitions = await listMigrationDefinitions();

  if (!isPostgresConfigured()) {
    return {
      available: false,
      expectedCount: migrationDefinitions.length,
      appliedCount: 0,
      pending: migrationDefinitions.map((definition) => definition.name),
      missingChecksums: [],
      checksumMismatches: [],
      unknownApplied: [],
      requiredTablesMissing: REQUIRED_PRODUCTION_TABLES,
    };
  }

  try {
    const [appliedRecords, requiredTablesMissing] = await Promise.all([
      listAppliedMigrationRecords(),
      listMissingRequiredTables(),
    ]);
    const expectedByName = new Map(migrationDefinitions.map((definition) => [definition.name, definition]));
    const appliedByName = new Map(appliedRecords.map((record) => [record.name, record]));
    const pending = migrationDefinitions
      .filter((definition) => !appliedByName.has(definition.name))
      .map((definition) => definition.name);
    const missingChecksums = appliedRecords
      .filter((record) => expectedByName.has(record.name) && !record.checksum)
      .map((record) => record.name);
    const checksumMismatches = appliedRecords
      .filter((record) => {
        const expected = expectedByName.get(record.name);
        return Boolean(expected && record.checksum && expected.checksum !== record.checksum);
      })
      .map((record) => record.name);
    const unknownApplied = appliedRecords
      .filter((record) => !expectedByName.has(record.name))
      .map((record) => record.name);

    return {
      available: true,
      expectedCount: migrationDefinitions.length,
      appliedCount: appliedRecords.length,
      pending,
      missingChecksums,
      checksumMismatches,
      unknownApplied,
      requiredTablesMissing,
    };
  } catch {
    return {
      available: false,
      expectedCount: migrationDefinitions.length,
      appliedCount: 0,
      pending: migrationDefinitions.map((definition) => definition.name),
      missingChecksums: [],
      checksumMismatches: [],
      unknownApplied: [],
      requiredTablesMissing: REQUIRED_PRODUCTION_TABLES,
    };
  }
}
