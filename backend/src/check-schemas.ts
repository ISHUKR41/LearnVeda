import { pool } from "./config/database";

async function main() {
  try {
    const res = await pool.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE 'eduquest_%' 
         OR table_name IN ('User', 'Subject', 'Chapter', 'Topic', 'Question', 'LevelDefinition')
      ORDER BY table_schema, table_name
    `);
    console.log("\nTable Schema Mapping:");
    console.table(res.rows);
  } catch (err) {
    console.error("Failed to query information_schema:", err);
  } finally {
    await pool.end();
  }
}

main();
