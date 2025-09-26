import { NextRequest, NextResponse } from "next/server";
import { customFetch } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const url =
      status && status !== "all"
        ? `/order/history?status=${status}`
        : "/order/history";

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

    const response = await customFetch(url, {
      method: "GET",
      headers,
      next: {
        revalidate: 300, // 5 minutes cache
        tags: ["orders"],
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "CDN-Cache-Control": "public, s-maxage=300",
        "Vercel-CDN-Cache-Control": "public, s-maxage=300",
      },
    });
  } catch (error) {
    console.error("API Error fetching orders:", error);
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
