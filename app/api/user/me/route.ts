import { NextRequest, NextResponse } from "next/server";
import { customFetch } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    // Forward cookies from the client request to the backend
    const cookieHeader = request.headers.get("cookie");

    // Extract ACCESS_TOKEN from cookies
    let accessToken = null;
    if (cookieHeader) {
      const match = cookieHeader.match(/ACCESS_TOKEN=([^;]+)/);
      accessToken = match ? match[1] : null;
    }

    // If we have an access token, use it in Authorization header
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await customFetch("/auth/me", {
      method: "GET",
      headers,
      next: {
        revalidate: 60, // 1 minute cache for user data
        tags: ["user"],
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: response.status }
      );
    }

    const user = await response.json();

    return NextResponse.json(user, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        "CDN-Cache-Control": "public, s-maxage=60",
        "Vercel-CDN-Cache-Control": "public, s-maxage=60",
      },
    });
  } catch (error) {
    console.error("API Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
