"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { customFetch } from "@/lib/utils";
import { ProductCard } from "../product/product-card";
import { productLimit } from "@/lib/product-limit";
import { GoToTopButton } from "@/components/go-to-top-button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Infinite scroll effect
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loader, hasMore, loading]);

  // Fetch more products
  const fetchMore = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams();
      params.set("page", String(nextPage));
      params.set("limit", String(limit));
      const res = await customFetch(`/product?${params.toString()}`);
      const result = await res.json();
      let newProducts = [];
      let totalCount = initialTotalCount;
      if (Array.isArray(result)) {
        newProducts = result;
        totalCount = result.length + products.length;
      } else {
        newProducts = result.products || [];
        totalCount = result.totalCount || newProducts.length + products.length;
      }
      // Deduplicate by uuid
      setProducts((prev) => {
        const existingUuids = new Set(prev.map((p: any) => p.uuid));
        const filteredNew = newProducts.filter(
          (p: any) => !existingUuids.has(p.uuid)
        );
        return [...prev, ...filteredNew];
      });
      setPage(nextPage);
      setHasMore(products.length + newProducts.length < totalCount);
    } catch (error) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // If initial search/page changes (SSR navigation), update state
  useEffect(() => {
    setProducts(initialProducts);
    setPage(initialPage);
    setHasMore(initialTotalCount > initialProducts.length);
  }, [initialProducts, initialTotalCount, initialPage]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-24 mt-20">
  {/* Breadcrumb */}
  <div className="container mx-auto px-4 md:px-6 pt-6">
    <Breadcrumb
      items={[ 
        { label: "فروشگاه", href: "/shop", isCurrent: true },
      ]}
      className="mb-6"
    />
  </div>

  {/* Hero Section */}
  <section className="relative py-16 md:py-24 overflow-hidden">
    {/* Animated background layers */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />

    {/* Animated gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 animate-pulse" />

    {/* Floating orbs */}
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

    {/* Radial gradients for depth */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(6,182,212,0.4),transparent_40%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.4),transparent_40%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.3),transparent_50%)]" />

    {/* Animated mesh gradient */}
    <div
      className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-500/10 to-transparent animate-pulse"
      style={{ animationDuration: "6s" }}
    />

    {/* Top overlay for better text readability */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

    <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
      <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-6 drop-shadow-lg">
        فروشگاه مجسمه‌های انیمه لوکس
      </h1>
      <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-medium">
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

  {/* Product Grid */}
  <section className="container mx-auto px-4 md:px-6 mt-12">
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h2 className="text-2xl font-bold text-primary">همه محصولات</h2>
      <div className="flex gap-2 items-center">
        <span className="text-sm text-muted-foreground">
          {products.length} محصول نمایش داده می‌شود
        </span>
      </div>
    </div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 lg:grid-cols-3">
      {products && products.length > 0 ? (
        products.map((product) => (
          <ProductCard product={product} key={product.uuid} />
        ))
      ) : (
        <div className="col-span-full py-24 text-center flex flex-col items-center">
          <svg
            width="64"
            height="64"
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
          <p className="text-lg text-muted-foreground mb-2">
            هیچ محصولی یافت نشد
          </p>
          <Button asChild variant="outline" className="rounded-full mt-4">
            <Link href="/">بازگشت به صفحه اصلی</Link>
          </Button>
        </div>
      )}
    </div>

    {/* Loading indicator */}
    {loading && (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )}

    {/* Load more trigger */}
    {hasMore && (
      <div ref={loader} className="h-10 flex justify-center items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    )}
  </section>

  <GoToTopButton />
</div>
  );
}
