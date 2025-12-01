import { customFetch } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ topicSlug: string; blogSlug: string }> }
) {
  try {
    const { blogSlug } = await params;

    // Get User-Agent from request headers
    // In Next.js, headers() can read the original browser request headers
    // This works even for SSR requests if the original request came from browser
    let userAgent = "";

    try {
      const headersList = await headers();
      // headers() reads from the original incoming request
      // Try to get real browser user-agent from multiple sources
      userAgent =
        headersList.get("x-browser-user-agent") ||
        headersList.get("x-real-user-agent") ||
        headersList.get("x-forwarded-user-agent") ||
        headersList.get("user-agent") ||
        "";
    } catch (error) {
      // Fallback to request headers if headers() fails
      userAgent =
        request.headers.get("x-browser-user-agent") ||
        request.headers.get("x-real-user-agent") ||
        request.headers.get("x-forwarded-user-agent") ||
        request.headers.get("user-agent") ||
        "";
    }

    // Check if this is a server-side request (user-agent is "node")
    const isServerSideRequest =
      !userAgent ||
      userAgent.toLowerCase().trim() === "node" ||
      (userAgent.toLowerCase().includes("node") && userAgent.length < 10);

    // Prepare headers
    const headersToSend: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Only send user-agent if it's a real browser user-agent (not server-side)
    if (userAgent && !isServerSideRequest) {
      headersToSend["user-agent"] = userAgent;
    }

    const response = await customFetch(`/blog/${blogSlug}`, {
      method: "GET",
      headers: headersToSend,
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
