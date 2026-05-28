import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load env from the frontend .env
dotenv.config({ path: path.resolve('c:/Users/MR.ROBOT/OneDrive - Park University/Desktop/New folder (3)/education/education/frontend/.env') });

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log("Connected to Neon successfully!");
    
    // Set search_path explicitly to public
    // await client.query("SET search_path TO public");
    
    const res = await client.query(`
      SELECT id, name, email, track, role, level, xp, streak, created_at
      FROM eduquest_users
      LIMIT 5;
    `);
    
    console.log("Users in eduquest_users table:");
    console.log(JSON.stringify(res.rows, null, 2));
    
    await client.end();
  } catch (err) {
    console.error("Connection or query failed:", err);
  }
}

run();
