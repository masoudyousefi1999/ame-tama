"use client";

import { Button } from "@/components/ui/button";
import ProductGallery from "@/components/product/product-gallery";
import ProductInfo from "@/components/product/product-info";
import ProductTabs from "@/components/product/product-tabs";
import RelatedProducts from "@/components/product/related-products";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ArrowRight } from "lucide-react";

interface ProductPageClientProps {
  product: any;
}

export default function ProductPageClient({
  product,
}: ProductPageClientProps) {
  return (
    <div className="container mx-auto px-4 py-8 mt-20" dir="rtl">
      <div className="mb-2">
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
      </div>
      {/* back link */}
      <div className="mb-6 flex justify-end">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="flex items-center text-muted-foreground hover:text-primary transition-all duration-200 hover:bg-primary/10 rounded-full px-4"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          <span>بازگشت</span>
        </Button>
      </div>
      <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="product-gallery-zoom">
          <ProductGallery images={product.productMedia} alt={product.name} />
        </div>
        <div className="product-info-fade">
          <ProductInfo product={product} />
        </div>
      </div>
      <div className="product-tabs-enter">
        <ProductTabs product={product} />
      </div>
      <div>
        <RelatedProducts uuid={product.uuid} />
      </div>
    </div>
  );
}
