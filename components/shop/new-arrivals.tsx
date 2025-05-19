"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { toast } from "@/components/ui/use-toast"
import { ProductCard } from "@/components/product/product-card"

interface NewArrivalsProps {
  products: any[]
}

export default function NewArrivals({ products }: NewArrivalsProps) {
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

  return (
    <section id="new-arrivals">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          className="hidden sm:flex rounded-full border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-vazirmatn"
          asChild
        >
          <Link href="/shop?tab=all&sort=newest">
            مشاهده همه
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold mb-2 font-vazirmatn text-right">محصولات جدید</h2>
          <p className="text-gray-600 dark:text-gray-400 font-vazirmatn">
            جدیدترین مجسمه‌های اضافه شده به مجموعه AME-TAMA
          </p>
        </div>
      </div>

      <div dir="rtl" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProductCard product={product} showAddToCart={true} showAddToWishlist={true} />
          </motion.div>
        ))}
      </div>

      <div className="mt-6 sm:hidden">
        <Button
          variant="outline"
          className="w-full rounded-full border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-vazirmatn"
          asChild
        >
          <Link href="/shop?tab=all&sort=newest">
            مشاهده همه محصولات جدید
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
