"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const testimonials = [
  {
    id: 1,
    name: "علی محمدی",
    role: "کلکسیونر به مدت ۸ سال",
    content:
      "کیفیت مجسمه‌های AME-TAMA بی‌نظیر است. توجه به جزئیات در مجسمه لوفی گیر ۵ من واقعاً خیره‌کننده است. برای کلکسیونرهای جدی ارزش هر ریال را دارد.",
    rating: 5,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "مریم حسینی",
    role: "علاقه‌مند به انیمه",
    content:
      "من از بسیاری از فروشندگان مجسمه‌های لوکس خرید کرده‌ام، اما AME-TAMA با صنعتگری استثنایی و خدمات مشتری خود متمایز است. مجسمه گوجو من نقطه مرکزی مجموعه من است.",
    rating: 4,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "امیر رضایی",
    role: "کلکسیونر و منتقد",
    content:
      "بسته‌بندی به تنهایی نشان‌دهنده تعهد AME-TAMA به کیفیت است. هر مجسمه در شرایط عالی می‌رسد و گواهی‌های اصالت، آن لمس اضافی از لوکس بودن را اضافه می‌کنند.",
    rating: 5,
    avatar: "/placeholder.svg?height=100&width=100",
  },
];

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

  // Memoize displayed testimonials to prevent unnecessary re-renders
  const displayedTestimonials = useMemo(() => {
    return isMobile ? [testimonials[currentIndex]] : testimonials;
  }, [isMobile, currentIndex]);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  }, []);

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 md:px-6">
        {/* ── section header ─────────────────────────────── */}
        <div className="mb-12 text-center">
          <h2 className="text-primary text-3xl font-bold mb-4">
            نظرات کلکسیونرهای ما
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            به جامعه کلکسیونرهای مشتاق ما بپیوندید که برای مجسمه‌های انیمه لوکس
            خود به&nbsp;AME-TAMA اعتماد می‌کنند.
          </p>
        </div>

        {/* ── carousel wrapper ──────────────────────────── */}
        <div className="relative">
          {/* mobile nav arrows */}
          {isMobile && (
            <>
              <Button
                variant="ghost"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-0.5 w-4 h-6 bg-card/80 rounded-full shadow-sm sm:hidden"
                onClick={nextTestimonial}
                aria-label="نظر قبلی"
              >
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <Button
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-0.5 w-6 h-6 bg-card/80 rounded-full shadow-sm sm:hidden"
                onClick={prevTestimonial}
                aria-label="نظر بعدی"
              >
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </>
          )}

          {/* testimonials grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {displayedTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="bg-card rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300"
              >
                {/* user header */}
                <div className="mb-6 flex items-center">
                  <div className="relative ml-4 h-12 w-12 overflow-hidden rounded-full">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* rating */}
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < testimonial.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted-foreground"
                      )}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                </div>

                {/* testimonial body */}
                <p className="italic text-foreground/90">
                  &quot;{testimonial.content}&quot;
                </p>
              </div>
            ))}
          </div>

          {/* mobile pagination dots */}
          {isMobile && (
            <div className="mt-6 flex justify-center gap-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`رفتن به نظر ${index + 1}`}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/40"
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
