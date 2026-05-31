import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Routes that require authentication.
 * Unauthenticated users hitting these will be redirected to Clerk's sign-in page.
 * Note: Clerk's own sign-in component handles redirecting authenticated users
 * away from /sign-in and /sign-up — don't duplicate that logic here or it
 * causes Clerk's internal token refresh to loop.
 */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/wallet(.*)",
  "/settings(.*)",
  "/notifications(.*)",
  "/battle(.*)",
  "/class-9(.*)",
  "/class-10(.*)",
  "/class-11(.*)",
  "/class-12(.*)",
  "/engineering(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
