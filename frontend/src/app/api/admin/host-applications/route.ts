/**
 * FILE: route.ts
 * LOCATION: src/app/api/admin/host-applications/route.ts
 * PURPOSE: Admin-only endpoint that returns host applications for review.
 * LAST UPDATED: 2026-05-19
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { apiError, apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";
import { listHostApplications } from "@/lib/server/services/host-applications-service";
import type { HostApplicationStatus } from "@/types/host-applications";

export const runtime = "nodejs";

const STATUS_FILTERS: Array<HostApplicationStatus | "all"> = [
  "all",
  "pending",
  "approved",
  "rejected",
  "needs_info",
];

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError("UNAUTHENTICATED", "Please sign in to continue.", 401, undefined, NO_STORE_HEADERS);
  }

  if (user.role !== "admin") {
    return apiError("FORBIDDEN", "Admin access required.", 403, undefined, NO_STORE_HEADERS);
  }

  const statusParam = request.nextUrl.searchParams.get("status") ?? "all";
  const status = STATUS_FILTERS.includes(statusParam as HostApplicationStatus | "all")
    ? (statusParam as HostApplicationStatus | "all")
    : "all";

  const limitParam = Number.parseInt(request.nextUrl.searchParams.get("limit") ?? "50", 10);
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 10), 200) : 50;

  const overview = await listHostApplications(status, limit);
  return apiSuccess(overview, { headers: NO_STORE_HEADERS });
}
