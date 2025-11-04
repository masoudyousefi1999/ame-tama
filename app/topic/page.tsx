import BlogPageClient from "@/components/blog/blog-page-client";
import { getAllBlogTopics } from "@/lib/blog";
import type { Metadata } from "next";

const baseUrl = "https://ame-tama.com";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(baseUrl),
    title: "اخبار انیمه | AME-TAMA",
    description:
      "آخرین اخبار و اطلاعات انیمه‌ها در فروشگاه AME-TAMA. جدیدترین محصولات، اخبار انیمه‌ها و اطلاعات تکمیلی",
    keywords:
      "اخبار انیمه, انیمه, AME-TAMA, محصولات انیمه, فیگور انیمه, مجسمه انیمه, اخبار",
    openGraph: {
      title: "اخبار انیمه | AME-TAMA",
      description: "آخرین اخبار و اطلاعات انیمه‌ها در فروشگاه AME-TAMA",
      type: "website",
      url: `${baseUrl}/topic`,
      locale: "fa_IR",
      siteName: "AME-TAMA",
    },
    twitter: {
      card: "summary_large_image",
      title: "اخبار انیمه | AME-TAMA",
      description: "آخرین اخبار و اطلاعات انیمه‌ها",
    },
    alternates: {
      canonical: `${baseUrl}/topic`,
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

export default async function BlogPage() {
  let topicsResult: any = { blogTopics: [] };

  try {
    topicsResult = await getAllBlogTopics(1, 20);
  } catch (error) {
    console.warn("Failed to fetch blog topics:", error);
  }

  const topics = topicsResult.blogTopics || [];

  return <BlogPageClient topics={topics} />;
}
