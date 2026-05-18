/**
 * FILE: session.ts
 * LOCATION: src/lib/server/auth/session.ts
 * PURPOSE: Signed httpOnly cookie session helpers. The token is intentionally
 *          simple for the MVP, but the API mirrors what a production JWT or
 *          Auth.js adapter would provide later.
 * USED BY: Auth API routes, dashboard API route, current-user helper
 * DEPENDENCIES: node:crypto, next/server, server env helper
 * LAST UPDATED: 2026-05-11
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import { getSessionSecret } from "@/lib/server/env";
import type { PublicUser, SessionPayload } from "@/types/auth";

export const SESSION_COOKIE_NAME = "eduquest_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

/** Allows local production smoke tests over HTTP while keeping deploys secure by default. */
function shouldUseSecureCookie(): boolean {
  if (process.env.EDUQUEST_COOKIE_SECURE === "false") {
    return false;
  }

  return process.env.NODE_ENV === "production";
}

/** Converts text into a URL-safe base64 string. */
function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

/** Converts a URL-safe base64 string back into plain text. */
function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

/** Signs the token body with HMAC SHA-256 using the backend session secret. */
function signTokenBody(body: string): string {
  return createHmac("sha256", getSessionSecret()).update(body).digest("base64url");
}

/** Constant-time comparison protects against timing attacks on token signatures. */
function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

/** Creates a signed session token for a public user. */
export function createSessionToken(user: PublicUser): string {
  const payload: SessionPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = toBase64Url(JSON.stringify(payload));
  const signature = signTokenBody(body);
  return `${body}.${signature}`;
}

/** Verifies and decodes a session token, returning null when invalid or expired. */
export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) {
    return null;
  }

  const [body, signature] = token.split(".");

  if (!body || !signature || !safeEqual(signature, signTokenBody(body))) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(body)) as SessionPayload;
    const nowSeconds = Math.floor(Date.now() / 1000);
    return payload.exp > nowSeconds ? payload : null;
  } catch {
    return null;
  }
}

/** Reads the session payload from a Next.js request cookie. */
export function getSessionFromRequest(request: NextRequest): SessionPayload | null {
  return verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);
}

/** Adds the signed session cookie to a response after successful authentication. */
export function attachSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(),
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
}

/** Clears the session cookie during sign-out. */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(),
    maxAge: 0,
    path: "/",
  });
}
