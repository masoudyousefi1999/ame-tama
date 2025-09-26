import { NextRequest, NextResponse } from "next/server";
import { customFetch } from "@/lib/utils";

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

    const response = await customFetch("/order/decrease", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to decrease order item" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    console.error("API Error decreasing order item:", error);
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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
