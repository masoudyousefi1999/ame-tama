import Head from "next/head";
import { getSiteUrl } from "@/lib/site-url";

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  canonicalPath?: string;
  // New props for Torob.com integration
  price?: number;
  currency?: string;
  productId?: string;
  sku?: string;
  brand?: string;
  category?: string;
  availability?: "in stock" | "out of stock" | "limited";
  condition?: "new" | "used" | "refurbished";
}

export default function MetaTags({
  title,
  description,
  keywords = "",
  ogImage = "/images/og-default.jpg",
  ogType = "website",
  canonicalPath,
  price,
  currency = "IRR",
  productId,
  sku,
  brand,
  category,
  availability,
  condition = "new",
}: MetaTagsProps) {
  // ساخت آدرس کامل برای تصویر OG
  const fullOgImageUrl = ogImage.startsWith("http")
    ? ogImage
    : getSiteUrl(ogImage);

  // ساخت آدرس canonical
  const canonicalUrl = canonicalPath ? getSiteUrl(canonicalPath) : getSiteUrl();

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

      {/* متاتگ‌های مخصوص Torob.com و موتورهای جستجو */}
      {productId && <meta name="product:id" content={productId} />}
      {sku && <meta name="product:sku" content={sku} />}
      {brand && <meta name="product:brand" content={brand} />}
      {category && <meta name="product:category" content={category} />}
      {availability && (
        <meta name="product:availability" content={availability} />
      )}
      {condition && <meta name="product:condition" content={condition} />}

      {/* متاتگ‌های قیمت */}
      {price && (
        <>
          <meta name="product:price:amount" content={price.toString()} />
          <meta name="product:price:currency" content={currency} />
          <meta property="product:price:amount" content={price.toString()} />
          <meta property="product:price:currency" content={currency} />
        </>
      )}

      {/* متاتگ‌های اضافی برای Torob.com */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />

      {/* متاتگ‌های ساختاریافته برای محصولات */}
      {ogType === "product" && (
        <>
          <meta property="og:type" content="product" />
          {price && (
            <meta property="product:price:amount" content={price.toString()} />
          )}
          {price && (
            <meta property="product:price:currency" content={currency} />
          )}
          {brand && <meta property="product:brand" content={brand} />}
          {category && <meta property="product:category" content={category} />}
          {availability && (
            <meta property="product:availability" content={availability} />
          )}
          {condition && (
            <meta property="product:condition" content={condition} />
          )}
        </>
      )}
    </Head>
  );
}
