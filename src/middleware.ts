import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const { pathname } = request.nextUrl;

  // Hide header on login and signup pages only
  if (pathname === "/login" || pathname === "/signup") {
    requestHeaders.set("x-hidden-header", "true");
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Add TypeScript type for the custom header
declare module "next/server" {
  interface RequestHeaders {
    get(name: "x-hidden-header"): string | null;
  }
}
