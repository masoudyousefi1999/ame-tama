import { NextRequest, NextResponse } from "next/server";
import { customFetch } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    if (!search) {
      return NextResponse.json(
        { products: [], totalCount: 0 },
        { status: 200 }
      );
    }

    // Call the NestJS backend
    const params = new URLSearchParams();
    params.set("search", search);
    params.set("page", page);
    params.set("limit", limit);

    const response = await customFetch(`/product/search?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Backend search failed:", response.status);
      return NextResponse.json(
        { products: [], totalCount: 0 },
        { status: 200 }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300", // 5 minutes cache
      },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


