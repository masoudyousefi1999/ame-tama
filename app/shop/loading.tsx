import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container py-8 mt-20">
      {/* هدر فروشگاه */}
      <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-8">
        <Skeleton className="w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-1/3 h-12" />
        </div>
      </div>

      {/* دسته‌بندی‌ها */}
      <section className="mb-12">
        <Skeleton className="w-48 h-10 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-64 rounded-lg" />
          ))}
        </div>
      </section>

      {/* محصولات ویژه */}
      <section className="mb-12">
        <Skeleton className="w-48 h-10 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-80 rounded-lg" />
          ))}
        </div>
      </section>

      {/* محصولات جدید */}
      <section>
        <Skeleton className="w-48 h-10 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-80 rounded-lg" />
          ))}
        </div>
      </section>
    </div>
    </div>
  );
}
