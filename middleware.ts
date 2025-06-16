import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { customFetch } from "./lib/utils";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    try {
      const cookieHeader = request.headers.get("cookie") || "";

      const res = await customFetch(`/auth/is-admin`, {
        method: "GET",
        cookies: cookieHeader,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const isUserAdmin = await res.json();

      if (isUserAdmin !== true) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (error) {
      console.error("middleware error =>", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
