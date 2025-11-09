"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import CategoryProducts from "@/components/category/category-products";
import { type ICategoryType } from "@/lib/categories";
import { type ITagType } from "@/lib/tags";
import { customFetch } from "@/lib/utils";
import Link from "next/link";
import { IProductType } from "@/lib/products";
import { CustomImage as Image } from "@/components/ui/custom-image";
import { productLimit } from "@/lib/product-limit";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface TagPageProps {
  category: {
    id: number;
    name: string;
    slug: string;
  };
  tag: {
    createdAt: string;
    updatedAt: string;
    uuid: string;
    name: string;
    slug: string;
    description: string;
    image: {
      createdAt: string;
      updatedAt: string;
      uuid: string;
      fileExtension: string;
      mediaType: number;
      fileSize: number;
      url: string;
    };
  };
  page: number;
  products: IProductType[];
  totalCount: number;
  limit: number;
}

export default function TagPage({
  category,
  tag,
  page: initialPage,
  products: initialProducts,
  totalCount,
  limit,
}: TagPageProps) {
  const [displayProducts, setDisplayProducts] = useState(initialProducts);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resolvedTotalCount, setResolvedTotalCount] = useState(totalCount);
  const [hasMore, setHasMore] = useState(initialProducts.length < totalCount);
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDisplayProducts(initialProducts);
    setPage(initialPage);
    setHasMore(initialProducts.length < totalCount);
    setResolvedTotalCount(totalCount);
  }, [initialProducts, initialPage, totalCount]);

  // Memoize breadcrumb items
  const breadcrumbItems = useMemo(
    () => [
      {
        label: category.name,
        href: `/${category.slug}`,
      },
      {
        label: tag.name,
        href: `/${category.slug}/${tag.slug}`,
        isCurrent: true,
      },
    ],
    [category.name, category.slug, tag.name, tag.slug]
  );

  const fallbackTag = useMemo(
    () =>
      ({
        ...tag,
        categories: [],
        products: [],
      }) as unknown as ITagType,
    [tag]
  );

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const nextPage = page + 1;
    const url = `/category/${category.slug}/${tag.slug}?page=${nextPage}&limit=${productLimit}`;
      const res = await customFetch(url, { method: "GET" });

      if (!res.ok) {
        if (res.status === 404) {
          setHasMore(false);
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch more products");
      }

      const result = await res.json();
      const responseProducts: IProductType[] =
        result?.products ?? result?.tag?.products ?? [];
      const newProducts = Array.isArray(responseProducts)
        ? responseProducts
        : [];
      const newTotalCount: number | undefined =
        result?.totalCount ?? result?.tag?.totalCount;

      let appendedCount = 0;
      let updatedTotalCount = 0;

      setDisplayProducts((prev: IProductType[]) => {
        const existingUuids = new Set(prev.map((p: IProductType) => p.uuid));
        const filteredNew = newProducts
          .filter(
            (p: IProductType) => p?.uuid && !existingUuids.has(p.uuid)
          )
          .map((p) => {
            if (!p.tags || p.tags.length === 0) {
              return {
                ...p,
                tags: [fallbackTag],
              };
            }
            return p;
          });

        appendedCount = filteredNew.length;
        updatedTotalCount = prev.length + filteredNew.length;

        return filteredNew.length > 0 ? [...prev, ...filteredNew] : prev;
      });

      setPage(nextPage);

      if (typeof newTotalCount === "number") {
        setResolvedTotalCount(newTotalCount);
      }

      const effectiveTotal =
        typeof newTotalCount === "number"
          ? newTotalCount
          : resolvedTotalCount;

      if (
        newProducts.length < productLimit ||
        updatedTotalCount >= effectiveTotal ||
        appendedCount === 0
      ) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more products:", error);
      setErrorMessage("خطا در بارگذاری محصولات بیشتر");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [
    category.slug,
    fallbackTag,
    hasMore,
    loading,
    page,
    resolvedTotalCount,
    tag.slug,
  ]);

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
  }, [fetchMore, hasMore, loading]);

  return (
    <div className="min-h-screen bg-background">
      {/* breadcrumb */}
      <div className="container mx-auto px-4 pt-8 pb-4 md:mt-12">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />
      </div>

      {/* Tag Hero Section */}
      <header className="relative mb-12 overflow-hidden rounded-3xl group transition-all ease-in-out">
        <section className="relative py-12 md:py-20 overflow-hidden min-h-[300px] md:min-h-[350px]">
          {/* Dynamic gradient background based on tag */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />

          {/* Animated floating elements */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute top-32 right-20 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-primary/10 rounded-full blur-2xl animate-pulse delay-2000" />
          <div className="absolute bottom-32 right-1/3 w-28 h-28 bg-accent/10 rounded-full blur-2xl animate-pulse delay-500" />

          {/* Background Image with enhanced overlay */}
          <div className="absolute inset-0">
            {tag.image?.url ? (
              <Image
                src={tag.image.url}
                alt={tag.name}
                fill
                sizes="100vw"
                className="object-cover opacity-25 group-hover:opacity-35 transition-all duration-700 scale-105 group-hover:scale-110"
                priority
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-8xl opacity-60 animate-bounce">🎭</span>
              </div>
            )}
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
          </div>

          {/* Content with better typography and layout */}
          <div className="relative z-10 flex items-center h-full">
            <div className="container mx-auto px-6">
              <div className="max-w-5xl">
                {/* Tag title with enhanced styling */}
                <div className="mb-4">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight tracking-tight">
                    <span className="bg-gradient-to-r from-white via-primary/80 to-accent/80 bg-clip-text text-transparent">
                      {tag.name}
                    </span>
                  </h1>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full mb-4"></div>
                </div>

                {/* Description with better styling */}
                {tag.description && (
                  <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl leading-relaxed font-medium">
                    {tag.description}
                  </p>
                )}

                {/* Stats with enhanced design */}
                <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium text-sm">
                    {resolvedTotalCount} محصول موجود
                  </span>
                </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                    <span className="text-white font-medium text-sm">
                      در دسته‌بندی {category.name}
                    </span>
                  </div>
                </div>

                {/* Call to action buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="#products"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    <span>مشاهده محصولات</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </Link>
                  <Link
                    href={`/${category.slug}`}
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300"
                  >
                    <span>بازگشت به {category.name}</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </section>
      </header>

      {/* Products section */}
      <div id="products" className="container mx-auto px-4 pb-16">
        {/* Products header */}
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-2">
            محصولات {tag.name}
          </h3>
          <p className="text-muted-foreground text-lg">
            {displayProducts.length} محصول نمایش داده می‌شود از{" "}
            {resolvedTotalCount}
          </p>
        </div>

        <CategoryProducts products={displayProducts} viewMode="grid" />

        {errorMessage && (
          <div className="mt-8 text-center text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground">در حال بارگذاری...</span>
            </div>
          </div>
        )}
        <div ref={loader} className="h-12" />
      </div>
    </div>
  );
}
