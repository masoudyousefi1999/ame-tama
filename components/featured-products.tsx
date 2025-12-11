"use client";
import dynamic from "next/dynamic";
import type { IProductType } from "@/lib/products";

const ProductCard = dynamic(
  () =>
    import("@/components/product/product-card").then((mod) => mod.ProductCard),
  {
    loading: () => <div className="h-72 bg-muted rounded animate-pulse" />,
    ssr: false,
  }
);

interface FeaturedProductsProps {
  limit?: number;
  initialProducts?: IProductType[];
}

export default function FeaturedProducts({
  limit = 8,
  initialProducts = [],
}: FeaturedProductsProps = {}) {
  const products = (initialProducts || []).slice(0, limit);

  if (products.length === 0) {
    return (
      <section id="featured-products" className="py-10">
        <div className="container mx-auto px-2 md:px-4 text-center">
          <p className="text-muted-foreground">هیچ محصولی یافت نشد</p>
        </div>
      </section>
    );
  }

  return (
    <section id="featured-products" className="py-10">
      <div className="container mx-auto px-2 md:px-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.uuid} className="h-full">
              <ProductCard
                product={product}
                showAddToCart
                showAddToWishlist
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
