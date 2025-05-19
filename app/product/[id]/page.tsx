"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductGallery from "@/components/product/product-gallery";
import ProductInfo from "@/components/product/product-info";
import ProductTabs from "@/components/product/product-tabs";
import RelatedProducts from "@/components/product/related-products";
import { getProductById, getRelatedProducts } from "@/lib/products";
import MetaTags from "@/components/seo/meta-tags";
import ProductSchema from "@/components/seo/product-schema";
import ProductBreadcrumb from "@/components/product/product-breadcrumb";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Parse productId safely
  const productId = params?.id ? Number.parseInt(params.id as any) : Number.NaN;

  useEffect(() => {
    if (isNaN(productId)) {
      router.replace("/404");
      return;
    }

    // Fetch product data — assuming getProductById is synchronous. If async, wrap in async function.
    const fetchedProduct = getProductById(productId);

    if (!fetchedProduct) {
      router.replace("/404");
      return;
    }

    setProduct(fetchedProduct as any);

    // Fetch related products
    const fetchedRelated = getRelatedProducts(
      fetchedProduct.category,
      productId
    );
    setRelatedProducts(fetchedRelated as any);
  }, [productId, router]);

  // While loading or no product, render null or loading state
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MetaTags
        title={`${product.name} | AME-TAMA`}
        description={`خرید مجسمه ${product.name} - ${product.character} از سری ${product.series}. ساخته شده توسط ${product.manufacturer}.`}
        keywords={`${product.character}, ${product.series}, مجسمه انیمه, فیگور, کلکسیونی`}
        ogImage={product.images[0]?.url || "/placeholder.svg"}
        ogType="product"
        canonicalPath={`product/${productId}`}
      />
      <ProductSchema product={product} />
      <div className="container mx-auto px-4 py-8 mt-20" dir="rtl">
        <Breadcrumb
          items={[
            {
              label: product.category,
              href: `/category/${product.category}`,
            },
            { label: product.name, href: `/product/${product.id}`, isCurrent: true },
          ]}
          className="mb-2 mt-2"
        />
        <div className="mb-6 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
          >
            <span className="font-vazirmatn">بازگشت</span>
            <ArrowLeft className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Back to Cart Button Removed */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ProductGallery images={product.images} />
          <ProductInfo product={product} />
        </div>

        <ProductTabs product={product} />

        <RelatedProducts products={relatedProducts} />
      </div>
    </>
  );
}
