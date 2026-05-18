/**
 * FILE: run-migrations.ts
 * LOCATION: src/lib/server/database/migrations/run-migrations.ts
 * PURPOSE: Small PostgreSQL migration runner for production setup. It creates a
 *          migration history table, runs each SQL file exactly once, and records
 *          the result so future deploys are repeatable.
 * USED BY: npm run db:migrate
 * DEPENDENCIES: node:fs/promises, node:path, postgres.ts
 * LAST UPDATED: 2026-05-12
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { closePostgresPool, getPostgresPool, withPostgresTransaction } from "../postgres";

interface AppliedMigrationRow {
  name: string;
}

const MIGRATIONS_DIRECTORY = __dirname;

/** Returns every migration file in stable numeric order. */
async function listMigrationFiles(): Promise<string[]> {
  const entries = await readdir(MIGRATIONS_DIRECTORY);

  return entries
    .filter((entry) => /^\d+_.+\.sql$/.test(entry))
    .sort((left, right) => left.localeCompare(right));
}

/** Ensures the migration history table exists before any migration is checked. */
async function ensureMigrationTable(): Promise<void> {
  await getPostgresPool().query(`
    CREATE TABLE IF NOT EXISTS eduquest_schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

/** Reads the migration names that have already been applied to this database. */
async function listAppliedMigrations(): Promise<Set<string>> {
  const result = await getPostgresPool().query<AppliedMigrationRow>(
    "SELECT name FROM eduquest_schema_migrations",
  );

  return new Set(result.rows.map((row) => row.name));
}

/** Runs one migration and records it in the same transaction. */
async function applyMigration(fileName: string): Promise<void> {
  const migrationPath = path.join(MIGRATIONS_DIRECTORY, fileName);
  const sql = await readFile(migrationPath, "utf8");

  await withPostgresTransaction(async (client) => {
    await client.query(sql);
    await client.query(
      "INSERT INTO eduquest_schema_migrations (name) VALUES ($1)",
      [fileName],
    );
  });
}

/** Main CLI workflow used by the package script. */
async function main(): Promise<void> {
  await ensureMigrationTable();

  const migrationFiles = await listMigrationFiles();
  const appliedMigrations = await listAppliedMigrations();
  const pendingMigrations = migrationFiles.filter((fileName) => !appliedMigrations.has(fileName));

  if (pendingMigrations.length === 0) {
    console.log("EduQuest database is already up to date.");
    return;
  }

  for (const fileName of pendingMigrations) {
    console.log(`Applying migration: ${fileName}`);
    await applyMigration(fileName);
  }

  console.log(`Applied ${pendingMigrations.length} EduQuest migration(s).`);
}

main()
  .catch((error) => {
    console.error("EduQuest database migration failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePostgresPool();
  });
