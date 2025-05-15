import ShopPage from "@/components/shop/shop-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "فروشگاه | مجسمه‌های انیمه لوکس | AME-TAMA",
  description: "فروشگاه آنلاین مجسمه‌های انیمه لوکس AME-TAMA - مجموعه‌ای از بهترین مجسمه‌های انیمه با کیفیت استثنایی",
  openGraph: {
    title: "فروشگاه مجسمه‌های انیمه لوکس | AME-TAMA",
    description: "مجموعه‌ای از بهترین مجسمه‌های انیمه با کیفیت استثنایی و جزئیات خیره‌کننده",
    images: ["/placeholder.svg?height=630&width=1200"],
  },
}

export default function Shop() {
  return <ShopPage />
}
