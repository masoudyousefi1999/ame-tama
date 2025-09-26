import { NextRequest, NextResponse } from "next/server";
import { customFetch } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      console.log("No slug provided");
      return NextResponse.json(
        { error: "Product slug is required" },
        { status: 400 }
      );
    }

    const response = await customFetch(`/product/${slug}`, {
      method: "GET",
      next: {
        revalidate: 300, // 5 minutes cache
        tags: [`product-${slug}`],
      },
    });

    if (!response.ok) {
      console.log(`Backend returned ${response.status} for product: ${slug}`);
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: "Failed to fetch product" },
        { status: response.status }
      );
    }

    const product = await response.json();

    // Check if product is empty or has no data
    if (!product || Object.keys(product).length === 0) {
      console.log(`Product data is empty for slug: ${slug}`);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Return the product with proper headers for caching
    return NextResponse.json(product, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "CDN-Cache-Control": "public, s-maxage=300",
        "Vercel-CDN-Cache-Control": "public, s-maxage=300",
      },
    });
  } catch (error) {
    console.error("API Error fetching product:", error);
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
