"use client";

import { useEffect } from "react";

interface SmartPreloadProps {
  images: string[];
  priority?: boolean;
  delay?: number;
}

export function SmartPreload({
  images,
  priority = false,
  delay = 0,
}: SmartPreloadProps) {
  useEffect(() => {
    if (priority) {
      // Preload immediately for critical images
      images.forEach((src) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.href = src;
        link.as = "image";
        link.type = src.includes(".webp") ? "image/webp" : "image/svg+xml";
        document.head.appendChild(link);
      });
    } else if (delay > 0) {
      // Preload after delay for non-critical images
      const timer = setTimeout(() => {
        images.forEach((src) => {
          const link = document.createElement("link");
          link.rel = "preload";
          link.href = src;
          link.as = "image";
          link.type = src.includes(".webp") ? "image/webp" : "image/svg+xml";
          document.head.appendChild(link);
        });
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [images, priority, delay]);

  return null;
}

// Hook for conditional preloading
export function useImagePreload(
  src: string,
  condition: boolean = true,
  delay: number = 0
) {
  useEffect(() => {
    if (!condition || !src) return;

    const preloadImage = () => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = src;
      link.as = "image";
      link.type = src.includes(".webp") ? "image/webp" : "image/svg+xml";
      document.head.appendChild(link);
    };

    if (delay > 0) {
      const timer = setTimeout(preloadImage, delay);
      return () => clearTimeout(timer);
    } else {
      preloadImage();
    }
  }, [src, condition, delay]);
}
