/**
 * Image optimization utilities
 */

// Generate a low quality image placeholder URL
export function getLowQualityImageUrl(url: string): string {
  // If it's already a placeholder, return as is
  if (url.includes("/placeholder.svg")) {
    return url
  }

  // For real images, we would use a service like Cloudinary or Imgix
  // For this example, we'll just append a query parameter
  return `${url}?quality=10&width=50`
}

// Get the appropriate image size based on device
export function getResponsiveImageSize(
  url: string,
  deviceType: "mobile" | "tablet" | "desktop" | "auto" = "auto",
): string {
  // If it's a placeholder, return as is
  if (url.includes("/placeholder.svg")) {
    return url
  }

  // Determine width based on device type
  let width: number
  switch (deviceType) {
    case "mobile":
      width = 640
      break
    case "tablet":
      width = 1024
      break
    case "desktop":
      width = 1920
      break
    case "auto":
    default:
      // Auto will be handled by Next.js Image component with sizes prop
      return url
  }

  // For real images, we would use a service like Cloudinary or Imgix
  // For this example, we'll just append a query parameter
  return `${url}?width=${width}`
}

// Check if WebP is supported
export async function isWebPSupported(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false
  }

  // Check for WebP support
  const webpSupported = document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") === 0

  return webpSupported
}

// Check if AVIF is supported
export async function isAvifSupported(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve(true)
    }
    img.onerror = () => {
      resolve(false)
    }
    img.src =
      "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
  })
}

// Get the optimal image format based on browser support
export async function getOptimalImageFormat(): Promise<"avif" | "webp" | "jpeg"> {
  const avifSupported = await isAvifSupported()
  if (avifSupported) {
    return "avif"
  }

  const webpSupported = await isWebPSupported()
  if (webpSupported) {
    return "webp"
  }

  return "jpeg"
}
