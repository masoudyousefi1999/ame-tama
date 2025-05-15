"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Trash2, ShoppingBag, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/cart-context"
import { toast } from "@/components/ui/use-toast"

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, clearCart, subtotal, discount, total, applyDiscount } = useCart()
  const [discountCode, setDiscountCode] = useState("")
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)

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
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-8 font-vazirmatn">سبد خرید</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* محصولات سبد خرید */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
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

            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {items.map((item) => (
                <li key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center">
                  {/* تصویر محصول */}
                  <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  {/* اطلاعات محصول */}
                  <div className="flex-1 mr-4 mt-4 sm:mt-0">
                    <h3 className="text-lg font-medium font-vazirmatn">{item.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 font-vazirmatn">
                      {item.price.toLocaleString("fa-IR")} تومان
                    </p>
                  </div>

                  {/* کنترل‌های محصول */}
                  <div className="flex items-center mt-4 sm:mt-0">
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full mr-4">
                      <button
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeItem(item.id)}
                      aria-label="حذف محصول"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

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

        {/* خلاصه سفارش */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
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
        </div>
      </div>
    </div>
  )
}
