"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface ResponsiveBackgroundProps {
  mobileSrc: string
  desktopSrc: string
  alt: string
  className?: string
  children?: React.ReactNode
}

export function ResponsiveBackground({ mobileSrc, desktopSrc, alt, className, children }: ResponsiveBackgroundProps) {
  const [loaded, setLoaded] = useState(false)
  const isMobile = useIsMobile()
  const src = isMobile ? mobileSrc : desktopSrc

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
    <div
      className={cn(
        "relative bg-cover bg-center transition-opacity duration-500",
        loaded ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{ backgroundImage: `url(${src})` }}
      role="img"
      aria-label={alt}
    >
      {children}
    </div>
  )
}
