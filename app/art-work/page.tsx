import { getAllArtWorks, IArtWorkType } from "@/lib/art-work";
import ArtWorkPageClient from "@/components/art-work/art-work-page-client";
import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ame-tama.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "آثار هنری | آمه‌تاما (AME-TAMA)",
  description:
    "مجموعه‌ای از آثار هنری زیبای کاربران آمه‌تاما را مشاهده کنید و اثر هنری خود را به اشتراک بگذارید",
  keywords: [
    "آثار هنری",
    "نقاشی",
    "هنر",
    "آمه تاما",
    "AME-TAMA",
    "art work",
    "artwork",
  ],
  alternates: {
    canonical: `${baseUrl}/art-work`,
  },
  openGraph: {
    title: "آثار هنری | آمه‌تاما",
    description: "مجموعه‌ای از آثار هنری زیبای کاربران آمه‌تاما را مشاهده کنید",
    type: "website",
    url: `${baseUrl}/art-work`,
    siteName: "آمه‌ تاما | AME-TAMA",
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "آثار هنری | آمه‌تاما",
    description: "مجموعه‌ای از آثار هنری زیبای کاربران",
  },
};

export default async function ArtWorkPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: currentPage } = await searchParams;

  let artWorks: IArtWorkType[] = [];
  let totalCount = 0;
  const limit = 12;
  const page = Number.parseInt(currentPage || "1");

  try {
    const fetchedArtWorks = await getAllArtWorks(page, limit, {
      next: { tags: ["art-works"] },
    });
    artWorks = fetchedArtWorks.artWorks || [];
    totalCount = fetchedArtWorks.totalCount || 0;
  } catch (error) {
    console.error("Error fetching art works:", error);
    artWorks = [];
    totalCount = 0;
  }

  return (
    <ArtWorkPageClient
      initialArtWorks={artWorks}
      totalCount={totalCount}
      currentPage={page}
      limit={limit}
    />
  );
}
