"use client";

import { useEffect, useMemo } from "react";
import { useBreadcrumb } from "@/context/breadcrumb-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { CustomImage as Image } from "@/components/ui/custom-image";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { IBlogTopicType } from "@/lib/blog";

interface BlogTopicClientProps {
  topic: IBlogTopicType;
}

const BlogCard = ({ topic, post }: { topic: IBlogTopicType; post: any }) => {
  const isMobile = useIsMobile();

  return (
    <Link
      href={`/topic/${topic.slug}/${post.slug}`}
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

      <div className="p-6">
        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span>{new Date(post.createdAt).toLocaleDateString("fa-IR")}</span>
          <span>•</span>
          <span>مقاله</span>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-card-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {/* Content preview */}
        {post.content && (
          <div
            className="text-muted-foreground text-sm md:text-base line-clamp-3 mb-4"
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

export default function BlogTopicClient({ topic }: { topic: IBlogTopicType }) {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: "موضوعات", href: "/topic" },
      { label: topic.name, href: `/topic/${topic.slug}`, isCurrent: true },
    ]);
  }, [setBreadcrumbs, topic.name, topic.slug]);

  // Memoize blogs count for performance
  const blogsCount = useMemo(
    () => topic.blogs?.length || 0,
    [topic.blogs?.length]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-24 lg:mt-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 pt-6">
        <Breadcrumb
          items={[
            { label: "موضوعات", href: "/topic" },
            {
              label: topic.name,
              href: `/topic/${topic.slug}`,
              isCurrent: true,
            },
          ]}
          className="mb-6"
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-8 md:py-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-pattern-dots opacity-20" />
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h1 className="text-2xl md:text-4xl font-black text-white mb-3 md:mb-4">
            {topic.name}
          </h1>
          {topic.description && (
            <p className="text-sm md:text-lg text-white/90 max-w-2xl mx-auto mb-4 md:mb-6 font-medium">
              {topic.description}
            </p>
          )}
          <div className="flex items-center justify-center gap-2 text-white/80">
            <span className="text-xs md:text-sm">{blogsCount} مقاله موجود</span>
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="container mx-auto px-4 md:px-6 mt-4 md:mt-6">
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-primary">
            مقالات {topic.name}
          </h2>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              {blogsCount} مقاله نمایش داده می‌شود
            </span>
          </div>
        </div>

        {topic.blogs && topic.blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {topic.blogs.map((blog: any) => (
              <BlogCard key={blog.uuid} topic={topic} post={blog} />
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
              هیچ مقاله‌ای در این تاپیک یافت نشد
            </p>
            <Link
              href="/topic"
              className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mt-4"
            >
              بازگشت به تاپیک‌ها
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
