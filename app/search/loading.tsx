import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container py-8 mt-20">
      <header className="mb-8 space-y-4">
        <div className="h-10 w-40 mb-4">
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="h-12 w-full max-w-xl mb-2">
          <Skeleton className="h-12 w-full max-w-xl" />
        </div>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-lg" />
        ))}
      </div>
    </div>
    </div>
  );
}
