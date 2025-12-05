import HeroSection from "@/components/hero-section";
import FeaturedProductsSection from "@/components/featured-products-section";
import ServerCustomerReviews from "@/components/server-customer-reviews";
import CategoryShowcase from "@/components/shop/category-showcase";
import { getAllCategories } from "@/lib/categories";
import { getAllProducts } from "@/lib/products";
import { getAllTags, ITagType } from "@/lib/tags";
import AnimeShowcase from "@/components/animes/anime-showcase";
import BlogSection from "@/components/home/blog-section";
import { getLatestBlogs, getPopularBlogs } from "@/lib/blog";

export default async function Home() {
  let allCategories: any[] = [];
  let productsResult: any = { products: [] };
  let tagsResult: any = { tags: [] };

  let latestBlogs: any[] = [];
  let popularBlogs: any[] = [];

  try {
    const [
      categoriesData,
      productsData,
      tagsData,
      latestBlogsData,
      popularBlogsData,
    ] = await Promise.all([
      getAllCategories({
        next: { tags: ["categories"] }, // 10 minutes cache
      }),
      getAllProducts(1, 8, {
        next: { tags: ["products", "homepage"] }, // 5 minutes cache
      }),
      getAllTags(1, 6, {
        next: { tags: ["tags", "homepage"] }, // 5 minutes cache
      }),
      getLatestBlogs(3),
      getPopularBlogs(3),
    ]);

    allCategories = categoriesData || [];
    productsResult = productsData || { products: [] };
    tagsResult = tagsData || { tags: [] };
    latestBlogs = latestBlogsData || [];
    popularBlogs = popularBlogsData || [];
  } catch (error) {
    console.warn("Failed to fetch data for homepage:", error);
    // Use empty arrays as fallback
  }

  const categories = allCategories || [];
  const products = productsResult.products || [];
  const tags = tagsResult.tags || [];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Cleanup script for unused preloads */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Clean up unused preloads after page load
            window.addEventListener('load', function() {
              setTimeout(() => {
                const preloadLinks = document.querySelectorAll('link[rel="preload"][as="image"]');
                preloadLinks.forEach((link) => {
                  const href = link.getAttribute('href');
                  if (href) {
                    const imgElements = document.querySelectorAll(\`img[src="\${href}"]\`);
                    if (imgElements.length === 0) {
                      link.remove();
                    }
                  }
                });
              }, 1000);
            });
          `,
        }}
      />
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-pattern-dots opacity-20 pointer-events-none" />
        <div className="relative z-10">
          <HeroSection />
        </div>
      </div>

      {/* Featured Products */}
      <FeaturedProductsSection initialProducts={products} />

      {/* Category Showcase */}
      <section className="relative py-16 md:py-24 bg-muted/60">
        <div className="absolute inset-0 bg-pattern-grid opacity-10 pointer-events-none" />
        <div className="relative container mx-auto px-6 lg:px-8 z-10">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 md:mb-8 section-title">
              تنوع محصول
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              مجموعه‌ای متنوع از دسته‌بندی‌های مختلف برای انتخاب بهترین محصولات
              انیمه
            </p>
          </div>
          <div className="px-4">
            <CategoryShowcase categories={categories as any} />
          </div>
        </div>
      </section>

      {/* Tags Showcase */}
      <section className="relative py-16 md:py-24 bg-background">
        <div className="absolute inset-0 bg-pattern-dots opacity-10 pointer-events-none" />
        <div className="relative container mx-auto px-6 lg:px-8 z-10">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 md:mb-8 section-title">
              انیمه مورد علاقه‌ات رو انتخاب کن
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              محصولات متنوع انیمه مورد علاقه‌ات رو ببین و بهترین محصولات رو پیدا
              کن
            </p>
          </div>
          <div className="px-4">
            <AnimeShowcase tags={tags as ITagType[]} />
          </div>
        </div>
      </section>

      {/* Latest Blogs */}
      <BlogSection
        blogs={latestBlogs}
        title="جدیدترین بلاگ‌ها"
        description="آخرین مقالات و مطالب منتشر شده در AME-TAMA"
      />

      {/* Popular Blogs */}
      {popularBlogs.length > 0 && (
        <BlogSection
          blogs={popularBlogs}
          title="محبوب‌ترین بلاگ‌ها"
          description="پربازدیدترین مقالات و مطالب AME-TAMA"
          bgColor="bg-background"
        />
      )}

      {/* Testimonials */}
      <section className="relative py-16 md:py-24 bg-muted/60">
        <div className="absolute inset-0 bg-pattern-dots opacity-10 pointer-events-none" />
        <div className="relative container mx-auto px-6 lg:px-8 z-10">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 md:mb-8 section-title">
              نظرات مشتریان
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              تجربیات واقعی مشتریان ما از کیفیت و خدمات AME-TAMA
            </p>
          </div>
          <div className="px-4">
            <ServerCustomerReviews />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-24 bg-background">
        <div className="relative container mx-auto px-6 lg:px-8 z-10">
          <div className="max-w-4xl mx-auto rounded-3xl bg-card/80 border border-border/60 px-6 py-12 md:px-10 md:py-16 text-center shadow-2xl backdrop-blur">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 md:mb-8">
              آماده شروع کلکسیون خود هستید؟
            </h2>
            <p className="text-lg text-muted-foreground mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed">
              به هزاران مشتری دیگر بپیوندید و کلکسیون منحصر به فرد خود را بسازید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              <a
                href="/shop"
                className="inline-flex items-center justify-center px-8 md:px-10 py-3 md:py-4 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold transition-transform duration-200 hover:scale-105 shadow-lg shadow-primary/30"
              >
                مشاهده فروشگاه
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center px-8 md:px-10 py-3 md:py-4 rounded-full border border-border/70 text-foreground hover:text-primary hover:border-primary font-semibold transition-transform duration-200 hover:scale-105 bg-transparent"
              >
                درباره ما
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
