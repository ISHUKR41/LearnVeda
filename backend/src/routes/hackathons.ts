/**
 * FILE: hackathons.ts
 * LOCATION: backend/src/routes/hackathons.ts
 * PURPOSE: REST API router declarations for the EduQuest Hackathons.
 *          Maps URLs to controller handlers and applies authentication middleware.
 *
 * ENDPOINTS:
 *  GET    /api/hackathons                 — List hackathons (DRAFT hidden by default)
 *  GET    /api/hackathons/:id             — Details of a specific hackathon
 *  POST   /api/hackathons/:id/register    — Register student (auth required)
 *  POST   /api/hackathons/:id/submit      — Submit project (auth required + validator check)
 *  GET    /api/hackathons/:id/submissions — Leaderboard project entries (standings)
 *
 * USED BY: backend/src/index.ts → /api/hackathons
 * DEPENDENCIES: express, ../controllers/hackathons.controller, ../middlewares/auth.middleware
 * LAST UPDATED: 2026-05-27
 */

import { Router } from "express";
import {
  listHackathons,
  getHackathon,
  registerForHackathon,
  submitProject,
  getStandings
} from "../controllers/hackathons.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/* ─── Public Endpoints ─── */

// GET /api/hackathons — List all published, active, or completed hackathons
router.get("/", listHackathons);

// GET /api/hackathons/:id — Retrieve detailed specification of a single hackathon
router.get("/:id", getHackathon);

// GET /api/hackathons/:id/submissions — Live submissions standings ranking
router.get("/:id/submissions", getStandings);

/* ─── Protected Endpoints (Requires User Authentication) ─── */

// POST /api/hackathons/:id/register — Register the student for this hackathon
router.post("/:id/register", authMiddleware, registerForHackathon);

// POST /api/hackathons/:id/submit — Submit project repository (GitHub URL + metadata)
router.post("/:id/submit", authMiddleware, submitProject);

export default router;
