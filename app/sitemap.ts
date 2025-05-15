import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  // const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ametama.com"
  const baseUrl = "https://ametama.com"

  // صفحات استاتیک
  const staticPages = ["", "/shop", "/about", "/contact", "/faq", "/cart", "/checkout", "/profile"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  // صفحات محصولات
  // const products = getAllProducts()
  // const productPages = products.map((product) => ({
  //   url: `${baseUrl}/product/${product.id}`,
  //   lastModified: new Date(),
  //   changeFrequency: "weekly" as const,
  //   priority: 0.8,
  // }))

  // صفحات دسته‌بندی
  // const categories = getAllCategories()
  // const categoryPages = categories.map((category) => ({
  //   url: `${baseUrl}/category/${category.slug}`,
  //   lastModified: new Date(),
  //   changeFrequency: "weekly" as const,
  //   priority: 0.7,
  // }))

  return [...staticPages]
}
