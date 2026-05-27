/**
 * FILE: audit.ts
 * LOCATION: backend/src/routes/audit.ts
 * PURPOSE: Admin API endpoints for viewing and querying audit logs.
 *          Provides paginated access, filtering, statistics, and export.
 *
 * ENDPOINTS:
 *  GET  /api/audit/logs       — Paginated audit log listing with filters
 *  GET  /api/audit/stats      — Audit statistics (by severity, category)
 *  GET  /api/audit/user/:id   — Audit trail for a specific user
 *  GET  /api/audit/resource/:type/:id — Audit trail for a resource
 *  POST /api/audit/export     — Export audit logs as CSV (admin only)
 *
 * SECURITY: All endpoints require admin authentication.
 * USED BY: Admin dashboard, compliance reporting
 * LAST UPDATED: 2026-05-26
 */

import { Router, Request, Response } from "express";
import { getAuditLogs, getAuditStats, AuditCategory, AuditSeverity } from "../services/audit.service";
import logger from "../utils/logger";

const router = Router();

/* ─────────────────────────────────────────────
 * GET /api/audit/logs
 * Paginated audit log listing with optional filters.
 * Supports filtering by category, severity, user, action, and date range.
 * ───────────────────────────────────────────── */
router.get("/logs", async (req: Request, res: Response) => {
  try {
    const filters = {
      category: req.query.category as AuditCategory | undefined,
      severity: req.query.severity as AuditSeverity | undefined,
      userId: req.query.userId ? String(req.query.userId) : undefined,
      action: req.query.action ? String(req.query.action) : undefined,
      startDate: req.query.startDate ? String(req.query.startDate) : undefined,
      endDate: req.query.endDate ? String(req.query.endDate) : undefined,
      page: req.query.page ? parseInt(String(req.query.page), 10) : 1,
      limit: req.query.limit ? parseInt(String(req.query.limit), 10) : 25,
    };

    const result = await getAuditLogs(filters);
    res.json({ ok: true, ...result });
  } catch (error) {
    logger.error("[Audit API] Failed to fetch audit logs", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    res.status(500).json({ ok: false, error: "Failed to retrieve audit logs" });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/audit/stats
 * Audit statistics for the admin dashboard.
 * ───────────────────────────────────────────── */
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const days = req.query.days ? parseInt(String(req.query.days), 10) : 7;
    const stats = await getAuditStats(days);
    res.json({ ok: true, ...stats });
  } catch (error) {
    logger.error("[Audit API] Failed to fetch audit stats", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    res.status(500).json({ ok: false, error: "Failed to retrieve audit statistics" });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/audit/user/:userId
 * Audit trail for a specific user.
 * Shows all actions performed by that user.
 * ───────────────────────────────────────────── */
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;

    const result = await getAuditLogs({ userId, page, limit: 50 });
    res.json({ ok: true, ...result });
  } catch (error) {
    logger.error("[Audit API] Failed to fetch user audit trail", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    res.status(500).json({ ok: false, error: "Failed to retrieve user audit trail" });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/audit/resource/:type/:id
 * Audit trail for a specific resource.
 * Shows all modifications to that resource.
 * ───────────────────────────────────────────── */
router.get("/resource/:type/:id", async (req: Request, res: Response) => {
  try {
    const resourceType = String(req.params.type);
    const resourceId = String(req.params.id);

    /* Custom query for resource-specific audit trail */
    const { pool } = require("../config/database");
    const result = await pool.query(
      `SELECT id, category, action, description, user_id, severity, metadata, created_at
       FROM audit_logs
       WHERE resource_type = $1 AND resource_id = $2
       ORDER BY created_at DESC
       LIMIT 100`,
      [resourceType, resourceId]
    );

    res.json({
      ok: true,
      resourceType,
      resourceId,
      logs: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    logger.error("[Audit API] Failed to fetch resource audit trail", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    res.status(500).json({ ok: false, error: "Failed to retrieve resource audit trail" });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/audit/export
 * Exports audit logs as CSV format.
 * Admin-only endpoint for compliance reporting.
 * ───────────────────────────────────────────── */
router.post("/export", async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, category } = req.body;

    const result = await getAuditLogs({
      startDate,
      endDate,
      category,
      page: 1,
      limit: 10000, // Max export size
    });

    /* Generate CSV */
    const headers = ["ID", "Category", "Action", "Description", "User ID", "IP Address", "Severity", "Created At"];
    const csvRows = [headers.join(",")];

    for (const log of result.logs) {
      csvRows.push([
        log.id,
        log.category,
        log.action,
        `"${String(log.description).replace(/"/g, '""')}"`,
        log.user_id ?? "",
        log.ip_address ?? "",
        log.severity,
        log.created_at,
      ].join(","));
    }

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=audit-export-${Date.now()}.csv`);
    res.send(csvRows.join("\n"));
  } catch (error) {
    logger.error("[Audit API] Export failed", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    res.status(500).json({ ok: false, error: "Export failed" });
  }
});

export default router;
