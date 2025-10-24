"use client";

import { useEffect, useMemo } from "react";
import { CustomImage as Image } from "@/components/ui/custom-image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store, Tag } from "lucide-react";
import CategoryProducts from "@/components/category/category-products";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface AnimePageClientProps {
  tag: {
    name: string;
    slug: string;
    description?: string;
    image?: {
      url: string;
    };
  };
  categories: Array<{
    uuid: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
  }>;
  products: Array<any>;
  totalCount: number;
}

export default function AnimePageClient({
  tag,
  categories,
  products,
  totalCount,
}: AnimePageClientProps) {
  // Memoize breadcrumb items
  const breadcrumbItems = useMemo(
    () => [
      {
        label: "انیمه",
        href: "/anime",
      },
      {
        label: tag.name || "",
        href: `/${tag.slug || ""}`,
        isCurrent: true,
      },
    ],
    [tag.name, tag.slug]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      <div className="container mx-auto lg:mt-16 px-4 py-8 lg:md:mt-24">
        {/* breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        {/* hero header */}
        <header className="relative mb-12 overflow-hidden rounded-3xl group transition-all ease-in-out">
          <section className="relative py-16 md:py-24 overflow-hidden h-48 md:h-56">
            {/* Animated background layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20" />

            {/* Static decorative elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl" />
            <div className="absolute top-40 right-32 w-24 h-24 bg-teal-400/10 rounded-full blur-xl" />
            <div className="absolute bottom-20 left-1/3 w-28 h-28 bg-cyan-400/10 rounded-full blur-xl" />

            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              {tag.image?.url ? (
                <Image
                  src={tag.image.url}
                  alt={tag.name}
                  fill
                  sizes="100vw"
                  className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500"
                  priority
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
                  <span className="text-6xl opacity-50">🎭</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-6 lg:px-8 h-full flex items-center">
              <div className="max-w-3xl">
                <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                  <Tag className="w-4 h-4 ml-1" />
                  تگ انیمه
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {tag.name}
                </h1>
                {tag.description && (
                  <p className="text-lg md:text-xl text-gray-200 mb-6 leading-relaxed">
                    {tag.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-4">
                  <Link href="/shop">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Store className="w-5 h-5 ml-2" />
                      مشاهده همه محصولات
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="w-5 h-5 ml-2" />
                      بازگشت به خانه
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </header>

        {/* categories section */}
        <section className="mb-14">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-2xl font-extrabold text-transparent tracking-tight">
              دسته‌بندی‌های {tag.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.uuid}
                href={`/${category.slug}/${tag.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card bg-opacity-50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width:640px) 100vw, (max-width:768px) 50vw, 33vw"
                      className="transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      quality={75}
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
                      <span className="text-4xl opacity-50">📦</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* products section */}
        {products.length > 0 && (
          <section className="mb-14">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                محصولات {tag.name}
              </h2>
              <p className="text-gray-300 text-lg">{totalCount} محصول موجود</p>
            </div>
            <CategoryProducts
              products={products}
              viewMode="grid"
              showProductName={true}
            />
          </section>
        )}
      </div>
    </div>
  );
}
