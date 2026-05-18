/**
 * FILE: api-response.ts
 * LOCATION: src/lib/server/utils/api-response.ts
 * PURPOSE: Small response helpers that keep all backend route handlers returning
 *          the same JSON shape for success and error states.
 * USED BY: All src/app/api route handlers
 * DEPENDENCIES: next/server
 * LAST UPDATED: 2026-05-11
 */

import { NextResponse } from "next/server";

/** Standard success response shape for frontend API calls. */
export interface ApiSuccess<T> {
  ok: true;
  data: T;
  message?: string;
}

/** Standard error response shape for frontend API calls. */
export interface ApiFailure {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/** Prevents personalized or rapidly changing API payloads from being cached. */
export const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
} as const;

/** Creates a consistent JSON success response. */
export function apiSuccess<T>(
  data: T,
  init?: ResponseInit & { message?: string },
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    { ok: true, data, message: init?.message },
    { status: init?.status ?? 200, headers: init?.headers },
  );
}

/** Creates a consistent JSON error response. */
export function apiError(
  code: string,
  message: string,
  status = 400,
  details?: unknown,
  headers?: HeadersInit,
): NextResponse<ApiFailure> {
  return NextResponse.json(
    { ok: false, error: { code, message, details } },
    { status, headers },
  );
}

/**
 * Safely parses a JSON request body without throwing from the route handler.
 * Invalid JSON becomes null and is handled as a validation error.
 */
export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
