/**
 * FILE: middleware.ts
 * LOCATION: src/middleware.ts
 * PURPOSE: Root-level Next.js middleware for Clerk Authentication.
 *          Protects private routes while keeping general CBSE study tracks public.
 * USED BY: Next.js App Router (automatic)
 * DEPENDENCIES: @clerk/nextjs
 * LAST UPDATED: 2026-05-27
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define matching rules for protected student workspace routes
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/battle(.*)",
  "/profile(.*)",
  "/wallet(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Force authentication for workspace pages, redirects to Clerk sign-in automatically
    await auth.protect();
  }
});

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
  ],
};
