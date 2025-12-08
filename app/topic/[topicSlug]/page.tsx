import BlogTopicClient from "@/components/blog/blog-topic-client";
import { getBlogTopicBySlug } from "@/lib/blog";
import type { Metadata } from "next";
import { productLimit } from "@/lib/product-limit";

const baseUrl = "https://ame-tama.com";

interface BlogTopicPageProps {
  params: Promise<{ topicSlug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: BlogTopicPageProps): Promise<Metadata> {
  const { topicSlug } = await params;
  if (!topicSlug) {
    return {
      title: "تاپیک یافت نشد | AME-TAMA",
      description: "تاپیک مورد نظر یافت نشد",
    };
  }
  const data = await getBlogTopicBySlug(topicSlug, 1, 1);

  // Get topic from response or fallback to first blog's topic
  const topic = data?.topic || data?.blogs?.[0]?.topic;

  if (!data || !topic) {
    return {
      title: "تاپیک یافت نشد | AME-TAMA",
      description: "تاپیک مورد نظر یافت نشد",
    };
  }

  return {
    metadataBase: new URL(baseUrl),
    title: `${topic.name} | AME-TAMA`,
    description: topic.description || `مقالات مربوط به ${topic.name}`,
    keywords: `${topic.name}, اخبار انیمه, AME-TAMA, مقالات انیمه`,
    openGraph: {
      title: `${topic.name} | AME-TAMA`,
      description: topic.description || `مقالات مربوط به ${topic.name}`,
      type: "website",
      url: `${baseUrl}/topic/${topicSlug}`,
      locale: "fa_IR",
      siteName: "AME-TAMA",
    },
    twitter: {
      card: "summary_large_image",
      title: `${topic.name} | AME-TAMA`,
      description: topic.description || `مقالات مربوط به ${topic.name}`,
    },
    alternates: {
      canonical: `${baseUrl}/topic/${topicSlug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function BlogTopicPage({
  params,
  searchParams,
}: BlogTopicPageProps) {
  const { topicSlug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Number.parseInt(pageParam || "1", 10);
  const limit = productLimit;

  const data = await getBlogTopicBySlug(topicSlug, page, limit);

  // Get topic from response or fallback to first blog's topic
  const topic = data?.topic || data?.blogs?.[0]?.topic;

  if (!data || !topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">تاپیک یافت نشد</h1>
          <p className="text-muted-foreground mb-6">
            تاپیک مورد نظر وجود ندارد یا حذف شده است.
          </p>
          <a
            href="/topic"
            className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            بازگشت به اخبار
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <BlogTopicClient
      topic={topic}
      initialBlogs={data.blogs || []}
      initialTotalCount={data.totalCount || 0}
      initialPage={page}
      initialLimit={limit}
    />
  );
}
