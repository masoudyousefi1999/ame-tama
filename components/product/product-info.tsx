"use client"

import { useState } from "react"
import { Star, Minus, Plus, Heart, Share2, ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/cart-context"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useRouter } from "next/navigation"
import { useWishlist } from "@/context/wishlist-context"

interface ProductInfoProps {
  product: {
    id: number
    name: string
    price: number
    originalPrice?: number
    rating: number
    reviewCount: number
    availability: "in-stock" | "low-stock" | "out-of-stock"
    isNew: boolean
    isLimited: boolean
    category: string
    series: string
    character: string
    manufacturer: string
    releaseDate: string
    scale: string
    material: string
    height: string
    images: { id: number; url: string; alt: string }[]
  }
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCart()
  const router = useRouter()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAddedToCart(true)

    toast({
      title: "محصول به سبد خرید اضافه شد",
      description: `${quantity} عدد ${product.name} به سبد خرید شما اضافه شد.`,
      action: (
        <ToastAction altText="مشاهده سبد خرید" onClick={() => router.push("/cart")}>
          مشاهده سبد خرید
        </ToastAction>
      ),
    })

    // بعد از 2 ثانیه، وضعیت دکمه به حالت اولیه برمی‌گردد
    setTimeout(() => {
      setAddedToCart(false)
    }, 2000)
  }

  // تعیین وضعیت موجودی
  const availabilityText = {
    "in-stock": "موجود در انبار",
    "low-stock": "تنها چند عدد باقی مانده",
    "out-of-stock": "ناموجود",
  }

  const availabilityColor = {
    "in-stock": "text-green-500",
    "low-stock": "text-amber-500",
    "out-of-stock": "text-red-500",
  }

  return (
    <div className="space-y-6">
      {/* نام محصول */}
      <h1 className="text-3xl font-bold font-vazirmatn">{product.name}</h1>

      {/* امتیاز و نظرات */}
      <div className="flex items-center gap-x-4 gap-x-reverse">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-5 h-5",
                i < product.rating ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-600",
              )}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400 font-vazirmatn">({product.reviewCount} نظر)</span>
      </div>

      {/* قیمت */}
      <div className="flex items-center gap-x-3 gap-x-reverse">
        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100 font-vazirmatn">
          {new Intl.NumberFormat("fa-IR").format(product.price)} تومان
        </span>

        {product.originalPrice && (
          <span className="text-lg text-gray-500 line-through font-vazirmatn">
            {new Intl.NumberFormat("fa-IR").format(product.originalPrice)} تومان
          </span>
        )}
      </div>

      {/* وضعیت موجودی */}
      <div className="flex items-center gap-x-2 gap-x-reverse">
        <span className={cn("text-sm font-medium font-vazirmatn", availabilityColor[product.availability])}>
          {availabilityText[product.availability]}
        </span>

        {/* نشان‌های محصول */}
        <div className="flex gap-x-2 gap-x-reverse mr-4">
          {product.isNew && <Badge className="bg-purple-500 hover:bg-purple-600 font-vazirmatn">جدید</Badge>}
          {product.isLimited && <Badge className="bg-amber-500 hover:bg-amber-600 font-vazirmatn">نسخه محدود</Badge>}
        </div>
      </div>

      {/* خط جداکننده */}
      <div className="border-t border-gray-200 dark:border-gray-800 my-6"></div>

      {/* اطلاعات کلیدی محصول */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="font-vazirmatn">
          <span className="text-gray-500 dark:text-gray-400">سری:</span>{" "}
          <span className="font-medium">{product.series}</span>
        </div>
        <div className="font-vazirmatn">
          <span className="text-gray-500 dark:text-gray-400">شخصیت:</span>{" "}
          <span className="font-medium">{product.character}</span>
        </div>
        <div className="font-vazirmatn">
          <span className="text-gray-500 dark:text-gray-400">سازنده:</span>{" "}
          <span className="font-medium">{product.manufacturer}</span>
        </div>
        <div className="font-vazirmatn">
          <span className="text-gray-500 dark:text-gray-400">تاریخ انتشار:</span>{" "}
          <span className="font-medium">{product.releaseDate}</span>
        </div>
        <div className="font-vazirmatn">
          <span className="text-gray-500 dark:text-gray-400">مقیاس:</span>{" "}
          <span className="font-medium">{product.scale}</span>
        </div>
        <div className="font-vazirmatn">
          <span className="text-gray-500 dark:text-gray-400">ارتفاع:</span>{" "}
          <span className="font-medium">{product.height}</span>
        </div>
      </div>

      {/* خط جداکننده */}
      <div className="border-t border-gray-200 dark:border-gray-800 my-6"></div>

      {/* انتخاب تعداد */}
      <div className="flex items-center gap-x-4 gap-x-reverse">
        <span className="text-gray-700 dark:text-gray-300 font-vazirmatn">تعداد:</span>
        <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-full">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">کاهش</span>
          </Button>

          <span className="w-10 text-center font-medium font-vazirmatn">
            {new Intl.NumberFormat("fa-IR").format(quantity)}
          </span>

          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={increaseQuantity}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">افزایش</span>
          </Button>
        </div>
      </div>

      {/* دکمه‌های اقدام */}
      <div className="flex flex-wrap gap-4 mt-8">
        <Button
          className={cn(
            "flex-1 rounded-full py-6 font-vazirmatn transition-all duration-300",
            addedToCart
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700",
          )}
          onClick={handleAddToCart}
          disabled={product.availability === "out-of-stock"}
        >
          {addedToCart ? (
            <>
              <Check className="ml-2 h-5 w-5" />
              به سبد خرید اضافه شد
            </>
          ) : (
            <>
              <ShoppingCart className="ml-2 h-5 w-5" />
              افزودن به سبد خرید
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12"
          onClick={() => (isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product))}
        >
          <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}`} />
          <span className="sr-only">افزودن به علاقه‌مندی‌ها</span>
        </Button>

        <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
          <Share2 className="h-5 w-5" />
          <span className="sr-only">اشتراک‌گذاری</span>
        </Button>
      </div>
    </div>
  )
}
