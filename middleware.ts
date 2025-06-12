import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    console.log("All request cookies:", request.cookies.getAll());
    try {
      const accessToken = request.cookies.get("ACCESS_TOKEN")?.value;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/is-admin`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: accessToken } : {}),
          },
        }
      );

      const isUserAdmin = await res.json();
      console.log("is user admin? =>", isUserAdmin);

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
