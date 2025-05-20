import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FAQCategory } from "@/components/faq/faq-category";
import { faqCategories } from "@/lib/faq-data";
import { generateCanonicalUrl } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "سوالات متداول | AME-TAMA",
  description:
    "پاسخ به سوالات رایج درباره محصولات، سفارش، ارسال و خدمات فروشگاه مجسمه‌های انیمه AME-TAMA",
  alternates: {
    canonical: generateCanonicalUrl("/faq"),
  },
};

export function generateViewport() {
  return {
    viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#000000" },
    ],
  };
}

export default function FAQPage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      {/* بردکرامب */}
      <Breadcrumb
        items={[{ label: "سوالات متداول", href: "/faq", isCurrent: true }]}
        className="mb-6 mt-6"
      />

      {/* هدر صفحه */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">سوالات متداول</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          پاسخ به سوالات رایج شما درباره محصولات، سفارش، ارسال و خدمات فروشگاه
          مجسمه‌های انیمه AME-TAMA
        </p>
      </div>

      {/* جستجوی سوالات */}
      <div className="max-w-3xl mx-auto mb-12">
        {/* <FAQSearch onSearch={(query) => console.log(query)} /> */}
      </div>

      {/* فهرست دسته‌بندی‌ها */}
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center">
          دسته‌بندی‌های سوالات
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {faqCategories.map((category, index) => (
            <a
              key={index}
              href={`#category-${index}`}
              className="bg-muted rounded-lg p-4 text-center hover:bg-muted/80 transition-colors"
            >
              <h3 className="font-medium">{category.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {category.items.length} سوال
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* دسته‌بندی‌های سوالات */}
      <div className="max-w-3xl mx-auto">
        {faqCategories.map((category, index) => (
          <div key={index} id={`category-${index}`}>
            <FAQCategory
              title={category.title}
              description={category.description}
              items={category.items}
            />
          </div>
        ))}
      </div>

      {/* بخش سوال بیشتر */}
      <div className="max-w-3xl mx-auto mt-16 text-center bg-muted p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">سوال شما پاسخ داده نشد؟</h2>
        <p className="text-muted-foreground mb-6">
          اگر سوال شما در لیست بالا نبود، می‌توانید از طریق فرم تماس با ما، سوال
          خود را مطرح کنید.
        </p>
        <Button asChild size="lg">
          <Link href="/contact">تماس با ما</Link>
        </Button>
      </div>
    </main>
  );
}
