"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveImageProps extends Omit<ImageProps, "onError" | "src"> {
  src: string | null | undefined;
  fallbackSrc?: string;
  lowQualitySrc?: string;
  aspectRatio?:
    | "square"
    | "video"
    | "portrait"
    | "wide"
    | "ultra-wide"
    | string;
  loadingStrategy?: "eager" | "lazy" | "progressive";
  mobileSize?: string;
  tabletSize?: string;
  desktopSize?: string;
  mobileQuality?: number;
  desktopQuality?: number;
  containerClassName?: string;
}

export function ResponsiveImage({
  src,
  fallbackSrc = "/placeholder.svg",
  lowQualitySrc,
  aspectRatio = "square",
  loadingStrategy = "lazy",
  mobileSize = "100vw",
  tabletSize = "50vw",
  desktopSize = "33vw",
  mobileQuality = 70,
  desktopQuality = 85,
  fill = false,
  sizes,
  priority,
  alt,
  className,
  containerClassName,
  ...rest
}: ResponsiveImageProps) {
  const isMobile = useIsMobile();
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (src && !src.includes("placeholder.svg")) {
      try {
        let finalSrc = src;
        if (/^https?:\/\//.test(src)) {
          const url = new URL(src);
          url.searchParams.set(
            "quality",
            (isMobile ? mobileQuality : desktopQuality).toString()
          );
          if (isMobile && !url.searchParams.has("width")) {
            url.searchParams.set("width", "640");
          }
          finalSrc = url.toString();
        }
        setImgSrc(finalSrc);
      } catch (e) {
        console.warn("Invalid image URL:", src);
        setImgSrc(src); // fallback to raw
      }
    }
  }, [src, isMobile, mobileQuality, desktopQuality]);

  useEffect(() => {
    if (src) {
      setIsLoaded(false);
      setIsError(false);
    }
  }, [src]);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      case "portrait":
        return "aspect-[3/4]";
      case "wide":
        return "aspect-[16/9]";
      case "ultra-wide":
        return "aspect-[21/9]";
      default:
        return aspectRatio.startsWith("aspect-")
          ? aspectRatio
          : "aspect-square";
    }
  };

  const imageSizes =
    sizes ||
    `(max-width: 640px) ${mobileSize}, (max-width: 1024px) ${tabletSize}, ${desktopSize}`;
  const loading = priority
    ? undefined
    : loadingStrategy === "eager"
    ? "eager"
    : "lazy";

  const showLowQuality =
    loadingStrategy === "progressive" && lowQualitySrc && !isLoaded && !isError;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square",
        !fill && getAspectRatioClass(),
        containerClassName
      )}
    >
      {showLowQuality && (
        <Image
          src={lowQualitySrc}
          alt=""
          fill={fill}
          width={fill ? undefined : 100}
          height={fill ? undefined : 100}
          className={cn(
            "absolute inset-0 object-cover opacity-100 transition-opacity",
            !isLoaded && "z-10"
          )}
          sizes={imageSizes}
          aria-hidden="true"
        />
      )}

      <Image
        src={imgSrc || fallbackSrc}
        alt={alt}
        fill={fill}
        width={fill ? undefined : 100}
        height={fill ? undefined : 100}
        sizes={imageSizes}
        priority={priority}
        loading={loading}
        onError={() => {
          setIsError(true);
          setImgSrc(fallbackSrc);
        }}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "transition-opacity duration-300 object-cover",
          showLowQuality && !isLoaded && "opacity-0",
          isLoaded && "opacity-100",
          className
        )}
        {...rest}
      />
    </div>
  );
}
