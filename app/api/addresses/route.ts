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

    const response = await customFetch("/address", {
      method: "GET",
      headers,
      next: {
        revalidate: 300, // 5 minutes cache
        tags: ["addresses"],
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch addresses" },
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
    console.error("API Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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

    const response = await customFetch("/address", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to create address" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 201,
    });
  } catch (error) {
    console.error("API Error creating address:", error);
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
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
