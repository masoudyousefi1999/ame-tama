import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-8 mt-20">
      {/* Header skeleton */}
      <div className="relative h-64 rounded-2xl overflow-hidden mb-8">
        <Skeleton className="w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-1/3 h-12" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters skeleton */}
        <div className="hidden md:block w-64">
          <Skeleton className="h-[500px] rounded-lg" />
        </div>

        <div className="flex-1">
          {/* Sort bar skeleton */}
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="w-32 h-8" />
            <Skeleton className="w-48 h-10" />
          </div>

          {/* Product grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
