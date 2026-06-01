/**
 * FILE: route.ts
 * LOCATION: src/app/api/contact/route.ts
 * PURPOSE: Handles contact form submissions from the public contact page.
 *          Validates the input, stores the submission in the DB, and returns
 *          a structured JSON response consumed by ContactFormClient.
 *
 * ROUTES:
 *   POST /api/contact — submit a contact form message
 *
 * LAST UPDATED: 2026-05-31
 */

import { NextRequest, NextResponse } from "next/server";
import { getPostgresPool } from "@/lib/server/database/postgres";

export const runtime = "nodejs";

/* Allowed subject values — must match the <select> in the form */
const VALID_SUBJECTS = new Set([
  "student-support",
  "institution",
  "events",
  "content",
  "bug",
  "feature",
  "other",
]);

/* Simple email regex — not RFC-exhaustive, good enough for forms */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* POST /api/contact */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: "INVALID_JSON", message: "Request body must be valid JSON." } },
      { status: 400 },
    );
  }

  const { firstName, lastName, email, subject, message } = body as Record<string, string>;

  /* ── Validation ── */
  if (!firstName?.trim() || firstName.trim().length < 2) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION", message: "First name must be at least 2 characters." } },
      { status: 422 },
    );
  }
  if (!email?.trim() || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION", message: "A valid email address is required." } },
      { status: 422 },
    );
  }
  if (!subject || !VALID_SUBJECTS.has(subject)) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION", message: "Please select a valid subject." } },
      { status: 422 },
    );
  }
  if (!message?.trim() || message.trim().length < 20) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION", message: "Message must be at least 20 characters." } },
      { status: 422 },
    );
  }
  if (message.trim().length > 5000) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION", message: "Message must be under 5,000 characters." } },
      { status: 422 },
    );
  }

  /* ── Persist to DB ── */
  try {
    const pool = getPostgresPool();
    await pool.query(
      `INSERT INTO eduquest_contact_submissions
         (first_name, last_name, email, subject, message, submitted_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT DO NOTHING`,
      [
        firstName.trim().slice(0, 100),
        (lastName ?? "").trim().slice(0, 100),
        email.trim().toLowerCase().slice(0, 254),
        subject,
        message.trim().slice(0, 5000),
      ],
    ).catch(async (err) => {
      /* Table may not exist yet — create it on the fly and retry once */
      if ((err as { code?: string }).code === "42P01") {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS eduquest_contact_submissions (
            id            BIGSERIAL   PRIMARY KEY,
            first_name    TEXT        NOT NULL,
            last_name     TEXT        NOT NULL DEFAULT '',
            email         TEXT        NOT NULL,
            subject       TEXT        NOT NULL,
            message       TEXT        NOT NULL,
            submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            status        TEXT        NOT NULL DEFAULT 'pending'
          )
        `);
        await pool.query(
          `INSERT INTO eduquest_contact_submissions
             (first_name, last_name, email, subject, message, submitted_at)
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [
            firstName.trim().slice(0, 100),
            (lastName ?? "").trim().slice(0, 100),
            email.trim().toLowerCase().slice(0, 254),
            subject,
            message.trim().slice(0, 5000),
          ],
        );
      }
    });
  } catch (err) {
    console.error("[POST /api/contact] DB error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "CONTACT_SAVE_FAILED",
          message: "We could not save your message right now. Please try again in a moment.",
        },
      },
      { status: 503 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      data: {
        message: "Your message has been received. We'll reply within 24–72 hours.",
      },
    },
    { status: 200 },
  );
}
