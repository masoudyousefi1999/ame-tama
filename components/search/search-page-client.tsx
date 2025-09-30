"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { customFetch } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { ProductCard } from "../product/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";

interface SearchPageClientProps {
  initialResults: any[];
  query: string;
  currentPage: number;
  totalPages: number;
}

export default function SearchPageClient({
  initialResults,
  query: initialQuery,
  currentPage,
  totalPages: initialTotalPages,
}: SearchPageClientProps) {
  const [results, setResults] = useState(initialResults);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(currentPage);
  const [hasMore, setHasMore] = useState(initialResults.length > 0);
  const loader = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

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

  // Fetch more results
  const fetchMore = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams();
      params.set("search", query);
      params.set("page", String(nextPage));
      params.set("limit", "12"); // or use productLimit if available
      const res = await customFetch(`/product/search?${params.toString()}`);
      const data = await res.json();
      let newResults = [];
      if (Array.isArray(data)) {
        newResults = data;
      } else if (Array.isArray(data.products)) {
        newResults = data.products;
      }
      // Deduplicate by uuid
      setResults((prev) => {
        const existingUuids = new Set(prev.map((p: any) => p.uuid));
        const filteredNew = newResults.filter(
          (p: any) => !existingUuids.has(p.uuid)
        );
        return [...prev, ...filteredNew];
      });
      setPage(nextPage);
      setHasMore(newResults.length > 0);
    } catch (error) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Reset state on SSR navigation
  useEffect(() => {
    setResults(initialResults);
    setPage(currentPage);
    setHasMore(initialResults.length > 0);
  }, [initialResults, currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-24 mt-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 pt-6">
        <Breadcrumb
          items={[{ label: "جستجو", href: "/search", isCurrent: true }]}
          className="mb-6"
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Animated background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-cyan-500/30 animate-pulse" />

        {/* Floating orbs */}
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-pink-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-28 h-28 bg-cyan-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        />
        <div
          className="absolute bottom-32 right-20 w-20 h-20 bg-pink-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        />

        {/* Radial gradients for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(236,72,153,0.4),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.4),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.3),transparent_50%)]" />

        {/* Top overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-pink-200 to-cyan-200 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            جستجو در محصولات انیمه
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-medium">
            نام محصول، شخصیت یا سری انیمه مورد نظر خود را جستجو کنید.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-xl mx-auto"
            onSubmit={handleSearch}
          >
            <Input
              type="text"
              placeholder="جستجو در محصولات..."
              className="rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 flex-1 min-w-0 focus:bg-white/20 focus:border-white/40"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              type="submit"
              className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/25"
            >
              جستجو
            </Button>
          </form>
          {initialQuery && (
            <p className="text-white/80 mt-4 font-medium">
              نتایج جستجو برای «{initialQuery}»
            </p>
          )}
        </div>
      </section>

      {/* Results Grid */}
      <section className="container mx-auto px-4 md:px-6 mt-12">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-primary">نتایج جستجو</h2>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              {results.length} محصول نمایش داده می‌شود
            </span>
          </div>
        </div>

        {/* Adjust the grid layout with smaller gap on mobile */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 lg:grid-cols-3">
          {results && results.length > 0 ? (
            results.map((product) => (
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-lg text-muted-foreground mb-2">
                هیچ محصولی یافت نشد
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                سعی کنید کلمات کلیدی دیگری استفاده کنید
              </p>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/shop">مشاهده همه محصولات</Link>
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
    </div>
  );
}
