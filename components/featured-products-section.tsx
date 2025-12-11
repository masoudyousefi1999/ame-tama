import FeaturedProducts from "./featured-products";
import { IProductType } from "@/lib/products";

interface FeaturedProductsSectionProps {
  initialProducts?: IProductType[];
  limit?: number;
}

export default function FeaturedProductsSection({
  initialProducts,
  limit,
}: FeaturedProductsSectionProps) {
  return (
    <section className="relative py-24 bg-background">
      <div className="relative container mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            محصولات ویژه
          </h2>
          <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-accent" />
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            جدیدترین و محبوب‌ترین محصولات انیمه را با کیفیت برتر تجربه کنید
          </p>
        </div>
        <div className="px-4">
          <FeaturedProducts initialProducts={initialProducts} limit={limit} />
        </div>
      </div>
    </section>
  );
}
