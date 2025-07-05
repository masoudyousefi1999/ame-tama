import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FAQCategory } from "@/components/faq/faq-category";
import { faqCategories } from "@/lib/faq-data";
import { generateCanonicalUrl } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "سوالات متداول | AME-TAMA",
  description:
    "پاسخ به سوالات رایج درباره محصولات، سفارش، ارسال و خدمات فروشگاه مجسمه‌های انیمه AME-TAMA",
  alternates: { canonical: generateCanonicalUrl("/faq") },
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-24 mt-20">
      {/* Breadcrumb */}
      <main className="container mx-auto px-4 md:px-6 mt-8">
        <Breadcrumb
          items={[{ label: "سوالات متداول", href: "/faq", isCurrent: true }]}
          className="mb-6"
        />
      </main>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Animated background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900" />

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 via-purple-500/30 to-fuchsia-500/30 animate-pulse" />

        {/* Floating orbs */}
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-violet-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-28 h-28 bg-fuchsia-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        />
        <div
          className="absolute bottom-32 right-20 w-20 h-20 bg-violet-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        />

        {/* Radial gradients for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.4),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.4),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,38,211,0.3),transparent_50%)]" />

        {/* Animated mesh gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-transparent via-violet-500/10 to-transparent animate-pulse"
          style={{ animationDuration: "6s" }}
        />

        {/* Top overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            سوالات متداول
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-medium">
            پاسخ به سوالات رایج شما درباره محصولات، سفارش، ارسال و خدمات فروشگاه
            مجسمه‌های انیمه AME-TAMA
          </p>
          <div className="flex items-center justify-center gap-4">
            <HelpCircle className="h-12 w-12 text-white/80" />
            <div className="text-left">
              <h2 className="text-xl font-bold text-white">
                {faqCategories.reduce(
                  (total, cat) => total + cat.items.length,
                  0
                )}{" "}
                سوال
              </h2>
              <p className="text-white/80">
                در {faqCategories.length} دسته‌بندی
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 mt-12">
        {/* Category shortcuts */}
        <section className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center">
            دسته‌بندی‌های سوالات
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {faqCategories.map((cat, i) => (
              <a
                key={i}
                href={`#category-${i}`}
                className="bg-muted rounded-lg p-4 text-center hover:bg-muted/80 transition-colors"
              >
                <h3 className="font-medium">{cat.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {cat.items.length} سوال
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* FAQ blocks */}
        <section className="max-w-3xl mx-auto">
          {faqCategories.map((cat, i) => (
            <div key={i} id={`category-${i}`}>
              <FAQCategory
                title={cat.title}
                description={cat.description}
                items={cat.items}
              />
            </div>
          ))}
        </section>

        {/* Still need help */}
        <section className="max-w-3xl mx-auto mt-16 text-center bg-muted p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">سوال شما پاسخ داده نشد؟</h2>
          <p className="text-muted-foreground mb-6">
            اگر سوال شما در لیست بالا نبود، می‌توانید از طریق فرم تماس با ما
            سؤال خود را مطرح کنید.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          >
            <Link href="/contact">تماس با ما</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
