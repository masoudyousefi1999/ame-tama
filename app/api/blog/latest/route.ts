import { customFetch } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "3";

    // Fetch popular blogs directly from backend API
    const response = await customFetch(`/blog?limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    // Backend returns array directly or { document: [...], count: number }
    const blogs = Array.isArray(data.blogs) ? data.blogs : data || [];

    // Map the blogs to our expected format
    const transformedBlogs = blogs.map((blog: any) => ({
      uuid: blog.uuid,
      slug: blog.slug,
      title: blog.title,
      content: blog.content,
      viewCount: blog.viewCount || 0,
      isPublished: blog.isPublished,
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      image: blog.image
        ? {
            url: blog.image.url,
          }
        : null,
      topic: blog.topic
        ? {
            uuid: blog.topic.uuid,
            name: blog.topic.name,
            slug: blog.topic.slug,
            description: blog.topic.description,
            image: blog.topic.image || null,
            createdAt: blog.topic.createdAt,
            updatedAt: blog.topic.updatedAt,
            blogs: [],
          }
        : null,
    }));

    return NextResponse.json(transformedBlogs, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=1800, s-maxage=1800", // Cache for 30 minutes
      },
    });
  } catch (error) {
    console.error("Error fetching popular blogs:", error);
    return NextResponse.json([], {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }
}
