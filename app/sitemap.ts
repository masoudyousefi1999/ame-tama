import { getAllCategories } from "@/lib/categories";
import { getAllProducts } from "@/lib/products";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ametama.com";

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

  // صفحات محصولات
  const productItems = await getAllProducts(1, 100);
  const { products } = productItems;

  const productPages = products.map((product) => ({
    url: `${baseUrl}/product/${encodeURIComponent(product.slug)}`,
    lastModified: new Date(product?.updatedAt ?? new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // صفحات دسته‌بندی
  const categories = await getAllCategories();

  const rootCategories: any[] = [];
  categories.forEach((item) => rootCategories.push(...item.children));

  const categoryPages = rootCategories.map((category) => ({
    url: `${baseUrl}/category/figures/${encodeURIComponent(category.slug)}`,
    lastModified: new Date(category?.updatedAt ?? new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}
