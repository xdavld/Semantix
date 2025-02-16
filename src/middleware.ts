import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/login" || pathname === "/signup") {
    const url = request.nextUrl.clone();

    const newHeaders = new Headers(request.headers);
    newHeaders.set("x-hidden-header", "true");

    return NextResponse.rewrite(url, {
      request: {
        headers: newHeaders,
      },
    });
  }

  return NextResponse.next();
}
declare module "next/server" {
  interface RequestHeaders {
    get(name: "x-hidden-header"): string | null;
  }
}
