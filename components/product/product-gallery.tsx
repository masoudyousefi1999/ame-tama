"use client"

import { useState } from "react"
import Image from "next/image"
import { Expand, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: {
    id: number
    url: string
    alt: string
  }[]
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const handleThumbnailClick = (image: typeof mainImage, index: number) => {
    setMainImage(image)
    setCurrentIndex(index)
  }

  const handlePrevImage = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length
    setMainImage(images[newIndex])
    setCurrentIndex(newIndex)
  }

  const handleNextImage = () => {
    const newIndex = (currentIndex + 1) % images.length
    setMainImage(images[newIndex])
    setCurrentIndex(newIndex)
  }

  return (
    <div className="space-y-4">
      {/* تصویر اصلی */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden group">
        <Image
          src={mainImage.url || "/placeholder.svg"}
          alt={mainImage.alt}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* دکمه‌های ناوبری */}
        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md"
            onClick={handlePrevImage}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">تصویر قبلی</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md"
            onClick={handleNextImage}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">تصویر بعدی</span>
          </Button>
        </div>

        {/* دکمه بزرگنمایی */}
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Expand className="h-5 w-5" />
              <span className="sr-only">بزرگنمایی</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-1 sm:p-2">
            <div className="relative aspect-square">
              <Image
                src={mainImage.url || "/placeholder.svg"}
                alt={mainImage.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* تصاویر بندانگشتی */}
      <div className="flex gap-x-2 gap-x-reverse justify-center">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => handleThumbnailClick(image, index)}
            className={cn(
              "relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all duration-200",
              mainImage.id === image.id
                ? "ring-2 ring-purple-500 dark:ring-purple-400"
                : "ring-1 ring-gray-200 dark:ring-gray-700 opacity-70 hover:opacity-100",
            )}
          >
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 64px, 80px"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
