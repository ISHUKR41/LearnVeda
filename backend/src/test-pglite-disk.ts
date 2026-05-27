import { PGlite } from "@electric-sql/pglite";

async function main() {
  try {
    console.log("Initializing PGlite on disk...");
    const db = await PGlite.create("./pglite-db-test");
    console.log("PGlite created successfully. Querying...");
    const result = await db.query("SELECT 1 + 1 AS sum");
    console.log("Result:", result.rows);
    await db.close();
    console.log("PGlite closed successfully!");
  } catch (error) {
    console.error("PGlite failed:", error);
  }
}

main();
