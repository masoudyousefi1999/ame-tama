import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import MetaTags from "@/components/seo/meta-tags";
import ProductSchema from "@/components/seo/product-schema";
import ProductPageClient from "@/components/product/product-page-client";

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
  let relatedProducts = [];

  try {
    product = await getProductBySlug(slug);

    if (!product) {
      notFound();
    }

    relatedProducts = await getRelatedProducts(
      product.category.slug,
      product.uuid
    );
  } catch (error) {
    console.error("Error fetching product data:", error);
    notFound();
  }

  return (
    <>
      <MetaTags
        title={`${product.name} | AME-TAMA`}
        description={`خرید مجسمه ${product.name} - ${
          product?.detail?.character || ""
        } از سری ${product?.detail?.series || ""}.}.`}
        keywords={`${product?.detail?.character || ""}, ${
          product?.detail?.series || ""
        }, مجسمه انیمه, فیگور, کلکسیونی`}
        ogImage={product?.productMedia[0]?.url || "/placeholder.svg"}
        ogType="product"
        canonicalPath={`product/${product.slug}`}
      />
      <ProductSchema product={product as any} />
      <ProductPageClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
