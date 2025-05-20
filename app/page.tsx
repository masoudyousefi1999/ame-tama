import HeroSection from "@/components/hero-section";
import FeaturedProducts from "@/components/featured-products";
import CategoryFilter from "@/components/category-filter";
import TestimonialSection from "@/components/testimonial-section";
import ShopCTA from "@/components/shop/shop-cta";

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen">
      <HeroSection />
      <CategoryFilter />
      <ShopCTA />
      <FeaturedProducts />
      <TestimonialSection />
    </main>
  );
}
