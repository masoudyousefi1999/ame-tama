"use client";

import { useEffect, useRef } from "react";

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
  const linkRefs = useRef<HTMLLinkElement[]>([]);

  useEffect(() => {
    // Check mobile and connection status
    const isMobile = window.innerWidth < 768;
    const connection = (navigator as any).connection;
    const isSlowConnection =
      connection &&
      (connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g");

    // Limit preloading on mobile with slow connections
    if (isMobile && isSlowConnection && !priority) {
      return;
    }

    const preloadImages = () => {
      // Limit number of images to preload on mobile
      const imagesToPreload = isMobile ? images.slice(0, 3) : images;

      imagesToPreload.forEach((src) => {
        // Check if link already exists to avoid duplicates
        const existingLink = document.querySelector(`link[href="${src}"]`);
        if (existingLink) return;

        const link = document.createElement("link");
        link.rel = "preload";
        link.href = src;
        link.as = "image";
        link.type = src.includes(".webp") ? "image/webp" : "image/svg+xml";

        if (priority) {
          link.setAttribute("fetchpriority", isMobile ? "auto" : "high");
        } else if (isMobile) {
          link.setAttribute("fetchpriority", "low");
        }

        document.head.appendChild(link);
        linkRefs.current.push(link);
      });
    };

    if (priority) {
      // Preload immediately for critical images
      preloadImages();
    } else if (delay > 0) {
      // Preload after delay for non-critical images
      const timer = setTimeout(preloadImages, delay);
      return () => {
        clearTimeout(timer);
        // Clean up preload links
        linkRefs.current.forEach((link) => link.remove());
        linkRefs.current = [];
      };
    }

    // Cleanup on unmount
    return () => {
      linkRefs.current.forEach((link) => link.remove());
      linkRefs.current = [];
    };
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
