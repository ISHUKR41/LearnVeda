const { Client } = require('pg');

async function run() {
  console.log("1. Initializing pg Client...");
  const client = new Client({
    connectionString: "postgresql://postgres:password@127.0.0.1:5432/eduquest?sslmode=disable"
  });
  
  try {
    console.log("2. Connecting to PostgreSQL...");
    await client.connect();
    console.log("3. Connected successfully! Running Schema cleanup...");
    
    // Create schemas if not exists
    await client.query("CREATE SCHEMA IF NOT EXISTS public");
    await client.query("CREATE SCHEMA IF NOT EXISTS backend");
    console.log("4. Schemas verified.");

    // Drop all tables in backend schema starting with eduquest_
    console.log("5. Querying backend tables...");
    const backendTablesRes = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'backend' AND (table_name LIKE 'eduquest_%' OR table_name IN ('seo_cache', 'analytics_events', 'rate_limit_violations', 'api_request_logs', 'audit_logs'))
    `);
    console.log(`6. Found ${backendTablesRes.rows.length} tables in backend schema. Dropping...`);
    for (const row of backendTablesRes.rows) {
      await client.query(`DROP TABLE IF EXISTS backend."${row.table_name}" CASCADE`);
    }

    // Drop all tables in public schema starting with eduquest_
    console.log("7. Querying public tables...");
    const publicTablesRes = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND (table_name LIKE 'eduquest_%' OR table_name IN ('seo_cache', 'analytics_events', 'rate_limit_violations', 'api_request_logs', 'audit_logs'))
    `);
    console.log(`8. Found ${publicTablesRes.rows.length} tables in public schema. Dropping...`);
    for (const row of publicTablesRes.rows) {
      await client.query(`DROP TABLE IF EXISTS public."${row.table_name}" CASCADE`);
    }

    // Drop schema migrations table
    console.log("9. Dropping schema migrations tables...");
    await client.query("DROP TABLE IF EXISTS public.eduquest_schema_migrations CASCADE");
    await client.query("DROP TABLE IF EXISTS backend.eduquest_schema_migrations CASCADE");

    console.log("10. Cleanup complete!");
  } catch (err) {
    console.error("❌ Reset script error:", err);
  } finally {
    console.log("11. Closing database connection...");
    await client.end();
    console.log("12. Connection closed.");
  }
}

run().then(() => {
  console.log("13. Script execution finished.");
});
