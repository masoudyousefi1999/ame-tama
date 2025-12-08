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

    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const response = await customFetch(`/tag/${slug}?page=${page}&limit=${limit}`, {
      next: {
        tags: [`tag-${slug}`],
      },
    });

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

    if (!tag) {
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
