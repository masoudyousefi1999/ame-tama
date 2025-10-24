import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendBase =
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL_SERVER ||
      "https://api.ame-tama.com";

    const targetUrl = `${backendBase}/sitemap`;

    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Accept:
          "application/xml,text/xml,application/xhtml+xml,application/rss+xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      console.error("Backend sitemap fetch failed:", res.status);
      return NextResponse.json(
        { error: "Sitemap unavailable" },
        { status: 502 }
      );
    }

    const xml = await res.text();

    // Basic guard: ensure it looks like XML sitemap to avoid serving HTML error pages
    const isXmlLike =
      xml.trim().startsWith("<?xml") ||
      xml.includes("<urlset") ||
      xml.includes("<sitemapindex");
    if (!isXmlLike) {
      console.error("Backend sitemap response is not XML-like");
      return NextResponse.json(
        { error: "Invalid sitemap content" },
        { status: 502 }
      );
    }

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching sitemap:", error);
    // Minimal valid XML fallback
    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://ame-tama.com";
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${base}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>`;
    return new NextResponse(fallback, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }
}
