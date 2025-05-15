import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      {/* اسکلتون هدر فروشگاه */}
      <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-8">
        <Skeleton className="w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-1/3 h-12" />
        </div>
      </div>

      {/* اسکلتون دسته‌بندی‌ها */}
      <div className="mb-12">
        <Skeleton className="w-48 h-10 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-64 rounded-lg" />
          ))}
        </div>
      </div>

      {/* اسکلتون محصولات ویژه */}
      <div className="mb-12">
        <Skeleton className="w-48 h-10 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-80 rounded-lg" />
          ))}
        </div>
      </div>

      {/* اسکلتون محصولات جدید */}
      <div>
        <Skeleton className="w-48 h-10 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-80 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
