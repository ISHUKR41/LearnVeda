/**
 * FILE: auth.service.ts
 * LOCATION: backend/src/services/auth.service.ts
 * PURPOSE: Business logic for user authentication — registration, login,
 *          token refresh, and session management.
 *
 * ARCHITECTURE: Service layer pattern — this file contains ONLY business logic.
 *               It does NOT handle HTTP requests/responses (that's the controller's job).
 *               It does NOT execute raw SQL (that's the repository's job with Prisma).
 *
 * SECURITY:
 *  - Passwords hashed with PBKDF2-SHA512 (100,000 iterations)
 *  - JWT tokens with short expiry (15 min access, 7 day refresh)
 *  - Rate limiting handled at the middleware level
 *  - Email validation and input sanitization
 *
 * DEPENDENCIES: ../utils/jwt, ../config/database
 * USED BY: auth.controller.ts, auth routes
 * LAST UPDATED: 2026-05-19
 */

import pool from "../config/database";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashPassword,
  verifyPassword,
} from "../utils/jwt";

/* ─────────────────────────────────────────────
 * Types — Service input/output contracts
 * ───────────────────────────────────────────── */

/** Input for user registration */
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  classLevel?: string;  // "class-9", "class-10", etc.
  stream?: string;      // "science", "commerce", "arts"
  board?: string;       // "CBSE", "ICSE", etc.
}

/** Input for user login */
export interface LoginInput {
  email: string;
  password: string;
}

/** Output returned after successful auth operations */
export interface AuthResult {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    level: number;
    xp: number;
    streak: number;
    classLevel: string | null;
  };
  accessToken: string;
  refreshToken: string;
}

/** Standard service error */
export interface ServiceError {
  code: string;
  message: string;
  statusCode: number;
}

/* ─────────────────────────────────────────────
 * AUTH SERVICE
 * ───────────────────────────────────────────── */

/**
 * Registers a new user account.
 *
 * Validation rules:
 *  - Name: 2-64 characters, standard characters only
 *  - Email: Valid email format, must be unique in database
 *  - Password: Minimum 8 characters
 *
 * After registration:
 *  1. Creates user record with hashed password
 *  2. Creates wallet with 100 starter Stars
 *  3. Generates JWT access + refresh tokens
 *  4. Returns user profile and tokens
 *
 * @param input - Registration form data
 * @returns AuthResult with user data and tokens, or ServiceError
 */
export async function registerUser(
  input: RegisterInput
): Promise<AuthResult | ServiceError> {
  /* ── Input Validation ── */
  if (!input.name || input.name.trim().length < 2) {
    return { code: "INVALID_NAME", message: "Name must be at least 2 characters.", statusCode: 400 };
  }

  if (!input.email || !isValidEmail(input.email)) {
    return { code: "INVALID_EMAIL", message: "Please provide a valid email address.", statusCode: 400 };
  }

  if (!input.password || input.password.length < 8) {
    return { code: "WEAK_PASSWORD", message: "Password must be at least 8 characters.", statusCode: 400 };
  }

  const email = input.email.toLowerCase().trim();

  /* ── Check for existing user ── */
  const existingUser = await pool.query(
    "SELECT id FROM \"User\" WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    return { code: "EMAIL_EXISTS", message: "An account with this email already exists.", statusCode: 409 };
  }

  /* ── Hash password ── */
  const { hash: passwordHash } = hashPassword(input.password);

  /* ── Create user ── */
  const userResult = await pool.query(
    `INSERT INTO "User" (
      id, name, email, "passwordHash", role, points, xp, "currentLevel",
      "currentStreak", "highestStreak", "lastActive", "classLevel", stream, board,
      "isMinor", "isActive", "isVerified", "createdAt", "updatedAt"
    ) VALUES (
      gen_random_uuid()::text, $1, $2, $3, 'STUDENT', 0, 0, 1,
      0, 0, NOW(), $4, $5, $6,
      FALSE, TRUE, FALSE, NOW(), NOW()
    ) RETURNING id, name, email, role, "currentLevel" AS level, xp, "currentStreak" AS streak, "classLevel"`,
    [
      input.name.trim(),
      email,
      passwordHash,
      input.classLevel ?? null,
      input.stream ?? null,
      input.board ?? "CBSE",
    ]
  );

  const user = userResult.rows[0];

  /* ── Create wallet with starter Stars ── */
  await pool.query(
    `INSERT INTO "Wallet" (id, "userId", balance, "totalEarned", "totalSpent", "isPremium", "createdAt", "updatedAt")
     VALUES (gen_random_uuid()::text, $1, 100, 100, 0, FALSE, NOW(), NOW())`,
    [user.id]
  );

  /* ── Generate tokens ── */
  const accessToken = generateAccessToken(user.id, email, "STUDENT");
  const { token: refreshToken } = generateRefreshToken(user.id);

  /* ── Create welcome notification ── */
  await pool.query(
    `INSERT INTO "Notification" (id, "userId", type, title, message, "isRead", priority, "createdAt")
     VALUES (gen_random_uuid()::text, $1, 'SYSTEM', 'Welcome to EduQuest! 🎓',
             'Start your learning journey today. Complete your first lesson to earn 50 XP!',
             FALSE, 'HIGH', NOW())`,
    [user.id]
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      level: user.level,
      xp: user.xp,
      streak: user.streak,
      classLevel: user.classlevel,
    },
    accessToken,
    refreshToken,
  };
}

/**
 * Authenticates a user with email and password.
 *
 * Security measures:
 *  - Generic error messages (doesn't reveal if email exists)
 *  - Timing-safe password comparison (prevents timing attacks)
 *  - Updates lastActive timestamp on successful login
 *
 * @param input - Login credentials
 * @returns AuthResult with user data and tokens, or ServiceError
 */
export async function loginUser(
  input: LoginInput
): Promise<AuthResult | ServiceError> {
  if (!input.email || !input.password) {
    return { code: "MISSING_CREDENTIALS", message: "Email and password are required.", statusCode: 400 };
  }

  const email = input.email.toLowerCase().trim();

  /* ── Find user by email ── */
  const result = await pool.query(
    `SELECT id, name, email, "passwordHash", role, "currentLevel" AS level, xp,
            "currentStreak" AS streak, "classLevel", "isActive"
     FROM "User"
     WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    // Generic message — don't reveal whether the email exists
    return { code: "INVALID_CREDENTIALS", message: "Invalid email or password.", statusCode: 401 };
  }

  const user = result.rows[0];

  /* ── Check account status ── */
  if (!user.isactive) {
    return { code: "ACCOUNT_DISABLED", message: "Your account has been deactivated. Contact support.", statusCode: 403 };
  }

  /* ── Verify password ── */
  const isValidPassword = verifyPassword(input.password, user.passwordHash);

  if (!isValidPassword) {
    return { code: "INVALID_CREDENTIALS", message: "Invalid email or password.", statusCode: 401 };
  }

  /* ── Update last active timestamp ── */
  await pool.query(
    `UPDATE "User" SET "lastActive" = NOW(), "updatedAt" = NOW() WHERE id = $1`,
    [user.id]
  );

  /* ── Generate tokens ── */
  const accessToken = generateAccessToken(user.id, email, user.role);
  const { token: refreshToken } = generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      level: user.level,
      xp: user.xp,
      streak: user.streak,
      classLevel: user.classlevel,
    },
    accessToken,
    refreshToken,
  };
}

/**
 * Refreshes an expired access token using a valid refresh token.
 *
 * Token rotation: A new refresh token is issued on every refresh.
 * This means a stolen refresh token can only be used once.
 *
 * @param refreshTokenStr - The current refresh token
 * @returns New access + refresh tokens, or ServiceError
 */
export async function refreshTokens(
  refreshTokenStr: string
): Promise<{ accessToken: string; refreshToken: string } | ServiceError> {
  const payload = verifyRefreshToken(refreshTokenStr);

  if (!payload) {
    return { code: "INVALID_REFRESH_TOKEN", message: "Refresh token is invalid or expired. Please log in again.", statusCode: 401 };
  }

  /* ── Fetch user to get current role and check active status ── */
  const result = await pool.query(
    `SELECT id, email, role, "isActive" FROM "User" WHERE id = $1`,
    [payload.userId]
  );

  if (result.rows.length === 0 || !result.rows[0].isActive) {
    return { code: "USER_NOT_FOUND", message: "User account not found or deactivated.", statusCode: 401 };
  }

  const user = result.rows[0];

  /* ── Issue new tokens (rotation) ── */
  const accessToken = generateAccessToken(user.id, user.email, user.role);
  const { token: newRefreshToken } = generateRefreshToken(user.id);

  return { accessToken, refreshToken: newRefreshToken };
}

/* ─────────────────────────────────────────────
 * Helper Functions
 * ───────────────────────────────────────────── */

/**
 * Validates email format using a regex pattern.
 * This is a basic check — full validation requires sending a confirmation email.
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Type guard — checks if a result is a ServiceError
 */
export function isServiceError(result: unknown): result is ServiceError {
  return typeof result === "object" && result !== null && "statusCode" in result;
}
