import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load env from the frontend .env
dotenv.config({ path: path.resolve('c:/Users/MR.ROBOT/OneDrive - Park University/Desktop/New folder (3)/education/education/frontend/.env') });

async function run() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log("Connected to Neon successfully!");
    
    const res = await client.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
      ORDER BY table_name;
    `);
    
    console.log("Tables in database:");
    res.rows.forEach(row => {
      console.log(`- ${row.table_schema}.${row.table_name}`);
    });
    
    await client.end();
  } catch (err) {
    console.error("Connection or query failed:", err);
  }
}

run();
