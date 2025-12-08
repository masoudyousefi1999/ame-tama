"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CustomImage } from "@/components/ui/custom-image";

interface ProductGalleryProps {
  images: { url: string }[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Preload next few images for instant navigation
  useEffect(() => {
    if (images.length <= 1) return;

    const preloadNextImages = () => {
      // Preload next 2 images for instant navigation
      const nextImages = [
        images[(currentIndex + 1) % images.length],
        images[(currentIndex + 2) % images.length],
      ].filter(Boolean);

      nextImages.forEach((image) => {
        if (image?.url) {
          // Check if already preloaded to avoid duplicates
          const existingLink = document.querySelector(
            `link[href="${image.url}"]`
          );
          if (!existingLink) {
            const link = document.createElement("link");
            link.rel = "preload";
            link.href = image.url;
            link.as = "image";
            link.type = "image/webp";
            link.setAttribute("fetchpriority", "low");
            document.head.appendChild(link);
          }
        }
      });
    };

    // Preload after a short delay to not interfere with first image
    const timer = setTimeout(preloadNextImages, 100);
    return () => clearTimeout(timer);
  }, [currentIndex, images]);

  // Preload all images when gallery becomes visible (intersection observer)
  useEffect(() => {
    if (images.length <= 1) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Gallery is visible, preload remaining images
            images.slice(2).forEach((image) => {
              if (image?.url) {
                const existingLink = document.querySelector(
                  `link[href="${image.url}"]`
                );
                if (!existingLink) {
                  const link = document.createElement("link");
                  link.rel = "preload";
                  link.href = image.url;
                  link.as = "image";
                  link.type = "image/webp";
                  link.setAttribute("fetchpriority", "low");
                  document.head.appendChild(link);
                }
              }
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (constraintsRef.current) {
      observer.observe(constraintsRef.current);
    }

    return () => observer.disconnect();
  }, [images]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };
  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const handleThumbnailClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main image */}
      <div
        ref={constraintsRef}
        className="relative aspect-square overflow-hidden rounded-lg bg-card ring-1 ring-border"
      >
        <div className="absolute inset-0 h-full w-full transition-opacity duration-300">
          <CustomImage
            src={images[currentIndex]?.url || "/placeholder.svg"}
            alt={`${alt} - تصویر ${currentIndex + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={currentIndex === 0 ? 90 : 75}
            className={cn(
              "object-contain transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            priority={currentIndex === 0}
            fetchPriority={currentIndex === 0 ? "high" : "auto"}
            loading={currentIndex === 0 ? "eager" : "lazy"}
            enableBlur
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            onLoad={handleImageLoad}
          />
        </div>

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
              <CustomImage
                src={image.url || "/placeholder.svg"}
                alt={`${alt} - تصویر کوچک ${i + 1}`}
                fill
                sizes="64px"
                quality={i < 3 ? 85 : 60}
                className="object-cover"
                loading={i < 3 ? "eager" : "lazy"}
                priority={i === 0}
                enableBlur
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
