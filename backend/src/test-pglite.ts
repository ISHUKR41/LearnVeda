// test-pglite.ts
import { PGlite } from "@electric-sql/pglite";

async function main() {
  try {
    console.log("Initializing PGlite...");
    const db = new PGlite();
    const result = await db.query("SELECT 1 + 1 AS sum");
    console.log("Result:", result.rows);
    console.log("PGlite is working successfully!");
  } catch (error) {
    console.error("PGlite failed:", error);
  }
}

main();
