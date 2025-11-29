"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useBreadcrumb } from "@/context/breadcrumb-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { CustomImage as Image } from "@/components/ui/custom-image";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import type { IBlogPostType, IBlogTopicType } from "@/lib/blog";
import LoadingSpinner from "../ui/loading-spinner";
import GradientHero from "@/components/ui/gradient-hero";

const BlogCard = ({ topic, post }: { topic: IBlogTopicType; post: any }) => {
  const isMobile = useIsMobile();

  return (
    <Link
      href={`/topic/${topic.slug}/${post.slug}`}
      prefetch={false}
      className={cn(
        "group relative overflow-hidden rounded-xl md:rounded-2xl border border-border bg-card transition-all duration-300",
        isMobile
          ? "shadow-md hover:shadow-lg"
          : "shadow-lg hover:shadow-2xl hover:scale-[1.02]"
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
        {post.image && post.image.url ? (
          <Image
            src={post.image.url}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            quality={80}
            onError={() => {
              console.error(`Blog image failed to load: ${post.title}`);
            }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
            <span className="text-4xl opacity-50">📰</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

        {/* Published status badge */}
      </div>

      <div className="p-4 md:p-6">
        {/* Meta info */}
        <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
          <span>{new Date(post.createdAt).toLocaleDateString("fa-IR")}</span>
          <span>•</span>
          <span>مقاله</span>
        </div>

        {/* Title */}
        <h3 className="text-base md:text-lg lg:text-xl font-bold text-card-foreground mb-2 md:mb-3 line-clamp-2 group-hover:text-primary/80 transition-colors duration-200">
          {post.title}
        </h3>

        {/* Content preview */}
        {post.content && (
          <div
            className="text-muted-foreground text-xs md:text-sm lg:text-base line-clamp-2 md:line-clamp-3 mb-2 md:mb-4"
            dangerouslySetInnerHTML={{
              __html:
                post.content.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
            }}
          />
        )}
      </div>
    </Link>
  );
};

export default function BlogTopicClient({
  topic,
  initialBlogs,
  initialTotalCount,
  initialPage,
  initialLimit,
}: {
  topic: IBlogTopicType;
  initialBlogs: IBlogPostType[];
  initialTotalCount: number;
  initialPage: number;
  initialLimit: number;
}) {
  const { setBreadcrumbs } = useBreadcrumb();
  const [blogs, setBlogs] = useState<IBlogPostType[]>(initialBlogs);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialBlogs.length < initialTotalCount
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBreadcrumbs([
      { label: "موضوعات", href: "/topic" },
      { label: topic.name, href: `/topic/${topic.slug}`, isCurrent: true },
    ]);
  }, [setBreadcrumbs, topic.name, topic.slug]);

  // Fetch more blogs from the API
  const fetchMoreBlogs = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(initialLimit),
      });

      const baseUrl =
        process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";
      const response = await fetch(
        `${baseUrl}/api/blog-topic/${topic.slug}?${params}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.statusText}`);
      }

      const result = await response.json();
      const newBlogs = result.blogs || [];

      // Deduplicate blogs based on uuid and check if there are more
      setBlogs((prevBlogs) => {
        const existingUuids = new Set(prevBlogs.map((b) => b.uuid));
        const uniqueNewBlogs = newBlogs.filter(
          (b: IBlogPostType) => !existingUuids.has(b.uuid)
        );

        // If no new unique blogs, we've reached the end
        if (uniqueNewBlogs.length === 0) {
          setHasMore(false);
          return prevBlogs;
        }

        const updatedBlogs = [...prevBlogs, ...uniqueNewBlogs];

        // Check if there are more blogs to load
        setHasMore(
          updatedBlogs.length < initialTotalCount && newBlogs.length > 0
        );

        return updatedBlogs;
      });

      setPage(nextPage);
    } catch (err) {
      console.error("Error fetching more blogs:", err);
      setError(err instanceof Error ? err.message : "خطا در بارگذاری مقالات");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, initialLimit, initialTotalCount, topic.slug]);

  // Use the custom infinite scroll hook
  const { loaderRef } = useInfiniteScroll({
    onLoadMore: fetchMoreBlogs,
    hasMore,
    isLoading,
    threshold: 0.1,
    rootMargin: "200px",
  });

  // Memoize blogs count for performance
  const blogsCount = useMemo(() => blogs.length, [blogs.length]);

  return (
    <div className="min-h-screen bg-background text-foreground lg:mt-20 pb-16 lg:pb-0">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 pt-6 mb-6">
        <Breadcrumb
          items={[
            { label: "موضوعات", href: "/topic" },
            {
              label: topic.name,
              href: `/topic/${topic.slug}`,
              isCurrent: true,
            },
          ]}
        />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <GradientHero
          title={topic.name}
          description={topic.description || null}
          image={topic.image?.url || null}
          stats={[
            { label: `${initialTotalCount} مقاله` }
          ]}
          actions={[
            {
              label: "مشاهده مقالات",
              href: "#blogs",
              variant: "primary",
            },
            {
              label: "مشاهده همه تاپیک‌ها",
              href: "/topic",
              variant: "secondary",
            }
          ]}
        />
      </div>

      {/* Blogs Grid */}
      <section
        id="blogs"
        className="container mx-auto px-4 md:px-6 mt-4 md:mt-6"
      >
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-primary">
            مقالات {topic.name}
          </h2>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              {blogsCount} از {initialTotalCount} مقاله نمایش داده می‌شود
            </span>
          </div>
        </div>

        <div className="mb-5">
          {blogs && blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {blogs.map((blog: IBlogPostType) => (
                  <BlogCard key={blog.uuid} topic={topic} post={blog} />
                ))}
              </div>

              {/* Infinite scroll loader */}
              <div ref={loaderRef} className="h-4" />

              {/* Loading indicator */}
              {isLoading && (
                <div
                  className="flex justify-center items-center py-8"
                  dir="rtl"
                >
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    <span className="text-sm text-muted-foreground">
                      در حال بارگذاری مقالات بیشتر...
                    </span>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div
                  className="flex justify-center items-center py-4 text-red-400"
                  dir="rtl"
                >
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* No more data indicator */}
              {!hasMore && blogs.length > 0 && (
                <div
                  className="flex justify-center items-center py-8"
                  dir="rtl"
                >
                  <span className="text-sm text-muted-foreground">
                    تمام مقالات نمایش داده شد
                  </span>
                </div>
              )}
            </>
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
                هیچ مقاله‌ای در این تاپیک یافت نشد
              </p>
              <Link
                href="/topic"
                className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/85 transition-all duration-200 mt-4"
              >
                بازگشت به تاپیک‌ها
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
