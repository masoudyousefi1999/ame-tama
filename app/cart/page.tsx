"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Trash2, ShoppingBag, ArrowLeft, RefreshCw, ExternalLink, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/cart-context"
import { toast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileCartItem } from "@/components/cart/mobile-cart-item"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbCurrent,
} from "@/components/ui/breadcrumb"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function CartPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const { items, updateQuantity, removeItem, clearCart, subtotal, discount, total, applyDiscount } = useCart()
  const [discountCode, setDiscountCode] = useState("")
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Toggle summary visibility on mobile
  useEffect(() => {
    if (!isMobile) {
      setShowSummary(true)
    }
  }, [isMobile])

  // اعمال کد تخفیف
  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً کد تخفیف را وارد کنید.",
        variant: "destructive",
      })
      return
    }

    setIsApplyingDiscount(true)

    // شبیه‌سازی تأخیر شبکه
    setTimeout(() => {
      const success = applyDiscount(discountCode)

      if (success) {
        toast({
          title: "کد تخفیف اعمال شد",
          description: `کد تخفیف ${discountCode} با موفقیت اعمال شد.`,
        })
        setDiscountCode("")
      } else {
        toast({
          title: "خطا",
          description: "کد تخفیف نامعتبر است.",
          variant: "destructive",
        })
      }

      setIsApplyingDiscount(false)
    }, 1000)
  }

  const handleQuantityChange = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setIsUpdating(true)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    updateQuantity(id, newQuantity)
    setIsUpdating(false)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 mt-20 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // اگر سبد خرید خالی است
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 mt-20" dir="rtl">
        <div className="max-w-2xl mx-auto text-center py-16">
          <ShoppingBag className="h-20 w-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
          <h1 className="text-2xl font-bold mb-4 font-vazirmatn">سبد خرید شما خالی است</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 font-vazirmatn">
            محصولی در سبد خرید شما وجود ندارد. برای مشاهده محصولات به فروشگاه بروید.
          </p>
          <Button
            className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
            onClick={() => router.push("/shop")}
          >
            <ShoppingBag className="ml-2 h-5 w-5" />
            رفتن به فروشگاه
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20 pb-24 md:pb-8" dir="rtl">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">خانه</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbCurrent>سبد خرید</BreadcrumbCurrent>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="text-2xl font-bold mb-8 font-vazirmatn">سبد خرید</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* محصولات سبد خرید */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold font-vazirmatn">محصولات ({items.length})</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 font-vazirmatn"
                  onClick={clearCart}
                >
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف همه
                </Button>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-vazirmatn">
                      محصول
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-vazirmatn">
                      قیمت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-vazirmatn">
                      تعداد
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-vazirmatn">
                      مجموع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-vazirmatn">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white dark:bg-gray-800"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="96px"
                              />
                            </div>
                            <div className="mr-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white font-vazirmatn">
                                {item.name}
                              </div>
                              {/* Add Product Details Button */}
                              <Link
                                href={`/product/${item.id}`}
                                className="mt-1 inline-flex items-center text-xs text-purple-600 hover:text-purple-800 transition-colors"
                              >
                                <span className="font-vazirmatn">جزییات محصول</span>
                                <ExternalLink className="h-3 w-3 mr-1" />
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white font-vazirmatn">
                            {new Intl.NumberFormat("fa-IR").format(item.price)} تومان
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full w-24">
                            <button
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={isUpdating}
                            >
                              -
                            </button>
                            <span className="flex-1 text-center text-sm font-vazirmatn">
                              {new Intl.NumberFormat("fa-IR").format(item.quantity)}
                            </span>
                            <button
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={isUpdating}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white font-vazirmatn">
                            {new Intl.NumberFormat("fa-IR").format(item.price * item.quantity)} تومان
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                            aria-label="حذف محصول"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              <AnimatePresence>
                {items.map((item) => (
                  <MobileCartItem
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                    onUpdateQuantity={handleQuantityChange}
                    isUpdating={isUpdating}
                  />
                ))}
              </AnimatePresence>
              <div className="p-4 text-xs text-center text-gray-500 dark:text-gray-400 font-vazirmatn">
                برای حذف محصول، آن را به سمت چپ بکشید
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-700">
              <Link
                href="/shop"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium font-vazirmatn"
              >
                <ArrowLeft className="ml-2 h-4 w-4" />
                ادامه خرید
              </Link>
            </div>
          </div>
        </div>

        {/* خلاصه سفارش - Mobile Toggle */}
        <div className="lg:hidden mt-4 mb-2">
          <Button
            variant="outline"
            onClick={() => setShowSummary(!showSummary)}
            className="w-full flex justify-between items-center rounded-lg font-vazirmatn"
          >
            <span>خلاصه سفارش</span>
            {showSummary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* خلاصه سفارش */}
        <AnimatePresence>
          {(showSummary || !isMobile) && (
            <motion.div
              initial={isMobile ? { height: 0, opacity: 0 } : false}
              animate={isMobile ? { height: "auto", opacity: 1 } : {}}
              exit={isMobile ? { height: 0, opacity: 0 } : {}}
              className="lg:col-span-1 overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold mb-4 font-vazirmatn">خلاصه سفارش</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 font-vazirmatn">مجموع قیمت محصولات:</span>
                    <span className="font-medium font-vazirmatn">{subtotal.toLocaleString("fa-IR")} تومان</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span className="font-vazirmatn">تخفیف ({discount}%):</span>
                      <span className="font-medium font-vazirmatn">
                        {((subtotal * discount) / 100).toLocaleString("fa-IR")} تومان
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span className="font-vazirmatn">مبلغ قابل پرداخت:</span>
                      <span className="font-vazirmatn">{total.toLocaleString("fa-IR")} تومان</span>
                    </div>
                  </div>
                </div>

                {/* کد تخفیف */}
                <div className="mb-6">
                  <label htmlFor="discount-code" className="block text-sm font-medium mb-2 font-vazirmatn">
                    کد تخفیف:
                  </label>
                  <div className="flex gap-x-2 gap-x-reverse">
                    <Input
                      id="discount-code"
                      type="text"
                      placeholder="کد تخفیف خود را وارد کنید"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="rounded-full font-vazirmatn"
                    />
                    <Button
                      variant="outline"
                      className="rounded-full font-vazirmatn"
                      onClick={handleApplyDiscount}
                      disabled={isApplyingDiscount}
                    >
                      {isApplyingDiscount ? <RefreshCw className="h-4 w-4 animate-spin" /> : "اعمال"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-vazirmatn">
                    کدهای تخفیف نمونه: WELCOME10, SUMMER20, ANIME30
                  </p>
                </div>

                <Button
                  className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
                  onClick={() => router.push("/checkout")}
                >
                  ادامه فرآیند خرید
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky Checkout Bar for Mobile */}
        {isMobile && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 p-4 z-40"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-vazirmatn">مجموع:</span>
              <span className="font-bold font-vazirmatn">{total.toLocaleString("fa-IR")} تومان</span>
            </div>
            <Button
              className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
              onClick={() => router.push("/checkout")}
            >
              ادامه فرآیند خرید
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
