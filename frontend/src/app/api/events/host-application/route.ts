/**
 * FILE: route.ts
 * LOCATION: src/app/api/events/host-application/route.ts
 * PURPOSE: API endpoint for college/institution event hosting applications.
 *          Accepts POST requests from the /events/host form and stores the
 *          application in the database for the VidyaBolt team to review.
 *          Every accepted application is written to the dedicated
 *          eduquest_host_applications table and mirrored into audit logs for
 *          operational traceability. An acknowledgement email would be
 *          triggered here in production after a mail service integration.
 * USED BY: src/app/events/host/page.tsx — called on form submission
 * DEPENDENCIES: postgres pool, auth helpers, api-response utilities
 * LAST UPDATED: 2026-05-18
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { withPostgresTransaction } from "@/lib/server/database/postgres";
import { apiError, apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/* ─────────────────────────────────────────────
 * Input Validation
 * ───────────────────────────────────────────── */

interface ValidatedHostApplication {
  institutionName: string;
  institutionType: "college" | "school" | "coaching" | "corporate" | "other";
  city: string;
  state: string;
  website: string | null;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string | null;
  organizerRole: string | null;
  eventName: string;
  eventType: "coding" | "quiz" | "hackathon" | "olympiad" | "other";
  eventDate: string;
  expectedParticipants: number;
  targetAudience: string | null;
  eventDescription: string | null;
  needsSafeBrowser: boolean;
  needsCertificates: boolean;
  needsLeaderboard: boolean;
  needsPrizeIntegration: boolean;
}

interface HostApplicationInsertRow {
  id: string;
}

const INSTITUTION_TYPES = new Set(["college", "school", "coaching", "corporate", "other"]);
const EVENT_TYPES = new Set(["coding", "quiz", "hackathon", "olympiad", "other"]);

/** Converts unknown form values into trimmed strings without leaking `undefined`. */
function readString(body: Record<string, unknown>, field: string): string {
  const value = body[field];
  return typeof value === "string" ? value.trim() : "";
}

/** Converts optional text inputs into either a clean string or null for SQL. */
function readOptionalString(body: Record<string, unknown>, field: string): string | null {
  const value = readString(body, field);
  return value.length > 0 ? value : null;
}

/** Normalises checkbox-style values so the API remains stable across clients. */
function readBoolean(body: Record<string, unknown>, field: string, fallback: boolean): boolean {
  const value = body[field];
  return typeof value === "boolean" ? value : fallback;
}

/** Generates a readable reference number that support/admin teams can search. */
function createReferenceNumber(): string {
  return `EQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

/**
 * Validates the required fields of a host application submission.
 * Returns parsed data on success, or an error message when validation fails.
 *
 * @param body - The parsed JSON body from the request
 * @returns Parsed application data or an error string
 */
function validateHostApplication(body: Record<string, unknown>): { data: ValidatedHostApplication; error: null } | { data: null; error: string } {
  const required = [
    "institutionName",
    "institutionType",
    "city",
    "state",
    "organizerName",
    "organizerEmail",
    "eventName",
    "eventType",
    "eventDate",
    "expectedParticipants",
  ];

  for (const field of required) {
    if (!readString(body, field)) {
      return { data: null, error: `Missing required field: ${field}` };
    }
  }

  const institutionType = readString(body, "institutionType");
  if (!INSTITUTION_TYPES.has(institutionType)) {
    return { data: null, error: "Invalid institution type." };
  }

  const eventType = readString(body, "eventType");
  if (!EVENT_TYPES.has(eventType)) {
    return { data: null, error: "Invalid event type." };
  }

  /* Basic email format validation */
  const organizerEmail = readString(body, "organizerEmail").toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(organizerEmail)) {
    return { data: null, error: "Invalid email address format" };
  }

  const eventDate = readString(body, "eventDate");
  if (Number.isNaN(Date.parse(eventDate))) {
    return { data: null, error: "Invalid event date." };
  }

  const expectedParticipants = Number.parseInt(readString(body, "expectedParticipants"), 10);
  if (!Number.isFinite(expectedParticipants) || expectedParticipants <= 0) {
    return { data: null, error: "Expected participants must be a positive number." };
  }

  /* Must agree to terms */
  if (!body.agreeToTerms) {
    return { data: null, error: "You must agree to the terms to submit an application" };
  }

  return {
    data: {
      institutionName: readString(body, "institutionName"),
      institutionType: institutionType as ValidatedHostApplication["institutionType"],
      city: readString(body, "city"),
      state: readString(body, "state"),
      website: readOptionalString(body, "website"),
      organizerName: readString(body, "organizerName"),
      organizerEmail,
      organizerPhone: readOptionalString(body, "organizerPhone"),
      organizerRole: readOptionalString(body, "organizerRole"),
      eventName: readString(body, "eventName"),
      eventType: eventType as ValidatedHostApplication["eventType"],
      eventDate,
      expectedParticipants,
      targetAudience: readOptionalString(body, "targetAudience"),
      eventDescription: readOptionalString(body, "eventDescription"),
      needsSafeBrowser: readBoolean(body, "needsSafeBrowser", true),
      needsCertificates: readBoolean(body, "needsCertificates", true),
      needsLeaderboard: readBoolean(body, "needsLeaderboard", true),
      needsPrizeIntegration: readBoolean(body, "needsPrizeIntegration", false),
    },
    error: null,
  };
}

/* ─────────────────────────────────────────────
 * POST Handler
 * ───────────────────────────────────────────── */

/**
 * POST /api/events/host-application
 *
 * Accepts a hosting application from an institution or organiser.
 * Stores it in eduquest_host_applications and writes a matching audit event.
 * Returns a success confirmation.
 *
 * Body: HostEventFormData (see src/app/events/host/page.tsx)
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  /* Parse the JSON body from the form */
  try {
    body = await request.json();
  } catch {
    return apiError(
      "INVALID_BODY",
      "Request body must be valid JSON.",
      400,
      undefined,
      NO_STORE_HEADERS,
    );
  }

  /* Validate required fields */
  const validation = validateHostApplication(body);
  if (validation.error) {
    return apiError(
      "VALIDATION_FAILED",
      validation.error,
      400,
      undefined,
      NO_STORE_HEADERS,
    );
  }

  const application = validation.data;
  if (!application) {
    return apiError(
      "VALIDATION_FAILED",
      "Host application data could not be validated.",
      400,
      undefined,
      NO_STORE_HEADERS,
    );
  }

  /* Check if there is a logged-in user (optional — applications can be anonymous) */
  const user = await getAuthenticatedUser(request);

  try {
    const referenceNumber = createReferenceNumber();
    const ipAddress = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
    const userAgent = request.headers.get("user-agent") ?? "unknown";

    /*
     * Store the structured application and audit event together.
     * This keeps admin review data queryable while preserving an immutable
     * operational trail for support and compliance review.
     */
    const applicationId = await withPostgresTransaction(async (client) => {
      const insertResult = await client.query<HostApplicationInsertRow>(
        `INSERT INTO eduquest_host_applications (
           reference_number,
           institution_name, institution_type, city, state, website,
           organizer_name, organizer_email, organizer_phone, organizer_role,
           event_name, event_type, event_date, expected_participants,
           target_audience, event_description,
           needs_safe_browser, needs_certificates, needs_leaderboard, needs_prize_integration,
           submitted_by_user_id, ip_address, user_agent
         )
         VALUES (
           $1,
           $2, $3, $4, $5, $6,
           $7, $8, $9, $10,
           $11, $12, $13::date, $14,
           $15, $16,
           $17, $18, $19, $20,
           $21, $22, $23
         )
         RETURNING id`,
        [
          referenceNumber,
          application.institutionName,
          application.institutionType,
          application.city,
          application.state,
          application.website,
          application.organizerName,
          application.organizerEmail,
          application.organizerPhone,
          application.organizerRole,
          application.eventName,
          application.eventType,
          application.eventDate,
          application.expectedParticipants,
          application.targetAudience,
          application.eventDescription,
          application.needsSafeBrowser,
          application.needsCertificates,
          application.needsLeaderboard,
          application.needsPrizeIntegration,
          user?.id ?? null,
          ipAddress,
          userAgent,
        ],
      );

      const createdApplicationId = insertResult.rows[0].id;

      await client.query(
        `INSERT INTO eduquest_audit_logs
           (actor_id, actor_type, action, target_type, target_id, severity, metadata)
         VALUES
           ($1, $2, $3, $4, $5, $6, $7::jsonb)`,
        [
          user?.id ?? null,                    /* actor_id — null if anonymous */
          user ? "student" : "anonymous",      /* actor_type — matches audit schema */
          "host_application_submitted",        /* action — filterable by admins */
          "host_application",                  /* target_type */
          createdApplicationId,                /* target_id — links audit to review row */
          "info",                              /* severity — application intake is informational */
          JSON.stringify({
            referenceNumber,
            organizerEmail: application.organizerEmail,
            eventName: application.eventName,
            institutionName: application.institutionName,
            submittedAt: new Date().toISOString(),
            submitterUserId: user?.id ?? null,
            ipAddress,
            userAgent,
          }),
        ],
      );

      return createdApplicationId;
    });

    /*
     * In production, trigger an automated acknowledgement email here:
     * await sendEmail({
     *   to: body.organizerEmail as string,
     *   subject: "VidyaBolt Host Application Received",
     *   template: "host-application-received",
     *   data: { organizerName: body.organizerName, eventName: body.eventName },
     * });
     */

    return apiSuccess(
      {
        message: "Host application submitted successfully",
        referenceNumber,
        applicationId,
        nextSteps: [
          "Our team will review your application within 48 working hours",
          "You will receive a confirmation email at the address you provided",
          "If approved, we will schedule a 15-minute onboarding call",
        ],
      },
      { headers: NO_STORE_HEADERS },
    );

  } catch (error) {
    /* Log the error server-side without leaking details to the client */
    console.error("[host-application] Database error:", error);

    return apiError(
      "INTERNAL_ERROR",
      "Failed to submit your application. Please try again or contact us directly.",
      500,
      undefined,
      NO_STORE_HEADERS,
    );
  }
}

/**
 * GET /api/events/host-application
 * Returns a helpful 405 with documentation about this endpoint.
 */
export async function GET() {
  return apiError(
    "METHOD_NOT_ALLOWED",
    "POST to this endpoint to submit a host application. See /events/host for the form.",
    405,
    undefined,
    { ...NO_STORE_HEADERS, Allow: "POST" },
  );
}
