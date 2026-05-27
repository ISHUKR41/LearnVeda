import { Pool } from "pg";

async function main() {
  const pool = new Pool({
    connectionString: "postgresql://postgres:password@localhost:5432/eduquest"
  });

  try {
    const client = await pool.connect();
    console.log("Connected to local PGlite database successfully!");

    // Set search path
    await client.query("SET search_path TO backend, public");

    // Check frontend tables
    console.log("\n--- Checking Frontend Tables (public schema) ---");
    const tables = ["eduquest_users", "eduquest_subjects", "eduquest_chapters", "eduquest_questions", "eduquest_events"];
    for (const table of tables) {
      try {
        const countRes = await client.query(`SELECT COUNT(*)::INTEGER AS count FROM ${table}`);
        console.log(`Table ${table}: ${countRes.rows[0].count} rows`);
      } catch (err) {
        console.log(`Table ${table}: Error - ${(err as Error).message}`);
      }
    }

    // Check backend tables
    console.log("\n--- Checking Backend Tables (backend schema) ---");
    const backendTables = ["User", "Subject", "Chapter", "Topic", "Question", "LevelDefinition"];
    for (const table of backendTables) {
      try {
        const countRes = await client.query(`SELECT COUNT(*)::INTEGER AS count FROM "${table}"`);
        console.log(`Table "${table}": ${countRes.rows[0].count} rows`);
      } catch (err) {
        console.log(`Table "${table}": Error - ${(err as Error).message}`);
      }
    }

    client.release();
  } catch (error) {
    console.error("Database connection check failed:", error);
  } finally {
    await pool.end();
  }
}

main();
