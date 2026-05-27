/**
 * FILE: events.ts
 * LOCATION: backend/src/routes/events.ts
 * PURPOSE: REST API routes for the EduQuest events & competitions portal.
 *          Handles event listing, creation, registration, and management.
 *
 * FEATURES:
 *  - Public event browsing with filtering and pagination
 *  - Event registration with capacity checking
 *  - Organizer event creation (requires ORGANIZER or ADMIN role)
 *  - Event status management (DRAFT → PUBLISHED → LIVE → COMPLETED)
 *
 * ENDPOINTS:
 *  GET    /api/events              — List events (filterable by status, type)
 *  GET    /api/events/:id          — Single event details with registration count
 *  POST   /api/events              — Create event (ORGANIZER/ADMIN only)
 *  POST   /api/events/:id/register — Register for event (auth required)
 *  DELETE /api/events/:id/register — Cancel registration (auth required)
 *  PATCH  /api/events/:id/status   — Update event status (organizer only)
 *
 * DEPENDENCIES: express, ../config/database, ../middlewares/auth.middleware
 * USED BY: frontend events page, dashboard event widgets
 * LAST UPDATED: 2026-05-19
 */

import { Router, Request, Response } from "express";
import pool from "../config/database";
import { authMiddleware, optionalAuthMiddleware, roleMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Auto-initialize HackathonSubmission table on module import
async function initSubmissionsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "HackathonSubmission" (
        id TEXT PRIMARY KEY,
        "eventId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "teamName" TEXT NOT NULL,
        "projectDesc" TEXT NOT NULL,
        "githubUrl" TEXT NOT NULL,
        "demoUrl" TEXT,
        "submittedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "score" INTEGER,
        "feedback" TEXT,
        CONSTRAINT fk_submission_event FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE,
        CONSTRAINT fk_submission_user FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
        CONSTRAINT uq_submission_event_user UNIQUE ("eventId", "userId")
      );
    `);
  } catch (err) {
    console.error("[events] Failed to initialize HackathonSubmission table:", err);
  }
}
initSubmissionsTable();

/* ─────────────────────────────────────────────
 * Valid event types and statuses for validation
 * ───────────────────────────────────────────── */
const VALID_EVENT_TYPES = new Set(["COMPETITION", "HACKATHON", "QUIZ", "WORKSHOP"]);
const VALID_STATUSES = new Set(["DRAFT", "PUBLISHED", "LIVE", "COMPLETED", "ARCHIVED"]);

/* ─────────────────────────────────────────────
 * GET /api/events
 * Returns paginated list of events, filterable by status and type.
 * Public endpoint — anonymous users can browse upcoming events.
 *
 * Query params:
 *  status    — Event status filter (default: "PUBLISHED")
 *  type      — Event type filter (optional)
 *  limit     — Max events (default: 12, max: 50)
 *  offset    — Pagination offset (default: 0)
 * ───────────────────────────────────────────── */
router.get("/", optionalAuthMiddleware, async (req: Request, res: Response) => {
  const status = VALID_STATUSES.has(String(req.query.status))
    ? String(req.query.status)
    : "PUBLISHED";

  const eventType = VALID_EVENT_TYPES.has(String(req.query.type))
    ? String(req.query.type)
    : null;

  const limit = Math.min(parseInt(String(req.query.limit ?? "12"), 10), 50);
  const offset = Math.max(parseInt(String(req.query.offset ?? "0"), 10), 0);

  try {
    let queryText = `
      SELECT e.id, e.title, e.description, e."eventType", e.venue,
             e."maxParticipants", e."startTime", e."endTime",
             e."registrationDeadline", e."isProctored", e."requiresSafeBrowser",
             e.status, e."bannerUrl", e."collegeName", e."createdAt",
             COUNT(er.id) AS "registrationCount"
      FROM "Event" e
      LEFT JOIN "EventRegistration" er ON er."eventId" = e.id AND er.status != 'CANCELLED'
      WHERE e.status = $1
    `;

    const params: (string | number)[] = [status];

    if (eventType) {
      params.push(eventType);
      queryText += ` AND e."eventType" = $${params.length}`;
    }

    queryText += `
      GROUP BY e.id
      ORDER BY e."startTime" ASC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    params.push(limit, offset);

    const result = await pool.query(queryText, params);

    // Get total count for pagination
    const countParams: (string | number)[] = [status];
    let countWhere = `WHERE status = $1`;
    if (eventType) {
      countParams.push(eventType);
      countWhere += ` AND "eventType" = $2`;
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM "Event" ${countWhere}`,
      countParams
    );

    res.json({
      ok: true,
      data: {
        events: result.rows,
        total: parseInt(countResult.rows[0].count),
        limit,
        offset,
      },
    });
  } catch (err) {
    console.error("[events GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch events." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/events/:id
 * Returns a single event with full details and registration info.
 * If user is authenticated, also returns their registration status.
 * ───────────────────────────────────────────── */
router.get("/:id", optionalAuthMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const eventResult = await pool.query(
      `SELECT e.*, COUNT(er.id) AS "registrationCount"
       FROM "Event" e
       LEFT JOIN "EventRegistration" er ON er."eventId" = e.id AND er.status != 'CANCELLED'
       WHERE e.id = $1
       GROUP BY e.id`,
      [id]
    );

    if (eventResult.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Event not found." } });
      return;
    }

    const event = eventResult.rows[0];

    // Check if current user is registered (if authenticated)
    let userRegistration = null;
    if (req.user) {
      const regResult = await pool.query(
        `SELECT id, status, "registeredAt"
         FROM "EventRegistration"
         WHERE "eventId" = $1 AND "userId" = $2`,
        [id, req.user.userId]
      );
      userRegistration = regResult.rows[0] ?? null;
    }

    res.json({
      ok: true,
      data: {
        event,
        userRegistration,
      },
    });
  } catch (err) {
    console.error("[events/:id GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch event details." } });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/events
 * Creates a new event. Requires ORGANIZER or ADMIN role.
 *
 * Body: { title, description, eventType, venue, maxParticipants,
 *         startTime, endTime, registrationDeadline, isProctored,
 *         requiresSafeBrowser, collegeName, bannerUrl }
 * ───────────────────────────────────────────── */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ORGANIZER", "ADMIN"]),
  async (req: Request, res: Response) => {
    const {
      title, description, eventType = "COMPETITION", venue,
      maxParticipants, startTime, endTime, registrationDeadline,
      isProctored = false, requiresSafeBrowser = false,
      collegeName, bannerUrl,
    } = req.body;

    // Input validation
    if (!title || title.trim().length < 3) {
      res.status(400).json({ ok: false, error: { message: "Event title must be at least 3 characters." } });
      return;
    }

    if (!description || description.trim().length < 20) {
      res.status(400).json({ ok: false, error: { message: "Event description must be at least 20 characters." } });
      return;
    }

    if (!startTime || !endTime) {
      res.status(400).json({ ok: false, error: { message: "Start time and end time are required." } });
      return;
    }

    try {
      const result = await pool.query(
        `INSERT INTO "Event" (
          id, title, description, "organizerId", "eventType", venue,
          "maxParticipants", "startTime", "endTime", "registrationDeadline",
          "isProctored", "requiresSafeBrowser", status, "bannerUrl", "collegeName",
          "createdAt", "updatedAt"
        ) VALUES (
          gen_random_uuid()::text, $1, $2, $3, $4, $5,
          $6, $7, $8, $9,
          $10, $11, 'DRAFT', $12, $13,
          NOW(), NOW()
        ) RETURNING *`,
        [
          title.trim(), description.trim(), req.user!.userId, eventType, venue ?? "Online",
          maxParticipants ?? null, new Date(startTime), new Date(endTime),
          registrationDeadline ? new Date(registrationDeadline) : null,
          isProctored, requiresSafeBrowser, bannerUrl ?? null, collegeName ?? null,
        ]
      );

      res.status(201).json({ ok: true, data: { event: result.rows[0] } });
    } catch (err) {
      console.error("[events POST] Error:", err);
      res.status(500).json({ ok: false, error: { message: "Failed to create event." } });
    }
  }
);

/* ─────────────────────────────────────────────
 * POST /api/events/:id/register
 * Registers the authenticated user for an event.
 * Checks capacity limit and registration deadline.
 * ───────────────────────────────────────────── */
router.post("/:id/register", authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  try {
    // Check event exists and is open for registration
    const eventResult = await pool.query(
      `SELECT id, "maxParticipants", "registrationDeadline", status
       FROM "Event" WHERE id = $1`,
      [id]
    );

    if (eventResult.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Event not found." } });
      return;
    }

    const event = eventResult.rows[0];

    if (event.status !== "PUBLISHED") {
      res.status(400).json({ ok: false, error: { message: "This event is not open for registration." } });
      return;
    }

    // Check registration deadline
    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
      res.status(400).json({ ok: false, error: { message: "Registration deadline has passed." } });
      return;
    }

    // Check capacity
    if (event.maxParticipants) {
      const countResult = await pool.query(
        `SELECT COUNT(*) FROM "EventRegistration"
         WHERE "eventId" = $1 AND status != 'CANCELLED'`,
        [id]
      );
      if (parseInt(countResult.rows[0].count) >= event.maxParticipants) {
        res.status(400).json({ ok: false, error: { message: "This event is full." } });
        return;
      }
    }

    // Check if already registered
    const existingReg = await pool.query(
      `SELECT id, status FROM "EventRegistration"
       WHERE "eventId" = $1 AND "userId" = $2`,
      [id, userId]
    );

    if (existingReg.rows.length > 0) {
      if (existingReg.rows[0].status === "CANCELLED") {
        // Re-register if previously cancelled
        await pool.query(
          `UPDATE "EventRegistration" SET status = 'REGISTERED', "registeredAt" = NOW()
           WHERE id = $1`,
          [existingReg.rows[0].id]
        );
        res.json({ ok: true, data: { message: "Re-registered for event successfully." } });
        return;
      }
      res.status(409).json({ ok: false, error: { message: "You are already registered for this event." } });
      return;
    }

    // Create registration
    const regResult = await pool.query(
      `INSERT INTO "EventRegistration" (id, "eventId", "userId", status, "registeredAt")
       VALUES (gen_random_uuid()::text, $1, $2, 'REGISTERED', NOW())
       RETURNING *`,
      [id, userId]
    );

    res.status(201).json({ ok: true, data: { registration: regResult.rows[0] } });
  } catch (err) {
    console.error("[events/:id/register POST] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to register for event." } });
  }
});

/* ─────────────────────────────────────────────
 * DELETE /api/events/:id/register
 * Cancels a user's event registration.
 * ───────────────────────────────────────────── */
router.delete("/:id/register", authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  try {
    const result = await pool.query(
      `UPDATE "EventRegistration" SET status = 'CANCELLED'
       WHERE "eventId" = $1 AND "userId" = $2 AND status = 'REGISTERED'
       RETURNING id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Registration not found." } });
      return;
    }

    res.json({ ok: true, data: { message: "Registration cancelled." } });
  } catch (err) {
    console.error("[events/:id/register DELETE] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to cancel registration." } });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/events/:id/submit
 * Handles project submissions for Hackathon events.
 * Performs deep regex validation on GitHub URLs and team names.
 * Supports updating project code (ON CONFLICT DO UPDATE).
 * ───────────────────────────────────────────── */
router.post("/:id/submit", authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;
  const { teamName, projectDesc, githubUrl, demoUrl } = req.body;

  // Basic validation checks
  if (!teamName || teamName.trim().length < 2) {
    res.status(400).json({ ok: false, error: { message: "Team Name must be at least 2 characters." } });
    return;
  }

  if (!projectDesc || projectDesc.trim().length < 10) {
    res.status(400).json({ ok: false, error: { message: "Project Description must be at least 10 characters." } });
    return;
  }

  // Strict regex check for GitHub Repo URLs (no malicious injection)
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/;
  if (!githubUrl || !githubRegex.test(githubUrl.trim())) {
    res.status(400).json({ ok: false, error: { message: "Please submit a valid GitHub Repository URL (e.g. https://github.com/user/repo)." } });
    return;
  }

  try {
    // 1. Confirm event exists and is a HACKATHON
    const eventResult = await pool.query(
      `SELECT id, "eventType", status FROM "Event" WHERE id = $1`,
      [id]
    );

    if (eventResult.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Hackathon not found." } });
      return;
    }

    const event = eventResult.rows[0];
    if (event.eventType !== "HACKATHON") {
      res.status(400).json({ ok: false, error: { message: "Submissions are only allowed for Hackathon events." } });
      return;
    }

    // 2. Verify that the user is actually registered for this event
    const regResult = await pool.query(
      `SELECT id FROM "EventRegistration" WHERE "eventId" = $1 AND "userId" = $2 AND status = 'REGISTERED'`,
      [id, userId]
    );

    if (regResult.rows.length === 0) {
      res.status(403).json({ ok: false, error: { message: "You must register for this hackathon before submitting a project." } });
      return;
    }

    // 3. Insert or update the submission securely (ON CONFLICT DO UPDATE)
    const submissionResult = await pool.query(
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
      [id, userId, teamName.trim(), projectDesc.trim(), githubUrl.trim(), demoUrl ? demoUrl.trim() : null]
    );

    res.status(200).json({
      ok: true,
      message: "Project submitted successfully!",
      data: { submission: submissionResult.rows[0] }
    });
  } catch (err) {
    console.error("[events/:id/submit POST] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to submit project. Please try again." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/events/:id/submissions
 * Retrieves all approved project submissions for the standings leaderboard.
 * Public route to allow all students to see competition results.
 * ───────────────────────────────────────────── */
router.get("/:id/submissions", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT s.id, s."teamName", s."projectDesc", s."githubUrl", s."demoUrl", s."score", s."submittedAt", u.name AS "authorName"
       FROM "HackathonSubmission" s
       JOIN "User" u ON u.id = s."userId"
       WHERE s."eventId" = $1
       ORDER BY COALESCE(s."score", 0) DESC, s."submittedAt" ASC
       LIMIT 50`,
      [id]
    );

    res.json({
      ok: true,
      data: { submissions: result.rows }
    });
  } catch (err) {
    console.error("[events/:id/submissions GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch project submissions." } });
  }
});

export default router;
