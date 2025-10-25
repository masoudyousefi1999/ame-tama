import BlogPostClient from "@/components/blog/blog-post-client";
import { getBlogPostBySlugs, IBlogPostType } from "@/lib/blog";
import type { Metadata } from "next";

const baseUrl = "https://ame-tama.com";

interface BlogPostPageProps {
  params: Promise<{ topicSlug: string; blogSlug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { topicSlug, blogSlug } = await params;
  const blogPost = await getBlogPostBySlugs(blogSlug);

  if (!blogPost) {
    return {
      title: "مقاله یافت نشد | AME-TAMA",
      description: "مقاله مورد نظر یافت نشد",
    };
  }

  return {
    metadataBase: new URL(baseUrl),
    title: `${blogPost.title} | AME-TAMA`,
    description: blogPost.content.replace(/<[^>]*>/g, "").substring(0, 160),
    keywords: `${blogPost.title}, اخبار انیمه, AME-TAMA, مقالات انیمه`,
    openGraph: {
      title: `${blogPost.title} | AME-TAMA`,
      description: blogPost.content.replace(/<[^>]*>/g, "").substring(0, 160),
      type: "article",
      url: `${baseUrl}/topic/${topicSlug}/${blogSlug}`,
      locale: "fa_IR",
      siteName: "AME-TAMA",
    },
    twitter: {
      card: "summary_large_image",
      title: `${blogPost.title} | AME-TAMA`,
      description: blogPost.content.replace(/<[^>]*>/g, "").substring(0, 160),
    },
    alternates: {
      canonical: `${baseUrl}/topic/${topicSlug}/${blogSlug}`,
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { blogSlug } = await params;
  const blogPost = (await getBlogPostBySlugs(blogSlug)) as IBlogPostType;

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">مقاله یافت نشد</h1>
          <p className="text-gray-300 mb-6">
            مقاله مورد نظر وجود ندارد یا حذف شده است.
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

  return <BlogPostClient blogPost={blogPost} topic={blogPost.topic} />;
}
