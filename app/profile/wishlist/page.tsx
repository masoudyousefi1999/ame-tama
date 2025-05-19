"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { BackButton } from "@/components/ui/back-button"
import { ProductCard } from "@/components/product/product-card"
import { useWishlist } from "@/context/wishlist-context"

export default function WishlistPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { addItem } = useCart()
  const { toast } = useToast()
  const { wishlist, removeFromWishlist } = useWishlist()
  const [searchQuery, setSearchQuery] = useState("")

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

  const handleAddToCart = (product: any) => {
    addItem(product, 1)

    toast({
      title: "به سبد خرید اضافه شد",
      description: `${product.name} به سبد خرید شما اضافه شد`,
    })
  }

  // Filter wishlist based on search query
  const filteredWishlist = wishlist.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <BackButton href="/profile" label="بازگشت به پروفایل" />
        </div>
        <Breadcrumb
          items={[
            { label: "پروفایل", href: "/profile" },
            { label: "علاقه‌مندی‌های من", href: "/profile/wishlist", isCurrent: true },
          ]}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-vazirmatn">مجسمه‌های مورد علاقه من</CardTitle>
            <CardDescription className="font-vazirmatn">فیگورهای انیمه و اکشن فیگورهای مورد علاقه شما</CardDescription>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="جستجو در مجسمه‌های مورد علاقه..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 font-vazirmatn"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredWishlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWishlist.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  variant="wishlist"
                  onAddToCart={handleAddToCart}
                  onRemoveFromWishlist={removeFromWishlist}
                  showRemoveFromWishlist={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium mb-2 font-vazirmatn">لیست مجسمه‌های مورد علاقه شما خالی است</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 font-vazirmatn">
                فیگورهای انیمه و اکشن فیگورهای مورد علاقه خود را به این لیست اضافه کنید
              </p>
              <Button
                className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
                onClick={() => router.push("/shop")}
              >
                <Search className="ml-2 h-4 w-4" />
                مشاهده محصولات
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
