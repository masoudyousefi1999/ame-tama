"use client";

import { useEffect, useMemo } from "react";
import { useBreadcrumb } from "@/context/breadcrumb-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import Image from "@/components/ui/custom-image";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ITagType } from "@/lib/tags";
import GradientHero from "@/components/ui/gradient-hero";

interface AnimePageClientProps {
  tags: ITagType[];
}

const AnimeCard = ({ tag }: { tag: ITagType }) => {
  const isMobile = useIsMobile();

  return (
    <Link
      href={`/anime/${tag.slug}`}
      prefetch={false}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300",
        isMobile
          ? "shadow-md hover:shadow-lg"
          : "shadow-lg hover:shadow-2xl hover:scale-[1.02]"
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
        {tag.image?.url ? (
          <Image
            src={tag.image.url}
            alt={tag.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            quality={80}
            onError={() => {
              console.error(`Anime image failed to load: ${tag.name}`);
            }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
            <span className="text-4xl opacity-50">🎭</span>
          </div>
        )}
        <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors" />

        {/* Overlay with anime name */}
        <div className="absolute inset-0 flex items-end p-4">
          <div className="bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 w-full">
            <h3 className="text-foreground font-semibold text-sm md:text-base truncate">
              {tag.name}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function AnimePageClient({ tags }: AnimePageClientProps) {
  const { setBreadcrumbs } = useBreadcrumb();
  const isMobile = useIsMobile();

  useEffect(() => {
    setBreadcrumbs([{ label: "انیمه", href: "/anime", isCurrent: true }]);
  }, [setBreadcrumbs]);

  // Memoize tags count for performance
  const tagsCount = useMemo(() => tags.length, [tags.length]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 lg:mt-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 pt-6">
        <Breadcrumb
          items={[{ label: "انیمه", href: "/anime", isCurrent: true }]}
          className="mb-6"
        />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <GradientHero
          title="لیست انیمه ها"
          description="مجموعه کامل انیمه ها برای پیدا کردن محصولات مورد علاقه‌تان"
          stats={[{ label: `${tagsCount} انیمه موجود` }]}
        />
      </div>

      {/* Anime Grid */}
      <section className="container mx-auto px-4 md:px-6 mt-4 md:mt-6">
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-primary">
            همه انیمه ها
          </h2>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              {tagsCount} انیمه نمایش داده می‌شود
            </span>
          </div>
        </div>

        {tags && tags.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {tags.map((tag) => (
              <AnimeCard key={tag.uuid} tag={tag} />
            ))}
          </div>
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
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <p className="text-base md:text-lg text-muted-foreground mb-2">
              هیچ انیمه‌ای یافت نشد
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/85 transition-all duration-200 mt-4"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
