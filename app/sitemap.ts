import { getAllCategories } from "@/lib/categories";
import { getAllProducts } from "@/lib/products";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ame-tama.com";

  // صفحات استاتیک
  const staticPages = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/faq",
    "/cart",
    "/checkout",
    "/profile",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // صفحات محصولات - دریافت همه محصولات
  let allProducts: any[] = [];
  let page = 1;
  const limit = 50; // افزایش تعداد محصولات در هر صفحه

  while (true) {
    const productItems = await getAllProducts(page, limit);
    if (productItems.products.length === 0) break;
    allProducts = [...allProducts, ...productItems.products];
    page++;

    // محدود کردن تعداد صفحات برای جلوگیری از حلقه بی‌نهایت
    if (page > 20) break;
  }

  console.log(`Total products found: ${allProducts.length}`);

  const productPages = allProducts.map((product) => ({
    url: `${baseUrl}/product/${encodeURIComponent(product.slug)}`,
    lastModified: new Date(product?.updatedAt ?? new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.9, // افزایش اولویت صفحات محصولات
  }));

  // صفحات دسته‌بندی
  const categories = await getAllCategories();

  const rootCategories: any[] = [];
  categories.forEach((item) => rootCategories.push(...item.children));

  const categoryPages = rootCategories.map((category) => ({
    url: `${baseUrl}/category/figures/${encodeURIComponent(category.slug)}`,
    lastModified: new Date(category?.updatedAt ?? new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.8, // افزایش اولویت صفحات دسته‌بندی
  }));

  // اضافه کردن صفحات دسته‌بندی اصلی
  const mainCategoryPages = categories.map((category) => ({
    url: `${baseUrl}/category/${encodeURIComponent(category.slug)}`,
    lastModified: new Date(category?.updatedAt ?? new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...mainCategoryPages,
  ];
}
