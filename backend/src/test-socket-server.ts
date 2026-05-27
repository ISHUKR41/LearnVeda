import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

async function main() {
  try {
    console.log("Initializing PGlite...");
    const pg = await PGlite.create("./pglite-db-socket-test");
    console.log("Creating socket server...");
    const server = new PGLiteSocketServer({
      db: pg,
      port: 5433,
      host: "127.0.0.1"
    });
    console.log("Starting socket server...");
    await server.start();
    console.log("Socket server started successfully!");
    await server.stop();
    await pg.close();
    console.log("Done!");
  } catch (error) {
    console.error("Socket server test failed:", error);
  }
}

main();
