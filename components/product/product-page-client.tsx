"use client";

import { Button } from "@/components/ui/button";
import ProductGallery from "@/components/product/product-gallery";
import ProductInfo from "@/components/product/product-info";
import ProductTabs from "@/components/product/product-tabs";
import RelatedProducts from "@/components/product/related-products";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface ProductPageClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductPageClient({
  product,
  relatedProducts,
}: ProductPageClientProps) {
  return (
    <div className="container mx-auto px-4 py-8 mt-20" dir="rtl">
      <Breadcrumb
        items={[
          { href: "/category/figures", label: "فیگور ها" },
          {
            href: `/category/figures/${product.category.slug}`,
            label: product.category.slug,
          },
          {
            href: product.slug,
            label: product.name,
            isCurrent: true,
          },
        ]}
        className="mb-2"
      />

      {/* back link */}
      <div className="mb-6 flex justify-end">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="flex items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="font-vazirmatn">بازگشت</span>
        </Button>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductGallery images={product.productMedia} alt={product.name} />
        <ProductInfo product={product} />
      </div>

      <ProductTabs product={product} />
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
