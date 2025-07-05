import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

// Product-specific skeleton components
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm overflow-hidden",
        className
      )}
    >
      <div className="h-64 md:h-72 lg:h-80 bg-muted product-skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded product-skeleton" />
        <div className="h-4 bg-muted rounded w-3/4 product-skeleton" />
        <div className="h-6 bg-muted rounded w-1/2 product-skeleton" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 mt-20" dir="rtl">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex items-center space-x-2 space-x-reverse">
        <div className="h-4 bg-muted rounded w-20 product-skeleton" />
        <div className="h-4 bg-muted rounded w-4 product-skeleton" />
        <div className="h-4 bg-muted rounded w-24 product-skeleton" />
        <div className="h-4 bg-muted rounded w-4 product-skeleton" />
        <div className="h-4 bg-muted rounded w-32 product-skeleton" />
      </div>

      {/* Back button skeleton */}
      <div className="mb-6 flex justify-end">
        <div className="h-10 bg-muted rounded-full w-24 product-skeleton" />
      </div>

      {/* Main content skeleton */}
      <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Gallery skeleton */}
        <div className="space-y-4">
          <div className="h-96 bg-muted rounded-xl product-skeleton" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-20 w-20 bg-muted rounded-lg product-skeleton"
              />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-3/4 product-skeleton" />
            <div className="h-6 bg-muted rounded w-1/2 product-skeleton" />
          </div>

          <div className="space-y-4">
            <div className="h-12 bg-muted rounded w-1/3 product-skeleton" />
            <div className="h-4 bg-muted rounded w-full product-skeleton" />
            <div className="h-4 bg-muted rounded w-2/3 product-skeleton" />
          </div>

          <div className="space-y-3">
            <div className="h-10 bg-muted rounded w-1/2 product-skeleton" />
            <div className="h-10 bg-muted rounded w-full product-skeleton" />
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="mb-12 space-y-6">
        <div className="flex gap-4 border-b">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-10 bg-muted rounded w-24 product-skeleton"
            />
          ))}
        </div>
        <div className="h-64 bg-muted rounded product-skeleton" />
      </div>

      {/* Related products skeleton */}
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 product-skeleton" />
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}

export { Skeleton };
