import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ame-tama.com";

    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/checkout/", "/profile/", "/api/", "/admin/"],
        },
      ],
      sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/sitemap-images.xml`],
    };
  } catch (error) {
    // Fallback robots.txt in case of error
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/checkout/", "/profile/", "/api/", "/admin/"],
        },
      ],
      sitemap: [
        "https://ame-tama.com/sitemap.xml",
        "https://ame-tama.com/sitemap-images.xml",
      ],
    };
  }
}
