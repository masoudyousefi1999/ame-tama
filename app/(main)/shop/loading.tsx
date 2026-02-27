import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-24 mt-20">
      {/* Breadcrumb skeleton */}
      <div className="container mx-auto px-4 md:px-6 pt-6">
        <div className="mb-6">
          <Skeleton className="h-6 w-32" />
        </div>
      </div>

      {/* Hero section skeleton */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <Skeleton className="h-12 md:h-16 w-3/4 mx-auto mb-4 md:mb-6" />
          <Skeleton className="h-6 md:h-8 w-2/3 mx-auto mb-6 md:mb-8" />
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-xl mx-auto">
            <Skeleton className="h-10 w-full sm:w-64 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </div>
      </section>

      {/* Product grid skeleton */}
      <section className="container mx-auto px-4 md:px-6 mt-8 md:mt-12">
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-32" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-border bg-card bg-opacity-50"
            >
              {/* Image skeleton */}
              <div className="relative aspect-[1] w-full overflow-hidden rounded-t-2xl">
                <Skeleton className="w-full h-full" />
              </div>

              {/* Content skeleton */}
              <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
