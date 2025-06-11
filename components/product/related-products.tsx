"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IProductType } from "@/lib/products";

interface RelatedProductsProps {
  products: IProductType[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold font-vazirmatn">محصولات مرتبط</h2>

        <div className="flex gap-x-2 gap-x-reverse">
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">قبلی</span>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">بعدی</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.uuid}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => setHoveredProduct(product.uuid)}
            onMouseLeave={() => setHoveredProduct(null)}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            <Link href={`/product/${product.slug}`} className="block">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={product.productMedia[0].url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Product badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {(product.createdAt as any) > new Date() && (
                    <Badge className="bg-purple-500 hover:bg-purple-600 font-vazirmatn">
                      جدید
                    </Badge>
                  )}
                  {product.quantity < 10 && (
                    <Badge className="bg-amber-500 hover:bg-amber-600 font-vazirmatn">
                      نسخه محدود
                    </Badge>
                  )}
                </div>

                {/* Quick add button */}
                <motion.div
                  className="absolute bottom-4 left-0 right-0 flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: hoveredProduct === product.uuid ? 1 : 0,
                    y: hoveredProduct === product.uuid ? 0 : 20,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    size="sm"
                    className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg rounded-full px-6 font-vazirmatn"
                  >
                    <ShoppingCart className="h-4 w-4 ml-2" />
                    افزودن سریع
                  </Button>
                </motion.div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors font-vazirmatn">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100 font-vazirmatn">
                  {product.price.toLocaleString("fa-IR")} تومان
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
