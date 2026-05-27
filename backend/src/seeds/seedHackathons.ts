/**
 * FILE: seedHackathons.ts
 * LOCATION: backend/src/seeds/seedHackathons.ts
 * PURPOSE: Seeds specific hackathons with predefined IDs ('inter-college-hackathon',
 *          'dsa-speedrun-hackathon', 'national-web-domination') to perfectly match
 *          the frontend catalog and support complete dynamic registration/submission flows.
 *          Connects directly to the PGlite disk storage for 100% reliable offline seeding.
 *
 * HOW TO RUN:
 *  1. Stop the running db-server (to release the file lock)
 *  2. Run: npx ts-node --transpile-only src/seeds/seedHackathons.ts
 *  3. Restart the db-server
 */

import { PGlite } from "@electric-sql/pglite";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🚀 Starting predefined Hackathons seeding directly via PGlite disk...");
  
  // Create connection to the local database file path directly on disk
  const pg = await PGlite.create("./.data/pglite-db");

  try {
    // Get an organizer/admin user
    const adminRes = await pg.query(
      `SELECT id FROM "backend"."User" WHERE email = 'admin@eduquest.com' LIMIT 1`
    );

    if (adminRes.rows.length === 0) {
      throw new Error("Admin user not found. Please run main seeds first.");
    }

    const adminId = (adminRes.rows[0] as any).id;
    console.log(`📍 Found organizer/admin user ID: ${adminId}`);

    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const pastDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);

    const hackathons = [
      {
        id: "inter-college-hackathon",
        title: "Inter-College Hackathon — Build in 24 Hours",
        description: "Connect with students across India, form a team of up to 4, and build an AI-powered full-stack learning platform. Top projects will be reviewed by top tech leads in India.",
        eventType: "HACKATHON",
        venue: "Online / Delhi NCR",
        maxParticipants: 500,
        startTime: now,
        endTime: oneWeekFromNow,
        registrationDeadline: oneWeekFromNow,
        isProctored: false,
        requiresSafeBrowser: false,
        status: "PUBLISHED",
        bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
        collegeName: "EduQuest Academy"
      },
      {
        id: "dsa-speedrun-hackathon",
        title: "DSA & Speedrun Challenge — Summer 2026",
        description: "Solve 10 complex algorithmic and data structure problems in standard time limits. Code performance, memory footprint, and speed are evaluated in real-time.",
        eventType: "HACKATHON",
        venue: "Online",
        maxParticipants: 1000,
        startTime: oneWeekFromNow,
        endTime: twoWeeksFromNow,
        registrationDeadline: twoWeeksFromNow,
        isProctored: true,
        requiresSafeBrowser: true,
        status: "PUBLISHED",
        bannerUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
        collegeName: "EduQuest Academy"
      },
      {
        id: "national-web-domination",
        title: "National Web Domination Championship",
        description: "Design and implement highly responsive, accessible, and fast web portals using premium typography, layouts, and performance optimization rules.",
        eventType: "HACKATHON",
        venue: "Online",
        maxParticipants: 1500,
        startTime: pastDate,
        endTime: pastDate,
        registrationDeadline: pastDate,
        isProctored: false,
        requiresSafeBrowser: false,
        status: "COMPLETED",
        bannerUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80",
        collegeName: "EduQuest Academy"
      }
    ];

    await pg.query("BEGIN");

    for (const h of hackathons) {
      await pg.query(
        `INSERT INTO "backend"."Event" (
          id, title, description, "organizerId", "eventType", venue,
          "maxParticipants", "startTime", "endTime", "registrationDeadline",
          "isProctored", "requiresSafeBrowser", status, "bannerUrl", "collegeName",
          "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          "organizerId" = EXCLUDED."organizerId",
          "eventType" = EXCLUDED."eventType",
          venue = EXCLUDED.venue,
          "maxParticipants" = EXCLUDED."maxParticipants",
          "startTime" = EXCLUDED."startTime",
          "endTime" = EXCLUDED."endTime",
          "registrationDeadline" = EXCLUDED."registrationDeadline",
          "isProctored" = EXCLUDED."isProctored",
          "requiresSafeBrowser" = EXCLUDED."requiresSafeBrowser",
          status = EXCLUDED.status,
          "bannerUrl" = EXCLUDED."bannerUrl",
          "collegeName" = EXCLUDED."collegeName",
          "updatedAt" = NOW()`,
        [
          h.id, h.title, h.description, adminId, h.eventType, h.venue,
          h.maxParticipants, h.startTime, h.endTime, h.registrationDeadline,
          h.isProctored, h.requiresSafeBrowser, h.status, h.bannerUrl, h.collegeName
        ]
      );
      console.log(`   ✅ Seeded/Upserted event: ${h.title} (ID: ${h.id})`);
    }

    await pg.query("COMMIT");
    console.log("🎉 Predefined Hackathons seeded successfully directly to disk!");
  } catch (err) {
    await pg.query("ROLLBACK");
    console.error("❌ Failed to seed predefined Hackathons directly to disk:", err);
    throw err;
  } finally {
    await pg.close();
  }
}

main().catch((err) => {
  console.error("Fatal predefined Hackathons seed error:", err);
  process.exit(1);
});
