"use client"

import { useEffect } from "react"

export default function ViewportHeightFix() {
  useEffect(() => {
    // Function to update the CSS variable
    const updateHeight = () => {
      // Set the --vh custom property to 1% of the viewport height
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`)
    }

    // Set the height initially
    updateHeight()

    // Update the height on resize and orientation change
    window.addEventListener("resize", updateHeight)
    window.addEventListener("orientationchange", updateHeight)

    // Hack for iOS Safari to force recalculation after page load
    setTimeout(updateHeight, 100)

    // Clean up event listeners
    return () => {
      window.removeEventListener("resize", updateHeight)
      window.removeEventListener("orientationchange", updateHeight)
    }
  }, [])

  return null // This component doesn't render anything
}
