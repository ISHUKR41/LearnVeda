/**
 * FILE: run-migrations.ts
 * LOCATION: src/lib/server/database/migrations/run-migrations.ts
 * PURPOSE: Small PostgreSQL migration runner for production setup. It creates a
 *          migration history table, runs each SQL file exactly once, records a
 *          checksum, and blocks deploys if an already-applied file changes.
 * USED BY: npm run db:migrate
 * DEPENDENCIES: migration-status.ts, postgres.ts
 * LAST UPDATED: 2026-05-19
 */

import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

const envLocalPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}
dotenv.config();
import { listMigrationDefinitions, type MigrationFileDefinition } from "../migration-status";
import { closePostgresPool, getPostgresPool, withPostgresTransaction } from "../postgres";

interface AppliedMigrationRow {
  name: string;
  checksum: string | null;
}

/** Ensures the migration history table exists before any migration is checked. */
async function ensureMigrationTable(): Promise<void> {
  await getPostgresPool().query(`
    CREATE TABLE IF NOT EXISTS eduquest_schema_migrations (
      name TEXT PRIMARY KEY,
      checksum TEXT,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await getPostgresPool().query(`
    ALTER TABLE eduquest_schema_migrations
    ADD COLUMN IF NOT EXISTS checksum TEXT
  `);
}

/** Reads the migration names that have already been applied to this database. */
async function listAppliedMigrations(): Promise<Map<string, AppliedMigrationRow>> {
  const result = await getPostgresPool().query<AppliedMigrationRow>(
    "SELECT name, checksum FROM eduquest_schema_migrations",
  );

  return new Map(result.rows.map((row) => [row.name, row]));
}

/** Fails fast when an applied SQL file no longer matches its recorded checksum. */
function assertAppliedMigrationsAreImmutable(
  migrationDefinitions: MigrationFileDefinition[],
  appliedMigrations: Map<string, AppliedMigrationRow>,
): void {
  for (const migration of migrationDefinitions) {
    const applied = appliedMigrations.get(migration.name);

    if (!applied || !applied.checksum) {
      continue;
    }

    if (applied.checksum !== migration.checksum) {
      throw new Error(
        `Migration checksum mismatch for ${migration.name}. Create a new migration instead of editing an applied migration.`,
      );
    }
  }
}

/** Adds checksums to legacy applied rows created before checksum tracking. */
async function backfillMissingChecksums(
  migrationDefinitions: MigrationFileDefinition[],
  appliedMigrations: Map<string, AppliedMigrationRow>,
): Promise<void> {
  for (const migration of migrationDefinitions) {
    const applied = appliedMigrations.get(migration.name);

    if (!applied || applied.checksum) {
      continue;
    }

    await getPostgresPool().query(
      "UPDATE eduquest_schema_migrations SET checksum = $1 WHERE name = $2 AND checksum IS NULL",
      [migration.checksum, migration.name],
    );
    appliedMigrations.set(migration.name, { name: migration.name, checksum: migration.checksum });
  }
}

/** Runs one migration and records it in the same transaction. */
async function applyMigration(migration: MigrationFileDefinition): Promise<void> {
  await withPostgresTransaction(async (client) => {
    await client.query(migration.sql);
    await client.query(
      "INSERT INTO eduquest_schema_migrations (name, checksum) VALUES ($1, $2)",
      [migration.name, migration.checksum],
    );
  });
}

/** Main CLI workflow used by the package script. */
async function main(): Promise<void> {
  await ensureMigrationTable();

  const migrationDefinitions = await listMigrationDefinitions();
  const appliedMigrations = await listAppliedMigrations();
  assertAppliedMigrationsAreImmutable(migrationDefinitions, appliedMigrations);
  await backfillMissingChecksums(migrationDefinitions, appliedMigrations);

  const pendingMigrations = migrationDefinitions.filter((migration) => !appliedMigrations.has(migration.name));

  if (pendingMigrations.length === 0) {
    console.log("Learnova database is already up to date.");
    return;
  }

  for (const migration of pendingMigrations) {
    console.log(`Applying migration: ${migration.name}`);
    await applyMigration(migration);
  }

  console.log(`Applied ${pendingMigrations.length} Learnova migration(s).`);
}

main()
  .catch((error) => {
    console.error("Learnova database migration failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePostgresPool();
  });
