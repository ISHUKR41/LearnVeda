/**
 * FILE: auth.ts
 * LOCATION: backend/src/routes/auth.ts
 * PURPOSE: REST API routes for user authentication — registration, login,
 *          token refresh, and logout.
 *
 * ENDPOINTS:
 *  POST /api/auth/register  — Create new account (returns tokens)
 *  POST /api/auth/login     — Login with email/password (returns tokens)
 *  POST /api/auth/refresh   — Refresh expired access token
 *  POST /api/auth/logout    — Invalidate current session
 *  GET  /api/auth/me        — Get current authenticated user profile
 *
 * SECURITY:
 *  - Passwords hashed with PBKDF2-SHA512
 *  - Access token in response body (frontend stores in memory)
 *  - Refresh token in response body (frontend stores in httpOnly cookie)
 *  - All error messages are generic to prevent information leakage
 *
 * DEPENDENCIES: express, ../services/auth.service, ../middlewares/auth.middleware
 * USED BY: frontend sign-in/sign-up pages, session management
 * LAST UPDATED: 2026-05-19
 */

import { Router, Request, Response } from "express";
import {
  registerUser,
  loginUser,
  refreshTokens,
  isServiceError,
} from "../services/auth.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import pool from "../config/database";

const router = Router();

/* ─────────────────────────────────────────────
 * POST /api/auth/register
 * Creates a new user account with email and password.
 *
 * Body: { name, email, password, classLevel?, stream?, board? }
 * Returns: { user, accessToken, refreshToken }
 *
 * The service layer handles:
 *  - Input validation (name length, email format, password strength)
 *  - Duplicate email checking
 *  - Password hashing
 *  - Wallet creation with starter Stars
 *  - Welcome notification creation
 * ───────────────────────────────────────────── */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body);

    if (isServiceError(result)) {
      res.status(result.statusCode).json({
        ok: false,
        error: { code: result.code, message: result.message },
      });
      return;
    }

    res.status(201).json({
      ok: true,
      data: result,
    });
  } catch (err) {
    console.error("[auth/register POST] Error:", err);
    res.status(500).json({
      ok: false,
      error: { message: "Registration failed. Please try again." },
    });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/auth/login
 * Authenticates a user with email and password.
 *
 * Body: { email, password }
 * Returns: { user, accessToken, refreshToken }
 *
 * Security:
 *  - Generic "Invalid email or password" for both wrong email and wrong password
 *  - Timing-safe password comparison (prevents timing attacks)
 *  - Updates lastActive timestamp on success
 * ───────────────────────────────────────────── */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);

    if (isServiceError(result)) {
      res.status(result.statusCode).json({
        ok: false,
        error: { code: result.code, message: result.message },
      });
      return;
    }

    res.json({
      ok: true,
      data: result,
    });
  } catch (err) {
    console.error("[auth/login POST] Error:", err);
    res.status(500).json({
      ok: false,
      error: { message: "Login failed. Please try again." },
    });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/auth/refresh
 * Issues a new access token using a valid refresh token.
 * Implements token rotation — a new refresh token is also issued.
 *
 * Body: { refreshToken }
 * Returns: { accessToken, refreshToken }
 * ───────────────────────────────────────────── */
router.post("/refresh", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({
      ok: false,
      error: { message: "Refresh token is required." },
    });
    return;
  }

  try {
    const result = await refreshTokens(refreshToken);

    if (isServiceError(result)) {
      res.status(result.statusCode).json({
        ok: false,
        error: { code: result.code, message: result.message },
      });
      return;
    }

    res.json({
      ok: true,
      data: result,
    });
  } catch (err) {
    console.error("[auth/refresh POST] Error:", err);
    res.status(500).json({
      ok: false,
      error: { message: "Token refresh failed. Please log in again." },
    });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/auth/logout
 * Invalidates the current session.
 * In the current implementation, the client simply discards its tokens.
 * Future: Add token blacklisting with Redis for true server-side invalidation.
 * ───────────────────────────────────────────── */
router.post("/logout", (_req: Request, res: Response) => {
  // Client-side token deletion is handled by the frontend.
  // Server-side: we acknowledge the logout request.
  res.json({
    ok: true,
    data: { message: "Logged out successfully." },
  });
});

/* ─────────────────────────────────────────────
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 * Requires a valid access token in the Authorization header.
 *
 * Used by the frontend to verify session validity on page load.
 * ───────────────────────────────────────────── */
router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, "currentLevel" AS level, xp, points,
              "currentStreak" AS streak, "highestStreak", "classLevel",
              stream, board, "isVerified", "createdAt"
       FROM "User"
       WHERE id = $1 AND "isActive" = TRUE`,
      [req.user!.userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        ok: false,
        error: { message: "User not found." },
      });
      return;
    }

    // Also fetch wallet balance
    const walletResult = await pool.query(
      `SELECT balance, "isPremium" FROM "Wallet" WHERE "userId" = $1`,
      [req.user!.userId]
    );

    const user = result.rows[0];
    const wallet = walletResult.rows[0] ?? { balance: 0, isPremium: false };

    res.json({
      ok: true,
      data: {
        user: {
          ...user,
          walletBalance: wallet.balance,
          isPremium: wallet.isPremium,
        },
      },
    });
  } catch (err) {
    console.error("[auth/me GET] Error:", err);
    res.status(500).json({
      ok: false,
      error: { message: "Failed to fetch user profile." },
    });
  }
});

export default router;
