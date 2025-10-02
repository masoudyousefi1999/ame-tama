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
  const linkRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    if (!condition || !src || preloadedRef.current) return;

    // Check if we're on mobile and adjust behavior
    const isMobile = window.innerWidth < 768;
    const connection = (navigator as any).connection;
    const isSlowConnection =
      connection &&
      (connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g");

    // Skip preloading on mobile with slow connections unless it's priority
    if (isMobile && isSlowConnection && !priority) {
      return;
    }

    const preloadImage = () => {
      // Check if link already exists to avoid duplicates
      const existingLink = document.querySelector(`link[href="${src}"]`);
      if (existingLink) return;

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

      // Add fetchpriority for critical images, but be conservative on mobile
      if (priority) {
        link.setAttribute("fetchpriority", isMobile ? "auto" : "high");
      } else if (isMobile) {
        link.setAttribute("fetchpriority", "low");
      }

      document.head.appendChild(link);
      linkRef.current = link;
      preloadedRef.current = true;
    };

    if (delay > 0) {
      const timer = setTimeout(preloadImage, delay);
      return () => {
        clearTimeout(timer);
        // Clean up the preload link if component unmounts
        if (linkRef.current) {
          linkRef.current.remove();
          linkRef.current = null;
        }
      };
    } else {
      preloadImage();
    }
  }, [src, condition, delay, priority]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (linkRef.current) {
        linkRef.current.remove();
        linkRef.current = null;
      }
    };
  }, []);

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
