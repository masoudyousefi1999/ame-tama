import { customFetch } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ame-tama.com";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const response = await customFetch(
      `/blog-topic?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=1800, s-maxage=1800", // Cache for 30 minutes
      },
    });
  } catch (error) {
    console.error("Error fetching blog topics:", error);

    // Return empty response on error
    return NextResponse.json(
      {
        blogTopics: [],
        totalCount: 0,
      },
      {
        status: 200, // Return 200 to prevent page crashes
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  }
}
