"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IProductType } from "@/lib/products";

interface RelatedProductsProps {
  products: IProductType[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Don't render if no products
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <motion.section 
      className="mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* ­­­­­­­­­­­­­­­­­­­ Heading & arrows */}
      <motion.div 
        className="mb-8 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          محصولات مشابه
        </h2>

        <div className="flex gap-x-2 rtl:gap-x-reverse">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full hover:bg-primary/10 transition-all duration-200 hover:scale-105"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">قبلی</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full hover:bg-primary/10 transition-all duration-200 hover:scale-105"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">بعدی</span>
          </Button>
        </div>
      </motion.div>

      {/* ­­­­­­­­­­­­­­­­­­­ Cards */}
      <motion.div 
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.uuid}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            onMouseEnter={() => setHoveredProduct(product.uuid)}
            onMouseLeave={() => setHoveredProduct(null)}
            className="group relative rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 bg-card related-product-item"
            whileHover={{ 
              y: -8,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
          >
            <Link href={`/product/${product.slug}`} className="block">
              {/* image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={product.productMedia[0]?.url ?? "/placeholder.svg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-all duration-700 product-image-hover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* quick view overlay */}
                <motion.div
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <div className="flex items-center gap-2 text-white">
                    <Eye className="h-5 w-5" />
                    <span className="text-sm font-medium">مشاهده محصول</span>
                  </div>
                </motion.div>

                {/* badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                  {(product.createdAt as any) > new Date() && (
                    <Badge className="bg-primary text-primary-foreground product-badge-improved">
                      جدید
                    </Badge>
                  )}
                  {product.quantity < 10 && (
                    <Badge className="bg-warning text-warning-foreground product-badge-improved">
                      نسخه محدود
                    </Badge>
                  )}
                </div>

                {/* quick-add */}
                <motion.div
                  className="absolute bottom-4 left-0 right-0 flex justify-center z-20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: hoveredProduct === product.uuid ? 1 : 0,
                    y: hoveredProduct === product.uuid ? 0 : 20,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    size="sm"
                    className="rounded-full px-6 shadow-lg bg-background/90 backdrop-blur-sm text-foreground hover:bg-background transition-all duration-200 hover:scale-105"
                  >
                    <ShoppingCart className="ml-2 h-4 w-4" />
                    افزودن سریع
                  </Button>
                </motion.div>
              </div>

              {/* details */}
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold transition-colors group-hover:text-primary leading-relaxed line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-lg font-bold price-improved">
                  {product.price.toLocaleString("fa-IR")} تومان
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
