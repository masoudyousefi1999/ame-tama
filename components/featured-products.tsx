"use client";

import type React from "react";
import { useEffect, useState, useCallback, memo, useMemo, useRef } from "react";
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

// Cache for featured products
const featuredProductsCache = new Map<string, IProductType[]>();
const pendingFeaturedRequests = new Map<string, Promise<any>>();

interface FeaturedProductsProps {
  limit?: number;
  initialProducts?: IProductType[];
}

export default function FeaturedProducts({
  limit,
  initialProducts,
}: FeaturedProductsProps = {}) {
  const { addItem } = useCart();
  const [products, setProducts] = useState<IProductType[]>(
    initialProducts || []
  );
  const [loading, setLoading] = useState(!initialProducts);
  const isMobile = useIsMobile();
  const hasFetched = useRef(!!initialProducts);

  useEffect(() => {
    // If we have initial products, use them and don't fetch
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      setLoading(false);
      return;
    }

    // Prevent duplicate calls
    if (hasFetched.current) return;
    hasFetched.current = true;

    let isMounted = true;
    const cacheKey = `featured-${limit || "default"}`;

    (async () => {
      try {
        // Check cache first
        if (featuredProductsCache.has(cacheKey)) {
          if (isMounted) {
            setProducts(featuredProductsCache.get(cacheKey)!);
            setLoading(false);
          }
          return;
        }

        // Check if request is already pending
        if (pendingFeaturedRequests.has(cacheKey)) {
          try {
            const result = await pendingFeaturedRequests.get(cacheKey)!;
            if (isMounted) {
              setProducts(result.products || []);
              featuredProductsCache.set(cacheKey, result.products || []);
            }
          } catch (error) {
            console.error("Error fetching featured products:", error);
          } finally {
            if (isMounted) setLoading(false);
          }
          return;
        }

        // Make new request
        const requestPromise = getAllProducts(2, 6);
        pendingFeaturedRequests.set(cacheKey, requestPromise);

        const result = await requestPromise;
        const { products } = result;

        if (isMounted) {
          setProducts(products || []);
          featuredProductsCache.set(cacheKey, products || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        if (isMounted) {
          toast({
            variant: "error",
            title: "خطا در بارگذاری محصولات",
            description:
              "امکان بارگذاری محصولات وجود ندارد. لطفاً دوباره تلاش کنید.",
            duration: 2000,
          });
          setProducts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
        pendingFeaturedRequests.delete(cacheKey);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [limit, initialProducts]);

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
