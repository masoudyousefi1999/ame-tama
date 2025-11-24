"use client";

import { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customFetch } from "@/lib/utils";
import { ProductCard } from "../product/product-card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [searchQuery, setSearchQuery] = useState("");
  const loader = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const isMobile = useIsMobile();

  // Initialize mobile optimizations - only on mount
  useEffect(() => {
    // Mobile optimizations can be added here if needed
  }, []);

  // Memoize expensive calculations
  const productCount = useMemo(() => products.length, [products.length]);

  // Fetch more products with optimized error handling
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

  const handleSearch = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    },
    [searchQuery, router]
  );

  // Simplified hero section for better performance
  const heroSection = useMemo(
    () => (
      <section className="relative py-12 md:py-20 bg-gradient-to-br from-primary/25 via-primary/10 to-accent/20">
        <div className="container mx-auto px-4 md:px-6 text-center text-foreground">
          <h1 className="text-3xl md:text-6xl font-black mb-4 md:mb-6">
            فروشگاه مجسمه‌های انیمه لوکس
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 font-medium">
            جدیدترین و خاص‌ترین اکشن فیگورهای انیمه را با تضمین اصالت و کیفیت از
            AME-TAMA تهیه کنید.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-xl mx-auto"
            onSubmit={handleSearch}
          >
            <Input
              type="text"
              placeholder="جستجو در محصولات..."
              className="rounded-full bg-card/80 border-border text-foreground placeholder:text-muted-foreground flex-1 min-w-0 focus:bg-card focus:border-primary/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2"
            >
              جستجو
            </Button>
          </form>
        </div>
      </section>
    ),
    [searchQuery, handleSearch]
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 lg:mt-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 pt-6">
        <Breadcrumb
          items={[{ label: "فروشگاه", href: "/shop", isCurrent: true }]}
          className="mb-6"
        />
      </div>

      {/* Optimized Hero Section */}
      {heroSection}

      {/* Product Grid */}
      <section className="container mx-auto px-4 md:px-6 mt-8 md:mt-12">
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-primary">
            همه محصولات
          </h2>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              {productCount} محصول نمایش داده می‌شود
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
