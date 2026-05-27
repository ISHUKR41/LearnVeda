import { Client } from 'pg';

async function run() {
  process.env.PGSSLMODE = "disable";
  const client = new Client({
    connectionString: "postgresql://postgres:password@127.0.0.1:5432/eduquest",
    ssl: false
  });
  try {
    await client.connect();
    console.log("Connected successfully!");
    const res = await client.query("SELECT 1 AS ok");
    console.log("Query result:", res.rows);
    await client.end();
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

run();
