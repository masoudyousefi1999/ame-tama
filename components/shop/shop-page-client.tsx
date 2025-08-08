"use client";

import { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customFetch } from "@/lib/utils";
import { ProductCard } from "../product/product-card";
import { GoToTopButton } from "@/components/go-to-top-button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { optimizeForMobile } from "@/lib/performance-monitor";

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

  // Initialize mobile optimizations
  useEffect(() => {
    optimizeForMobile();
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

  // Optimized intersection observer with throttling
  useEffect(() => {
    if (!hasMore || loading || !loader.current) return;

    let timeoutId: NodeJS.Timeout;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Throttle the fetch to prevent rapid calls
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            fetchMore();
          }, 100);
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
      clearTimeout(timeoutId);
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

  // Optimized hero section for mobile
  const heroSection = useMemo(
    () => (
      <section className="relative py-12 md:py-20 overflow-hidden">
        {/* Simplified background for mobile */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />

        {/* Reduced animated elements on mobile */}
        {!isMobile && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 animate-pulse" />
            <div
              className="absolute top-20 left-20 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl animate-bounce"
              style={{ animationDelay: "0s", animationDuration: "3s" }}
            />
            <div
              className="absolute top-40 right-32 w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-bounce"
              style={{ animationDelay: "1s", animationDuration: "4s" }}
            />
            <div
              className="absolute bottom-20 left-1/3 w-28 h-28 bg-purple-400/20 rounded-full blur-xl animate-bounce"
              style={{ animationDelay: "2s", animationDuration: "3.5s" }}
            />
            <div
              className="absolute bottom-32 right-20 w-20 h-20 bg-pink-400/20 rounded-full blur-xl animate-bounce"
              style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
            />
          </>
        )}

        {/* Simplified gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(6,182,212,0.3),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.3),transparent_40%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h1 className="text-3xl md:text-6xl font-black bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-4 md:mb-6 drop-shadow-lg">
            فروشگاه مجسمه‌های انیمه لوکس
          </h1>
          <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto mb-6 md:mb-8 font-medium">
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
              className="rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 flex-1 min-w-0 focus:bg-white/20 focus:border-white/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25"
            >
              جستجو
            </Button>
          </form>
        </div>
      </section>
    ),
    [isMobile, searchQuery, handleSearch]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-24 mt-20">
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
            products.map((product) => (
              <MemoizedProductCard product={product} key={product.uuid} />
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

      <GoToTopButton />
    </div>
  );
}
