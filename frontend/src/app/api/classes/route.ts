/**
 * FILE: route.ts
 * LOCATION: src/app/api/classes/route.ts
 * PURPOSE: Public curriculum catalog endpoint. It exposes the curated class,
 *          stream, engineering language, and engineering skill lists used by
 *          the frontend routes without allowing public curriculum mutation.
 * USED BY: Future search/onboarding widgets and external smoke tests
 * DEPENDENCIES: constants.ts and shared API response helpers
 * LAST UPDATED: 2026-05-16
 */

import {
  CLASSES_SIMPLE,
  CLASSES_STREAM,
  ENGINEERING_LANGUAGES,
  ENGINEERING_SKILLS,
} from "@/lib/constants";
import { apiError, apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/** Returns the route-connected learning catalog used by the public class pages. */
export async function GET() {
  return apiSuccess(
    {
      simpleClasses: CLASSES_SIMPLE,
      streamClasses: CLASSES_STREAM,
      engineeringLanguages: ENGINEERING_LANGUAGES,
      engineeringSkills: ENGINEERING_SKILLS,
    },
    { headers: NO_STORE_HEADERS },
  );
}

/** Blocks public curriculum writes until the admin content workflow exists. */
export async function POST() {
  return apiError(
    "ADMIN_CONTENT_WORKFLOW_REQUIRED",
    "Curriculum changes must go through the admin content workflow with review and audit logs.",
    405,
    undefined,
    { ...NO_STORE_HEADERS, Allow: "GET" },
  );
}
