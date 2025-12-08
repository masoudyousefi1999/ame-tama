"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBreadcrumb } from "@/context/breadcrumb-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CustomImage as Image } from "@/components/ui/custom-image";
import GradientHero from "@/components/ui/gradient-hero";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn, customFetch } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ITagType } from "@/lib/tags";
import type { ICategoryType } from "@/lib/categories";
import type { IProductType } from "@/lib/products";
import { productLimit } from "@/lib/product-limit";

interface AnimePageClientProps {
  tag: ITagType;
  categories: ICategoryType[];
  products: IProductType[];
  totalCount: number;
  initialPage?: number;
  initialLimit?: number;
}

export default function AnimePageClient({
  tag,
  categories,
  products,
  totalCount,
  initialPage = 1,
  initialLimit = productLimit,
}: AnimePageClientProps) {
  const { setBreadcrumbs } = useBreadcrumb();
  const isMobile = useIsMobile();
  const loader = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resolvedTotalCount, setResolvedTotalCount] = useState(totalCount);

  const enrichedInitialProducts = useMemo(
    () =>
      (products || []).map((product) => ({
        ...product,
        tags: product.tags && product.tags.length > 0 ? product.tags : [tag],
      })),
    [products, tag]
  );

  const [displayProducts, setDisplayProducts] = useState(
    enrichedInitialProducts
  );
  const [page, setPage] = useState(() =>
    enrichedInitialProducts.length > 0 || totalCount > 0 ? initialPage : 0
  );
  const [hasMore, setHasMore] = useState(
    enrichedInitialProducts.length < totalCount
  );

  useEffect(() => {
    setDisplayProducts(enrichedInitialProducts);
    setPage(
      enrichedInitialProducts.length > 0 || totalCount > 0 ? initialPage : 0
    );
    setHasMore(enrichedInitialProducts.length < totalCount);
    setResolvedTotalCount(totalCount);
  }, [enrichedInitialProducts, totalCount, initialPage]);

  // Memoize breadcrumb items
  const breadcrumbItems = useMemo(
    () => [
      {
        label: "انیمه",
        href: "/anime",
      },
      {
        label: tag.name || "",
        href: `/anime/${tag.slug || ""}`,
        isCurrent: true,
      },
    ],
    [tag.name, tag.slug]
  );

  useEffect(() => {
    setBreadcrumbs(breadcrumbItems);
  }, [setBreadcrumbs, breadcrumbItems]);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const nextPage = page + 1;
      const response = await customFetch(
        `/tag/${tag.slug}?page=${nextPage}&limit=${initialLimit}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch more products");
      }

      const result = await response.json();
      const responseProducts: IProductType[] =
        result?.products ?? result?.tag?.products ?? [];
      const newProducts = Array.isArray(responseProducts)
        ? responseProducts
        : [];
      const newTotalCount: number | undefined =
        result?.totalCount ?? result?.tag?.totalCount;

      let appendedCount = 0;
      let updatedTotalCount = 0;

      setDisplayProducts((prev) => {
        const existingUuids = new Set(prev.map((product) => product.uuid));
        const merged = newProducts
          .filter(
            (product) => product?.uuid && !existingUuids.has(product.uuid)
          )
          .map((product) => ({
            ...product,
            tags:
              product.tags && product.tags.length > 0 ? product.tags : [tag],
          }));

        appendedCount = merged.length;
        updatedTotalCount = prev.length + merged.length;

        return merged.length > 0 ? [...prev, ...merged] : prev;
      });

      setPage(nextPage);

      if (typeof newTotalCount === "number") {
        setResolvedTotalCount(newTotalCount);
      }

      const effectiveTotal =
        typeof newTotalCount === "number" ? newTotalCount : resolvedTotalCount;

      if (
        newProducts.length < initialLimit ||
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
    hasMore,
    loading,
    page,
    resolvedTotalCount,
    tag,
    totalCount,
    initialLimit,
  ]);

  useEffect(() => {
    if (!hasMore || loading) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loader.current;

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [fetchMore, hasMore, loading]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-24 lg:mt-20">
      <div className="container mx-auto px-4 md:px-6 pt-6">
        {/* breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Hero Header */}
        <div className="mb-8">
          <GradientHero
            title={tag.name}
            description={tag.description || null}
            image={tag.image?.url || null}
            stats={[
              { label: `${resolvedTotalCount} محصول موجود` },
              ...(categories.length > 0
                ? [{ label: `${categories.length} دسته‌بندی` }]
                : []),
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
                label: "بازگشت به انیمه‌ها",
                href: "/anime",
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

        {/* Categories Section */}
        {categories && categories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">
              دسته‌بندی‌های {tag.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}/${tag.slug}`}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300",
                    isMobile
                      ? "shadow-md hover:shadow-lg"
                      : "shadow-lg hover:shadow-2xl hover:scale-[1.02]"
                  )}
                >
                  <div className="relative aspect-square w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        quality={80}
                        onError={() => {
                          console.error(
                            `Category image failed to load: ${category.name}`
                          );
                        }}
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
                        <span className="text-4xl opacity-50">📦</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                    {/* Overlay with category name */}
                    <div className="absolute inset-0 flex items-end p-3">
                      <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 w-full">
                        <h3 className="text-white font-semibold text-xs md:text-sm truncate">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Products Section */}
        <section id="products" className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              محصولات {tag.name}
            </h2>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">
                {displayProducts.length} محصول نمایش داده می‌شود از{" "}
                {resolvedTotalCount}
              </span>
            </div>
          </div>

          {displayProducts && displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {displayProducts.map((product, index) => (
                <ProductCard
                  key={product.uuid}
                  product={product}
                  eagerLoad={index < 4}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 md:py-24">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 bg-muted/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  هیچ محصولی یافت نشد
                </h3>
                <p className="text-muted-foreground mb-6">
                  متأسفانه برای این انیمه محصولی موجود نیست
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="default">
                    <Link href="/anime">مشاهده همه انیمه‌ها</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/shop">مشاهده فروشگاه</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-8 text-center text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-muted-foreground">
                  در حال بارگذاری...
                </span>
              </div>
            </div>
          )}
          <div ref={loader} className="h-12" />
        </section>
      </div>
    </div>
  );
}
