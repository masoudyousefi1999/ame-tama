"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/components/ui/use-toast"

export default function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { items, itemCount, subtotal, updateQuantity, total, recentlyAdded } = useCart()

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close dropdown when navigating
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false)
    }

    window.addEventListener("popstate", handleRouteChange)
    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  // Handle quantity updates with error handling
  const handleQuantityUpdate = (productUuid: string, quantity: number, type: "increase" | "decrease") => {
    try {
      updateQuantity(productUuid, quantity, type)
    } catch (error) {
      toast({
        title: "خطا در به‌روزرسانی سبد خرید",
        description: "مشکلی در به‌روزرسانی تعداد محصول رخ داد.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Cart Button with Animation */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full relative"
        onClick={toggleDropdown}
        aria-label="سبد خرید"
        aria-expanded={isOpen}
        aria-controls="cart-dropdown"
      >
        <ShoppingBag className="h-5 w-5" />
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {itemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      {/* Cart Dropdown */}
      <div
        id="cart-dropdown"
        className={cn(
          "absolute left-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 transition-all duration-300 transform origin-top",
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none",
        )}
      >
        {/* Cart Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold text-lg font-vazirmatn">سبد خرید</h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">بستن</span>
          </Button>
        </div>

        {/* Cart Content */}
        <div className="max-h-80 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-vazirmatn">سبد خرید شما خالی است</p>
            </div>
          ) : (
            <ul className="space-y-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.product.uuid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex gap-x-4 p-3 rounded-lg",
                      recentlyAdded === item.product.uuid
                        ? "bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
                        : "border border-transparent",
                    )}
                  >
                    {/* Product Image */}
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                      <Image
                        src={item?.product?.productMedia[0]?.url || "/placeholder.svg"}
                        alt={item.product.name || "product image"}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 mr-4">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="text-sm font-medium line-clamp-1 hover:text-purple-600 transition-colors font-vazirmatn"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-vazirmatn">
                        {new Intl.NumberFormat("fa-IR").format(item.product.price)} تومان
                      </div>
                      <div className="flex items-center mt-1">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 w-6 h-6 flex items-center justify-center"
                          onClick={() => handleQuantityUpdate(item.product.uuid, 1, "decrease")}
                          aria-label="کاهش تعداد"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </motion.button>
                        <motion.span
                          key={item.quantity}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="mx-2 text-sm font-vazirmatn"
                        >
                          {new Intl.NumberFormat("fa-IR").format(item.quantity)}
                        </motion.span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 w-6 h-6 flex items-center justify-center"
                          onClick={() => handleQuantityUpdate(item.product.uuid, 1, "increase")}
                          aria-label="افزایش تعداد"
                        >
                          <Plus className="h-3 w-3" />
                        </motion.button>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm font-medium font-vazirmatn">
                          {new Intl.NumberFormat("fa-IR").format(item.product.price * item.quantity)} تومان
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="text-red-500 hover:text-red-700 p-1"
                          onClick={() => handleQuantityUpdate(item.product.uuid, item.quantity, "decrease")}
                          aria-label="حذف محصول"
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between mb-4">
              <span className="font-vazirmatn">مجموع:</span>
              <motion.span
                key={subtotal}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-semibold font-vazirmatn"
              >
                {new Intl.NumberFormat("fa-IR").format(subtotal)} تومان
              </motion.span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/cart"
                className="bg-white text-purple-600 border border-purple-600 hover:bg-purple-50 rounded-full py-2 px-4 text-center text-sm font-medium transition-colors font-vazirmatn"
                onClick={() => setIsOpen(false)}
              >
                مشاهده سبد خرید
              </Link>
              <Link
                href="/checkout"
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full py-2 px-4 text-center text-sm font-medium transition-colors font-vazirmatn"
                onClick={() => setIsOpen(false)}
              >
                تسویه حساب
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
