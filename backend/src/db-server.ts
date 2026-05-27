/**
 * FILE: db-server.ts
 * LOCATION: backend/src/db-server.ts
 * PURPOSE: Starts a persistent local PostgreSQL database server on port 5432.
 *          Powered by @electric-sql/pglite and @electric-sql/pglite-socket.
 *          Standard PostgreSQL clients (Prisma, pg pool, psql) can connect to this instance.
 *          Saves all database tables and rows to `./.data/pglite-db`.
 * USED BY: Run as a background task via npm/tsx
 * LAST UPDATED: 2026-05-27
 */

import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

async function main() {
  try {
    console.log("Initializing persistent PGlite database at './.data/pglite-db'...");
    
    // Create connection to the local database file path
    const pg = await PGlite.create("./.data/pglite-db");
    
    // Wrap PGlite in the TCP socket server wrapper
    const server = new PGLiteSocketServer({
      db: pg,
      port: 5432,
      host: "127.0.0.1"
    });
    
    // Start the socket server
    await server.start();
    
    console.log("\n========================================================");
    console.log("🚀  PGlite PostgreSQL database server is now online!");
    console.log("📍  Address: 127.0.0.1:5432");
    console.log("📂  Storage: backend/.data/pglite-db (Fully Persisted)");
    console.log("========================================================\n");

    // Handle system signals for graceful shutdown
    const handleShutdown = async () => {
      console.log("\n[DB Server] Shutting down PGlite server gracefully...");
      await server.stop();
      console.log("[DB Server] All database client connections closed cleanly.");
      process.exit(0);
    };

    process.on("SIGINT", handleShutdown);
    process.on("SIGTERM", handleShutdown);
  } catch (error) {
    console.error("🔴 [DB Server] Failed to boot database server:", error);
    process.exit(1);
  }
}

main();
