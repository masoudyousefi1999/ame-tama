"use client";

import { useEffect, useRef, useState } from "react";

interface ConditionalPreloadProps {
  src: string;
  condition: boolean;
  delay?: number;
  priority?: boolean;
}

export function ConditionalPreload({
  src,
  condition,
  delay = 0,
  priority = false,
}: ConditionalPreloadProps) {
  const preloadedRef = useRef(false);

  useEffect(() => {
    if (!condition || !src || preloadedRef.current) return;

    const preloadImage = () => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = src;
      link.as = "image";

      // Set appropriate type based on file extension
      if (src.includes(".webp")) {
        link.type = "image/webp";
      } else if (src.includes(".svg")) {
        link.type = "image/svg+xml";
      } else if (src.includes(".png")) {
        link.type = "image/png";
      } else if (src.includes(".jpg") || src.includes(".jpeg")) {
        link.type = "image/jpeg";
      }

      // Add fetchpriority for critical images
      if (priority) {
        link.setAttribute("fetchpriority", "high");
      }

      document.head.appendChild(link);
      preloadedRef.current = true;
    };

    if (delay > 0) {
      const timer = setTimeout(preloadImage, delay);
      return () => {
        clearTimeout(timer);
        // Clean up the preload link if component unmounts
        const existingLink = document.querySelector(`link[href="${src}"]`);
        if (existingLink) {
          existingLink.remove();
        }
      };
    } else {
      preloadImage();
    }
  }, [src, condition, delay, priority]);

  return null;
}

// Hook for intersection-based preloading
export function useIntersectionPreload(src: string, threshold: number = 0.1) {
  const [shouldPreload, setShouldPreload] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldPreload(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, shouldPreload };
}
