import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { customFetch } from "./lib/utils";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("ACCESS_TOKEN")?.value;

  // Shortcut: no token, not authenticated
  if (!accessToken) {
    if (pathname === "/login") return NextResponse.next();
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Check if user is authenticated
  let isAuthenticated = false;
  try {
    const meRes = await customFetch("/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    isAuthenticated = meRes.ok;
  } catch {
    isAuthenticated = false;
  }

  // Redirect logged-in user away from login
  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Admin route access check
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const adminRes = await customFetch("/auth/is-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const isAdmin = await adminRes.json();
      if (isAdmin !== true) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
