"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { customFetch } from "@/lib/utils";
import { TestimonialMobileCard } from "./testimonial-mobile-card";

type TestimonialItem = {
  id: string | number;
  name: string;
  content: string;
  rating: number;
};

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const programmaticRef = useRef<boolean>(false);

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
              revalidate: 120,
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
        const mapped: TestimonialItem[] = items
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
          .filter((t: TestimonialItem) => t.content);
        if (!ignore) setTestimonials(mapped);
      } catch {
        if (!ignore) setTestimonials([]);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  // Memoize displayed testimonials to prevent unnecessary re-renders
  const displayedTestimonials = useMemo(() => {
    if (testimonials.length === 0) return [];
    return isMobile ? [testimonials[currentIndex]] : testimonials;
  }, [isMobile, currentIndex, testimonials]);

  // Scroll active card into view on mobile (only for programmatic nav)
  useEffect(() => {
    if (!isMobile) return;
    if (!programmaticRef.current) return;
    const el = cardRefs.current[currentIndex];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
    const t = setTimeout(() => {
      programmaticRef.current = false;
    }, 350);
    return () => clearTimeout(t);
  }, [currentIndex, isMobile]);

  const handleMobileScroll = useCallback(() => {
    if (programmaticRef.current) return;
    const container = containerRef.current;
    if (!container) return;
    const children = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!children.length) return;
    const center = container.scrollLeft + container.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const dist = Math.abs(childCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = idx;
      }
    });
    setCurrentIndex(best);
  }, []);

  const handleDotClick = (idx: number) => {
    programmaticRef.current = true;
    setCurrentIndex(idx);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-muted/30 to-background relative overflow-hidden">
      {/* decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.1),transparent_50%)]"></div>

      <div className="container mx-auto px-0 md:px-6 relative">
        {/* ── section header ─────────────────────────────── */}
        <div className="mb-16 text-center px-4 md:px-0">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            نظرات کلکسیونرهای ما
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed">
            به جامعه کلکسیونرهای مشتاق ما بپیوندید که برای مجسمه‌های انیمه لوکس
            خود به&nbsp;AME-TAMA اعتماد می‌کنند.
          </p>
        </div>

        {/* ── carousel wrapper ──────────────────────────── */}
        <div className="relative">
          {/* testimonials layout */}
          {isMobile ? (
            <div
              ref={containerRef}
              onScroll={handleMobileScroll}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-1 w-full"
            >
              {testimonials.map((testimonial, index) => (
                <TestimonialMobileCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  index={index}
                  cardRef={(el: any) => {
                    cardRefs.current[index] = el;
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedTestimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="group relative bg-gradient-to-br from-card to-card/50 rounded-3xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* decorative quote icon */}
                  <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg
                      className="h-8 w-8 text-primary"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.777.201-4.893 2.397-4.893 6.018v3.231h6.017v7.391h-11.102zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.777.201-4.893 2.397-4.893 6.018v3.231h6.017v7.391h-11.12z" />
                    </svg>
                  </div>

                  {/* user header */}
                  <div className="mb-4 flex items-center">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-lg shadow-md">
                      {(testimonial.name || "? ").trim().slice(0, 1)}
                    </div>
                    <div className="mr-3">
                      <h3 className="font-bold text-foreground text-lg">
                        {testimonial.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < testimonial.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-muted-foreground/30"
                            )}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* testimonial body */}
                  <blockquote className="text-foreground/90 leading-relaxed text-base relative">
                    <span className="text-primary/60 text-2xl font-bold absolute -top-2 -right-2">
                      "
                    </span>
                    <span className="relative z-10">{testimonial.content}</span>
                    <span className="text-primary/60 text-2xl font-bold">
                      "
                    </span>
                  </blockquote>
                </div>
              ))}
            </div>
          )}

          {/* mobile pagination dots */}
          {isMobile && (
            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    programmaticRef.current = true;
                    setCurrentIndex(index);
                  }}
                  aria-label={`رفتن به نظر ${index + 1}`}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
