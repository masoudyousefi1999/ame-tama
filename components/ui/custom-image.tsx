"use client";

import React from "react";
import Image, { type ImageProps } from "next/image";

export interface CustomImageProps extends Omit<ImageProps, "loader"> {
  src: string;
  fallbackSrc?: string;
  maxRetries?: number;
  retryDelayMs?: number;
  enableBlur?: boolean;
  blurDataURL?: string;
}

export function CustomImage({
  src,
  fallbackSrc,
  maxRetries = 2,
  retryDelayMs = 500,
  enableBlur,
  blurDataURL,
  quality,
  width,
  height,
  ...rest
}: CustomImageProps) {
  const [currentSrc, setCurrentSrc] = React.useState<string>(src);
  const [attempt, setAttempt] = React.useState<number>(0);
  const [failed, setFailed] = React.useState<boolean>(false);

  React.useEffect(() => {
    setCurrentSrc(src);
    setAttempt(0);
    setFailed(false);
  }, [src]);

  const handleError = React.useCallback(() => {
    if (attempt < maxRetries) {
      const delay = retryDelayMs * Math.pow(2, attempt);
      window.setTimeout(() => {
        setAttempt((a) => a + 1);
        const cacheBuster = `cb=${Date.now()}-${attempt + 1}`;
        const join = currentSrc.includes("?") ? "&" : "?";
        setCurrentSrc(`${src}${join}${cacheBuster}`);
      }, delay);
    } else {
      setFailed(true);
    }
  }, [attempt, maxRetries, retryDelayMs, src, currentSrc]);

  const defaultBlur =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJyBoZWlnaHQ9JzEwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48ZmlsdGVyIGlkPSdiJyB4PScwJyB5PScwJyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJz48ZmVHYXVzc2lhbkJsdXIgc3REZXZpYXRpb249JzIuNScvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyNlZWUnIGZpbHRlcj0ndXJsKCNiKScvPjwvc3ZnPiI=";

  const imageProps: Partial<ImageProps> = {};
  const placeholderProvided = (rest as any).placeholder !== undefined;
  if (!placeholderProvided && enableBlur) {
    (imageProps as any).placeholder = "blur";
    (imageProps as any).blurDataURL = blurDataURL || defaultBlur;
  } else if ((rest as any).placeholder === "blur") {
    (imageProps as any).placeholder = "blur";
    (imageProps as any).blurDataURL = (rest as any).blurDataURL || defaultBlur;
  }

  if (failed) {
    return (
      <Image
        src={fallbackSrc || "/placeholder.svg?height=400&width=400"}
        quality={quality}
        width={width}
        height={height}
        {...imageProps}
        {...rest}
      />
    );
  }

  return (
    <Image
      key={`${currentSrc}-${attempt}`}
      src={currentSrc}
      quality={quality}
      width={width}
      height={height}
      onError={handleError}
      {...imageProps}
      {...rest}
    />
  );
}
