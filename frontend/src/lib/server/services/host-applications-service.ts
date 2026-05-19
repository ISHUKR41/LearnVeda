/**
 * FILE: host-applications-service.ts
 * LOCATION: src/lib/server/services/host-applications-service.ts
 * PURPOSE: Server-side access layer for institution event-hosting applications.
 *          Provides list, detail, and status update queries for admin workflows.
 * LAST UPDATED: 2026-05-19
 */

import { queryPostgres } from "@/lib/server/database/postgres";
import type {
  HostApplicationDetail,
  HostApplicationStatus,
  HostApplicationsOverview,
  HostApplicationSummary,
} from "@/types/host-applications";

interface HostApplicationRow {
  id: string;
  referenceNumber: string;
  institutionName: string;
  institutionType: string;
  city: string;
  state: string;
  website: string | null;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string | null;
  organizerRole: string | null;
  eventName: string;
  eventType: string;
  eventDate: string;
  expectedParticipants: number;
  targetAudience: string | null;
  eventDescription: string | null;
  needsSafeBrowser: boolean;
  needsCertificates: boolean;
  needsLeaderboard: boolean;
  needsPrizeIntegration: boolean;
  status: HostApplicationStatus;
  reviewNotes: string | null;
  submittedByUserId: string | null;
  reviewedByUserId: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

interface HostApplicationCountRow {
  status: HostApplicationStatus;
  count: number;
}

const BASE_SELECT = `
  SELECT
    id,
    reference_number          AS "referenceNumber",
    institution_name          AS "institutionName",
    institution_type          AS "institutionType",
    city,
    state,
    website,
    organizer_name            AS "organizerName",
    organizer_email           AS "organizerEmail",
    organizer_phone           AS "organizerPhone",
    organizer_role            AS "organizerRole",
    event_name                AS "eventName",
    event_type                AS "eventType",
    event_date                AS "eventDate",
    expected_participants     AS "expectedParticipants",
    target_audience           AS "targetAudience",
    event_description         AS "eventDescription",
    needs_safe_browser        AS "needsSafeBrowser",
    needs_certificates        AS "needsCertificates",
    needs_leaderboard         AS "needsLeaderboard",
    needs_prize_integration   AS "needsPrizeIntegration",
    status,
    review_notes              AS "reviewNotes",
    submitted_by_user_id      AS "submittedByUserId",
    reviewed_by_user_id       AS "reviewedByUserId",
    created_at                AS "createdAt",
    reviewed_at               AS "reviewedAt"
  FROM eduquest_host_applications
`;

/** Returns the latest host applications with optional status filtering. */
export async function listHostApplications(
  status: HostApplicationStatus | "all",
  limit = 50,
): Promise<HostApplicationsOverview> {
  const params: Array<string | number> = [];
  const whereClauses: string[] = [];

  if (status !== "all") {
    params.push(status);
    whereClauses.push(`status = $${params.length}`);
  }

  params.push(limit);
  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const listQuery = `
    ${BASE_SELECT}
    ${whereSql}
    ORDER BY created_at DESC
    LIMIT $${params.length}
  `;

  const listResult = await queryPostgres<HostApplicationRow>(listQuery, params);

  const totalsResult = await queryPostgres<HostApplicationCountRow>(
    `SELECT status, COUNT(*)::int AS count
     FROM eduquest_host_applications
     GROUP BY status`,
  );

  const totals = totalsResult.rows.reduce<HostApplicationsOverview["totals"]>(
    (acc, row) => {
      if (row.status === "pending") acc.pending = row.count;
      if (row.status === "approved") acc.approved = row.count;
      if (row.status === "rejected") acc.rejected = row.count;
      if (row.status === "needs_info") acc.needsInfo = row.count;
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0, needsInfo: 0 },
  );

  const applications: HostApplicationSummary[] = listResult.rows.map((row) => ({
    id: row.id,
    referenceNumber: row.referenceNumber,
    institutionName: row.institutionName,
    institutionType: row.institutionType,
    city: row.city,
    state: row.state,
    organizerName: row.organizerName,
    organizerEmail: row.organizerEmail,
    eventName: row.eventName,
    eventType: row.eventType,
    eventDate: row.eventDate,
    expectedParticipants: row.expectedParticipants,
    status: row.status,
    createdAt: row.createdAt,
    reviewedAt: row.reviewedAt,
  }));

  return { applications, totals };
}

/** Loads full details for one host application. */
export async function getHostApplicationDetail(id: string): Promise<HostApplicationDetail | null> {
  const result = await queryPostgres<HostApplicationRow>(
    `${BASE_SELECT} WHERE id = $1`,
    [id],
  );

  const row = result.rows[0];
  if (!row) return null;

  return {
    id: row.id,
    referenceNumber: row.referenceNumber,
    institutionName: row.institutionName,
    institutionType: row.institutionType,
    city: row.city,
    state: row.state,
    organizerName: row.organizerName,
    organizerEmail: row.organizerEmail,
    eventName: row.eventName,
    eventType: row.eventType,
    eventDate: row.eventDate,
    expectedParticipants: row.expectedParticipants,
    status: row.status,
    createdAt: row.createdAt,
    reviewedAt: row.reviewedAt,
    website: row.website,
    organizerPhone: row.organizerPhone,
    organizerRole: row.organizerRole,
    targetAudience: row.targetAudience,
    eventDescription: row.eventDescription,
    needsSafeBrowser: row.needsSafeBrowser,
    needsCertificates: row.needsCertificates,
    needsLeaderboard: row.needsLeaderboard,
    needsPrizeIntegration: row.needsPrizeIntegration,
    reviewNotes: row.reviewNotes,
    submittedByUserId: row.submittedByUserId,
    reviewedByUserId: row.reviewedByUserId,
  };
}

/** Updates the review status and notes for one application. */
export async function updateHostApplicationStatus(
  id: string,
  status: HostApplicationStatus,
  reviewNotes: string | null,
  reviewerId: string,
): Promise<HostApplicationDetail | null> {
  const result = await queryPostgres<HostApplicationRow>(
    `
      UPDATE eduquest_host_applications
      SET status = $2,
          review_notes = $3,
          reviewed_by_user_id = $4,
          reviewed_at = NOW(),
          updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        reference_number          AS "referenceNumber",
        institution_name          AS "institutionName",
        institution_type          AS "institutionType",
        city,
        state,
        website,
        organizer_name            AS "organizerName",
        organizer_email           AS "organizerEmail",
        organizer_phone           AS "organizerPhone",
        organizer_role            AS "organizerRole",
        event_name                AS "eventName",
        event_type                AS "eventType",
        event_date                AS "eventDate",
        expected_participants     AS "expectedParticipants",
        target_audience           AS "targetAudience",
        event_description         AS "eventDescription",
        needs_safe_browser        AS "needsSafeBrowser",
        needs_certificates        AS "needsCertificates",
        needs_leaderboard         AS "needsLeaderboard",
        needs_prize_integration   AS "needsPrizeIntegration",
        status,
        review_notes              AS "reviewNotes",
        submitted_by_user_id      AS "submittedByUserId",
        reviewed_by_user_id       AS "reviewedByUserId",
        created_at                AS "createdAt",
        reviewed_at               AS "reviewedAt"
    `,
    [id, status, reviewNotes, reviewerId],
  );

  const row = result.rows[0];
  if (!row) return null;

  return {
    id: row.id,
    referenceNumber: row.referenceNumber,
    institutionName: row.institutionName,
    institutionType: row.institutionType,
    city: row.city,
    state: row.state,
    organizerName: row.organizerName,
    organizerEmail: row.organizerEmail,
    eventName: row.eventName,
    eventType: row.eventType,
    eventDate: row.eventDate,
    expectedParticipants: row.expectedParticipants,
    status: row.status,
    createdAt: row.createdAt,
    reviewedAt: row.reviewedAt,
    website: row.website,
    organizerPhone: row.organizerPhone,
    organizerRole: row.organizerRole,
    targetAudience: row.targetAudience,
    eventDescription: row.eventDescription,
    needsSafeBrowser: row.needsSafeBrowser,
    needsCertificates: row.needsCertificates,
    needsLeaderboard: row.needsLeaderboard,
    needsPrizeIntegration: row.needsPrizeIntegration,
    reviewNotes: row.reviewNotes,
    submittedByUserId: row.submittedByUserId,
    reviewedByUserId: row.reviewedByUserId,
  };
}
