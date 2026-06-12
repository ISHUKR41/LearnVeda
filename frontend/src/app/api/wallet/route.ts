/**
 * FILE: route.ts
 * LOCATION: src/app/api/wallet/route.ts
 * PURPOSE: Wallet API — returns the authenticated user's Stars balance,
 *          transaction history, and lifetime earn/spend totals.
 *
 *          Stars are Learnova's virtual currency:
 *          - Earned by answering questions correctly, winning battles, streaks
 *          - Spent on battle wagers
 *          - Never convertible to real money (compliant with RBI guidelines)
 *
 * ROUTES:
 *   GET /api/wallet              → Current balance + recent 20 transactions
 *   GET /api/wallet?history=all  → Full transaction history (paginated)
 *
 * SECURITY:
 *   - Authentication required. 401 if no valid session cookie.
 *   - Each user can only see their own wallet.
 *
 * USED BY: Dashboard wallet card, Profile page, Battle wager UI
 * DEPENDENCIES: getAuthenticatedUser, getPostgresPool, api-response helpers
 * LAST UPDATED: 2026-05-25
 */

import { type NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { getPostgresPool } from "@/lib/server/database/postgres";
import { apiSuccess, apiError, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

/* Force Node.js runtime — required for the PostgreSQL pool and cookie-based auth */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ─────────────────────────────────────────────
 * GET /api/wallet
 * ───────────────────────────────────────────── */

/**
 * Returns the current user's wallet data.
 *
 * Response shape:
 * {
 *   ok: true,
 *   data: {
 *     wallet: {
 *       id, balance, totalEarned, totalSpent, updatedAt
 *     },
 *     transactions: WalletTransaction[],
 *     total: number   (total transaction count for pagination)
 *   }
 * }
 *
 * Each WalletTransaction:
 * {
 *   id, amount, txType, description, balanceAfter, referenceId, createdAt
 * }
 */
export async function GET(request: NextRequest) {
  /* ── Auth guard ───────────────────────────────────────────── */
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return apiError("UNAUTHENTICATED", "Please sign in to view your wallet.", 401, undefined, NO_STORE_HEADERS);
  }

  /* ── Pagination for transaction history ───────────────────── */
  const { searchParams } = new URL(request.url);
  const rawLimit  = parseInt(searchParams.get("limit")  ?? "20", 10);
  const rawOffset = parseInt(searchParams.get("offset") ?? "0",  10);
  const limit  = Math.min(Math.max(rawLimit, 1), 100);
  const offset = Math.max(rawOffset, 0);

  const pool = getPostgresPool();

  try {
    /*
     * Step 1: Fetch or lazily create the wallet for this user.
     * We use INSERT ... ON CONFLICT DO NOTHING + SELECT to ensure every
     * authenticated user has exactly one wallet row, created on first access.
     */
    await pool.query(
      `INSERT INTO eduquest_wallet (user_id, balance, total_earned, total_spent)
       VALUES ($1, 0, 0, 0)
       ON CONFLICT (user_id) DO NOTHING`,
      [user.id],
    );

    /*
     * Step 2: Fetch wallet summary + recent transactions in parallel.
     * COUNT(*) over the transactions table gives the total count for pagination.
     */
    const [walletResult, txResult, totalResult] = await Promise.all([
      pool.query(
        `SELECT
           id,
           balance,
           total_earned  AS "totalEarned",
           total_spent   AS "totalSpent",
           updated_at    AS "updatedAt"
         FROM eduquest_wallet
         WHERE user_id = $1`,
        [user.id],
      ),
      pool.query(
        `SELECT
           t.id,
           t.amount,
           t.tx_type         AS "txType",
           t.description,
           t.balance_after   AS "balanceAfter",
           t.reference_id    AS "referenceId",
           t.created_at      AS "createdAt"
         FROM eduquest_wallet_transactions t
         JOIN eduquest_wallet w ON w.id = t.wallet_id
         WHERE w.user_id = $1
         ORDER BY t.created_at DESC
         LIMIT  $2 OFFSET $3`,
        [user.id, limit, offset],
      ),
      pool.query(
        `SELECT COUNT(*)::INTEGER AS total
         FROM eduquest_wallet_transactions t
         JOIN eduquest_wallet w ON w.id = t.wallet_id
         WHERE w.user_id = $1`,
        [user.id],
      ),
    ]);

    const wallet       = walletResult.rows[0];
    const transactions = txResult.rows;
    const total        = totalResult.rows[0]?.total ?? 0;

    return apiSuccess(
      { wallet, transactions, total },
      { headers: NO_STORE_HEADERS },
    );
  } catch (err) {
    console.error("[GET /api/wallet] Database error:", err);
    return apiError("DB_ERROR", "Failed to fetch wallet data. Please try again.", 500);
  }
}
