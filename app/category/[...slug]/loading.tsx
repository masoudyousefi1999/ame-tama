import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      {/* اسکلتون هدر دسته‌بندی */}
      <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-8">
        <Skeleton className="w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-1/3 h-12" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* اسکلتون فیلترها */}
        <div className="hidden md:block w-64">
          <Skeleton className="w-full h-[500px] rounded-lg" />
        </div>

        <div className="flex-1">
          {/* اسکلتون مرتب‌سازی */}
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="w-32 h-8" />
            <Skeleton className="w-48 h-10" />
          </div>

          {/* اسکلتون محصولات */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-80 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
