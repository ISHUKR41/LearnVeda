import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "./src/lib/server/auth/session";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/wallet",
  "/settings",
  "/notifications",
  "/admin",
];

const AUTH_PAGES = ["/sign-in", "/sign-up"];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(r => pathname === r || pathname.startsWith(r + "/"));
}

function isAuthPage(pathname: string): boolean {
  return AUTH_PAGES.some(r => pathname === r || pathname.startsWith(r + "/"));
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("eduquest_session")?.value;
  const session = await verifySessionToken(token);
  const isLoggedIn = session !== null;
  const { pathname } = request.nextUrl;

  if (isLoggedIn && isAuthPage(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isLoggedIn && isProtectedRoute(pathname)) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
