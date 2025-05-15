import HeroSection from "@/components/hero-section"
import FeaturedProducts from "@/components/featured-products"
import CategoryFilter from "@/components/category-filter"
import TestimonialSection from "@/components/testimonial-section"

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen">
      <HeroSection />
      <CategoryFilter />
      <FeaturedProducts />
      <TestimonialSection />
    </main>
  )
}
