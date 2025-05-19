import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "h-5 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-shimmer bg-gradient-to-r from-transparent via-gray-300/50 dark:via-gray-600/50 to-transparent bg-[length:1000px_100%]",
        className,
      )}
    />
  )
}
