import { customFetch } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "6";

    // Fetch comments from main API
    const response = await customFetch(
      `/comment/last?page=${page}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          tags: ["comments", "testimonials"],
          revalidate: 3600, // Cache for 1 hour
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Transform data for consistency
    const comments = Array.isArray(data)
      ? data
      : Array.isArray(data?.comments)
      ? data.comments
      : [];

    const transformedComments = comments.map((comment: any, index: number) => ({
      id: comment.id ?? comment.uuid ?? index,
      name:
        (comment.user?.firstName || "") +
        (comment.user?.lastName
          ? ` ${comment.user.lastName}`
          : comment.user?.name
          ? comment.user.name
          : "کاربر"),
      content: comment.text || comment.content || "",
      rating: 5,
      createdAt: comment.createdAt || comment.created_at,
      user: comment.user || null,
    }));

    return NextResponse.json(transformedComments, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
