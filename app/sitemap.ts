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

  // صفحات محصولات
  // #FIXME: fix this
  const productItems = await getAllProducts(1, 20);
  const productItem2 = await getAllProducts(2, 20);
  const products1 = productItems.products;
  const products2 = productItem2.products;

  const products = [...products1, ...products2];
  console.log("products are: ", products);

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
