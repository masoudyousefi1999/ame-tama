"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ShoppingBag, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const { items } = useCart()

  // اگر سبد خرید خالی نیست و کاربر مستقیماً به این صفحه آمده، او را به صفحه اصلی هدایت می‌کنیم
  useEffect(() => {
    if (items.length > 0) {
      router.push("/")
    }
  }, [items, router])

  // شماره سفارش تصادفی
  const orderNumber = Math.floor(10000000 + Math.random() * 90000000)

  return (
    <div className="container mx-auto px-4 py-16 mt-20">
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 mb-6">
          <CheckCircle className="h-10 w-10" />
        </div>

        <h1 className="text-2xl font-bold mb-4 font-vazirmatn">سفارش شما با موفقیت ثبت شد</h1>

        <p className="text-gray-600 dark:text-gray-400 mb-2 font-vazirmatn">
          از خرید شما متشکریم! سفارش شما با موفقیت ثبت شد و در حال پردازش است.
        </p>

        <p className="text-gray-600 dark:text-gray-400 mb-8 font-vazirmatn">
          شماره سفارش: <span className="font-semibold">{orderNumber}</span>
        </p>

        <p className="text-gray-600 dark:text-gray-400 mb-8 font-vazirmatn">
          یک ایمیل تأیید برای شما ارسال شده است. جزئیات سفارش و اطلاعات پیگیری در ایمیل موجود است.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
            onClick={() => router.push("/shop")}
          >
            <ShoppingBag className="ml-2 h-5 w-5" />
            ادامه خرید
          </Button>

          <Button
            variant="outline"
            className="rounded-full border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-vazirmatn"
            onClick={() => router.push("/")}
          >
            <Home className="ml-2 h-5 w-5" />
            بازگشت به صفحه اصلی
          </Button>
        </div>
      </div>
    </div>
  )
}
