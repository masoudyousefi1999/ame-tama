import { customFetch } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ topicSlug: string; blogSlug: string }> }
) {
  try {
    const { blogSlug } = await params;

    const response = await customFetch(`/blog/${blogSlug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Blog post not found" },
          { status: 404 }
        );
      }
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
    console.error("Error fetching blog post:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
