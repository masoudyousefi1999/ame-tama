import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ame-tama.com";
  const baseUrl = "https://ame-tama.com";

  return {
    rules: {
      userAgent: "*",
      disallow: "/",
      // allow: "/",
      // disallow: ["/checkout/", "/profile/", "/api/", "/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
