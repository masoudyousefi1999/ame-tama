"use client";

import { useEffect, useMemo } from "react";
import { useBreadcrumb } from "@/context/breadcrumb-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { CustomImage as Image } from "@/components/ui/custom-image";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { IBlogTopicType } from "@/lib/blog";

interface BlogPageClientProps {
  topics: IBlogTopicType[];
}

const TopicCard = ({ topic }: { topic: IBlogTopicType }) => {
  const isMobile = useIsMobile();

  return (
    <Link
      href={`/topic/${topic.slug}`}
      prefetch={false}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300",
        isMobile
          ? "shadow-md hover:shadow-lg"
          : "shadow-lg hover:shadow-2xl hover:scale-[1.02]"
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
        {topic.image && topic.image.url ? (
          <Image
            src={topic.image.url}
            alt={topic.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            quality={80}
            onError={() => {
              console.error(`Topic image failed to load: ${topic.name}`);
            }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
            <span className="text-4xl opacity-50">📰</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

        {/* Blog count badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            {topic.blogs?.length || 0} مقاله
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span>{new Date(topic.createdAt).toLocaleDateString("fa-IR")}</span>
          <span>•</span>
          <span>{topic.blogs?.length || 0} مقاله</span>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-card-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {topic.name}
        </h3>

        {/* Description */}
        {topic.description && (
          <p className="text-muted-foreground text-sm md:text-base line-clamp-3 mb-4">
            {topic.description}
          </p>
        )}

        {/* Latest blog preview */}
        {topic.blogs && topic.blogs.length > 0 && (
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-2">آخرین مقاله:</p>
            <p className="text-sm font-medium text-card-foreground line-clamp-1">
              {topic.blogs[0].title}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default function BlogPageClient({ topics }: BlogPageClientProps) {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([{ label: "موضوعات", href: "/topic", isCurrent: true }]);
  }, [setBreadcrumbs]);

  // Memoize topics count for performance
  const topicsCount = useMemo(() => topics.length, [topics.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-24 lg:mt-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 pt-6">
        <Breadcrumb
          items={[{ label: "موضوعات", href: "/topic", isCurrent: true }]}
          className="mb-6"
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-8 md:py-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-pattern-dots opacity-20" />
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h1 className="text-2xl md:text-4xl font-black text-white mb-3 md:mb-4">
            موضوعات
          </h1>
          <p className="text-sm md:text-lg text-white/90 max-w-2xl mx-auto mb-4 md:mb-6 font-medium">
            آخرین موضوعات انیمه ای
          </p>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <span className="text-xs md:text-sm">
              {topicsCount} موضوع موجود
            </span>
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="container mx-auto px-4 md:px-6 mt-4 md:mt-6">
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-primary">
            موضوعات
          </h2>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              {topicsCount} موضوع نمایش داده می‌شود
            </span>
          </div>
        </div>

        {topics && topics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {topics.map((topic) => (
              <TopicCard key={topic.uuid} topic={topic} />
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
              هیچ موضوعی یافت نشد
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mt-4"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
