"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { useImageSettings } from "@/context/image-context";
import { getLowQualityImageUrl } from "@/lib/image-optimization";

interface OptimizedHeroProps {
  src: string;
  alt: string;
  className?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
}

/**
 * Full component with **only style-token updates**.<br>
 * – uses semantic design-tokens (`bg-background`, `bg-foreground`, etc.)
 * – no behavioural changes
 */
export function OptimizedHero({
  src,
  alt,
  className,
  overlayClassName,
  children,
}: OptimizedHeroProps) {
  const [loaded, setLoaded] = useState(false);
  const { useLowQualityPlaceholder } = useImageSettings();
  const lowQualitySrc = useLowQualityPlaceholder
    ? getLowQualityImageUrl(src)
    : undefined;

  /* ───────────────────────────────────────────────────
     Pre-load high-res when `src` changes
  ─────────────────────────────────────────────────── */
  useEffect(() => {
    setLoaded(false);

    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
  }, [src]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg", // ⬅︎ added rounded + token-friendly
        className
      )}
    >
      {/* Low-quality placeholder */}
      {lowQualitySrc && !loaded && (
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 bg-cover bg-center blur-sm scale-105",
            "opacity-80 saturate-50" // softer look while loading
          )}
          style={{ backgroundImage: `url(${lowQualitySrc})` }}
        />
      )}

      {/* High-res image */}
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "absolute inset-0 bg-cover bg-center transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0"
        )}
        style={{ backgroundImage: `url(${src})` }}
      />

      {/* Overlay – token-based colours for light & dark */}
      <div
        className={cn(
          // light → subtle foreground tint, dark → stronger
          "absolute inset-0 bg-foreground/10 dark:bg-foreground/25",
          overlayClassName
        )}
      />

      {/* Slot for hero content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
