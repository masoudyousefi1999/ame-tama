import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { customFetch } from "./lib/utils";

// Helper function to extract the ACCESS_TOKEN from the cookie header
function getAccessTokenFromCookie(cookieHeader: string): string | null {
  const match = cookieHeader.match(/ACCESS_TOKEN=([^;]+)/);
  return match ? match[1] : null;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cookieHeader = request.headers.get("cookie") || "";

  console.log("🔍 URL", request.nextUrl.pathname);
  console.log("🍪 Incoming Cookie Header:", cookieHeader || "❌ No cookie");
  console.log(
    "🌐 Request Origin:",
    request.headers.get("origin") || "❌ No origin"
  );
  console.log(
    "🔐 Secure?",
    request.nextUrl.protocol === "https:" ? "Yes" : "No"
  );

  // Get the ACCESS_TOKEN from the cookie header
  const accessToken = getAccessTokenFromCookie(cookieHeader);

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
    console.log("✅ me Status:", meRes.status);
    console.log("✅ me Response:", await meRes.json());

    isAuthenticated = meRes.ok;
  } catch (error) {
    console.log("error in /me => ", error);
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

      console.log("✅ is-admin Status:", adminRes.status);

      const isAdmin = await adminRes.json();
      console.log("✅ is-admin Response:", isAdmin);
      if (isAdmin !== true) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (error) {
      console.log("error in /me => ", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
