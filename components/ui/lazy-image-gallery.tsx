"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ResponsiveImage } from "./responsive-image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"

interface LazyImageGalleryProps {
  images: {
    id: number | string
    src: string
    alt: string
    thumbnail?: string
  }[]
  className?: string
}

export function LazyImageGallery({ images, className }: LazyImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [loadedIndexes, setLoadedIndexes] = useState<Set<number>>(new Set([0]))
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePrev = () => {
    const newIndex = (activeIndex - 1 + images.length) % images.length
    setActiveIndex(newIndex)
    preloadImage(newIndex)
  }

  const handleNext = () => {
    const newIndex = (activeIndex + 1) % images.length
    setActiveIndex(newIndex)
    preloadImage(newIndex)
  }

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index)
    preloadImage(index)
  }

  const preloadImage = (index: number) => {
    // Add to loaded indexes
    setLoadedIndexes((prev) => new Set([...prev, index]))

    // Preload next and previous images
    const nextIndex = (index + 1) % images.length
    const prevIndex = (index - 1 + images.length) % images.length

    setTimeout(() => {
      setLoadedIndexes((prev) => new Set([...prev, nextIndex, prevIndex]))
    }, 300)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handleNext() // RTL, so left is next
      } else if (e.key === "ArrowRight") {
        handlePrev() // RTL, so right is previous
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeIndex])

  return (
    <div className={cn("space-y-4", className)} ref={containerRef}>
      {/* Main image */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          >
            {loadedIndexes.has(index) && (
              <ResponsiveImage
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain p-2"
                priority={index === 0}
              />
            )}
          </div>
        ))}

        {/* Navigation buttons */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity z-20">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md"
            onClick={handlePrev}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">تصویر قبلی</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md"
            onClick={handleNext}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">تصویر بعدی</span>
          </Button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => handleThumbnailClick(index)}
            className={cn(
              "relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden snap-start",
              index === activeIndex
                ? "ring-2 ring-purple-500 dark:ring-purple-400"
                : "ring-1 ring-gray-200 dark:ring-gray-700 opacity-70 hover:opacity-100",
            )}
          >
            <ResponsiveImage
              src={image.thumbnail || image.src}
              alt={`${image.alt} thumbnail`}
              fill
              sizes="64px"
              className="object-cover"
              loadingStrategy={index < 5 ? "eager" : "lazy"}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
