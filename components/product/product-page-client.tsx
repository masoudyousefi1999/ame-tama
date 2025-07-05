"use client";

import { Button } from "@/components/ui/button";
import ProductGallery from "@/components/product/product-gallery";
import ProductInfo from "@/components/product/product-info";
import ProductTabs from "@/components/product/product-tabs";
import RelatedProducts from "@/components/product/related-products";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ProductPageClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductPageClient({
  product,
  relatedProducts,
}: ProductPageClientProps) {
  return (
    <motion.div
      className="container mx-auto px-4 py-8 mt-20"
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Breadcrumb
          items={[
            { href: "/category/figures", label: "فیگور ها" },
            {
              href: `/category/figures/${product.category.slug}`,
              label: product.category.slug,
            },
            {
              href: product.slug,
              label: product.name,
              isCurrent: true,
            },
          ]}
          className="mb-2"
        />
      </motion.div>

      {/* back link */}
      <motion.div
        className="mb-6 flex justify-end"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="flex items-center text-muted-foreground hover:text-primary transition-all duration-200 hover:bg-primary/10 rounded-full px-4"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          <span>بازگشت</span>
        </Button>
      </motion.div>

      <motion.div
        className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="product-gallery-zoom"
        >
          <ProductGallery images={product.productMedia} alt={product.name} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="product-info-fade"
        >
          <ProductInfo product={product} />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="product-tabs-enter"
      >
        <ProductTabs product={product} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <RelatedProducts products={relatedProducts} />
      </motion.div>
    </motion.div>
  );
}
