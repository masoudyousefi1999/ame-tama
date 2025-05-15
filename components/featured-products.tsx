"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { getAllProducts } from "@/lib/products";
import { toast } from "@/components/ui/use-toast";

// Sample product data
const products = getAllProducts();

export default function FeaturedProducts() {
  const { addItem } = useCart();

  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const addProductToCart = (product: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    addItem(product, 1);
    toast({
      title: "محصول به سبد خرید اضافه شد",
      description: `${product.name} به سبد خرید شما اضافه شد.`,
    });
  };

  return (
    <section id="featured-products" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent font-vazirmatn">
            مجسمه‌های لوکس ویژه
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-vazirmatn">
            محبوب‌ترین کالکشن‌های ما را کاوش کنید، هر کدام شاهکاری از جزئیات و
            صنعتگری.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={product.images[0]?.url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Product badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-purple-500 hover:bg-purple-600 font-vazirmatn">
                      جدید
                    </Badge>
                  )}
                  {product.isLimited && (
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
                    opacity: hoveredProduct === product.id ? 1 : 0,
                    y: hoveredProduct === product.id ? 0 : 20,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    size="sm"
                    className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg rounded-full px-6 font-vazirmatn"
                    onClick={(e) => addProductToCart(product, e)}
                  >
                    <ShoppingCart className="h-4 w-4 ml-2" />
                    افزودن سریع
                  </Button>
                </motion.div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors font-vazirmatn">
                  {product.name}
                </h3>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100 font-vazirmatn">
                  {product.price.toLocaleString("fa-IR")} تومان
                </p>

                <Link href={`/product/${product.id}`}>
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-vazirmatn"
                    onClick={() => {}}
                  >
                    مشاهده محصول
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href={"/shop"}>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-vazirmatn"
            >
              مشاهده همه مجسمه‌های لوکس
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
