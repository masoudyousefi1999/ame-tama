"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import FeaturedProducts from "./featured-products";
import { IProductType } from "@/lib/products";

interface FeaturedProductsSectionProps {
  initialProducts?: IProductType[];
}

export default function FeaturedProductsSection({
  initialProducts,
}: FeaturedProductsSectionProps) {
  const isMobile = useIsMobile();

  return (
    <section className="relative py-24 bg-background">
      <div className="relative container mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-8 section-title">
            محصولات ویژه
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            جدیدترین و محبوب‌ترین محصولات انیمه را با کیفیت برتر تجربه کنید
          </p>
        </div>
        <div className="px-4">
          <FeaturedProducts
            initialProducts={initialProducts}
            {...(isMobile ? { limit: 4 } : {})}
          />
        </div>
      </div>
    </section>
  );
}
