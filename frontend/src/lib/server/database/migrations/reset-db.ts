import "dotenv/config";
import { getPostgresPool, closePostgresPool } from "../postgres";

async function run() {
  console.log("1. Initializing DB connection using shared helper...");
  const pool = getPostgresPool();
  
  try {
    console.log("2. Running schema check and drops...");
    
    // Create schemas if they do not exist
    await pool.query("CREATE SCHEMA IF NOT EXISTS public");
    await pool.query("CREATE SCHEMA IF NOT EXISTS backend");
    console.log("3. Schemas verified.");

    // Drop all tables in backend schema starting with eduquest_
    console.log("4. Querying backend tables...");
    const backendTablesRes = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'backend' AND (table_name LIKE 'eduquest_%' OR table_name IN ('seo_cache', 'analytics_events', 'rate_limit_violations', 'api_request_logs', 'audit_logs'))
    `);
    console.log(`5. Found ${backendTablesRes.rows.length} tables in backend schema. Dropping...`);
    for (const row of backendTablesRes.rows) {
      await pool.query(`DROP TABLE IF EXISTS backend."${row.table_name}" CASCADE`);
    }

    // Drop all tables in public schema starting with eduquest_
    console.log("6. Querying public tables...");
    const publicTablesRes = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND (table_name LIKE 'eduquest_%' OR table_name IN ('seo_cache', 'analytics_events', 'rate_limit_violations', 'api_request_logs', 'audit_logs'))
    `);
    console.log(`7. Found ${publicTablesRes.rows.length} tables in public schema. Dropping...`);
    for (const row of publicTablesRes.rows) {
      await pool.query(`DROP TABLE IF EXISTS public."${row.table_name}" CASCADE`);
    }

    // Drop schema migrations tables
    console.log("8. Dropping schema migrations tables...");
    await pool.query("DROP TABLE IF EXISTS public.eduquest_schema_migrations CASCADE");
    await pool.query("DROP TABLE IF EXISTS backend.eduquest_schema_migrations CASCADE");

    console.log("9. Database cleanup completed successfully!");
  } catch (err) {
    console.error("❌ Reset script error:", err);
  } finally {
    console.log("10. Closing pool...");
    await closePostgresPool();
    console.log("11. Pool closed.");
  }
}

run().then(() => {
  console.log("12. Done.");
});
