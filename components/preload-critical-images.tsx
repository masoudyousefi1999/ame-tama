"use client"

import { useEffect } from "react"

interface PreloadCriticalImagesProps {
  images: string[]
}

export function PreloadCriticalImages({ images }: PreloadCriticalImagesProps) {
  useEffect(() => {
    // Only preload on fast connections
    if (
      (navigator as any).connection &&
      ((navigator as any).connection.saveData || (navigator as any).connection.effectiveType.includes("2g"))
    ) {
      return
    }

    // Preload critical images
    const preloadImages = () => {
      images.forEach((src) => {
        const link = document.createElement("link")
        link.rel = "preload"
        link.as = "image"
        link.href = src
        document.head.appendChild(link)
      })
    }

    // Use requestIdleCallback if available, otherwise use setTimeout
    if ("requestIdleCallback" in window) {
      ;(window as any).requestIdleCallback(preloadImages)
    } else {
      setTimeout(preloadImages, 1000)
    }
  }, [images])

  return null
}
