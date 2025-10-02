"use client";

import { cn } from "@/lib/utils";

type TestimonialItem = {
  id: string | number;
  name: string;
  content: string;
  rating: number;
};

interface TestimonialMobileCardProps {
  testimonial: TestimonialItem;
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
}

export function TestimonialMobileCard({
  testimonial,
  index,
  cardRef,
}: TestimonialMobileCardProps) {
  return (
    <div
      ref={cardRef}
      className="snap-center shrink-0 w-[80vw] max-w-xs group relative bg-gradient-to-br from-card to-card/50 rounded-3xl p-5 border border-border/50 shadow-md mx-auto"
    >
      {/* decorative quote icon */}
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <svg
          className="h-10 w-10 text-primary"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.777.201-4.893 2.397-4.893 6.018v3.231h6.017v7.391h-11.102zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.777.201-4.893 2.397-4.893 6.018v3.231h6.017v7.391h-11.12z" />
        </svg>
      </div>

      {/* user header */}
      <div className="mb-5 flex items-center">
        <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-xl shadow-lg">
          {(testimonial.name || "? ").trim().slice(0, 1)}
        </div>
        <div className="mr-3 flex-1">
          <h3 className="font-bold text-foreground text-lg mb-1">
            {testimonial.name}
          </h3>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={cn(
                  "h-5 w-5",
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
      <blockquote className="text-foreground/90 leading-relaxed text-sm relative min-h-[3rem] overflow-hidden">
        <span className="text-primary/60 text-2xl font-bold absolute -top-2 -right-2 opacity-50">
          "
        </span>
        <div className="relative z-10 pr-5 pl-2 py-1 max-h-[5rem] overflow-y-auto">
          {testimonial.content}
        </div>
        <span className="text-primary/60 text-2xl font-bold absolute -bottom-1 left-1 opacity-50">
          "
        </span>
      </blockquote>
    </div>
  );
}
