/**
 * FILE: proxy.ts
 * LOCATION: src/proxy.ts
 * PURPOSE: Next.js middleware for route protection.
 *          Protects dashboard and account-level routes by checking the
 *          eduquest_session cookie. Unauthenticated users are redirected to /sign-in.
 * LAST UPDATED: 2026-06-01
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* Routes that require authentication */
const PROTECTED_PATHS = [
  "/dashboard",
  "/profile",
  "/wallet",
  "/settings",
  "/notifications",
];

/* Auth pages — signed-in users should be redirected away */
const AUTH_PATHS = ["/sign-in", "/sign-up"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("eduquest_session");
  const isSignedIn = Boolean(sessionCookie?.value);

  /* If signed in and visiting auth pages, redirect to dashboard */
  if (isSignedIn && AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  /* Protect dashboard and account-level routes */
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p)) && !isSignedIn) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

/* Run on all routes except static assets */
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
