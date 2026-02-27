import AnimeListPageClient from "@/components/animes/anime-list-page-client";
import { getAllTags, ITagType } from "@/lib/tags";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(baseUrl),
    title: "انمیه ها | AME-TAMA",
    description:
      "مجموعه کامل انمیه ها در فروشگاه AME-TAMA. محصولات متنوع انمیه مورد علاقه‌ات رو ببین و بهترین محصولات رو پیدا کن",
    keywords:
      "انمیه ها, محصولات انمیه, انمیه, AME-TAMA, خرید محصولات انمیه, فیگور انمیه, مجسمه انمیه",
    openGraph: {
      title: "انمیه ها | AME-TAMA",
      description:
        "مجموعه کامل انمیه ها در فروشگاه AME-TAMA. محصولات متنوع انمیه مورد علاقه‌ات رو ببین و بهترین محصولات رو پیدا کن",
      type: "website",
      url: `${baseUrl}/anime`,
      locale: "fa_IR",
      siteName: "AME-TAMA",
    },
    twitter: {
      card: "summary_large_image",
      title: "انمیه ها | AME-TAMA",
      description: "مجموعه کامل انمیه ها در فروشگاه AME-TAMA",
    },
    alternates: {
      canonical: `${baseUrl}/anime`,
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

export default async function AnimePage() {
  let tagsResult: any = { tags: [] };

  try {
    tagsResult = await getAllTags(1, 100, {
      next: { tags: ["tags", "anime-page"] }, // 10 minutes cache
    });
  } catch (error) {
    console.warn("Failed to fetch tags for anime page:", error);
    // Use empty array as fallback
  }

  const tags = tagsResult.tags || [];

  return <AnimeListPageClient tags={tags as ITagType[]} />;
}
