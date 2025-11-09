import { NextRequest, NextResponse } from "next/server";
import { customFetch } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      console.log("No slug provided");
      return NextResponse.json(
        { error: "Tag slug is required" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || undefined;
    const limit = searchParams.get("limit") || undefined;

    const queryParams = new URLSearchParams();
    if (page) {
      queryParams.set("page", page);
    }
    if (limit) {
      queryParams.set("limit", limit);
    }
    const queryString = queryParams.toString();

    const response = await customFetch(
      `/tag/${slug}${queryString ? `?${queryString}` : ""}`,
      {
      method: "GET",
      next: {
        tags: [`tag-${slug}`],
      },
      }
    );

    if (!response.ok) {
      console.log(`Backend returned ${response.status} for tag: ${slug}`);
      if (response.status === 404) {
        return NextResponse.json({ error: "Tag not found" }, { status: 404 });
      }

      return NextResponse.json(
        { error: "Failed to fetch tag" },
        { status: response.status }
      );
    }

    const tag = await response.json();

    // Check if tag is empty or has no data
    if (!tag || Object.keys(tag).length === 0) {
      console.log(`Tag data is empty for slug: ${slug}`);
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // Return the tag with proper headers for caching
    return NextResponse.json(tag, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "CDN-Cache-Control": "public, s-maxage=300",
        "Vercel-CDN-Cache-Control": "public, s-maxage=300",
      },
    });
  } catch (error) {
    console.error("API Error fetching tag:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS if needed
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
