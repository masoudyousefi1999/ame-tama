import { NextResponse } from "next/server";

const CLARITY_ID = "sy8ocvwyz3";
const CLARITY_URL = `https://www.clarity.ms/tag/${CLARITY_ID}`;

export async function GET() {
  try {
    const upstream = await fetch(CLARITY_URL, {
      // Allow Next to cache the upstream fetch for a day before revalidating.
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Clarity script" },
        { status: upstream.status }
      );
    }

    const body = await upstream.text();
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") ||
          "application/javascript; charset=utf-8",
        // Long cache for clients; immutable because URL includes version.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Clarity proxy error" }, { status: 502 });
  }
}
