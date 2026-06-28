import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hasClerk } from "@/lib/env";

const isProtectedRoute = createRouteMatcher(["/outbound(.*)", "/api/outbound(.*)"]);

// Auth only activates when Clerk keys are present in the environment — i.e. on
// Vercel, where the keys are set. Locally (no keys) this is a pass-through, so
// the real /outbound routes are fully usable without login.
const proxy = hasClerk()
  ? clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) await auth.protect();
    })
  : function proxy() {
      return NextResponse.next();
    };

export default proxy;

// Run only where auth is actually used: the gated tool, its API, the auth pages,
// and Clerk's auto-proxy path. Marketing routes never hit this.
export const config = {
  matcher: [
    "/outbound/:path*",
    "/api/outbound/:path*",
    "/sign-in/:path*",
    "/sign-up/:path*",
    "/__clerk/:path*",
  ],
};
