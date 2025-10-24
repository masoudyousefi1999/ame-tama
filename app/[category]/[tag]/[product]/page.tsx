import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import ProductPageClient from "@/components/product/product-page-client";
import MetaTags from "@/components/seo/meta-tags";
import ProductSchema from "@/components/seo/product-schema";
import GoogleShoppingSchema from "@/components/seo/google-shopping-schema";
import { formatPriceDivided } from "@/lib/format-price";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    category: string;
    tag: string;
    product: string;
  }>;
}): Promise<Metadata> {
  const { category, tag, product } = await params;

  if (!product) {
    return {
      title: "محصول یافت نشد | AME-TAMA",
    };
  }

  const productData = await getProductBySlug(product, {
    next: { tags: ["products", `product-${product}`] },
  });

  if (!productData) {
    return {
      title: "محصول یافت نشد | AME-TAMA",
    };
  }

  const baseUrl = "https://ame-tama.com";
  const productUrl = `${baseUrl}/${category}/${tag}/${product}`;

  return {
    metadataBase: new URL(baseUrl),
    title: `خرید ${productData.name} | AME-TAMA`,
    description:
      productData.detail?.description ||
      `خرید ${productData.name} با بهترین قیمت و کیفیت در فروشگاه AME-TAMA`,
    keywords: `${productData.name}, محصولات انیمه, ${
      productData.category?.name || ""
    }, ${
      productData.tags?.map((tag) => tag.name).join(", ") || ""
    }, AME-TAMA, خرید محصولات انیمه, فیگور انیمه, مجسمه انیمه`,
    openGraph: {
      title: `خرید ${productData.name} | AME-TAMA`,
      description:
        productData.detail?.description ||
        `خرید ${productData.name} با بهترین قیمت و کیفیت در فروشگاه AME-TAMA`,
      type: "website",
      images: productData.productMedia?.map((media) => media.url) || [],
      url: productUrl,
      locale: "fa_IR",
      siteName: "AME-TAMA",
    },
    twitter: {
      card: "summary_large_image",
      title: `خرید ${productData.name} | AME-TAMA`,
      description:
        productData.detail?.description ||
        `خرید ${productData.name} با بهترین قیمت و کیفیت`,
      images: productData.productMedia?.map((media) => media.url) || [],
    },
    alternates: {
      canonical: productUrl,
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

export default async function ProductPage({
  params,
}: {
  params: Promise<{
    category: string;
    tag: string;
    product: string;
  }>;
}) {
  const { category, tag, product } = await params;
  const productData = await getProductBySlug(product, {
    next: { tags: ["products", `product-${product}`] },
  });

  if (!productData) notFound();

  return (
    <>
      <MetaTags
        title={`خرید ${productData.name} | AME-TAMA`}
        description={
          productData.detail?.description ||
          `خرید ${productData.name} با بهترین قیمت و کیفیت در فروشگاه AME-TAMA`
        }
        keywords={`${productData.name}, محصولات انیمه, ${
          productData.category?.name || ""
        }, ${
          productData.tags?.map((tag) => tag.name).join(", ") || ""
        }, AME-TAMA`}
        ogType="product"
        canonicalPath={`/${category}/${tag}/${product}`}
        price={productData.price}
        currency="IRR"
        productId={productData.uuid}
        brand="AME-TAMA"
        category={productData.category?.name}
        condition="new"
        ogImage={productData.productMedia?.[0]?.url}
      />
      <ProductSchema product={productData} />
      <GoogleShoppingSchema product={productData} />
      <ProductPageClient product={productData} />
    </>
  );
}
