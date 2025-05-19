"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface ResponsiveImageProps extends Omit<ImageProps, "onError" | "src"> {
  src: string | null | undefined
  fallbackSrc?: string
  lowQualitySrc?: string
  mobileSize?: string
  tabletSize?: string
  desktopSize?: string
  blurhash?: string
  aspectRatio?: string
  className?: string
  containerClassName?: string
  loadingStrategy?: "eager" | "lazy" | "progressive"
  mobileQuality?: number
  desktopQuality?: number
}

export function ResponsiveImage({
  src,
  fallbackSrc = "/placeholder.svg",
  lowQualitySrc,
  mobileSize = "100vw",
  tabletSize = "50vw",
  desktopSize = "33vw",
  blurhash,
  aspectRatio = "square",
  className,
  containerClassName,
  loadingStrategy = "lazy",
  mobileQuality = 70,
  desktopQuality = 85,
  alt,
  fill,
  sizes,
  priority,
  ...rest
}: ResponsiveImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const isMobile = useIsMobile()

  // Apply quality parameter based on device
  useEffect(() => {
    if (src && !src.includes("placeholder.svg")) {
      // Only apply quality to non-placeholder images
      try {
        const url = new URL(src)
        const quality = isMobile ? mobileQuality : desktopQuality

        // Add or update quality parameter
        url.searchParams.set("quality", quality.toString())

        // For mobile, also reduce dimensions if not already specified
        if (isMobile && !url.searchParams.has("width")) {
          url.searchParams.set("width", "640")
        }

        setImgSrc(url.toString())
      } catch (e) {
        // If URL parsing fails (e.g., relative URL), use original src
        setImgSrc(src)
      }
    }
  }, [src, isMobile, mobileQuality, desktopQuality])

  // Reset state when src changes
  useEffect(() => {
    if (src) {
      setIsLoaded(false)
      setIsError(false)
    }
  }, [src])

  // Calculate aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square"
      case "video":
        return "aspect-video"
      case "portrait":
        return "aspect-[3/4]"
      case "wide":
        return "aspect-[16/9]"
      case "ultra-wide":
        return "aspect-[21/9]"
      default:
        return aspectRatio.startsWith("aspect-") ? aspectRatio : "aspect-square"
    }
  }

  // Determine sizes if not explicitly provided
  const imageSizes = sizes || `(max-width: 640px) ${mobileSize}, (max-width: 1024px) ${tabletSize}, ${desktopSize}`

  // Handle image loading error
  const handleError = () => {
    setIsError(true)
    setImgSrc(fallbackSrc)
  }

  // Handle image load success
  const handleLoad = () => {
    setIsLoaded(true)
  }

  // Determine loading behavior
  const loading = priority ? undefined : loadingStrategy === "eager" ? "eager" : "lazy"

  // Determine placeholder behavior
  const placeholder = blurhash ? "blur" : "empty"
  const blurDataURL = blurhash

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-100 dark:bg-gray-800",
        !fill && getAspectRatioClass(),
        containerClassName,
      )}
    >
      {/* Low quality placeholder image */}
      {loadingStrategy === "progressive" && lowQualitySrc && !isLoaded && !isError && (
        <Image
          src={lowQualitySrc || "/placeholder.svg"}
          alt=""
          fill={fill}
          className={cn("object-cover transition-opacity duration-300", className)}
          sizes={imageSizes}
          aria-hidden="true"
        />
      )}

      {/* Main image */}
      <Image
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        fill={fill}
        sizes={imageSizes}
        priority={priority}
        loading={loading}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          "object-cover transition-opacity duration-300",
          !isLoaded && loadingStrategy === "progressive" && "opacity-0",
          isLoaded && "opacity-100",
          className,
        )}
        {...rest}
      />
    </div>
  )
}
