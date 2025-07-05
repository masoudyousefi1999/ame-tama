import HeroSection from "@/components/hero-section";
import FeaturedProducts from "@/components/featured-products";
import TestimonialSection from "@/components/testimonial-section";
import CategoryShowcase from "@/components/shop/category-showcase";
import {
  BrandedIllustration,
  FloatingElements,
} from "@/components/ui/branded-illustration";
import { getAllCategories } from "@/lib/categories";
import { getAllProducts } from "@/lib/products";

export default async function Home() {
  const [allCategories, products] = await Promise.all([
    getAllCategories(),
    getAllProducts(1, 8),
  ]);

  const categories = (allCategories as any)[0].children;

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Pattern - 100% screen height */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-pattern-dots opacity-30" />
        <BrandedIllustration variant="hero" />
        <FloatingElements />
        <div className="relative">
          <HeroSection />
        </div>
      </div>

      {/* Section Separator */}
      <div className="section-separator"></div>

      {/* Featured Products with Wave Pattern */}
      <section className="relative py-24 section-elevated section-glow mx-4 lg:mx-8">
        <div className="absolute inset-0 bg-pattern-waves opacity-20" />
        <BrandedIllustration variant="section" />
        <div className="relative container mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-8 section-title">
              محصولات ویژه
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              جدیدترین و محبوب‌ترین مجسمه‌های انیمه را با کیفیت برتر تجربه کنید
            </p>
          </div>
          <div className="px-4">
            <FeaturedProducts />
          </div>
        </div>
      </section>

      {/* Section Separator */}
      <div className="section-separator"></div>

      {/* Category Showcase with Grid Pattern */}
      <section className="relative py-24 section-elevated section-glow mx-4 lg:mx-8">
        <div className="absolute inset-0 bg-pattern-grid opacity-15" />
        <BrandedIllustration variant="section" />
        <div className="relative container mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-8 section-title">
              دسته‌بندی‌های محبوب
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              مجموعه‌ای متنوع از مجسمه‌های انیمه در دسته‌بندی‌های مختلف
            </p>
          </div>
          <div className="px-4">
            <CategoryShowcase categories={categories} />
          </div>
        </div>
      </section>

      {/* Section Separator */}
      <div className="section-separator"></div>

      {/* Testimonials with Subtle Pattern */}
      <section className="relative py-24 section-elevated section-glow mx-4 lg:mx-8">
        <div className="absolute inset-0 bg-pattern-dots opacity-10" />
        <BrandedIllustration variant="section" />
        <div className="relative container mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-8 section-title">
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

      {/* Section Separator */}
      <div className="section-separator"></div>

      {/* CTA Section with Gradient Background */}
      <section className="relative py-24 section-elevated section-glow mx-4 lg:mx-8">
        <FloatingElements />
        <div className="relative container mx-auto px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 section-title">
              آماده شروع کلکسیون خود هستید؟
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              به هزاران مشتری دیگر بپیوندید و کلکسیون منحصر به فرد خود را بسازید
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/shop"
                className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl border-0 text-lg"
              >
                مشاهده فروشگاه
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-gray-800 hover:bg-gray-700 border-2 border-primary text-primary hover:text-primary/80 font-semibold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg text-lg"
              >
                درباره ما
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section Separator */}
      <div className="section-separator"></div>
    </div>
  );
}
