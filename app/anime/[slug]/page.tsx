import { notFound } from "next/navigation";
import { getTagBySlug, ITagType } from "@/lib/tags";
import { getAllCategories } from "@/lib/categories";
import { getProductsByTagSlug, IProductType } from "@/lib/products";
import type { Metadata } from "next";
import { productLimit } from "@/lib/product-limit";
import AnimePageClient from "@/components/animes/anime-page-client";

// ✅ Use correct server function prop type
type Props = {
  params: {
    slug: string;
  };
};

const baseUrl = "https://ame-tama.com";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return {
      title: "انیمه یافت نشد | AME-TAMA",
    };
  }

  // ساخت URL کامل برای انیمه
  const animeUrl = `${baseUrl}/anime/${slug}`;

  return {
    metadataBase: new URL(baseUrl),
    title: `خرید محصولات ${tag.name} | AME-TAMA`,
    description: `خرید محصولات ${tag.name} با بهترین قیمت و کیفیت در فروشگاه AME-TAMA. مجموعه کامل محصولات انیمه ${tag.name} با تضمین اصالت`,
    keywords: `انیمه ${tag.name}, محصولات انیمه, ${tag.name}, AME-TAMA, خرید محصولات انیمه, فیگور انیمه, مجسمه انیمه`,
    openGraph: {
      title: `خرید محصولات ${tag.name} | AME-TAMA`,
      description: `خرید محصولات ${tag.name} با بهترین قیمت و کیفیت در فروشگاه AME-TAMA`,
      type: "website",
      images: [tag.image?.url],
      url: animeUrl,
      locale: "fa_IR",
      siteName: "AME-TAMA",
    },
    twitter: {
      card: "summary_large_image",
      title: `خرید محصولات ${tag.name} | AME-TAMA`,
      description: `خرید محصولات ${tag.name} با بهترین قیمت و کیفیت`,
      images: [tag.image?.url],
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

export default async function AnimeRoute(props: {
  params: { slug: string };
  searchParams?: { page?: string };
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const tagSlug = params.slug;
  const page = Number.parseInt(searchParams?.page || "1");
  const limit = productLimit;

  // Parallel data fetching for better performance
  const [documents] = await Promise.all([
    getTagBySlug(tagSlug) as unknown as Promise<{
      tag: ITagType;
      totalCount: number;
    }>,
  ]);

  const tag = documents.tag;
  const totalCount = documents.totalCount;
  const categories = tag.categories;
  const products = tag.products;

  delete (tag as any).categories;
  delete (tag as any).products;

  if (!tag) notFound();

  return (
    <AnimePageClient
      tag={tag}
      categories={categories}
      products={products}
      totalCount={totalCount}
    />
  );
}
