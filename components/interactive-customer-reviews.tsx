"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type ReviewItem = {
  id: string | number;
  name: string;
  content: string;
  rating: number;
};

interface InteractiveCustomerReviewsProps {
  reviews: ReviewItem[];
}

export default function InteractiveCustomerReviews({
  reviews,
}: InteractiveCustomerReviewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Handle scroll to detect current comment - optimized
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isDragging || isScrolling) return;

    const container = containerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const cardWidth = 288; // w-72 = 18rem = 288px
    const gap = 12; // gap-3 = 0.75rem = 12px
    const totalCardWidth = cardWidth + gap;

    // Calculate current index based on scroll position
    const newIndex = Math.round(scrollLeft / totalCardWidth);

    if (
      newIndex !== currentIndex &&
      newIndex >= 0 &&
      newIndex < reviews.length
    ) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, isDragging, isScrolling, reviews.length]);

  // Scroll to specific comment - optimized
  const scrollToComment = useCallback((index: number) => {
    if (!containerRef.current) return;

    const cardWidth = 288; // w-72 = 18rem = 288px
    const gap = 12; // gap-3 = 0.75rem = 12px
    const totalCardWidth = cardWidth + gap;
    const scrollPosition = index * totalCardWidth;
    const isTouchDevice =
      typeof window !== "undefined" && "ontouchstart" in window;

    setIsScrolling(true);
    setCurrentIndex(index);

    containerRef.current.scrollTo({
      left: scrollPosition,
      behavior: isTouchDevice ? "auto" : "smooth",
    });

    setTimeout(() => setIsScrolling(false), isTouchDevice ? 100 : 250);
  }, []);

  // Mouse drag handlers - only for desktop (no touch devices)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only enable drag on desktop (not touch devices)
    if (!containerRef.current || "ontouchstart" in window) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);

    // Change cursor to grabbing
    if (containerRef.current) {
      containerRef.current.style.cursor = "grabbing";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current || "ontouchstart" in window)
      return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    if ("ontouchstart" in window) return;
    setIsDragging(false);

    // Reset cursor to grab
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
    }
  };

  const handleMouseLeave = () => {
    if ("ontouchstart" in window) return;
    setIsDragging(false);

    // Reset cursor to grab
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
    }
  };

  // Set up scroll listener - optimized
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timeoutId: NodeJS.Timeout;
    const throttledHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        requestAnimationFrame(handleScroll);
      }, 16); // ~60fps
    };

    container.addEventListener("scroll", throttledHandleScroll, {
      passive: true,
    });
    return () => {
      container.removeEventListener("scroll", throttledHandleScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">هنوز نظری ثبت نشده است.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Reviews displayed horizontally in a single row */}
      <div
        ref={containerRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent"
        style={{
          scrollSnapType: "x mandatory",
          scrollBehavior:
            typeof window !== "undefined" && "ontouchstart" in window
              ? "auto"
              : "smooth",
          cursor:
            typeof window !== "undefined" && "ontouchstart" in window
              ? "default"
              : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {reviews.map((review, index) => (
          <div
            key={review.id}
            data-comment-card
            className="flex-none w-72 min-w-72 sm:w-80 sm:min-w-80"
            style={{ scrollSnapAlign: "center" }}
          >
            <article className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:border-primary/30 h-full select-none">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-sm sm:text-lg">
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm sm:text-base">
                    {review.name}
                  </h4>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm sm:text-lg ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        aria-label={`ستاره ${i + 1}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {review.content}
              </p>
            </article>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      {reviews.length > 1 && (
        <div className="flex justify-center mt-4 sm:mt-6">
          <div className="flex gap-1.5 sm:gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToComment(index)}
                className={`transition-all duration-200 ease-out ${
                  index === currentIndex
                    ? "w-6 h-2.5 sm:w-8 sm:h-3 rounded-full bg-gradient-to-r from-primary to-accent"
                    : "w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50"
                } cursor-pointer`}
                aria-label={`نظر ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
