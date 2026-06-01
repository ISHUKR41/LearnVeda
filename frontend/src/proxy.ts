/**
 * FILE: middleware.ts
 * LOCATION: src/middleware.ts
 * PURPOSE: Next.js middleware for Clerk authentication.
 *          Next.js ONLY reads middleware.ts — this is the real entry point.
 *          Clerk middleware validates JWTs on every request, enabling server-side
 *          auth() calls in API routes and Server Components.
 *
 *          Route logic:
 *            - Protected routes (/dashboard, /profile, etc.): redirect to /sign-in if not authed
 *            - Auth routes (/sign-in, /sign-up): redirect to /dashboard if already authed
 *            - All other routes: pass through (public)
 *
 * LAST UPDATED: 2026-06-01
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/* ── Routes that REQUIRE authentication ─────────────────────────────── */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/wallet(.*)",
  "/settings(.*)",
  "/notifications(.*)",
  "/admin(.*)",
]);

/* ── Auth-only pages — signed-in users should be redirected away ────── */
const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  /*
   * Resolve auth state:
   *   Primary:  Clerk session (Google / email via Clerk — validated via JWT)
   *   Fallback: Legacy eduquest_session httpOnly cookie (older accounts)
   *
   * NOTE: auth() is called unconditionally so Clerk can inject auth headers
   *       into the request for downstream Server Components and API routes.
   *       Without this call, auth() in API handlers returns { userId: null }.
   */
  const { userId } = await auth();
  const sessionCookie   = request.cookies.get("eduquest_session");
  const hasLegacyCookie = Boolean(sessionCookie?.value);
  const isSignedIn      = Boolean(userId) || hasLegacyCookie;

  /* ── Redirect signed-in users AWAY from auth pages ──────────────── */
  if (isSignedIn && isAuthRoute(request)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  /*
   * ── Protect dashboard & account routes ──────────────────────────
   * Unauthenticated requests are redirected to /sign-in.
   * The redirect_url param ensures the user lands back on the same page
   * after they authenticate.
   */
  if (isProtectedRoute(request) && !isSignedIn) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

/* Run on all routes except static files and Next.js internals */
export const config = {
  matcher: [
    /*
     * Match everything except:
     *   - _next/static (static files)
     *   - _next/image  (image optimization)
     *   - favicon.ico, images/, favicons/ (public assets)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|images/|favicons/).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
