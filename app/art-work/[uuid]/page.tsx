import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArtWorkByUuid } from "@/lib/art-work";
import { ArtWorkDetailPageClient } from "@/components/art-work/art-work-detail-page-client";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uuid: string }>;
}): Promise<Metadata> {
  const { uuid } = await params;

  if (!uuid) {
    return {
      title: "اثر هنری یافت نشد | AME-TAMA",
    };
  }

  const artWork = await getArtWorkByUuid(uuid, {
    next: { tags: ["art-works", `art-work-${uuid}`] },
  });

  if (!artWork) {
    return {
      title: "اثر هنری یافت نشد | AME-TAMA",
    };
  }

  const baseUrl = getSiteUrl();
  const metaTitle = `${artWork.title} | آثار هنری | AME-TAMA`;
  const metaDescription =
    artWork.description ||
    `اثر هنری ${artWork.title} از ${artWork.user.firstName} ${artWork.user.lastName}`;

  const ogImage = artWork.image?.url
    ? artWork.image.url.startsWith("http")
      ? artWork.image.url
      : getSiteUrl(artWork.image.url)
    : getSiteUrl("/placeholder.svg");

  return {
    metadataBase: new URL(baseUrl),
    title: metaTitle,
    description: metaDescription,
    keywords: [
      "آثار هنری",
      "نقاشی",
      "هنر",
      artWork.title,
      artWork.tag.name,
      "آمه تاما",
      "AME-TAMA",
    ],
    alternates: {
      canonical: `${baseUrl}/art-work/${uuid}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "article",
      url: `${baseUrl}/art-work/${uuid}`,
      siteName: "آمه‌ تاما | AME-TAMA",
      locale: "fa_IR",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: artWork.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    },
  };
}

export default async function ArtWorkDetailPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  const artWork = await getArtWorkByUuid(uuid, {
    next: { tags: ["art-works", `art-work-${uuid}`] },
  });

  if (!artWork) {
    notFound();
  }

  return <ArtWorkDetailPageClient artWork={artWork} />;
}

