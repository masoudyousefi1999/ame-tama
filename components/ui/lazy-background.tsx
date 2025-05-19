"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface LazyBackgroundProps {
  src: string
  lowQualitySrc?: string
  className?: string
  children?: React.ReactNode
}

export function LazyBackground({ src, lowQualitySrc, className, children }: LazyBackgroundProps) {
  const [loaded, setLoaded] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reset state when src changes
    setLoaded(false)

    // Create new image to preload
    const img = new Image()
    img.src = src
    img.onload = () => {
      setLoaded(true)
    }
  }, [src])

  useEffect(() => {
    // Set up intersection observer to detect when element is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" }, // Start loading when within 200px of viewport
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{
        backgroundImage: visible ? (loaded ? `url(${src})` : lowQualitySrc ? `url(${lowQualitySrc})` : "none") : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 0.5s ease-in-out",
      }}
    >
      {children}
    </div>
  )
}
