"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/cart-context"
import { toast } from "@/components/ui/use-toast"

interface CategoryProductsProps {
  products: any[]
  viewMode: "grid" | "list"
}

export default function CategoryProducts({ products, viewMode }: CategoryProductsProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const { addItem } = useCart()

  // افزودن محصول به سبد خرید
  const handleAddToCart = (product: any, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    addItem(product, 1)
    toast({
      title: "محصول به سبد خرید اضافه شد",
      description: `${product.name} به سبد خرید شما اضافه شد.`,
    })
  }

  // افزودن محصول به علاقه‌مندی‌ها
  const handleAddToWishlist = (product: any, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    toast({
      title: "محصول به علاقه‌مندی‌ها اضافه شد",
      description: `${product.name} به لیست علاقه‌مندی‌های شما اضافه شد.`,
    })
  }

  // اگر محصولی وجود نداشت
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-medium mb-2 font-vazirmatn">محصولی یافت نشد</h3>
        <p className="text-gray-500 dark:text-gray-400 font-vazirmatn">
          با معیارهای فیلتر فعلی محصولی یافت نشد. لطفاً فیلترها را تغییر دهید.
        </p>
      </div>
    )
  }

  // نمایش لیستی
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="relative h-60 sm:h-auto sm:w-48 flex-shrink-0">
                <Image
                  src={product.images?.[0]?.url || product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 192px"
                />

                {/* نشان‌های محصول */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {product.isNew && <Badge className="bg-purple-500 hover:bg-purple-600 font-vazirmatn">جدید</Badge>}
                  {product.isLimited && (
                    <Badge className="bg-amber-500 hover:bg-amber-600 font-vazirmatn">نسخه محدود</Badge>
                  )}
                  {product.availability === "low-stock" && (
                    <Badge className="bg-orange-500 hover:bg-orange-600 font-vazirmatn">موجودی محدود</Badge>
                  )}
                  {product.availability === "out-of-stock" && (
                    <Badge className="bg-red-500 hover:bg-red-600 font-vazirmatn">ناموجود</Badge>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-2 font-vazirmatn">{product.name}</h3>

                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 0)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-500 dark:text-gray-400 mr-1 font-vazirmatn">
                    ({product.reviewCount || 0})
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 font-vazirmatn">
                  {product.description}
                </p>

                <div className="mt-auto flex flex-wrap items-center justify-between">
                  <div className="mb-2 sm:mb-0">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100 font-vazirmatn">
                      {product.price.toLocaleString("fa-IR")} تومان
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through mr-2 font-vazirmatn">
                        {product.originalPrice.toLocaleString("fa-IR")} تومان
                      </span>
                    )}
                  </div>

                  <div className="flex gap-x-2 gap-x-reverse">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={(e) => handleAddToWishlist(product, e)}
                    >
                      <Heart className="h-4 w-4" />
                      <span className="sr-only">افزودن به علاقه‌مندی‌ها</span>
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={product.availability === "out-of-stock"}
                    >
                      <ShoppingCart className="h-4 w-4 ml-1" />
                      افزودن به سبد
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  // نمایش شبکه‌ای (پیش‌فرض)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onMouseEnter={() => setHoveredProduct(product.id)}
          onMouseLeave={() => setHoveredProduct(null)}
          className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
        >
          <Link href={`/product/${product.id}`} className="block">
            <div className="relative h-64 overflow-hidden">
              <Image
                src={product.images?.[0]?.url || product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* نشان‌های محصول */}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {product.isNew && <Badge className="bg-purple-500 hover:bg-purple-600 font-vazirmatn">جدید</Badge>}
                {product.isLimited && (
                  <Badge className="bg-amber-500 hover:bg-amber-600 font-vazirmatn">نسخه محدود</Badge>
                )}
                {product.availability === "low-stock" && (
                  <Badge className="bg-orange-500 hover:bg-orange-600 font-vazirmatn">موجودی محدود</Badge>
                )}
                {product.availability === "out-of-stock" && (
                  <Badge className="bg-red-500 hover:bg-red-600 font-vazirmatn">ناموجود</Badge>
                )}
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
              <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors font-vazirmatn">
                {product.name}
              </h3>

              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 0)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-1 font-vazirmatn">
                  ({product.reviewCount || 0})
                </span>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100 font-vazirmatn">
                  {product.price.toLocaleString("fa-IR")} تومان
                </p>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through font-vazirmatn">
                    {product.originalPrice.toLocaleString("fa-IR")}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
