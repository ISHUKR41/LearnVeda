import { PGlite } from "@electric-sql/pglite";
import path from "path";
import fs from "fs";

async function main() {
  try {
    const dbPath = "./pglite-db";
    console.log(`Testing direct PGlite load on '${dbPath}'...`);
    const pidPath = path.join(dbPath, "postmaster.pid");
    if (fs.existsSync(pidPath)) {
      console.log("Stale postmaster.pid exists, deleting...");
      fs.unlinkSync(pidPath);
    }
    const db = await PGlite.create(dbPath);
    console.log("Direct PGlite loaded successfully! Running test query...");
    const res = await db.query("SELECT 1 + 1 AS sum");
    console.log("Result:", res.rows);
    await db.close();
    console.log("Closed successfully!");
  } catch (err) {
    console.error("Direct PGlite load failed:", err);
  }
}

main();
