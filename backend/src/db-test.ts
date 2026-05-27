import { Pool } from 'pg';

async function run() {
  const pool = new Pool({
    connectionString: "postgresql://postgres:password@127.0.0.1:5432/eduquest?schema=backend",
    ssl: false,
  });
  try {
    const client = await pool.connect();
    console.log("Pool connected successfully!");
    const res = await client.query("SELECT 1 AS ok");
    console.log("Query result:", res.rows);
    client.release();
    await pool.end();
  } catch (err) {
    console.error("Pool connection failed:", err);
  }
}

run();
