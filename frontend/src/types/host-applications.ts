/**
 * FILE: host-applications.ts
 * LOCATION: src/types/host-applications.ts
 * PURPOSE: Shared types for institution event-hosting applications.
 *          Used by admin APIs, server services, and admin UI screens.
 * LAST UPDATED: 2026-05-19
 */

export type HostApplicationStatus = "pending" | "approved" | "rejected" | "needs_info";

/** Compact list view used by the admin review table. */
export interface HostApplicationSummary {
  id: string;
  referenceNumber: string;
  institutionName: string;
  institutionType: string;
  city: string;
  state: string;
  organizerName: string;
  organizerEmail: string;
  eventName: string;
  eventType: string;
  eventDate: string;
  expectedParticipants: number;
  status: HostApplicationStatus;
  createdAt: string;
  reviewedAt: string | null;
}

/** Full application detail used by the admin detail panel. */
export interface HostApplicationDetail extends HostApplicationSummary {
  website: string | null;
  organizerPhone: string | null;
  organizerRole: string | null;
  targetAudience: string | null;
  eventDescription: string | null;
  needsSafeBrowser: boolean;
  needsCertificates: boolean;
  needsLeaderboard: boolean;
  needsPrizeIntegration: boolean;
  reviewNotes: string | null;
  submittedByUserId: string | null;
  reviewedByUserId: string | null;
}

export interface HostApplicationsOverview {
  applications: HostApplicationSummary[];
  totals: {
    pending: number;
    approved: number;
    rejected: number;
    needsInfo: number;
  };
}
