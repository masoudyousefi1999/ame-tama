/**
 * Utility functions for image optimization
 */

// Check if WebP is supported
export function isWebPSupported(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const canvas = document.createElement("canvas")
  if (canvas.getContext && canvas.getContext("2d")) {
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0
  }

  return false
}

// Check if AVIF is supported
export function isAVIFSupported(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const img = new Image()
  img.src =
    "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
  return img.complete
}

// Get optimal image format extension
export function getOptimalImageFormat(): string {
  if (isAVIFSupported()) {
    return "avif"
  }

  if (isWebPSupported()) {
    return "webp"
  }

  return "jpg"
}

// Get connection speed category
export function getConnectionSpeed(): "slow" | "medium" | "fast" {
  if (typeof navigator === "undefined" || !("connection" in navigator)) {
    return "medium"
  }

  const connection = (navigator as any).connection

  if (connection) {
    const effectiveType = connection.effectiveType

    if (effectiveType === "slow-2g" || effectiveType === "2g") {
      return "slow"
    }

    if (effectiveType === "3g") {
      return "medium"
    }

    return "fast"
  }

  return "medium"
}

// Get appropriate image quality based on connection
export function getImageQuality(): number {
  const speed = getConnectionSpeed()

  switch (speed) {
    case "slow":
      return 60
    case "medium":
      return 75
    case "fast":
      return 85
    default:
      return 80
  }
}

// Get appropriate image width based on device and connection
export function getOptimalImageWidth(defaultWidth = 1200): number {
  const speed = getConnectionSpeed()

  if (typeof window === "undefined") {
    return defaultWidth
  }

  const screenWidth = window.innerWidth

  // For retina displays, we need 2x the screen width
  const devicePixelRatio = window.devicePixelRatio || 1
  const idealWidth = screenWidth * devicePixelRatio

  // Adjust based on connection speed
  switch (speed) {
    case "slow":
      return Math.min(idealWidth, 640)
    case "medium":
      return Math.min(idealWidth, 1024)
    case "fast":
      return Math.min(idealWidth, 1920)
    default:
      return Math.min(idealWidth, defaultWidth)
  }
}

// Optimize image URL with parameters
export function optimizeImageUrl(
  url: string,
  options: {
    width?: number
    quality?: number
    format?: string
  } = {},
): string {
  if (!url || url.includes("placeholder.svg")) {
    return url
  }

  try {
    const imageUrl = new URL(url)

    // Set width if provided
    if (options.width) {
      imageUrl.searchParams.set("width", options.width.toString())
    }

    // Set quality if provided
    if (options.quality) {
      imageUrl.searchParams.set("quality", options.quality.toString())
    }

    // Set format if provided
    if (options.format) {
      imageUrl.searchParams.set("format", options.format)
    }

    return imageUrl.toString()
  } catch (e) {
    // If URL parsing fails (e.g., relative URL), use original url
    return url
  }
}
