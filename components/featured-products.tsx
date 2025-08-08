"use client";

import type React from "react";
import { useEffect, useState, useCallback, memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { getAllProducts, IProductType } from "@/lib/products";
import { toast } from "@/components/ui/use-toast";
import dynamic from "next/dynamic";
import { useIsMobile } from "@/hooks/use-mobile";

// 🧠 Dynamically import ProductCard to reduce initial bundle
const ProductCard = dynamic(
  () =>
    import("@/components/product/product-card").then((mod) => mod.ProductCard),
  {
    loading: () => <div className="h-72 bg-muted rounded animate-pulse" />,
    ssr: false,
  }
);

// 🚀 Memoize grid wrapper
const MemoizedProductCard = memo(ProductCard);

export default function FeaturedProducts({ limit }: { limit?: number } = {}) {
  const { addItem } = useCart();
  const [products, setProducts] = useState<IProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const result = (await getAllProducts(2, 6)) as any;
        const { products } = result;

        if (isMounted) {
          setProducts(products || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          variant: "error",
          title: "خطا در بارگذاری محصولات",
          description:
            "امکان بارگذاری محصولات وجود ندارد. لطفاً دوباره تلاش کنید.",
          duration: 2000,
        });
        setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const addProductToCart = useCallback(
    (product: any, event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      try {
        addItem(product, 1);
        toast({
          variant: "cart",
          title: "محصول به سبد خرید اضافه شد",
          description: `${product.name} به سبد خرید شما اضافه شد.`,
          duration: 2000,
        });
      } catch {
        toast({
          variant: "error",
          title: "خطا در افزودن به سبد خرید",
          description: "امکان افزودن محصول به سبد خرید وجود ندارد.",
          duration: 2000,
        });
      }
    },
    [addItem]
  );

  // Memoize displayed products to prevent unnecessary re-renders
  const displayedProducts = useMemo(() => {
    return limit ? products.slice(0, limit) : products;
  }, [products, limit]);

  // Memoize loading skeletons
  const loadingSkeletons = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-72 bg-muted rounded animate-pulse" />
      )),
    []
  );

  return (
    <section id="featured-products" className="py-10">
      <div className="container mx-auto px-2 md:px-4">
        <div className="mb-6 text-center">
          <h2 className="text-primary text-2xl font-bold mb-2">
            مجسمه‌های لوکس ویژه
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground text-sm">
            {loading
              ? "در حال بارگذاری محصولات..."
              : "جدیدترین محصولات ما را بررسی کنید"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            loadingSkeletons
          ) : displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <div key={product.uuid} className="h-full">
                <MemoizedProductCard
                  product={product}
                  showAddToCart
                  showAddToWishlist
                  key={product.uuid}
                  className="h-full"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center">
              <p className="text-muted-foreground">هیچ محصولی یافت نشد</p>
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link href="/shop">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-border hover:bg-accent hover:text-accent-foreground"
            >
              مشاهده همه مجسمه‌های لوکس
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
