import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import ProductPageClient from "@/components/product/product-page-client";
import MetaTags from "@/components/seo/meta-tags";
import ProductSchema from "@/components/seo/product-schema";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) {
    return {
      title: "محصول یافت نشد | AME-TAMA",
    };
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "محصول یافت نشد | AME-TAMA",
    };
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fa-IR").format(price / 10) + " تومان";

  const imageUrl = product.productMedia[0]?.url || "/placeholder.svg";

  // تعیین وضعیت موجودی
  let availability: "in stock" | "out of stock" | "limited" = "in stock";
  if (product.quantity === 0) availability = "out of stock";
  else if (product.quantity > 0 && product.quantity < 3)
    availability = "limited";

  return {
    title: `${product.name} | AME-TAMA`,
    description: `خرید اکشن فیگور ${product.name} با قیمت ${formatPrice(
      product.price
    )}`,
    keywords: `فیگور انیمه, اکشن فیگور, ${product.name}, ${product.category.name}, AME-TAMA`,
    openGraph: {
      title: `${product.name} | AME-TAMA`,
      description: `خرید اکشن فیگور ${product.name} با قیمت ${formatPrice(
        product.price
      )}`,
      type: "website",
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
      description: `خرید اکشن فیگور ${product.name} با قیمت ${formatPrice(
        product.price
      )}`,
      images: [imageUrl],
    },
    other: {
      "product:id": product.uuid,
      "product:sku": `AME-${product.uuid}`,
      "product:brand": product.category.name,
      "product:category": product.category.name,
      "product:availability": availability,
      "product:condition": "new",
      "product:price:amount": product.price, // قیمت ریال از بک‌اند (بدون تبدیل)
      "product:price:currency": "IRR",
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
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fa-IR").format(price / 10) + " تومان";

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

  // تعیین وضعیت موجودی
  let availability: "in stock" | "out of stock" | "limited" = "in stock";
  if (product.quantity === 0) availability = "out of stock";
  else if (product.quantity > 0 && product.quantity < 3)
    availability = "limited";

  return (
    <>
      <MetaTags
        title={`${product.name} | AME-TAMA`}
        description={`خرید اکشن فیگور ${product.name} با قیمت ${formatPrice(
          product.price
        )}`}
        keywords={`فیگور انیمه, اکشن فیگور, ${product.name}, ${product.category.name}, AME-TAMA`}
        ogImage={product?.productMedia[0]?.url || "/placeholder.svg"}
        ogType="product"
        canonicalPath={`product/${product.slug}`}
        price={product.price} // قیمت ریال از بک‌اند (بدون تبدیل)
        currency="IRR"
        productId={product.uuid}
        sku={`AME-${product.uuid}`}
        brand={product.category.name}
        category={product.category.name}
        availability={availability}
        condition="new"
      />
      <ProductSchema product={product} />
      <ProductPageClient product={product} />
    </>
  );
}
