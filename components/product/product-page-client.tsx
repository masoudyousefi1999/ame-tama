"use client"

import { Button } from "@/components/ui/button"
import ProductGallery from "@/components/product/product-gallery"
import ProductInfo from "@/components/product/product-info"
import ProductTabs from "@/components/product/product-tabs"
import RelatedProducts from "@/components/product/related-products"
import { Breadcrumb } from "@/components/ui/breadcrumb"

interface ProductPageClientProps {
  product: any
  relatedProducts: any[]
}

export default function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  return (
    <div className="container mx-auto px-4 py-8 mt-20" dir="rtl">
      <Breadcrumb
        items={[
          { href: `/category/figures`, label: "فیگور ها" },
          {
            href: `/category/figures/${product.category.slug}`,
            label: `${product.category.slug}`,
          },
          {
            href: `${product.slug}`,
            label: `${product.name}`,
            isCurrent: true,
          },
        ]}
        className="mb-2"
      />
      <div className="mb-6 flex justify-end items-center">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
        >
          <span className="font-vazirmatn align-start">بازگشت</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <ProductGallery images={product?.productMedia} />
        <ProductInfo product={product} />
      </div>

      <ProductTabs product={product} />

      <RelatedProducts products={relatedProducts} />
    </div>
  )
}
