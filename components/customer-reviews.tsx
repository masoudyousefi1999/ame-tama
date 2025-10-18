"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { customFetch } from "@/lib/utils";

type ReviewItem = {
  id: string | number;
  name: string;
  content: string;
  rating: number;
};

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const page = 1;
        const limit = 6;
        const res = await customFetch(
          `/comment/last?page=${page}&limit=${limit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            next: {
              tags: ["testimonials"],
            },
          }
        );
        const data = await res.json();
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.comments)
          ? data.comments
          : [];
        const mapped: ReviewItem[] = items
          .map((c: any, idx: number) => ({
            id: c.id ?? c.uuid ?? idx,
            name:
              (c.user?.firstName || "") +
              (c.user?.lastName
                ? ` ${c.user.lastName}`
                : c.user?.name
                ? c.user.name
                : "کاربر"),
            content: c.text || c.content || "",
            rating: 5,
          }))
          .filter((t: ReviewItem) => t.content);
        if (!ignore) setReviews(mapped);
      } catch {
        if (!ignore) setReviews([]);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  // Handle scroll to determine current visible comment
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    const cards = container.querySelectorAll("[data-comment-card]");
    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - containerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setCurrentIndex(closestIndex);
  }, []);

  // Scroll to specific comment
  const scrollToComment = useCallback((index: number) => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll("[data-comment-card]");
    const targetCard = cards[index] as HTMLElement;

    if (targetCard) {
      targetCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, []);

  // Set up scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
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
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent"
      >
        {reviews.map((review, index) => (
          <div
            key={review.id}
            data-comment-card
            className="flex-none w-80 min-w-80"
          >
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:border-primary/30 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-lg">
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {review.name}
                  </h4>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
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
            </div>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      {reviews.length > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToComment(index)}
                className={`transition-all duration-300 ease-out ${
                  index === currentIndex
                    ? "w-8 h-3 rounded-full bg-gradient-to-r from-primary to-accent"
                    : "w-3 h-3 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50"
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
