"use client";

import React from "react";
import Image, { type ImageProps } from "next/image";

export interface CustomImageProps extends Omit<ImageProps, "loader"> {
  src: string;
  fallbackSrc?: string;
  maxRetries?: number;
  retryDelayMs?: number;
}

export function CustomImage({
  src,
  fallbackSrc,
  maxRetries = 2,
  retryDelayMs = 500,
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

  if (failed) {
    return (
      <Image
        src={fallbackSrc || "/placeholder.svg?height=400&width=400"}
        quality={quality}
        width={width}
        height={height}
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
      {...rest}
    />
  );
}
