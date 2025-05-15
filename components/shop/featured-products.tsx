"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { toast } from "@/components/ui/use-toast";

interface FeaturedProductsProps {
  products: any[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const { addItem } = useCart();

  // افزودن محصول به سبد خرید
  const handleAddToCart = (product: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    addItem(product, 1);
    toast({
      title: "محصول به سبد خرید اضافه شد",
      description: `${product.name} به سبد خرید شما اضافه شد.`,
    });
  };

  // افزودن محصول به علاقه‌مندی‌ها
  const handleAddToWishlist = (product: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    toast({
      title: "محصول به علاقه‌مندی‌ها اضافه شد",
      description: `${product.name} به لیست علاقه‌مندی‌های شما اضافه شد.`,
    });
  };

  return (
    <section id="featured-products">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          className="hidden sm:flex rounded-full border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-vazirmatn"
          asChild
        >
          <Link href="/shop?tab=featured">
            مشاهده همه
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold mb-2 font-vazirmatn text-right">
            محصولات ویژه
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-vazirmatn">
            مجسمه‌های برتر و محبوب با بالاترین امتیاز از طرف کاربران
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Link href={`/product/${product.id}`} className="block">
              <div className="relative h-64 overflow-hidden ">
                <Image
                  src={
                    product.images?.[0]?.url ||
                    product.image ||
                    "/placeholder.svg"
                  }
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* نشان‌های محصول */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
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
                  {product.availability === "low-stock" && (
                    <Badge className="bg-orange-500 hover:bg-orange-600 font-vazirmatn">
                      موجودی محدود
                    </Badge>
                  )}
                  {product.availability === "out-of-stock" && (
                    <Badge className="bg-red-500 hover:bg-red-600 font-vazirmatn">
                      ناموجود
                    </Badge>
                  )}
                </div>

                {/* امتیاز محصول */}
                <div className="absolute top-2 left-2 bg-amber-400 text-white text-xs font-bold rounded-full px-2 py-1 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 fill-current ml-1"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  {product.rating}
                </div>

                {/* دکمه‌های سریع */}
                <motion.div
                  className="absolute bottom-4 left-0 right-0 flex justify-center gap-x-2 gap-x-reverse"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: hoveredProduct === product.id ? 1 : 0,
                    y: hoveredProduct === product.id ? 0 : 20,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg rounded-full"
                    onClick={(e) => handleAddToWishlist(product, e)}
                  >
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">افزودن به علاقه‌مندی‌ها</span>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg rounded-full px-4 font-vazirmatn"
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={product.availability === "out-of-stock"}
                  >
                    <ShoppingCart className="h-4 w-4 ml-2" />
                    افزودن سریع
                  </Button>
                </motion.div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors font-vazirmatn text-right">
                  {product.name}
                </h3>
                <div className="flex  justify-between items-center flex-row-reverse">
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100 font-vazirmatn text-right">
                    {product.price.toLocaleString("fa-IR")} تومان
                  </p>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through font-vazirmatn text-right">
                      {product.originalPrice.toLocaleString("fa-IR")}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 sm:hidden">
        <Button
          variant="outline"
          className="w-full rounded-full border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-vazirmatn"
          asChild
        >
          <Link href="/shop?tab=featured">
            مشاهده همه محصولات ویژه
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
