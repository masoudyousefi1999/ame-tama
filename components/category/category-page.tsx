"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import CategoryProducts from "@/components/category/category-products";
import { type ICategoryType } from "@/lib/categories";
import { customFetch } from "@/lib/utils";
import Link from "next/link";
import { IProductType } from "@/lib/products";
import { CustomImage as Image } from "@/components/ui/custom-image";
import CategoryHeader from "./category-header";
import { productLimit } from "@/lib/product-limit";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface CategoryPageProps {
  category: ICategoryType & { image: string };
  page: number;
  products: IProductType[];
  totalCount: number;
  limit: number;
}

export default function CategoryPage({
  category,
  page: initialPage,
  products: initialProducts,
  totalCount,
  limit,
}: CategoryPageProps) {
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
        isCurrent: true,
      },
    ],
    [category.name, category.slug]
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
      let url = `/product/category/${category.slug}?page=${nextPage}&limit=${productLimit}`;
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
  }, [page, category.slug]);

  // Memoize tags section with modern minimal design
  const tagsSection = useMemo(() => {
    if (!category.tags || category.tags.length === 0) return null;

    return (
      <section className="mb-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            انیمه‌های موجود در {category.name}
          </h2>
          <p className="text-muted-foreground text-lg">
            مجموعه کامل محصولات انیمه‌ای با بهترین کیفیت
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {category.tags.map((tag) => (
            <Link
              key={tag.uuid}
              prefetch={false}
              href={`/${category.slug}/${tag.slug}`}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-card border border-border/50 transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-lg"
            >
              <Image
                src={tag.image?.url ?? "/placeholder.jpg"}
                alt={tag.name}
                fill
                sizes="(max-width:640px) 50vw, (max-width:768px) 33vw, (max-width:1024px) 25vw, (max-width:1280px) 20vw, 16vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                quality={80}
              />

              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Tag name */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="block text-sm font-semibold text-white text-center drop-shadow-lg transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                  {tag.name}
                </span>
              </div>

              {/* Hover effect indicator */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-8 text-center">
          <Link
            href={`/shop?category=${category.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium transition-all duration-300 hover:bg-primary/90 hover:scale-105"
          >
            مشاهده همه محصولات
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </section>
    );
  }, [category.tags, category.name, category.slug]);

  return (
    <div className="min-h-screen bg-background">
      {/* breadcrumb */}
      <div className="container mx-auto px-4 pt-8 pb-4 md:mt-12">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />
      </div>

      {/* hero header */}
      <CategoryHeader category={category} />

      {/* tags section */}
      <div className="container mx-auto px-4">{tagsSection}</div>

      {/* Products section */}
      <div id="products" className="container mx-auto px-4 pb-16">
        {/* Products header */}
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-2">
            محصولات {category.name}
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
