"use client";

import { useEffect, useMemo } from "react";
import { useBreadcrumb } from "@/context/breadcrumb-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CustomImage as Image } from "@/components/ui/custom-image";
import { ProductCard } from "@/components/product/product-card";
import { PaginationWrapper } from "@/components/pagination-wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ITagType } from "@/lib/tags";
import type { ICategoryType } from "@/lib/categories";
import type { IProductType } from "@/lib/products";

interface AnimePageClientProps {
  tag: ITagType;
  categories: ICategoryType[];
  products: IProductType[];
  totalCount: number;
}

export default function AnimePageClient({
  tag,
  categories,
  products,
  totalCount,
}: AnimePageClientProps) {
  const { setBreadcrumbs } = useBreadcrumb();
  const isMobile = useIsMobile();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      <div className="container mx-auto lg:mt-16 px-4 py-8 lg:md:mt-24">
        {/* breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        {/* Hero Header */}
        <header className="relative mb-12 overflow-hidden rounded-3xl group transition-all ease-in-out">
          <section className="relative py-12 md:py-20 overflow-hidden min-h-[300px] md:min-h-[350px]">
            {/* Dynamic gradient background based on anime */}
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
                  {/* Anime title with enhanced styling */}
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
                        {totalCount} محصول موجود
                      </span>
                    </div>
                    {categories && categories.length > 0 && (
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                        <span className="text-white font-medium text-sm">
                          {categories.length} دسته‌بندی
                        </span>
                      </div>
                    )}
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
                      href="/anime"
                      className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300"
                    >
                      <span>بازگشت به انیمه‌ها</span>
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
                {products.length} محصول نمایش داده می‌شود
              </span>
            </div>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, index) => (
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
        </section>
      </div>
    </div>
  );
}
