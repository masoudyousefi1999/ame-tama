"use client";

import { useState, useEffect } from "react";
import Image, { type ImageProps } from "next/image";
import { useImagePreload } from "./smart-preload";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  preloadFallback?: boolean;
}

export function ImageWithFallback({
  src,
  fallbackSrc = "/placeholder.svg",
  alt,
  preloadFallback = false,
  ...rest
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Preload fallback image only when needed
  useImagePreload(fallbackSrc, preloadFallback && hasError, 100);

  return (
    <Image
      {...rest}
      src={imgSrc || fallbackSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc);
        setHasError(true);
      }}
    />
  );
}
