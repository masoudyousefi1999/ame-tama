import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ShopCTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white font-vazirmatn">
            مجموعه کامل فیگورهای انیمه
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-vazirmatn">
            بیش از 1000 فیگور از برترین انیمه‌ها و مانگاهای محبوب شما. از شخصیت‌های کلاسیک گرفته تا جدیدترین سری‌ها.
          </p>
          <Link href="/shop">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full px-8 py-6 text-lg font-vazirmatn group transition-all duration-300 transform hover:scale-105"
            >
              <span>مشاهده فروشگاه</span>
              <ArrowRight className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
