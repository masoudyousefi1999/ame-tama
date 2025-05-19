"use client"

import { useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { getConnectionSpeed } from "@/lib/image-utils"

interface ImagePreloaderProps {
  images: string[]
  priority?: "high" | "medium" | "low"
}

export function ImagePreloader({ images, priority = "medium" }: ImagePreloaderProps) {
  const isMobile = useIsMobile()

  useEffect(() => {
    // Skip preloading on slow connections or if data saver is enabled
    const connection = (navigator as any).connection
    const isSaveData = connection?.saveData || false
    const connectionSpeed = getConnectionSpeed()

    if (isSaveData || connectionSpeed === "slow") {
      return
    }

    // For medium priority, only preload on fast connections if on mobile
    if (priority === "medium" && isMobile && connectionSpeed !== "fast") {
      return
    }

    // For low priority, only preload on desktop with fast connection
    if (priority === "low" && (isMobile || connectionSpeed !== "fast")) {
      return
    }

    // Preload images
    const imagePromises = images.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image()

        // Add width parameter for mobile
        if (isMobile && !src.includes("width=")) {
          const separator = src.includes("?") ? "&" : "?"
          src = `${src}${separator}width=640`
        }

        img.src = src
        img.onload = resolve
        img.onerror = reject
      })
    })

    // Use Promise.all to load all images in parallel
    Promise.all(imagePromises).catch(() => {
      // Silently fail on errors
    })
  }, [images, isMobile, priority])

  // This component doesn't render anything
  return null
}
