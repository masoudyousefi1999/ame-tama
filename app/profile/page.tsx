"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Heart, Settings, MapPin, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()

  // اگر کاربر وارد نشده باشد، به صفحه اصلی هدایت می‌شود
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  // اگر در حال بارگذاری است یا کاربر وارد نشده، چیزی نمایش نمی‌دهیم
  if (isLoading || !user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-8 font-vazirmatn">پروفایل من</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* اطلاعات کاربر */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="relative h-24 w-24 mx-auto mb-4">
                <Image
                  src={user.avatar || "/placeholder.svg?height=96&width=96"}
                  alt={`${user.firstName} ${user.lastName}`}
                  fill
                  className="object-cover rounded-full"
                  sizes="96px"
                />
              </div>
              <CardTitle className="font-vazirmatn">
                {user.firstName} {user.lastName}
              </CardTitle>
              <CardDescription className="font-vazirmatn">{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center p-2 rounded-lg bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400 font-vazirmatn"
                >
                  <ShoppingBag className="h-4 w-4 ml-2" />
                  سفارش‌های من
                </Link>
                <Link
                  href="/profile/wishlist"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-vazirmatn"
                >
                  <Heart className="h-4 w-4 ml-2" />
                  علاقه‌مندی‌ها
                </Link>
                <Link
                  href="/profile/addresses"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-vazirmatn"
                >
                  <MapPin className="h-4 w-4 ml-2" />
                  آدرس‌های من
                </Link>
                <Link
                  href="/profile/settings"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-vazirmatn"
                >
                  <Settings className="h-4 w-4 ml-2" />
                  تنظیمات حساب کاربری
                </Link>
                <button
                  className="flex items-center w-full text-right p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-600 dark:text-red-400 font-vazirmatn"
                  onClick={() => logout()}
                >
                  <LogOut className="h-4 w-4 ml-2" />
                  خروج از حساب کاربری
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* سفارش‌های اخیر */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="font-vazirmatn">سفارش‌های اخیر</CardTitle>
              <CardDescription className="font-vazirmatn">لیست سفارش‌های اخیر شما</CardDescription>
            </CardHeader>
            <CardContent>
              {/* اگر سفارشی وجود نداشته باشد */}
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-2 font-vazirmatn">هنوز سفارشی ثبت نکرده‌اید</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 font-vazirmatn">
                  به فروشگاه بروید و اولین سفارش خود را ثبت کنید
                </p>
                <Button
                  className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
                  onClick={() => router.push("/shop")}
                >
                  <ShoppingBag className="ml-2 h-4 w-4" />
                  رفتن به فروشگاه
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
