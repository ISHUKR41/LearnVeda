/**
 * FILE: hackathons.controller.ts
 * LOCATION: backend/src/controllers/hackathons.controller.ts
 * PURPOSE: Controller handlers for all Hackathon-related API endpoints.
 *          Performs parameter extraction, token authentication checks, input
 *          payload validation, and calls the corresponding database services.
 *
 * USED BY: backend/src/routes/hackathons.ts
 * DEPENDENCIES: express, ../services/hackathons.service
 * LAST UPDATED: 2026-05-27
 */

import { Request, Response } from "express";
import {
  getHackathonsList,
  getHackathonDetail,
  registerUser,
  submitTeamProject,
  getHackathonStandings
} from "../services/hackathons.service";

/**
 * Returns a list of all active or completed hackathons.
 * Optionally filter by query status parameter.
 */
export const listHackathons = async (req: Request, res: Response): Promise<void> => {
  try {
    const statusFilter = req.query.status ? String(req.query.status) : undefined;
    const hackathons = await getHackathonsList(statusFilter);

    res.status(200).json({
      ok: true,
      data: { hackathons }
    });
  } catch (error: any) {
    console.error("[hackathons.controller] listHackathons error:", error);
    res.status(500).json({
      ok: false,
      error: { message: "Internal server error while retrieving hackathons list." }
    });
  }
};

/**
 * Returns details for a single hackathon.
 */
export const getHackathon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const hackathon = await getHackathonDetail(String(id));

    if (!hackathon) {
      res.status(404).json({
        ok: false,
        error: { message: `Hackathon with ID '${id}' was not found.` }
      });
      return;
    }

    res.status(200).json({
      ok: true,
      data: { hackathon }
    });
  } catch (error: any) {
    console.error("[hackathons.controller] getHackathon error:", error);
    res.status(500).json({
      ok: false,
      error: { message: "Internal server error while retrieving hackathon details." }
    });
  }
};

/**
 * Registers the currently authenticated user for a specific hackathon.
 */
export const registerForHackathon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        ok: false,
        error: { message: "Unauthorized. User session not found." }
      });
      return;
    }

    const result = await registerUser(String(id), userId);
    
    res.status(result.statusCode).json({
      ok: result.success,
      message: result.message
    });
  } catch (error: any) {
    console.error("[hackathons.controller] registerForHackathon error:", error);
    res.status(500).json({
      ok: false,
      error: { message: "Internal server error while registering for the hackathon." }
    });
  }
};

/**
 * Saves or updates a project submission for a hackathon.
 * Validates inputs like the teamName, description, and Github Repository URL format.
 */
export const submitProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { teamName, projectDesc, githubUrl, demoUrl } = req.body;

    if (!userId) {
      res.status(401).json({
        ok: false,
        error: { message: "Unauthorized. User session not found." }
      });
      return;
    }

    // Input validations
    if (!teamName || !teamName.trim()) {
      res.status(400).json({ ok: false, error: { message: "Team name is required." } });
      return;
    }
    if (!projectDesc || !projectDesc.trim() || projectDesc.trim().length < 15) {
      res.status(400).json({ ok: false, error: { message: "Project description is required and must be at least 15 characters long." } });
      return;
    }
    if (!githubUrl || !githubUrl.trim()) {
      res.status(400).json({ ok: false, error: { message: "GitHub Repository URL is required." } });
      return;
    }

    // Secure GitHub Repository URL format regex check
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/;
    if (!githubRegex.test(githubUrl.trim())) {
      res.status(400).json({
        ok: false,
        error: { message: "Invalid GitHub URL format. Example: https://github.com/username/repository" }
      });
      return;
    }

    const result = await submitTeamProject(
      String(id),
      userId,
      teamName.trim(),
      projectDesc.trim(),
      githubUrl.trim(),
      demoUrl ? demoUrl.trim() : null
    );

    res.status(result.statusCode).json({
      ok: result.success,
      message: result.message,
      data: result.data ? { submission: result.data } : undefined
    });
  } catch (error: any) {
    console.error("[hackathons.controller] submitProject error:", error);
    res.status(500).json({
      ok: false,
      error: { message: "Internal server error while saving project submission." }
    });
  }
};

/**
 * Retrieves the live submissions list sorted by evaluation score.
 */
export const getStandings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const submissions = await getHackathonStandings(String(id));

    res.status(200).json({
      ok: true,
      data: { submissions }
    });
  } catch (error: any) {
    console.error("[hackathons.controller] getStandings error:", error);
    res.status(500).json({
      ok: false,
      error: { message: "Internal server error while retrieving hackathon standings." }
    });
  }
};
