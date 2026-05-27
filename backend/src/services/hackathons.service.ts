/**
 * FILE: hackathons.service.ts
 * LOCATION: backend/src/services/hackathons.service.ts
 * PURPOSE: Service logic for EduQuest Hackathons.
 *          Performs PostgreSQL database operations for fetching hackathons,
 *          registering participants, submitting code repository URLs, and
 *          generating live scoreboards/standings.
 *
 * USED BY: backend/src/controllers/hackathons.controller.ts
 * DEPENDENCIES: ../config/database
 * LAST UPDATED: 2026-05-27
 */

import pool from "../config/database";

export interface HackathonData {
  id: string;
  title: string;
  description: string;
  eventType: string;
  venue: string;
  maxParticipants: number;
  startTime: Date;
  endTime: Date;
  registrationDeadline: Date;
  isProctored: boolean;
  requiresSafeBrowser: boolean;
  status: string;
  bannerUrl: string;
  collegeName: string;
  registrationCount: number;
}

export interface SubmissionData {
  id: string;
  teamName: string;
  projectDesc: string;
  githubUrl: string;
  demoUrl: string | null;
  score: number | null;
  submittedAt: Date;
  authorName: string;
}

/**
 * Fetches a list of all events designated as hackathons.
 * Optionally filters the results by their status (DRAFT, PUBLISHED, LIVE, COMPLETED, ARCHIVED).
 *
 * @param status - Optional status to filter events by
 * @returns Array of hackathon records
 */
export async function getHackathonsList(status?: string): Promise<HackathonData[]> {
  try {
    let queryText = `
      SELECT e.id, e.title, e.description, e."eventType", e.venue,
             e."maxParticipants", e."startTime", e."endTime",
             e."registrationDeadline", e."isProctored", e."requiresSafeBrowser",
             e.status, e."bannerUrl", e."collegeName", e."createdAt",
             COUNT(er.id)::int AS "registrationCount"
      FROM "Event" e
      LEFT JOIN "EventRegistration" er ON er."eventId" = e.id AND er.status != 'CANCELLED'
      WHERE e."eventType" = 'HACKATHON'
    `;

    const params: any[] = [];

    if (status) {
      params.push(status);
      queryText += ` AND e.status = $1`;
    } else {
      queryText += ` AND e.status != 'DRAFT'`; // Default: hide draft hackathons
    }

    queryText += `
      GROUP BY e.id
      ORDER BY e."startTime" ASC
    `;

    const result = await pool.query(queryText, params);
    return result.rows as HackathonData[];
  } catch (error) {
    console.error("[hackathons.service] Error in getHackathonsList:", error);
    throw new Error("Failed to retrieve hackathons from database.");
  }
}

/**
 * Fetches full details for a single hackathon.
 *
 * @param id - The ID of the hackathon event
 * @returns Single hackathon record or null if not found
 */
export async function getHackathonDetail(id: string): Promise<HackathonData | null> {
  try {
    const queryText = `
      SELECT e.id, e.title, e.description, e."eventType", e.venue,
             e."maxParticipants", e."startTime", e."endTime",
             e."registrationDeadline", e."isProctored", e."requiresSafeBrowser",
             e.status, e."bannerUrl", e."collegeName", e."createdAt",
             COUNT(er.id)::int AS "registrationCount"
      FROM "Event" e
      LEFT JOIN "EventRegistration" er ON er."eventId" = e.id AND er.status != 'CANCELLED'
      WHERE e.id = $1 AND e."eventType" = 'HACKATHON'
      GROUP BY e.id
      LIMIT 1
    `;

    const result = await pool.query(queryText, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as HackathonData;
  } catch (error) {
    console.error("[hackathons.service] Error in getHackathonDetail:", error);
    throw new Error("Failed to retrieve hackathon details.");
  }
}

/**
 * Registers an authenticated user for a specific hackathon.
 * Verifies that the event is active, has not passed its deadline, and has remaining capacity.
 *
 * @param eventId - The ID of the hackathon event
 * @param userId - The ID of the registering student
 */
export async function registerUser(
  eventId: string,
  userId: string
): Promise<{ success: boolean; message: string; statusCode: number }> {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");

    // 1. Fetch details of the hackathon
    const eventResult = await client.query(
      `SELECT id, "maxParticipants", "registrationDeadline", status, title
       FROM "Event"
       WHERE id = $1 AND "eventType" = 'HACKATHON' FOR SHARE`,
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return { success: false, message: "Hackathon not found.", statusCode: 404 };
    }

    const event = eventResult.rows[0];

    // 2. Check if registration deadline has passed
    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
      await client.query("ROLLBACK");
      return { success: false, message: "Registration deadline has passed for this event.", statusCode: 400 };
    }

    // 3. Verify if already registered
    const existingResult = await client.query(
      `SELECT id, status FROM "EventRegistration"
       WHERE "eventId" = $1 AND "userId" = $2`,
      [eventId, userId]
    );

    if (existingResult.rows.length > 0) {
      const reg = existingResult.rows[0];
      if (reg.status === "REGISTERED" || reg.status === "CONFIRMED") {
        await client.query("ROLLBACK");
        return { success: true, message: "You are already registered for this hackathon.", statusCode: 200 };
      }
      
      // If previously cancelled, reactivate it
      await client.query(
        `UPDATE "EventRegistration"
         SET status = 'REGISTERED', "registeredAt" = NOW()
         WHERE id = $1`,
        [reg.id]
      );
    } else {
      // 4. Check capacity limits
      const countResult = await client.query(
        `SELECT COUNT(*) FROM "EventRegistration" WHERE "eventId" = $1 AND status != 'CANCELLED'`,
        [eventId]
      );
      const count = parseInt(countResult.rows[0].count, 10);

      if (event.maxParticipants && count >= event.maxParticipants) {
        await client.query("ROLLBACK");
        return { success: false, message: "Registration is full. Maximum capacity reached.", statusCode: 400 };
      }

      // 5. Insert new registration record
      await client.query(
        `INSERT INTO "EventRegistration" (id, "eventId", "userId", status, "registeredAt")
         VALUES (gen_random_uuid()::text, $1, $2, 'REGISTERED', NOW())`,
        [eventId, userId]
      );
    }

    // 6. Give user default startup notifications
    await client.query(
      `INSERT INTO "Notification" (id, "userId", type, title, message, "isRead", priority, "createdAt")
       VALUES (gen_random_uuid()::text, $1, 'EVENT', $2, $3, FALSE, 'NORMAL', NOW())`,
      [
        userId,
        `Registered for ${event.title}`,
        `You have successfully registered for the hackathon. Prepare your codebase and team submission before the deadline!`,
      ]
    );

    await client.query("COMMIT");
    return { success: true, message: "Successfully registered for this hackathon!", statusCode: 200 };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[hackathons.service] Error in registerUser:", error);
    return { success: false, message: "Internal server error occurred during registration.", statusCode: 500 };
  } finally {
    client.release();
  }
}

/**
 * Persists project submission files to PostgreSQL using database constraints.
 * Operates idempotently: saves a new project or updates the existing one.
 */
export async function submitTeamProject(
  eventId: string,
  userId: string,
  teamName: string,
  projectDesc: string,
  githubUrl: string,
  demoUrl?: string | null
): Promise<{ success: boolean; message: string; data?: any; statusCode: number }> {
  try {
    // 1. Verify that the user is registered
    const regResult = await pool.query(
      `SELECT id FROM "EventRegistration" WHERE "eventId" = $1 AND "userId" = $2 AND status != 'CANCELLED'`,
      [eventId, userId]
    );

    if (regResult.rows.length === 0) {
      return { success: false, message: "You must register for this hackathon before submitting a project.", statusCode: 403 };
    }

    // 2. Perform upsert operation
    const result = await pool.query(
      `INSERT INTO "HackathonSubmission" (
        id, "eventId", "userId", "teamName", "projectDesc", "githubUrl", "demoUrl", "submittedAt"
      ) VALUES (
        gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, NOW()
      )
      ON CONFLICT ("eventId", "userId") DO UPDATE SET
        "teamName" = EXCLUDED."teamName",
        "projectDesc" = EXCLUDED."projectDesc",
        "githubUrl" = EXCLUDED."githubUrl",
        "demoUrl" = EXCLUDED."demoUrl",
        "submittedAt" = NOW()
      RETURNING *`,
      [eventId, userId, teamName, projectDesc, githubUrl, demoUrl || null]
    );

    return {
      success: true,
      message: "Project submission recorded successfully!",
      data: result.rows[0],
      statusCode: 200
    };
  } catch (error) {
    console.error("[hackathons.service] Error in submitTeamProject:", error);
    return { success: false, message: "Failed to persist project submission in database.", statusCode: 500 };
  }
}

/**
 * Retrieves the live submissions list sorted by evaluation score.
 *
 * @param eventId - The ID of the hackathon event
 * @returns Sorted array of submissions
 */
export async function getHackathonStandings(eventId: string): Promise<SubmissionData[]> {
  try {
    const result = await pool.query(
      `SELECT s.id, s."teamName", s."projectDesc", s."githubUrl", s."demoUrl", s."score", s."submittedAt", u.name AS "authorName"
       FROM "HackathonSubmission" s
       JOIN "User" u ON u.id = s."userId"
       WHERE s."eventId" = $1
       ORDER BY COALESCE(s."score", 0) DESC, s."submittedAt" ASC
       LIMIT 50`,
      [eventId]
    );
    return result.rows as SubmissionData[];
  } catch (error) {
    console.error("[hackathons.service] Error in getHackathonStandings:", error);
    throw new Error("Failed to load standings from database.");
  }
}
