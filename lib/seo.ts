// انواع داده برای SEO
export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogType?: "website" | "product" | "article"
  twitterCard?: "summary" | "summary_large_image"
  canonicalUrl?: string
  noIndex?: boolean
}

// تنظیمات پایه SEO
export const defaultSEO: SEOProps = {
  title: "مجسمه‌های انیمه لوکس | AME-TAMA",
  description: "فروشگاه آنلاین مجسمه‌های انیمه لوکس با کیفیت استثنایی و جزئیات خیره‌کننده برای کلکسیونرهای مشتاق",
  keywords: [
    "مجسمه انیمه",
    "فیگور انیمه",
    "مجسمه لوکس",
    "کلکسیون انیمه",
    "فروشگاه انیمه",
    "مجسمه وان پیس",
    "مجسمه ناروتو",
    "مجسمه شیطان کش",
    "مجسمه جوجوتسو کایزن",
    "مجسمه حمله به تایتان",
    "مجسمه آکادمی قهرمان من",
  ],
  ogImage: "/og-image.jpg",
  ogType: "website",
  twitterCard: "summary_large_image",
  noIndex: false,
}

// ترکیب تنظیمات SEO با تنظیمات پیش‌فرض
export function mergeSEO(customSEO?: Partial<SEOProps>): SEOProps {
  return {
    title: customSEO?.title || "AME-TAMA | فروشگاه مجسمه‌های انیمه",
    description: customSEO?.description || "فروشگاه آنلاین مجسمه‌های انیمه با کیفیت و اورجینال - خرید مجسمه انیمه",
    keywords: customSEO?.keywords || ["مجسمه انیمه", "فیگور انیمه", "خرید مجسمه", "فروشگاه انیمه"],
    ogType: customSEO?.ogType || "website",
    // ogImage: customSEO?.ogImage || `${process.env.NEXT_PUBLIC_SITE_URL}/images/og-image.jpg`,
    ogImage: customSEO?.ogImage || `https://ame-tama.com/images/og-image.jpg`,
    twitterCard: customSEO?.twitterCard || "summary_large_image",
    canonicalUrl: customSEO?.canonicalUrl || "",
    noIndex: customSEO?.noIndex || false,
  }
}

// تولید عنوان صفحه
export function generateTitle(title?: string): string {
  if (!title) return defaultSEO.title || "AME-TAMA"
  return `${title} | AME-TAMA`
}

// تولید توضیحات متا برای محصول
export function generateProductDescription(product: any): string {
  return `مجسمه ${product.name} از سری ${product.series} با کیفیت استثنایی و جزئیات خیره‌کننده. ارتفاع: ${product.height}، مقیاس: ${product.scale}. خرید آنلاین از فروشگاه AME-TAMA.`
}

// تولید کلمات کلیدی برای محصول
export function generateProductKeywords(product: any): string[] {
  return [
    `مجسمه ${product.name}`,
    `فیگور ${product.name}`,
    `مجسمه ${product.character}`,
    `مجسمه ${product.series}`,
    `فیگور ${product.series}`,
    `کلکسیون ${product.series}`,
    `مجسمه انیمه ${product.series}`,
    `خرید مجسمه ${product.character}`,
  ]
}

// تولید کلمات کلیدی برای دسته‌بندی
export function generateCategoryKeywords(category: any): string[] {
  return [
    `مجسمه ${category.name}`,
    `فیگور ${category.name}`,
    `کلکسیون ${category.name}`,
    `مجسمه انیمه ${category.name}`,
    `خرید مجسمه ${category.name}`,
    `فروشگاه مجسمه ${category.name}`,
  ]
}

// تولید URL کانونیکال
export function generateCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";
  // اطمینان از اینکه path با / شروع می‌شود
  const formattedPath = path.startsWith("/") ? path : `/${path}`
  return `${baseUrl}${formattedPath}`
}
