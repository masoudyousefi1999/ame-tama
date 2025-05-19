"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CreditCard, MapPin, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useCart } from "@/context/cart-context"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

// انواع روش‌های پرداخت
const paymentMethods = [
  {
    id: "online",
    name: "پرداخت آنلاین",
    description: "پرداخت آنلاین با تمامی کارت‌های بانکی عضو شتاب",
    icon: CreditCard,
  },
  {
    id: "cod",
    name: "پرداخت در محل",
    description: "پرداخت وجه هنگام تحویل سفارش",
    icon: MapPin,
  },
]

// انواع روش‌های ارسال
const shippingMethods = [
  {
    id: "standard",
    name: "ارسال استاندارد",
    description: "تحویل بین ۳ تا ۵ روز کاری",
    price: 25000,
  },
  {
    id: "express",
    name: "ارسال سریع",
    description: "تحویل بین ۱ تا ۲ روز کاری",
    price: 45000,
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, discount, total, clearCart } = useCart()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    postalCode: "",
    city: "",
    province: "",
    notes: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("online")
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [showOrderSummary, setShowOrderSummary] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // محاسبه هزینه ارسال
  const shippingCost = shippingMethods.find((method) => method.id === shippingMethod)?.price || 0

  // محاسبه مبلغ نهایی با احتساب هزینه ارسال
  const finalTotal = total + shippingCost

  // تغییر مقادیر فرم
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // ارسال فرم
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // شبیه‌سازی ارسال اطلاعات به سرور
    setTimeout(() => {
      // پاک کردن سبد خرید
      clearCart()

      // هدایت به صفحه تأیید سفارش
      router.push("/checkout/success")
    }, 2000)
  }

  // اگر سبد خرید خالی است، کاربر را به صفحه سبد خرید هدایت می‌کنیم
  // if (items.length === 0) {
  //   router.push("/cart");
  //   return null;
  // }
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items, router])

  if (items.length === 0) {
    return null // Prevent rendering while redirecting
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-8 font-vazirmatn">تکمیل سفارش</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* فرم اطلاعات مشتری و ارسال */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* اطلاعات شخصی */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 font-vazirmatn">اطلاعات شخصی</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="font-vazirmatn">
                    نام <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="mt-1 font-vazirmatn"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="font-vazirmatn">
                    نام خانوادگی <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="mt-1 font-vazirmatn"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="font-vazirmatn">
                    شماره موبایل <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="mt-1 font-vazirmatn"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="font-vazirmatn">
                    ایمیل
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 font-vazirmatn"
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>
            </div>

            {/* آدرس ارسال */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 font-vazirmatn">آدرس ارسال</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address" className="font-vazirmatn">
                    آدرس <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="mt-1 font-vazirmatn"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="font-vazirmatn">
                    شهر <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="mt-1 font-vazirmatn"
                  />
                </div>
                <div>
                  <Label htmlFor="province" className="font-vazirmatn">
                    استان <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    required
                    className="mt-1 font-vazirmatn"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode" className="font-vazirmatn">
                    کد پستی <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="mt-1 font-vazirmatn"
                    placeholder="۱۲۳۴۵۶۷۸۹۰"
                  />
                </div>
              </div>
            </div>

            {/* روش ارسال */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 font-vazirmatn">روش ارسال</h2>
              <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                {shippingMethods.map((method) => (
                  <div
                    key={method.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border",
                      shippingMethod === method.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10"
                        : "border-gray-200 dark:border-gray-700",
                    )}
                  >
                    <div className="flex items-center">
                      <RadioGroupItem value={method.id} id={`shipping-${method.id}`} className="ml-2" />
                      <div>
                        <Label htmlFor={`shipping-${method.id}`} className="font-medium cursor-pointer font-vazirmatn">
                          {method.name}
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">{method.description}</p>
                      </div>
                    </div>
                    <div className="font-medium font-vazirmatn">{method.price.toLocaleString("fa-IR")} تومان</div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* روش پرداخت */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 font-vazirmatn">روش پرداخت</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={cn(
                      "flex items-center p-4 rounded-lg border",
                      paymentMethod === method.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10"
                        : "border-gray-200 dark:border-gray-700",
                    )}
                  >
                    <RadioGroupItem value={method.id} id={`payment-${method.id}`} className="ml-2" />
                    <method.icon className="h-5 w-5 text-gray-600 dark:text-gray-400 ml-2" />
                    <div>
                      <Label htmlFor={`payment-${method.id}`} className="font-medium cursor-pointer font-vazirmatn">
                        {method.name}
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">{method.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* یادداشت سفارش */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 font-vazirmatn">یادداشت سفارش (اختیاری)</h2>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="font-vazirmatn"
                placeholder="اگر توضیحات خاصی برای سفارش خود دارید، اینجا بنویسید..."
                rows={3}
              />
            </div>
          </form>
        </div>

        {/* خلاصه سفارش */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm sticky top-24">
            {/* هدر خلاصه سفارش برای موبایل */}
            <div className="lg:hidden p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold font-vazirmatn">خلاصه سفارش</h2>
              <Button variant="ghost" size="sm" className="p-1" onClick={() => setShowOrderSummary(!showOrderSummary)}>
                {showOrderSummary ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </div>

            {/* محتوای خلاصه سفارش */}
            <div className={cn("p-6", !showOrderSummary && "hidden lg:block")}>
              <h2 className="text-lg font-semibold mb-4 hidden lg:block font-vazirmatn">خلاصه سفارش</h2>

              {/* لیست محصولات */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs rounded-bl-md px-1">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 mr-3">
                      <h4 className="text-sm font-medium font-vazirmatn">{item.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-vazirmatn">
                        {item.price.toLocaleString("fa-IR")} تومان
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* محاسبات قیمت */}
              <div className="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-4 mb-6">
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

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 font-vazirmatn">هزینه ارسال:</span>
                  <span className="font-medium font-vazirmatn">{shippingCost.toLocaleString("fa-IR")} تومان</span>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span className="font-vazirmatn">مبلغ قابل پرداخت:</span>
                    <span className="font-vazirmatn">{finalTotal.toLocaleString("fa-IR")} تومان</span>
                  </div>
                </div>
              </div>

              {/* دکمه ثبت سفارش */}
              <Button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    در حال پردازش...
                  </div>
                ) : (
                  "ثبت سفارش و پرداخت"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
