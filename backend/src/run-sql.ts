/**
 * FILE: run-sql.ts
 * PURPOSE: Quick script to run SQL migration files directly against the database.
 * USAGE: npx ts-node --transpile-only src/run-sql.ts <migration-file-path>
 */
import { pool } from "./config/database";
import fs from "fs";
import path from "path";

async function runSql() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: npx ts-node --transpile-only src/run-sql.ts <sql-file-path>");
    process.exit(1);
  }

  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(fullPath, "utf-8");
  console.log(`[Migration] Running: ${path.basename(fullPath)}`);
  console.log(`[Migration] SQL length: ${sql.length} chars`);

  try {
    await pool.query(sql);
    console.log(`[Migration] ✅ Success: ${path.basename(fullPath)}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Migration] ❌ Failed: ${msg}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSql();
