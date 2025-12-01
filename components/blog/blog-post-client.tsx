"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useBreadcrumb } from "@/context/breadcrumb-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { CustomImage as Image } from "@/components/ui/custom-image";
import { cn, customFetch } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { IBlogPostType, IBlogTopicType } from "@/lib/blog";
import { ArrowLeft, Eye } from "lucide-react";

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
  const viewCountCalledRef = useRef<boolean>(false);
  const [viewCount, setViewCount] = useState<number>(
    blogPost.viewCount !== undefined && blogPost.viewCount !== null
      ? blogPost.viewCount
      : 0
  );

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

  // Call view-count endpoint when component mounts
  useEffect(() => {
    // Only call once per component mount
    if (viewCountCalledRef.current || !blogPost.uuid) {
      return;
    }

    viewCountCalledRef.current = true;

    // Call view-count endpoint from client-side
    const callViewCount = async () => {
      try {
        const response = await customFetch(
          `/blog/${blogPost.uuid}/view-count`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          // Increment view count after successful call
          setViewCount((prev) => prev + 1);
        }
      } catch (error) {
        // Silently handle errors - we don't want to disrupt the user experience
        console.error("Error calling view-count:", error);
      }
    };

    callViewCount();
  }, [blogPost.uuid]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="container mx-auto lg:mt-16 px-4 py-8 lg:md:mt-24">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        {/* Blog Content */}
        <section className="">
          <div className="">
            {/* Article Card - Unified Content */}
            <article className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
              {/* Featured Image */}
              {blogPost.image && blogPost.image.url && (
                <div className="p-6 md:p-8">
                  <div className="relative w-full max-w-4xl mx-auto">
                    <div
                      className="relative w-full flex items-center justify-center"
                      style={{ minHeight: "200px" }}
                    >
                      <Image
                        src={blogPost.image.url}
                        alt={blogPost.title}
                        width={1200}
                        height={800}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                        className="w-full h-auto object-contain max-h-[600px]"
                        priority
                        quality={95}
                        onError={() => {
                          console.error(
                            `Blog image failed to load: ${blogPost.title}`
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div className="p-8 md:p-12">
                {/* Article Title */}
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                    {blogPost.title}
                  </h2>

                  {/* Article Meta */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>
                        تاریخ انتشار: {formatDate(blogPost.publishedAt || "")}
                      </span>
                    </div>
                    {blogPost.updatedAt !== blogPost.publishedAt && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-warning rounded-full"></div>
                        <span>
                          آخرین به‌روزرسانی: {formatDate(blogPost.updatedAt)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{viewCount.toLocaleString("fa-IR")}</span>
                    </div>
                  </div>
                </div>

                {/* Article Body */}
                <div className="prose prose-lg prose-invert max-w-none">
                  <div
                    ref={contentRef}
                    className="article-content text-foreground"
                    dangerouslySetInnerHTML={{ __html: blogPost.content }}
                  />
                </div>
              </div>

              {/* Article Footer */}
              <div className="px-8 md:px-12 pb-8 md:pb-12">
                <div className="bg-muted/50 rounded-xl p-6 border border-border">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">
                        این مقاله بخشی از مجموعه{" "}
                        <strong className="text-foreground mr-1 ml-1">
                          {topic.name}
                        </strong>{" "}
                        میباشد.
                      </p>
                      <p>برای مشاهده مقالات مشابه، روی دکمه زیر کلیک کنید.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/topic/${topic.slug}`}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
                      >
                        <span>مقالات مشابه</span>
                      </Link>
                      <Link
                        href="/topic"
                        className="inline-flex items-center gap-2 bg-muted text-foreground font-semibold px-6 py-3 rounded-xl hover:bg-muted/80 transition-all duration-300"
                      >
                        <span>همه موضوعات</span>
                        <ArrowLeft className="w-4 h-4" />
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
