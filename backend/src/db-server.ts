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

import net from "net";
import fs from "fs";
import path from "path";

process.on('uncaughtException', (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error("UNHANDLED REJECTION:", reason);
  process.exit(1);
});

async function main() {
  try {
    const dbPath = "./pglite-db";
    const parentDir = path.dirname(dbPath);
    if (!fs.existsSync(parentDir)) {
      console.log(`Creating parent directories at '${parentDir}'...`);
      fs.mkdirSync(parentDir, { recursive: true });
    }

    // Clean up stale lock file if it exists to prevent boot lock-out
    const pidPath = path.join(dbPath, "postmaster.pid");
    if (fs.existsSync(pidPath)) {
      console.log(`Cleaning up stale postmaster.pid lock file at '${pidPath}'...`);
      try {
        fs.unlinkSync(pidPath);
      } catch (err: any) {
        console.warn(`Failed to clean up postmaster.pid: ${err.message}`);
      }
    }

    console.log(`Initializing persistent PGlite database at '${dbPath}'...`);
    
    // Create connection to the local database file path
    const pg = await PGlite.create(dbPath);
    
    // Wrap PGlite in the TCP socket server wrapper on an internal port
    const INTERNAL_PORT = 5433;
    const server = new PGLiteSocketServer({
      db: pg,
      port: INTERNAL_PORT,
      host: "127.0.0.1",
      maxConnections: 100
    });
    
    await server.start();
    
    // Create a proxy server to handle SSL requests gracefully (which pglite-socket drops)
    const proxy = net.createServer((clientSocket) => {
      let sslNegotiated = false;
      const buffer: Buffer[] = [];
      let isConnected = false;
      let internalSocket: net.Socket | null = null;

      // Register client data handler synchronously so we never miss any data!
      clientSocket.on('data', (data) => {
        const chunk = Buffer.isBuffer(data) ? data : Buffer.from(data);
        if (!sslNegotiated && chunk.length >= 8 && chunk.readInt32BE(0) === 8 && chunk.readInt32BE(4) === 80877103) {
          // Send 'N' to decline SSL
          clientSocket.write(Buffer.from('N'));
          sslNegotiated = true;
          if (chunk.length > 8) {
            const extra = chunk.subarray(8);
            if (isConnected && internalSocket) {
              internalSocket.write(extra);
            } else {
              buffer.push(extra);
            }
          }
        } else {
          if (isConnected && internalSocket) {
            internalSocket.write(chunk);
          } else {
            buffer.push(chunk);
          }
        }
      });

      // Connect to internal PGlite server
      internalSocket = net.connect(INTERNAL_PORT, '127.0.0.1', () => {
        isConnected = true;
        // Flush buffer
        for (const chunk of buffer) {
          internalSocket!.write(chunk);
        }
        buffer.length = 0;
      });

      internalSocket.on('data', (data) => {
        clientSocket.write(data);
      });

      internalSocket.on('error', (err) => {
        console.error("Internal socket error:", err.message);
      });

      clientSocket.on('error', (err) => {
        if (err.message.includes('ECONNRESET')) return;
        console.error("Client socket error:", err.message);
      });

      clientSocket.on('close', () => {
        if (internalSocket) internalSocket.end();
      });

      internalSocket.on('close', () => {
        clientSocket.end();
      });
    });

    proxy.listen(5432, '127.0.0.1', () => {
      console.log("\n========================================================");
      console.log("🚀  PGlite PostgreSQL Proxy is now online!");
      console.log("📍  Address: 127.0.0.1:5432 (Proxies to 5433)");
      console.log("📂  Storage: backend/.data/pglite-db (Fully Persisted)");
      console.log("========================================================\n");
    });

    // Handle system signals for graceful shutdown
    const handleShutdown = async () => {
      console.log("\n[DB Server] Shutting down PGlite server gracefully...");
      proxy.close();
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
