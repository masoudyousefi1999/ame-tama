"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCart } from "@/context/cart-context"
import { getAllProducts } from "@/lib/products"
import { toast } from "@/components/ui/use-toast"
import { ProductCard } from "@/components/product/product-card"

export default function FeaturedProducts() {
  const { addItem } = useCart()
  const [products, setProducts] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const products = await getAllProducts()

        if (products) {
          setProducts(products as any)
        } else {
          setProducts([])
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "خطا در بارگذاری محصولات",
          description: "امکان بارگذاری محصولات وجود ندارد. لطفاً دوباره تلاش کنید.",
          variant: "destructive",
        })
        setProducts([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const addProductToCart = (product: any, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    try {
      addItem(product, 1)
      toast({
        title: "محصول به سبد خرید اضافه شد",
        description: `${product.name} به سبد خرید شما اضافه شد.`,
      })
    } catch (error) {
      toast({
        title: "خطا در افزودن به سبد خرید",
        description: "امکان افزودن محصول به سبد خرید وجود ندارد.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <section id="featured-products" className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent font-vazirmatn">
              مجسمه‌های لوکس ویژه
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-vazirmatn">
              در حال بارگذاری محصولات...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg mb-4"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="featured-products" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent font-vazirmatn">
            مجسمه‌های لوکس ویژه
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-vazirmatn">
            محبوب‌ترین کالکشن‌های ما را کاوش کنید، هر کدام شاهکاری از جزئیات و صنعتگری.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products && products.length > 0 ? (
            products.map((product, index) => (
              <motion.div
                key={product.uuid}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product as any} showAddToCart={true} showAddToWishlist={true} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 font-vazirmatn">هیچ محصولی یافت نشد</p>
            </div>
          )}
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
  )
}
