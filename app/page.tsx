import HeroSection from "@/components/hero-section";
import FeaturedProductsSection from "@/components/featured-products-section";
import TestimonialSection from "@/components/testimonial-section";
import CategoryShowcase from "@/components/shop/category-showcase";
import {
  HomeBrandedIllustration,
  HomeFloatingElements,
} from "@/components/home/HomeClientWrappers";
import { getAllCategories } from "@/lib/categories";
import { getAllProducts } from "@/lib/products";

export default async function Home() {
  const [allCategories, products] = await Promise.all([
    getAllCategories(),
    getAllProducts(1, 8),
  ]);

  const categories = allCategories?.[0]?.children ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Global floating elements - only rendered ONCE */}
      <HomeFloatingElements />

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-pattern-dots opacity-20 pointer-events-none" />
        <HomeBrandedIllustration variant="hero" />
        <div className="relative z-10">
          <HeroSection />
        </div>
      </div>

      <div className="section-separator" />

      {/* Featured Products */}
      <FeaturedProductsSection />

      <div className="section-separator" />

      {/* Category Showcase */}
      <section className="relative py-16 md:py-24 section-elevated section-glow mx-4 lg:mx-8">
        <div className="absolute inset-0 bg-pattern-grid opacity-10 pointer-events-none" />
        <div className="relative container mx-auto px-6 lg:px-8 z-10">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-6 md:mb-8 section-title">
              دسته‌بندی‌های محبوب
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              مجموعه‌ای متنوع از مجسمه‌های انیمه در دسته‌بندی‌های مختلف
            </p>
          </div>
          <div className="px-4">
            <CategoryShowcase categories={categories as any} />
          </div>
        </div>
      </section>

      <div className="section-separator" />

      {/* Testimonials */}
      <section className="relative py-16 md:py-24 section-elevated section-glow mx-4 lg:mx-8">
        <div className="absolute inset-0 bg-pattern-dots opacity-10 pointer-events-none" />
        <div className="relative container mx-auto px-6 lg:px-8 z-10">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-6 md:mb-8 section-title">
              نظرات مشتریان
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              تجربیات واقعی مشتریان ما از کیفیت و خدمات AME-TAMA
            </p>
          </div>
          <div className="px-4">
            <TestimonialSection />
          </div>
        </div>
      </section>

      <div className="section-separator" />

      {/* CTA */}
      <section className="relative py-16 md:py-24 section-elevated section-glow mx-4 lg:mx-8">
        <div className="relative container mx-auto px-6 lg:px-8 text-center z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 md:mb-8 section-title">
              آماده شروع کلکسیون خود هستید؟
            </h2>
            <p className="text-lg text-muted-foreground mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed">
              به هزاران مشتری دیگر بپیوندید و کلکسیون منحصر به فرد خود را بسازید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              <a
                href="/shop"
                className="inline-flex items-center justify-center px-8 md:px-10 py-3 md:py-4 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold transition-transform duration-200 hover:scale-105 shadow-lg"
              >
                مشاهده فروشگاه
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center px-8 md:px-10 py-3 md:py-4 rounded-full bg-gray-800 hover:bg-gray-700 border-2 border-primary text-primary hover:text-primary/80 font-semibold transition-transform duration-200 hover:scale-105 shadow-md"
              >
                درباره ما
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="section-separator" />
    </div>
  );
}
