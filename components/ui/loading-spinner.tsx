import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const sizeClasses: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function LoadingSpinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <div
      {...props}
      className={cn(
        "animate-spin rounded-full border-2 border-border border-t-primary",
        sizeClasses[size],
        className
      )}
    />
  );
}
