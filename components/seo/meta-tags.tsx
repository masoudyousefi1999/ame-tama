import Head from "next/head"
import { getSiteUrl } from "@/lib/site-url"

interface MetaTagsProps {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  ogType?: "website" | "article" | "product"
  canonicalPath?: string
}

export default function MetaTags({
  title,
  description,
  keywords = "",
  ogImage = "/images/og-default.jpg",
  ogType = "website",
  canonicalPath,
}: MetaTagsProps) {
  // ساخت آدرس کامل برای تصویر OG
  const fullOgImageUrl = ogImage.startsWith("http") ? ogImage : getSiteUrl(ogImage)

  // ساخت آدرس canonical
  const canonicalUrl = canonicalPath ? getSiteUrl(canonicalPath) : getSiteUrl()

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* متاتگ‌های Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={fullOgImageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="AME-TAMA | مجسمه‌های انیمه لوکس" />
      <meta property="og:locale" content="fa_IR" />

      {/* متاتگ‌های Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImageUrl} />

      {/* لینک canonical */}
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  )
}
