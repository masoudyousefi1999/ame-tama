"use client";

import { useState } from "react";
import { CustomImage as Image } from "@/components/ui/custom-image";
import type { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface CategoryImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt: string;
  fallbackIcon?: string;
  className?: string;
}

export function CategoryImage({
  src,
  alt,
  fallbackIcon = "📦",
  className,
  ...props
}: CategoryImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div
        className={cn(
          "h-full w-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center",
          className
        )}
      >
        <span className="text-4xl opacity-50">{fallbackIcon}</span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center animate-pulse">
          <span className="text-2xl opacity-30">{fallbackIcon}</span>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className={cn(
          "object-cover transition-all duration-500",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        loading="lazy"
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        {...props}
      />
    </div>
  );
}
