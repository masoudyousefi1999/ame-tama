import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import ProductPageClient from "@/components/product/product-page-client";
import ProductSchema from "@/components/seo/product-schema";
import GoogleShoppingSchema from "@/components/seo/google-shopping-schema";
import { getSiteUrl } from "@/lib/site-url";

/** Fully dynamic: no static generation, fresh data on every request */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: {
    category: string;
    tag: string;
    product: string;
  };
}): Promise<Metadata> {
  const { category, tag, product } = await params;

  if (!product) {
    return {
      title: "محصول یافت نشد | AME-TAMA",
    };
  }

  const productData = await getProductBySlug(product, {
    cache: "no-store",
  });

  if (!productData) {
    return {
      title: "محصول یافت نشد | AME-TAMA",
    };
  }

  const baseUrl = getSiteUrl();
  const seo = productData.seoMetadata;

  const fallbackPath = [
    productData.category?.slug || category,
    productData.tags?.[0]?.slug || tag,
    productData.slug || product,
  ]
    .filter(Boolean)
    .join("/");
  const fallbackCanonical = getSiteUrl(fallbackPath);
  const canonicalUrl = seo?.canonicalUrl || fallbackCanonical;

  const metaTitle = seo?.metaTitle || `${productData.name} | AME-TAMA`;
  const metaDescription =
    seo?.metaDescription ||
    productData.detail?.description ||
    `خرید ${productData.name} از فروشگاه AME-TAMA`;

  const ogDescription = seo?.ogDescription || metaDescription;
  const ogTitle = seo?.ogTitle || metaTitle;

  const primaryImage = seo?.ogImage
    ? seo.ogImage.startsWith("http")
      ? seo.ogImage
      : getSiteUrl(seo.ogImage)
    : productData.productMedia?.[0]?.url
    ? productData.productMedia[0].url.startsWith("http")
      ? productData.productMedia[0].url
      : getSiteUrl(productData.productMedia[0].url)
    : getSiteUrl("/placeholder.svg");

  const ogImages = primaryImage ? [{ url: primaryImage }] : undefined;

  const availability = productData.quantity > 0 ? "instock" : "outofstock";

  const discountPrice = productData.discountPrice;

  const otherMeta: Record<string, string> = {
    product_id: productData.uuid,
    product_name: productData.name,
    availability,
    "og:image": primaryImage,
  };

  if (discountPrice) {
    otherMeta.product_price = String(discountPrice);
    otherMeta.product_old_price = String(productData.price);
  } else {
    otherMeta.product_price = String(productData.price);
  }

  const specifications = productData.detail?.specifications as
    | Record<string, any>
    | undefined;

  const oldPrice =
    (productData as any).oldPrice ??
    (specifications &&
      (specifications.oldPrice || specifications.originalPrice));
  if (oldPrice) {
    otherMeta.product_old_price = String(oldPrice);
  }

  return {
    metadataBase: new URL(baseUrl),
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      images: ogImages,
      url: canonicalUrl,
      locale: "fa_IR",
      siteName: "AME-TAMA | آمه تاما",
    },
    alternates: {
      canonical: canonicalUrl,
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
    other: otherMeta,
  };
}

export default async function ProductPage({
  params,
}: {
  params: {
    category: string;
    tag: string;
    product: string;
  };
}) {
  const { category, tag, product } = await params;
  const productData = await getProductBySlug(product, {
    cache: "no-store",
  });

  if (!productData) {
    notFound();
  }

  const categorySlug = productData.category?.slug;
  const tagSlug = productData.tags?.[0]?.slug;

  if (categorySlug !== category || tagSlug !== tag) {
    notFound();
  }

  return (
    <>
      <ProductSchema product={productData} />
      <GoogleShoppingSchema product={productData} />
      <ProductPageClient product={productData} />
    </>
  );
}
