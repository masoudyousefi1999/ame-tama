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
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length < totalCount);
  const loader = useRef<HTMLDivElement | null>(null);

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

  const fetchMore = useCallback(async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      let url = `/product/category/${category.slug}/${tag.slug}?page=${nextPage}&limit=${productLimit}`;
      const res = await customFetch(url, { method: "GET" });
      const result = await res.json();
      const newProducts = result.products || [];
      setProducts((prev: IProductType[]) => {
        const existingUuids = new Set(prev.map((p: IProductType) => p.uuid));
        const filteredNew = newProducts.filter(
          (p: IProductType) => !existingUuids.has(p.uuid)
        );
        return [...prev, ...filteredNew];
      });
      setPage((prev) => prev + 1);
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(newProducts.length === productLimit);
      }
    } catch (error) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, category.slug, tag.slug]);

  return (
    <div className="min-h-screen bg-background">
      {/* breadcrumb */}
      <div className="container mx-auto px-4 pt-8 pb-4 md:mt-12">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />
      </div>

      {/* Tag Hero Section */}
      <header className="relative mb-16 overflow-hidden rounded-3xl group transition-all ease-in-out">
        <section className="relative py-20 md:py-32 overflow-hidden min-h-[400px] md:min-h-[500px]">
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
                <div className="mb-6">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight tracking-tight">
                    <span className="bg-gradient-to-r from-white via-primary/80 to-accent/80 bg-clip-text text-transparent">
                      {tag.name}
                    </span>
                  </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full mb-6"></div>
                </div>

                {/* Description with better styling */}
                {tag.description && (
                  <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl leading-relaxed font-medium">
                    {tag.description}
                  </p>
                )}

                {/* Stats with enhanced design */}
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-semibold text-lg">
                      {totalCount} محصول موجود
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                    <span className="text-white font-semibold text-lg">
                      در دسته‌بندی {category.name}
                    </span>
                  </div>
                </div>

                {/* Call to action buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="#products"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  >
                    <span>مشاهده محصولات</span>
                    <svg
                      className="w-5 h-5"
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
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300"
                  >
                    <span>بازگشت به {category.name}</span>
                    <svg
                      className="w-5 h-5"
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
            {totalCount} محصول موجود
          </p>
        </div>

        <CategoryProducts products={products} viewMode="grid" />

        {loading && (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground">در حال بارگذاری...</span>
            </div>
          </div>
        )}
        <div ref={loader} />
      </div>
    </div>
  );
}
