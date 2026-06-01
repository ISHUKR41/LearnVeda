/**
 * FILE: proxy.ts
 * LOCATION: src/proxy.ts
 * PURPOSE: Next.js middleware for route protection.
 *          Uses Clerk for authentication — protects dashboard and account-level
 *          routes. Unauthenticated users (neither Clerk session nor legacy cookie)
 *          are redirected to /sign-in. Signed-in users visiting auth pages are
 *          redirected to /dashboard.
 * LAST UPDATED: 2026-06-01
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/* Routes that require authentication */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/wallet(.*)",
  "/settings(.*)",
  "/notifications(.*)",
  "/admin(.*)",
]);

/* Auth-only pages — authenticated users should be redirected away */
const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  /* Resolve authentication state:
   *   - Primary: Clerk session (Google SSO and email/password via Clerk)
   *   - Fallback: Legacy eduquest_session httpOnly cookie (older accounts)
   */
  const { userId } = await auth();
  const sessionCookie   = request.cookies.get("eduquest_session");
  const hasLegacyCookie = Boolean(sessionCookie?.value);
  const isSignedIn      = Boolean(userId) || hasLegacyCookie;

  /* ── Redirect signed-in users away from auth pages ── */
  if (isSignedIn && isAuthRoute(request)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  /* ── Protect dashboard and account-level routes ──
   *    Unauthenticated requests are sent to /sign-in.
   *    The Clerk redirectUrl is preserved so the user returns
   *    to their original destination after signing in.
   */
  if (isProtectedRoute(request) && !isSignedIn) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

/* Run on all routes except static assets */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|favicons|public).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
