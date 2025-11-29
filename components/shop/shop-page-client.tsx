"use client";

import { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { customFetch } from "@/lib/utils";
import { ProductCard } from "../product/product-card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import GradientHero from "@/components/ui/gradient-hero";

const MemoizedProductCard = memo(ProductCard);

interface ShopPageClientProps {
  initialProducts: any[];
  totalCount: number;
  currentPage: number;
  currentSearch?: string;
  limit: number;
}

export default function ShopPageClient({
  initialProducts,
  totalCount: initialTotalCount,
  currentPage: initialPage,
  limit,
}: ShopPageClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(
    initialTotalCount > initialProducts.length
  );
  const loader = useRef<HTMLDivElement | null>(null);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(limit),
      });

      const res = await customFetch(`/product?${params.toString()}`);
      const result = await res.json();

      const newProducts = Array.isArray(result)
        ? result
        : result.products || [];
      const updatedTotalCount = Array.isArray(result)
        ? initialTotalCount
        : result.totalCount || initialTotalCount;

      setProducts((prev) => {
        const existingUuids = new Set(prev.map((p: any) => p.uuid));
        const filteredNew = newProducts.filter(
          (p: any) => !existingUuids.has(p.uuid)
        );
        return filteredNew.length > 0 ? [...prev, ...filteredNew] : prev;
      });

      setPage(nextPage);
      setHasMore(
        (prev) => products.length + newProducts.length < updatedTotalCount
      );
    } catch (error) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, limit, products.length, initialTotalCount]);

  // Optimized intersection observer
  useEffect(() => {
    if (!hasMore || loading || !loader.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const currentLoader = loader.current;
    observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [fetchMore, hasMore, loading]);

  // If initial props change
  useEffect(() => {
    setProducts((prev) => (prev !== initialProducts ? initialProducts : prev));
    setPage((prev) => (prev !== initialPage ? initialPage : prev));
    setHasMore(initialTotalCount > initialProducts.length);
  }, [initialProducts, initialTotalCount, initialPage]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 lg:mt-20 lg:pb-24">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 pt-6">
        <Breadcrumb
          items={[{ label: "فروشگاه", href: "/shop", isCurrent: true }]}
          className="mb-6"
        />
      </div>

      {/* Gradient Hero Section */}
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <GradientHero
          title="فروشگاه وسایل انیمه ای"
          description="جدیدترین و خاص‌ترین وسایل انیمه ای را با تضمین اصالت و کیفیت از AME-TAMA تهیه کنید."
          className="rounded-3xl"
        />
      </div>

      {/* Product Grid */}
      <section className="container mx-auto px-4 md:px-6 mt-8 md:mt-12">
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-primary">
            همه محصولات
          </h2>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              {initialTotalCount} محصول
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products && products.length > 0 ? (
            products.map((product, index) => (
              <MemoizedProductCard
                product={product}
                key={product.uuid}
                eagerLoad={index < 3} // Eager load first 3 products for LCP
              />
            ))
          ) : (
            <div className="col-span-full py-16 md:py-24 text-center flex flex-col items-center">
              <svg
                width="48"
                height="48"
                fill="none"
                viewBox="0 0 24 24"
                className="mb-4 text-muted-foreground"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M3 21V7a2 2 0 0 1 2-2h2m0 0V3m0 2h10m0 0V3m0 2h2a2 2 0 0 1 2 2v14M3 21h18M3 21l3-3m12 3-3-3"
                />
              </svg>
              <p className="text-base md:text-lg text-muted-foreground mb-2">
                هیچ محصولی یافت نشد
              </p>
              <Button asChild variant="outline" className="rounded-full mt-4">
                <Link href="/">بازگشت به صفحه اصلی</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="flex justify-center py-6 md:py-8">
            <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-primary" />
          </div>
        )}

        {/* Infinite scroll trigger */}
        {hasMore && (
          <div
            ref={loader}
            className="h-8 md:h-10 flex justify-center items-center"
          />
        )}
      </section>
    </div>
  );
}
