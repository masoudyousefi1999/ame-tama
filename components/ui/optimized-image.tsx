"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  loading = "lazy",
  fetchPriority = "auto",
  sizes,
  quality = 75,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);

  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (retryCount < maxRetries) {
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);

      console.warn(
        `Image failed to load (attempt ${newRetryCount}/${maxRetries + 1}):`,
        currentSrc
      );

      // Retry with exponential backoff
      setTimeout(() => {
        setCurrentSrc(`${src}?retry=${newRetryCount}&t=${Date.now()}`);
      }, retryDelay * newRetryCount);
    } else {
      console.error(
        `Image failed to load after ${maxRetries} retries:`,
        currentSrc
      );
      setImageError(true);
      onError?.();
    }
  }, [src, currentSrc, retryCount, maxRetries, onError]);

  // Reset retry count when src changes
  React.useEffect(() => {
    setRetryCount(0);
    setImageError(false);
    setImageLoaded(false);
    setCurrentSrc(src);
  }, [src]);

  return (
    <div className="relative">
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        priority={priority}
        loading={loading}
        fetchPriority={fetchPriority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Loading state */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="text-muted-foreground text-sm">
            در حال بارگذاری...
          </div>
        </div>
      )}

      {/* Error state */}
      {imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">🖼️</div>
            <div className="text-xs">تصویر در دسترس نیست</div>
          </div>
        </div>
      )}
    </div>
  );
}
