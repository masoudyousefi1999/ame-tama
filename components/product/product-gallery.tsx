"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ResponsiveImage } from "@/components/ui/responsive-image";

interface ProductGalleryProps {
  images: { url: string }[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
      filter: "blur(2px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
      filter: "blur(2px)",
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };
  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number } }
  ) => {
    setIsDragging(false);
    if (Math.abs(info.offset.x) > 70)
      info.offset.x > 0 ? handlePrevious() : handleNext();
  };

  const handleThumbnailClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main image */}
      <div
        ref={constraintsRef}
        className="relative aspect-square overflow-hidden rounded-lg bg-card ring-1 ring-border"
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants as any}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 h-full w-full"
          >
            <ResponsiveImage
              src={images[currentIndex]?.url || "/placeholder.svg"}
              alt={`${alt} - تصویر ${currentIndex + 1}`}
              fill
              aspectRatio="square"
              loadingStrategy="progressive"
              desktopQuality={90}
              mobileQuality={80}
              className="object-contain"
            />
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-card/80 backdrop-blur-sm border border-border hover:bg-card/90 hover:scale-105 transition-all focus-visible-ring"
          onClick={handlePrevious}
          aria-label="تصویر قبلی"
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 text-foreground" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-card/80 backdrop-blur-sm border border-border hover:bg-card/90 hover:scale-105 transition-all focus-visible-ring"
          onClick={handleNext}
          aria-label="تصویر بعدی"
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 text-foreground" />
        </Button>

        {/* Pager dots */}
        <div
          className="absolute left-1/2 flex items-center gap-2 rounded-full bg-card/60 px-2 py-1 backdrop-blur-sm transform -translate-x-1/2"
          style={{
            bottom: "max(env(safe-area-inset-bottom), 0.5rem)",
          }}
        >
          {images.map((_, i) => {
            const isActive = i === currentIndex;
            return (
              <button
                key={i}
                onClick={() => handleThumbnailClick(i)}
                disabled={isDragging}
                aria-label={`رفتن به تصویر ${i + 1}`}
                aria-current={isActive}
                className={cn(
                  "rounded-full transition-all duration-300 focus-visible-ring",
                  // mobile-first sizes:
                  isActive
                    ? "h-3 w-6 sm:h-4 sm:w-8 bg-primary"
                    : "h-3 w-3 sm:h-4 sm:w-4 bg-muted hover:bg-primary/60 hover:scale-110"
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((image, i) => (
            <button
              key={i}
              onClick={() => handleThumbnailClick(i)}
              aria-label={`انتخاب تصویر ${i + 1}`}
              aria-pressed={i === currentIndex}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md transition-all duration-200 focus-visible-ring",
                i === currentIndex
                  ? "ring-2 ring-primary"
                  : "ring-1 ring-border hover:scale-[1.03]"
              )}
            >
              <ResponsiveImage
                src={image.url || "/placeholder.svg"}
                alt={`${alt} - تصویر کوچک ${i + 1}`}
                fill
                aspectRatio="square"
                loadingStrategy="lazy"
                desktopQuality={80}
                mobileQuality={70}
                className="object-cover"
              />
              {i === currentIndex && (
                <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
