// test-server.ts
import { PGlite } from "@electric-sql/pglite";
// @ts-ignore
import { PGliteServer } from "@electric-sql/pglite/server";

async function main() {
  try {
    console.log("Starting PGlite server test...");
    const pg = new PGlite("./.data/pglite-test-db");
    const server = new PGliteServer(pg);
    console.log("Server created successfully!");
    
    // Start listening on port 5432
    server.listen(5432, () => {
      console.log("PGlite server is listening on port 5432!");
      server.close();
      console.log("Server closed successfully.");
    });
  } catch (error) {
    console.error("PGliteServer failed:", error);
  }
}

main();
