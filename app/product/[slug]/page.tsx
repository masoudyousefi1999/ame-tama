import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import MetaTags from "@/components/seo/meta-tags";
import ProductSchema from "@/components/seo/product-schema";
import ProductPageClient from "@/components/product/product-page-client";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "محصول پیدا نشد",
      description: "محصول مورد نظر شما یافت نشد.",
    };
  }

  const baseUrl = "https://ame-tama.com";
  const imageUrl = product.productMedia[0].url || "/placeholder.svg";

  return {
    metadataBase: new URL(baseUrl),
    title: `${product.name} | AME-TAMA`,
    description: `خرید اکشن فیگور ${product.name}`,
    openGraph: {
      title: `${product.name} | AME-TAMA`,
      description: `خرید اکشن فیگور ${product.name}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | AME-TAMA`,
      description: `خرید اکشن فیگور ${product.name}`,
      images: [imageUrl],
    },
  };
}

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  let product = null;
  // let relatedProducts = [];

  try {
    product = await getProductBySlug(slug);

    if (!product) {
      notFound();
    }

    // const relatedProductsResult = await getRelatedProducts(product.uuid, 1, 4);
    // relatedProducts = relatedProductsResult.products;
  } catch (error) {
    console.error("Error fetching product data:", error);
    notFound();
  }

  return (
    <>
      <MetaTags
        title={`${product.name} | AME-TAMA`}
        description={`خرید اکشن فیگور ${product.name} `}
        ogImage={product?.productMedia[0]?.url || "/placeholder.svg"}
        ogType="product"
        canonicalPath={`product/${product.slug}`}
      />
      <ProductSchema product={product} />
      <ProductPageClient product={product}/>
    </>
  );
}
