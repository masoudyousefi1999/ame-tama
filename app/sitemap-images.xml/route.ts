import { getAllProducts } from "@/lib/products";
import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  const baseUrl = getSiteUrl();

  // دریافت همه محصولات
  let allProducts: any[] = [];
  let page = 1;
  const limit = 50;

  while (true) {
    const productItems = await getAllProducts(page, limit);
    if (productItems.products.length === 0) break;
    allProducts = [...allProducts, ...productItems.products];
    page++;

    // محدود کردن تعداد صفحات
    if (page > 20) break;
  }

  // ساخت XML برای تصاویر
  const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${allProducts
    .map((product) => {
      const productUrl = `${baseUrl}/product/${encodeURIComponent(
        product.slug
      )}`;
      const images = product.productMedia || [];

      return `
  <url>
    <loc>${productUrl}</loc>
    <lastmod>${new Date(
      product?.updatedAt ?? new Date()
    ).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    ${images
      .map(
        (img: any) => `
    <image:image>
      <image:loc>${
        img.url.startsWith("http") ? img.url : `${baseUrl}${img.url}`
      }</image:loc>
      <image:title>${product.name} - فیگور انیمه</image:title>
      <image:caption>فیگور ${product.name} از انیمه ${
          product.category.name
        }</image:caption>
      <image:license>${baseUrl}</image:license>
    </image:image>`
      )
      .join("")}
  </url>`;
    })
    .join("")}
</urlset>`;

  return new Response(imageSitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
