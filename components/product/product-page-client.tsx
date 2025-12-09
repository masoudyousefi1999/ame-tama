"use client";

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import ProductGallery from "@/components/product/product-gallery";
import ProductInfo from "@/components/product/product-info";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ArrowRight } from "lucide-react";
import { IProductType } from "@/lib/products";
import { useEffect, useRef, useState } from "react";

const ProductTabs = dynamic(() => import("@/components/product/product-tabs"), {
  loading: () => null,
  ssr: false,
});

const RelatedProducts = dynamic(
  () => import("@/components/product/related-products"),
  {
    ssr: false,
  }
);

interface ProductPageClientProps {
  product: IProductType;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const relatedRef = useRef<HTMLDivElement | null>(null);
  const [showRelated, setShowRelated] = useState(false);

  // Lazy-mount related products only when near viewport
  useEffect(() => {
    if (showRelated) return;
    const el = relatedRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowRelated(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [showRelated]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 lg:mt-20" dir="rtl">
        <div className="mb-2">
          <Breadcrumb
            items={[
              {
                href: `/${product.category.slug}`,
                label: product.category.name,
              },
              {
                href: `/${product.category.slug}/${product.tags[0].slug}`,
                label: product.tags[0].name,
              },
              {
                href: `/${product.category.slug}/${product.tags[0].slug}/${product.slug}`,
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
        <div ref={relatedRef}>
          {showRelated && <RelatedProducts uuid={product.uuid} />}
        </div>
      </div>
    </div>
  );
}
