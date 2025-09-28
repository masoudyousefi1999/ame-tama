"use client";

import { useState, useRef, useEffect } from "react";
import { CategoryCard } from "./category-card";

interface LazyCategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    productCount?: number;
  };
  index: number;
}

export function LazyCategoryCard({ category, index }: LazyCategoryCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasIntersected) {
          setIsVisible(true);
          setHasIntersected(true);
          // Disconnect observer after first intersection
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px", // Start loading 50px before the element comes into view
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [hasIntersected]);

  return (
    <>
      {isVisible ? (
        <CategoryCard category={category} />
      ) : (
        <div
          ref={cardRef}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card bg-opacity-50 animate-pulse"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/30" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="p-4 md:p-6">
            <div className="h-6 bg-muted/50 rounded mb-2" />
            <div className="h-4 bg-muted/30 rounded w-3/4 mb-3" />
            <div className="h-3 bg-muted/30 rounded w-1/2" />
          </div>
        </div>
      )}
    </>
  );
}
