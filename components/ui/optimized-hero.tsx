"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useImageSettings } from "@/context/image-context"
import { getLowQualityImageUrl } from "@/lib/image-optimization"

interface OptimizedHeroProps {
  src: string
  alt: string
  className?: string
  overlayClassName?: string
  children?: React.ReactNode
}

export function OptimizedHero({ src, alt, className, overlayClassName, children }: OptimizedHeroProps) {
  const [loaded, setLoaded] = useState(false)
  const { useLowQualityPlaceholder } = useImageSettings()
  const lowQualitySrc = useLowQualityPlaceholder ? getLowQualityImageUrl(src) : undefined

  useEffect(() => {
    // Reset state when src changes
    setLoaded(false)

    // Preload image
    const img = new Image()
    img.src = src
    img.onload = () => {
      setLoaded(true)
    }
  }, [src])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Low quality placeholder */}
      {lowQualitySrc && !loaded && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm transform scale-105"
          style={{ backgroundImage: `url(${lowQualitySrc})` }}
          aria-hidden="true"
        />
      )}

      {/* Main image */}
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
        )}
        style={{ backgroundImage: `url(${src})` }}
        role="img"
        aria-label={alt}
      />

      {/* Overlay */}
      <div className={cn("absolute inset-0 bg-black/40", overlayClassName)} />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
