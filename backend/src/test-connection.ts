import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("Connecting with DATABASE_URL:", process.env.DATABASE_URL);
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();
    console.log("Client connected successfully!");
    const res = await client.query("SELECT 1 + 1 AS sum");
    console.log("Query result:", res.rows);
    client.release();
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await pool.end();
  }
}

main();
