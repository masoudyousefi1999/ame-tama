"use client"

import { useEffect } from "react"

export default function PreventPullRefresh() {
  useEffect(() => {
    // Check if the device is iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

    if (!isIOS) return

    let startY = 0

    const handleTouchStart = (e: TouchEvent) => {
      // Store the initial touch position
      if (e.touches.length === 1) {
        startY = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      // If we're at the top of the page and trying to pull down
      if (window.scrollY === 0 && e.touches[0].clientY > startY) {
        // Prevent the default behavior (which would be pull-to-refresh)
        e.preventDefault()
      }
    }

    // Add passive: false to ensure preventDefault works
    document.addEventListener("touchstart", handleTouchStart, { passive: true })
    document.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
    }
  }, [])

  // This component doesn't render anything
  return null
}
