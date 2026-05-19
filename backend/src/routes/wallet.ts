/**
 * FILE: wallet.ts
 * LOCATION: backend/src/routes/wallet.ts
 * PURPOSE: REST API routes for the EduQuest Stars wallet system.
 *          Manages virtual currency (Stars) — balance, transactions, and earning.
 *
 * BUSINESS RULES:
 *  - Students earn Stars by answering questions, maintaining streaks, and winning battles
 *  - Stars can be spent on battle entry, premium content unlocks
 *  - All transactions are atomic with balance tracking (before/after snapshots)
 *  - Negative balance is NEVER allowed
 *
 * ENDPOINTS:
 *  GET  /api/wallet           — Current balance and wallet info
 *  GET  /api/wallet/history   — Transaction history with pagination
 *  POST /api/wallet/earn      — Credit Stars (system-triggered)
 *  POST /api/wallet/spend     — Debit Stars (user-triggered)
 *
 * DEPENDENCIES: express, ../config/database, ../middlewares/auth.middleware
 * USED BY: frontend dashboard wallet widget, battle entry, achievements
 * LAST UPDATED: 2026-05-19
 */

import { Router, Request, Response } from "express";
import pool from "../config/database";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/* All wallet routes require authentication */
router.use(authMiddleware);

/* ─────────────────────────────────────────────
 * GET /api/wallet
 * Returns the authenticated user's wallet balance and summary.
 * Creates a wallet if one doesn't exist (first-time users).
 * ───────────────────────────────────────────── */
router.get("/", async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  try {
    let walletResult = await pool.query(
      `SELECT id, balance, "totalEarned", "totalSpent", "isPremium", "subscriptionEnd"
       FROM "Wallet" WHERE "userId" = $1`,
      [userId]
    );

    // Auto-create wallet for first-time users with 100 starter Stars
    if (walletResult.rows.length === 0) {
      walletResult = await pool.query(
        `INSERT INTO "Wallet" (id, "userId", balance, "totalEarned", "totalSpent", "isPremium", "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, $1, 100, 100, 0, FALSE, NOW(), NOW())
         RETURNING id, balance, "totalEarned", "totalSpent", "isPremium", "subscriptionEnd"`,
        [userId]
      );
    }

    // Get recent transactions summary (last 7 days)
    const recentResult = await pool.query(
      `SELECT
         COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) AS "recentEarnings",
         COALESCE(SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END), 0) AS "recentSpending",
         COUNT(*) AS "recentTransactions"
       FROM "WalletTransaction"
       WHERE "userId" = $1 AND "createdAt" > NOW() - INTERVAL '7 days'`,
      [userId]
    );

    res.json({
      ok: true,
      data: {
        wallet: walletResult.rows[0],
        recentSummary: recentResult.rows[0],
      },
    });
  } catch (err) {
    console.error("[wallet GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch wallet." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/wallet/history
 * Returns paginated transaction history for the user.
 *
 * Query params:
 *  type   — Filter by transaction type (optional)
 *  limit  — Max records (default: 20, max: 50)
 *  offset — Pagination offset (default: 0)
 * ───────────────────────────────────────────── */
router.get("/history", async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const type = req.query.type ? String(req.query.type) : null;
  const limit = Math.min(parseInt(String(req.query.limit ?? "20"), 10), 50);
  const offset = Math.max(parseInt(String(req.query.offset ?? "0"), 10), 0);

  try {
    const params: (string | number)[] = [userId];
    let whereClause = `WHERE "userId" = $1`;

    if (type) {
      params.push(type);
      whereClause += ` AND type = $${params.length}`;
    }

    params.push(limit, offset);

    const result = await pool.query(
      `SELECT id, amount, type, description, "referenceId",
              "balanceBefore", "balanceAfter", "createdAt"
       FROM "WalletTransaction"
       ${whereClause}
       ORDER BY "createdAt" DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM "WalletTransaction" ${whereClause}`,
      params.slice(0, type ? 2 : 1)
    );

    res.json({
      ok: true,
      data: {
        transactions: result.rows,
        total: parseInt(countResult.rows[0].count),
        limit,
        offset,
      },
    });
  } catch (err) {
    console.error("[wallet/history GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch transaction history." } });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/wallet/earn
 * Credits Stars to the user's wallet. Used by internal systems:
 *  - Answering questions correctly
 *  - Maintaining streaks
 *  - Winning battles
 *  - Completing achievements
 *
 * Body: { amount: number, type: string, description?: string, referenceId?: string }
 * ───────────────────────────────────────────── */
router.post("/earn", async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { amount, type, description, referenceId } = req.body;

  // Validation
  if (!amount || typeof amount !== "number" || amount <= 0 || amount > 10000) {
    res.status(400).json({ ok: false, error: { message: "Amount must be between 1 and 10,000." } });
    return;
  }

  const validEarnTypes = ["EARN_QUESTION", "EARN_STREAK", "EARN_BATTLE", "EARN_ACHIEVEMENT", "EARN_DAILY", "EARN_BONUS"];
  if (!type || !validEarnTypes.includes(type)) {
    res.status(400).json({ ok: false, error: { message: `Type must be one of: ${validEarnTypes.join(", ")}` } });
    return;
  }

  try {
    // Use a transaction to ensure atomic balance update
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Get current balance with row lock (FOR UPDATE prevents race conditions)
      const walletResult = await client.query(
        `SELECT id, balance FROM "Wallet" WHERE "userId" = $1 FOR UPDATE`,
        [userId]
      );

      if (walletResult.rows.length === 0) {
        await client.query("ROLLBACK");
        res.status(404).json({ ok: false, error: { message: "Wallet not found." } });
        return;
      }

      const currentBalance = walletResult.rows[0].balance;
      const newBalance = currentBalance + amount;

      // Update wallet balance
      await client.query(
        `UPDATE "Wallet"
         SET balance = $1, "totalEarned" = "totalEarned" + $2, "updatedAt" = NOW()
         WHERE "userId" = $3`,
        [newBalance, amount, userId]
      );

      // Create transaction record
      const txResult = await client.query(
        `INSERT INTO "WalletTransaction"
           (id, "userId", amount, type, description, "referenceId", "balanceBefore", "balanceAfter", "createdAt")
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, NOW())
         RETURNING *`,
        [userId, amount, type, description ?? `Earned ${amount} Stars`, referenceId ?? null, currentBalance, newBalance]
      );

      await client.query("COMMIT");

      res.status(201).json({
        ok: true,
        data: {
          transaction: txResult.rows[0],
          newBalance,
        },
      });
    } catch {
      await client.query("ROLLBACK");
      throw new Error("Transaction failed");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("[wallet/earn POST] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to credit Stars." } });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/wallet/spend
 * Debits Stars from the user's wallet. Used for:
 *  - Battle entry fees
 *  - Premium content unlocks
 *
 * IMPORTANT: Never allows negative balance.
 *
 * Body: { amount: number, type: string, description?: string, referenceId?: string }
 * ───────────────────────────────────────────── */
router.post("/spend", async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { amount, type, description, referenceId } = req.body;

  if (!amount || typeof amount !== "number" || amount <= 0) {
    res.status(400).json({ ok: false, error: { message: "Amount must be a positive number." } });
    return;
  }

  const validSpendTypes = ["SPEND_BATTLE", "SPEND_PURCHASE", "SPEND_UNLOCK"];
  if (!type || !validSpendTypes.includes(type)) {
    res.status(400).json({ ok: false, error: { message: `Type must be one of: ${validSpendTypes.join(", ")}` } });
    return;
  }

  try {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const walletResult = await client.query(
        `SELECT id, balance FROM "Wallet" WHERE "userId" = $1 FOR UPDATE`,
        [userId]
      );

      if (walletResult.rows.length === 0) {
        await client.query("ROLLBACK");
        res.status(404).json({ ok: false, error: { message: "Wallet not found." } });
        return;
      }

      const currentBalance = walletResult.rows[0].balance;

      // CRITICAL: Prevent negative balance
      if (currentBalance < amount) {
        await client.query("ROLLBACK");
        res.status(400).json({
          ok: false,
          error: {
            message: `Insufficient Stars. Current balance: ${currentBalance}, required: ${amount}`,
          },
        });
        return;
      }

      const newBalance = currentBalance - amount;

      await client.query(
        `UPDATE "Wallet"
         SET balance = $1, "totalSpent" = "totalSpent" + $2, "updatedAt" = NOW()
         WHERE "userId" = $3`,
        [newBalance, amount, userId]
      );

      const txResult = await client.query(
        `INSERT INTO "WalletTransaction"
           (id, "userId", amount, type, description, "referenceId", "balanceBefore", "balanceAfter", "createdAt")
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, NOW())
         RETURNING *`,
        [userId, -amount, type, description ?? `Spent ${amount} Stars`, referenceId ?? null, currentBalance, newBalance]
      );

      await client.query("COMMIT");

      res.status(201).json({
        ok: true,
        data: {
          transaction: txResult.rows[0],
          newBalance,
        },
      });
    } catch {
      await client.query("ROLLBACK");
      throw new Error("Transaction failed");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("[wallet/spend POST] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to spend Stars." } });
  }
});

export default router;
