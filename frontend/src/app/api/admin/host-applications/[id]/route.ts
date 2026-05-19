/**
 * FILE: route.ts
 * LOCATION: src/app/api/admin/host-applications/[id]/route.ts
 * PURPOSE: Admin-only endpoint to update host application review status/notes.
 * LAST UPDATED: 2026-05-19
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { apiError, apiSuccess, NO_STORE_HEADERS, readJsonBody } from "@/lib/server/utils/api-response";
import { getHostApplicationDetail, updateHostApplicationStatus } from "@/lib/server/services/host-applications-service";
import type { HostApplicationStatus } from "@/types/host-applications";

export const runtime = "nodejs";

const ALLOWED_STATUSES = new Set<HostApplicationStatus>([
  "pending",
  "approved",
  "rejected",
  "needs_info",
]);

interface UpdatePayload {
  status?: HostApplicationStatus;
  reviewNotes?: string | null;
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError("UNAUTHENTICATED", "Please sign in to continue.", 401, undefined, NO_STORE_HEADERS);
  }

  if (user.role !== "admin") {
    return apiError("FORBIDDEN", "Admin access required.", 403, undefined, NO_STORE_HEADERS);
  }

  const { id } = await context.params;
  if (!id) {
    return apiError("MISSING_ID", "Application id is required.", 400, undefined, NO_STORE_HEADERS);
  }

  const rawBody = await readJsonBody(request);
  if (!rawBody || typeof rawBody !== "object") {
    return apiError("INVALID_BODY", "Request body must be valid JSON.", 400, undefined, NO_STORE_HEADERS);
  }

  const payload = rawBody as UpdatePayload;
  const status = payload.status;
  const reviewNotes =
    typeof payload.reviewNotes === "string" ? payload.reviewNotes.trim() : null;

  if (!status || !ALLOWED_STATUSES.has(status)) {
    return apiError("INVALID_STATUS", "A valid status is required.", 400, undefined, NO_STORE_HEADERS);
  }

  const updated = await updateHostApplicationStatus(id, status, reviewNotes, user.id);
  if (!updated) {
    return apiError("NOT_FOUND", "Host application not found.", 404, undefined, NO_STORE_HEADERS);
  }

  return apiSuccess({ application: updated }, { headers: NO_STORE_HEADERS });
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError("UNAUTHENTICATED", "Please sign in to continue.", 401, undefined, NO_STORE_HEADERS);
  }

  if (user.role !== "admin") {
    return apiError("FORBIDDEN", "Admin access required.", 403, undefined, NO_STORE_HEADERS);
  }

  const { id } = await context.params;
  if (!id) {
    return apiError("MISSING_ID", "Application id is required.", 400, undefined, NO_STORE_HEADERS);
  }

  const application = await getHostApplicationDetail(id);
  if (!application) {
    return apiError("NOT_FOUND", "Host application not found.", 404, undefined, NO_STORE_HEADERS);
  }

  return apiSuccess({ application }, { headers: NO_STORE_HEADERS });
}
