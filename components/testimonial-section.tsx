"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion } from "framer-motion";

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
    rating: 5,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "امیر رضایی",
    role: "کلکسیونر و منتقد",
    content:
      "بسته‌بندی به تنهایی نشان‌دهنده تعهد AME-TAMA به کیفیت است. هر مجسمه در شرایط عالی می‌رسد و گواهی‌های اصالت، آن لمس اضافی از لوکس بودن را اضافه می‌کنند.",
    rating: 4,
    avatar: "/placeholder.svg?height=100&width=100",
  },
];

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  const displayedTestimonials =
    width < 768 ? [testimonials[currentIndex]] : testimonials;

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 md:px-6">
        {/* ── section header ─────────────────────────────── */}
        <div className="mb-12 text-center">
          <h2 className="  text-primary text-3xl font-bold mb-4">
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
          {width < 768 && (
            <>
              <Button
                variant="ghost"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-0.5 w-4 h-6 bg-card/80 rounded-full shadow-sm sm:hidden"
                onClick={nextTestimonial}
              >
                <ChevronLeft className="h-3 w-3" />
                <span className="sr-only">نظر قبلی</span>
              </Button>
              <Button
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-0.5 w-6 h-6 bg-card/80 rounded-full shadow-sm sm:hidden"
                onClick={prevTestimonial}
              >
                <ChevronRight className="h-3 w-3" />
                <span className="sr-only">نظر بعدی</span>
              </Button>
            </>
          )}

          {/* testimonials grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {displayedTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300"
              >
                {/* user header */}
                <div className="mb-6 flex items-center">
                  <div className="relative ml-4 h-12 w-12 overflow-hidden rounded-full">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="  font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="  text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* rating */}
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < testimonial.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>

                {/* testimonial body */}
                <p className="  italic text-foreground/90">
                  &quot;{testimonial.content}&quot;
                </p>
              </motion.div>
            ))}
          </div>

          {/* mobile pagination dots */}
          {width < 768 && (
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
