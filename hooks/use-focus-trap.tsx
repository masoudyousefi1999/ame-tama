"use client"

import { useEffect, useRef } from "react"

export function useFocusTrap(isActive = true) {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isActive) return

    const root = rootRef.current
    if (!root) return

    const focusableElements = root.querySelectorAll(
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])',
    )

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    root.addEventListener("keydown", handleKeyDown)
    return () => {
      root.removeEventListener("keydown", handleKeyDown)
    }
  }, [isActive])

  return rootRef
}
