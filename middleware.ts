import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { customFetch } from "./lib/utils";

// Helper function to extract the ACCESS_TOKEN from the cookie header
function getAccessTokenFromCookie(cookieHeader: string): string | null {
  const match = cookieHeader.match(/ACCESS_TOKEN=([^;]+)/);
  return match ? match[1] : null;
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (pathname.startsWith('/checkout/success/payments/zarinpal')) {
    const authority = searchParams.get('Authority')
    const status = searchParams.get('Status')

    // Create new redirect URL with parameters added
    const redirectUrl = new URL('/checkout/success', request.url)
    if (authority) redirectUrl.searchParams.set('Authority', authority)
    if (status) redirectUrl.searchParams.set('Status', status)

    return NextResponse.redirect(redirectUrl)
  }

  const cookieHeader = request.headers.get("cookie") || "";


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
    const meRes = await fetch("https://api.ame-tama.com/auth/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    isAuthenticated = meRes.ok;
  } catch (error) {
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
      const adminRes = await fetch(
        "https://api.ame-tama.com/auth/is-admin",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const isAdmin = await adminRes.json();

      if (isAdmin !== true) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login",'/checkout/success/:path*'],
};
