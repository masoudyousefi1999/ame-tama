import Image from "next/image"
import type { Category } from "@/lib/categories"

interface CategoryHeaderProps {
  category: Category
  productCount: number
}

export default function CategoryHeader({ category, productCount }: CategoryHeaderProps) {
  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-8">
      {/* تصویر پس‌زمینه */}
      <div className="absolute inset-0">
        <Image
          src={category.image || "/placeholder.svg?height=600&width=1200"}
          alt={category.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-indigo-900/70 backdrop-blur-sm" />
      </div>

      {/* محتوای هدر */}
      <div className="relative h-full flex flex-col justify-center items-center text-center text-white p-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 font-vazirmatn">{category.name}</h1>
        <p className="text-lg max-w-2xl font-vazirmatn">{category.description}</p>
        <div className="mt-4 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full">
          <span className="font-vazirmatn">{productCount} محصول</span>
        </div>
      </div>
    </div>
  )
}
