import { notFound } from "next/navigation";
import { getTagBySlug, ITagType } from "@/lib/tags";
import type { Metadata } from "next";
import { productLimit } from "@/lib/product-limit";
import AnimePageClient from "@/components/animes/anime-page-client";

// ✅ Use correct server function prop type
type Props = {
  params: Promise<{
    animeSlug: string;
  }>;
};

const baseUrl = "https://ame-tama.com";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { animeSlug } = await params;
  const tag = await getTagBySlug(animeSlug);

  if (!tag) {
    return {
      title: "انیمه یافت نشد | AME-TAMA",
    };
  }

  // ساخت URL کامل برای انیمه
  const animeUrl = `${baseUrl}/anime/${animeSlug}`;

  return {
    metadataBase: new URL(baseUrl),
    title: `خرید محصولات ${tag.tag.name} | AME-TAMA`,
    description: `خرید محصولات ${tag.tag.name} با بهترین قیمت و کیفیت در فروشگاه AME-TAMA. مجموعه کامل محصولات انیمه ${tag.tag.name} با تضمین اصالت`,
    keywords: `انیمه ${tag.tag.name}, محصولات انیمه, ${tag.tag.name}, AME-TAMA, خرید محصولات انیمه, فیگور انیمه, مجسمه انیمه`,
    openGraph: {
      title: `خرید محصولات ${tag.tag.name} | AME-TAMA`,
      description: `خرید محصولات ${tag.tag.name} با بهترین قیمت و کیفیت در فروشگاه AME-TAMA`,
      type: "website",
      images: [tag.tag.image?.url],
      url: animeUrl,
      locale: "fa_IR",
      siteName: "AME-TAMA",
    },
    twitter: {
      card: "summary_large_image",
      title: `خرید محصولات ${tag.tag.name} | AME-TAMA`,
      description: `خرید محصولات ${tag.tag.name} با بهترین قیمت و کیفیت`,
      images: [tag.tag.image?.url],
    },
    alternates: {
      canonical: animeUrl,
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

export default async function AnimeRoute({
  params,
}: {
  params: Promise<{
    animeSlug: string;
  }>;
}) {
  const { animeSlug } = await params;

  const tagData = await getTagBySlug(animeSlug, {
    page: 1,
    limit: productLimit,
  });

  if (!tagData) notFound();
  const categories = tagData.tag.categories;
  const products = tagData.tag.products;
  const totalCount = tagData.totalCount;

  const tag = tagData.tag as ITagType;

  return (
    <AnimePageClient
      tag={tag}
      categories={categories}
      products={products}
      totalCount={totalCount || 0}
    />
  );
}
