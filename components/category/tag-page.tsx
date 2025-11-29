"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import CategoryProducts from "@/components/category/category-products";
import { type ICategoryType } from "@/lib/categories";
import { type ITagType } from "@/lib/tags";
import { customFetch } from "@/lib/utils";
import Link from "next/link";
import { IProductType } from "@/lib/products";
import { productLimit } from "@/lib/product-limit";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import GradientHero from "@/components/ui/gradient-hero";

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
      <div className="container mx-auto px-4 pt-8 pb-4 lg:mt-20">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />
      </div>

      {/* Tag Hero Section */}
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <GradientHero
          title={tag.name}
          description={tag.description || null}
          image={tag.image?.url || null}
          stats={[
          { label: `${resolvedTotalCount} محصول موجود` },
          { label: `در دسته‌بندی ${category.name}` },
        ]}
        actions={[
          {
            label: "مشاهده محصولات",
            href: "#products",
            icon: (
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
            ),
          },
          {
            label: `بازگشت به ${category.name}`,
            href: `/${category.slug}`,
            icon: (
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
            ),
            variant: "secondary",
            prefetch: false,
          },
        ]}
        />
      </div>
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
