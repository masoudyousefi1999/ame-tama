"use client";

import { useEffect, useMemo, useRef } from "react";
import { useBreadcrumb } from "@/context/breadcrumb-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { CustomImage as Image } from "@/components/ui/custom-image";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { IBlogPostType, IBlogTopicType } from "@/lib/blog";

interface BlogPostClientProps {
  blogPost: IBlogPostType;
  topic: IBlogTopicType;
}

export default function BlogPostClient({
  blogPost,
  topic,
}: BlogPostClientProps) {
  const { setBreadcrumbs } = useBreadcrumb();
  const isMobile = useIsMobile();
  const contentRef = useRef<HTMLDivElement>(null);

  // Memoize breadcrumb items
  const breadcrumbItems = useMemo(
    () => [
      {
        label: "موضوعات",
        href: "/topic",
      },
      {
        label: topic.name,
        href: `/topic/${topic.slug}`,
      },
      {
        label: blogPost.title,
        href: `topic/${topic.slug}/${blogPost.slug}`,
        isCurrent: true,
      },
    ],
    [topic.slug, blogPost.title, blogPost.slug]
  );

  useEffect(() => {
    setBreadcrumbs(breadcrumbItems);
  }, [setBreadcrumbs, breadcrumbItems]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      <div className="container mx-auto lg:mt-16 px-4 py-8 lg:md:mt-24">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        {/* Blog Content */}
        <section className="">
          <div className="">
            {/* Article Card - Unified Content */}
            <article className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
              {/* Featured Image */}
              {blogPost.image && blogPost.image.url && (
                <div className="p-6 md:p-8">
                  <div className="relative aspect-[16/9] w-full max-w-2xl mx-auto overflow-hidden rounded-xl">
                    <Image
                      src={blogPost.image.url}
                      alt={blogPost.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority
                      quality={95}
                      onError={() => {
                        console.error(
                          `Blog image failed to load: ${blogPost.title}`
                        );
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div className="p-8 md:p-12">
                {/* Article Title */}
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                    {blogPost.title}
                  </h2>

                  {/* Article Meta */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>
                        تاریخ انتشار: {formatDate(blogPost.createdAt)}
                      </span>
                    </div>
                    {blogPost.updatedAt !== blogPost.createdAt && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span>
                          آخرین به‌روزرسانی: {formatDate(blogPost.updatedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Article Body */}
                <div className="prose prose-lg prose-invert max-w-none">
                  <div
                    ref={contentRef}
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: blogPost.content }}
                    style={{
                      color: "#d1d5db !important",
                      backgroundColor: "transparent !important",
                    }}
                  />
                </div>
              </div>

              {/* Article Footer */}
              <div className="px-8 md:px-12 pb-8 md:pb-12">
                <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="text-sm text-gray-300">
                      <p className="mb-2">
                        این مقاله بخشی از مجموعه{" "}
                        <strong className="text-white">{topic.slug}</strong> است.
                      </p>
                      <p>برای مشاهده مقالات مشابه، روی دکمه زیر کلیک کنید.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/topic/${topic.slug}`}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
                      >
                        <span>مقالات مشابه</span>
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
                        href="/topic"
                        className="inline-flex items-center gap-2 bg-gray-600 text-gray-200 font-semibold px-6 py-3 rounded-xl hover:bg-gray-500 transition-all duration-300"
                      >
                        <span>همه موضوعات</span>
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
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
