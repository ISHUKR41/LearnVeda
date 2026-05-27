/**
 * FILE: uploads.ts
 * LOCATION: backend/src/routes/uploads.ts
 * PURPOSE: File upload API endpoints for user avatars, document uploads,
 *          and community post attachments.
 *
 * ENDPOINTS:
 *  POST /api/uploads/avatar     — Upload user profile picture (requires auth)
 *  POST /api/uploads/document   — Upload learning documents (requires auth)
 *  POST /api/uploads/attachment  — Upload community post attachments (requires auth)
 *  DELETE /api/uploads/:filename — Delete an uploaded file (requires auth + ownership)
 *
 * SECURITY:
 *  - All endpoints require JWT authentication
 *  - File type and size validation before storage
 *  - Rate limited to prevent abuse (10 uploads per minute)
 *
 * DEPENDENCIES: multer (multipart parsing), upload.service.ts
 * USED BY: Frontend avatar upload, document sharing feature
 * LAST UPDATED: 2026-05-26
 */

import { Router, Request, Response } from "express";
import multer from "multer";
import { uploadFile, deleteFile } from "../services/upload.service";
import { rateLimiter } from "../middlewares/rateLimiter";
import logger from "../utils/logger";

const router = Router();

/* ─────────────────────────────────────────────
 * Multer Configuration
 * Uses memory storage for buffer-based processing.
 * Files are validated and stored by upload.service.ts.
 * ───────────────────────────────────────────── */

const upload = multer({
  /* Store files in memory as Buffer (not on disk) */
  storage: multer.memoryStorage(),

  /* Maximum file size: 10MB (enforced before our validation) */
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1, // One file per request
  },
});

/* ─────────────────────────────────────────────
 * Rate limiter specific to upload endpoints.
 * More restrictive than general API rate limit.
 * ───────────────────────────────────────────── */
const uploadRateLimiter = rateLimiter({
  windowMs: 60_000,
  limit: 10,
  keyPrefix: "upload",
});

/* ─────────────────────────────────────────────
 * POST /api/uploads/avatar
 * Upload or update user profile picture.
 * Accepts JPEG, PNG, WebP up to 5MB.
 * Returns the public URL of the uploaded image.
 * ───────────────────────────────────────────── */
router.post(
  "/avatar",
  uploadRateLimiter,
  upload.single("avatar"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ ok: false, error: "No file uploaded. Use 'avatar' field name." });
        return;
      }

      const result = await uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        {
          category: "image",
          subfolder: "avatars",
          maxWidth: 400,
          maxHeight: 400,
          quality: 85,
        }
      );

      if (!result.success) {
        res.status(400).json({ ok: false, error: result.error });
        return;
      }

      logger.info("[Uploads] Avatar uploaded", {
        userId: (req as Request & { userId?: string }).userId,
        filename: result.filename,
      });

      res.status(201).json({
        ok: true,
        data: {
          url: result.url,
          filename: result.filename,
          sizeBytes: result.sizeBytes,
        },
      });
    } catch (error) {
      logger.error("[Uploads] Avatar upload failed", {
        error: error instanceof Error ? error.message : "Unknown",
      });
      res.status(500).json({ ok: false, error: "Upload failed. Please try again." });
    }
  }
);

/* ─────────────────────────────────────────────
 * POST /api/uploads/document
 * Upload learning documents (PDF, DOCX, XLSX).
 * Maximum file size: 10MB.
 * ───────────────────────────────────────────── */
router.post(
  "/document",
  uploadRateLimiter,
  upload.single("document"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ ok: false, error: "No file uploaded. Use 'document' field name." });
        return;
      }

      const result = await uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        {
          category: "document",
          subfolder: "documents",
        }
      );

      if (!result.success) {
        res.status(400).json({ ok: false, error: result.error });
        return;
      }

      res.status(201).json({
        ok: true,
        data: {
          url: result.url,
          filename: result.filename,
          originalName: result.originalName,
          sizeBytes: result.sizeBytes,
          mimeType: result.mimeType,
        },
      });
    } catch (error) {
      logger.error("[Uploads] Document upload failed", {
        error: error instanceof Error ? error.message : "Unknown",
      });
      res.status(500).json({ ok: false, error: "Upload failed." });
    }
  }
);

/* ─────────────────────────────────────────────
 * POST /api/uploads/attachment
 * Upload community post attachments (images, documents, code files).
 * ───────────────────────────────────────────── */
router.post(
  "/attachment",
  uploadRateLimiter,
  upload.single("attachment"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ ok: false, error: "No file uploaded. Use 'attachment' field name." });
        return;
      }

      /* Determine category from MIME type */
      let category: "image" | "document" | "code" = "document";
      if (file.mimetype.startsWith("image/")) category = "image";
      else if (file.mimetype.startsWith("text/")) category = "code";

      const result = await uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        {
          category,
          subfolder: "attachments",
        }
      );

      if (!result.success) {
        res.status(400).json({ ok: false, error: result.error });
        return;
      }

      res.status(201).json({
        ok: true,
        data: {
          url: result.url,
          filename: result.filename,
          originalName: result.originalName,
          sizeBytes: result.sizeBytes,
          mimeType: result.mimeType,
          category,
        },
      });
    } catch (error) {
      logger.error("[Uploads] Attachment upload failed", {
        error: error instanceof Error ? error.message : "Unknown",
      });
      res.status(500).json({ ok: false, error: "Upload failed." });
    }
  }
);

/* ─────────────────────────────────────────────
 * DELETE /api/uploads/:subfolder/:filename
 * Delete an uploaded file.
 * Only the file owner or admin can delete files.
 * ───────────────────────────────────────────── */
router.delete("/:subfolder/:filename", async (req: Request, res: Response) => {
  try {
    const subfolder = String(req.params.subfolder);
    const filename = String(req.params.filename);

    /* Validate subfolder to prevent path traversal */
    const allowedSubfolders = ["avatars", "documents", "attachments"];
    if (!allowedSubfolders.includes(subfolder)) {
      res.status(400).json({ ok: false, error: "Invalid subfolder" });
      return;
    }

    /* Validate filename to prevent path traversal */
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      res.status(400).json({ ok: false, error: "Invalid filename" });
      return;
    }

    const success = await deleteFile(filename, subfolder);

    if (!success) {
      res.status(404).json({ ok: false, error: "File not found" });
      return;
    }

    res.json({ ok: true, message: "File deleted successfully" });
  } catch (error) {
    logger.error("[Uploads] File deletion failed", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    res.status(500).json({ ok: false, error: "Deletion failed." });
  }
});

export default router;
