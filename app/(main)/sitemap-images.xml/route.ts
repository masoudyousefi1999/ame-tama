import { getAllProducts } from "@/lib/products";
import { getSiteUrl } from "@/lib/site-url";

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const baseUrl = getSiteUrl();

  let allProducts: any[] = [];
  try {
    let page = 1;
    const limit = 50;
    while (true) {
      const productItems = await getAllProducts(page, limit);
      if (
        !productItems ||
        !productItems.products ||
        productItems.products.length === 0
      )
        break;
      allProducts = [...allProducts, ...productItems.products];
      page++;
      if (page > 20) break;
    }
  } catch (error) {
    // Swallow fetch errors and fall back to minimal sitemap
  }

  const urlsXml = (
    allProducts.length > 0
      ? allProducts
      : [{ slug: "", updatedAt: new Date().toISOString(), productMedia: [] }]
  )
    .map((product: any) => {
      const categorySlug = product.category?.slug;
      const tagSlug = product.tags?.[0]?.slug;
      const productSlug = product.slug;
      if (!categorySlug || !tagSlug || !productSlug) return "";

      const productPath = [categorySlug, tagSlug, productSlug]
        .map((part: string) => encodeURIComponent(part))
        .join("/");
      const productUrl = getSiteUrl(productPath);
      const images = Array.isArray(product?.productMedia)
        ? product.productMedia
        : [];
      const safeName = xmlEscape(String(product?.name ?? "Ame-Tama"));
      const lastModIso = new Date(
        product?.updatedAt ?? new Date()
      ).toISOString();

      const imagesXml = images
        .map((img: any) => {
          const rawUrl = String(img?.url ?? "");
          if (!rawUrl) return "";
          const loc = rawUrl.startsWith("http")
            ? rawUrl
            : `${baseUrl}${rawUrl}`;
          return `
    <image:image>
      <image:loc>${xmlEscape(loc)}</image:loc>
      <image:title>${safeName} - فیگور انیمه</image:title>
      <image:caption>${safeName}</image:caption>
      <image:license>${xmlEscape(baseUrl)}</image:license>
    </image:image>`;
        })
        .join("");

      return `
  <url>
    <loc>${xmlEscape(productUrl)}</loc>
    <lastmod>${lastModIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>${imagesXml}
  </url>`;
    })
    .join("");

  const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urlsXml}
</urlset>`;

  return new Response(imageSitemap, {
    headers: {
      "Content-Type": "application/xml",
      // Cache for 12 hours, allow stale-while-revalidate
      "Cache-Control":
        "public, max-age=0, s-maxage=43200, stale-while-revalidate=21600",
    },
  });
}
