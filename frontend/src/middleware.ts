/**
 * FILE: middleware.ts
 * LOCATION: src/middleware.ts
 * PURPOSE: Root-level Next.js middleware for Clerk Authentication.
 *          Protects private routes (dashboard, battle, profile, wallet, settings)
 *          while keeping general CBSE study tracks and public pages accessible.
 *          When an unauthenticated user visits a protected route, they are
 *          redirected to the Clerk-hosted sign-in page with a return URL.
 * USED BY: Next.js App Router (automatic — runs on every matched request)
 * DEPENDENCIES: @clerk/nextjs/server
 * LAST UPDATED: 2026-05-27
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Route matcher for protected student workspace routes.
 * These routes require authentication — unauthenticated visitors
 * are redirected to the sign-in page.
 */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/battle(.*)",
  "/profile(.*)",
  "/wallet(.*)",
  "/settings(.*)",
]);

/**
 * Clerk middleware handler.
 * Runs on every matched request path. For protected routes, it checks
 * whether the user has a valid Clerk session. If not, it redirects
 * them to the sign-in page with a return URL so they come back after
 * authenticating.
 *
 * Public routes (homepage, class pages, about, etc.) pass through
 * without any auth check.
 */
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Check if user is signed in via Clerk
    const { userId } = await auth();

    if (!userId) {
      // Redirect unauthenticated users to sign-in with return URL
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
      const { redirectToSignIn } = await auth();
      // Use Clerk's built-in redirect for proper session handling
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  }
});

/**
 * Next.js middleware matcher configuration.
 * Defines which request paths this middleware should run on.
 * Static assets and public files are excluded for performance.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Images and static resources in the public folder
     */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API and TRPC routes
    "/(api|trpc)(.*)",
    // Clerk auto-proxy path for authentication flows
    "/__clerk/(.*)",
  ],
};
