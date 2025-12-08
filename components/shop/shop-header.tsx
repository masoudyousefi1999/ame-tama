"use client";

import { useState, useEffect } from "react";
import { CustomImage as Image } from "@/components/ui/custom-image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// تصاویر اسلایدر
const slides = [
  {
    image: "/placeholder.svg?height=600&width=1200",
    title: "مجسمه‌های انیمه لوکس",
    description:
      "مجموعه‌ای از بهترین مجسمه‌های انیمه با کیفیت استثنایی و جزئیات خیره‌کننده",
    cta: "مشاهده مجموعه",
    link: "#categories",
  },
  {
    image: "/placeholder.svg?height=600&width=1200",
    title: "محصولات جدید",
    description: "جدیدترین مجسمه‌های اضافه شده به مجموعه AME-TAMA را کشف کنید",
    cta: "مشاهده محصولات جدید",
    link: "#new-arrivals",
  },
  {
    image: "/placeholder.svg?height=600&width=1200",
    title: "نسخه‌های محدود",
    description:
      "مجسمه‌های کمیاب و نسخه‌های محدود که فقط برای مدت کوتاهی در دسترس هستند",
    cta: "مشاهده نسخه‌های محدود",
    link: "#limited-editions",
  },
];

export default function ShopHeader() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // تغییر خودکار اسلاید
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // تغییر به اسلاید مشخص
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-2xl md:h-[500px]">
      {/* slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            priority={index === 0}
            sizes="(max-width:768px) 100vw, 1200px"
            className="object-cover"
          />

          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 backdrop-blur-sm" />

          {/* slide content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-card-foreground transition-all duration-700">
            <h1
              className="mb-4 max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl"
            >
              {slide.title}
            </h1>

            <p
              className="mb-8 max-w-2xl text-lg md:text-xl"
            >
              {slide.description}
            </p>

            <div>
              <Button
                size="lg"
                asChild
                className="group rounded-full bg-gradient-to-r from-primary to-secondary px-8 py-6 text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary/90 hover:to-secondary/90"
              >
                <a href={slide.link}>
                  {slide.cta}
                  <ArrowRight className="ml-2 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1 rtl:rotate-0" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`رفتن به اسلاید ${index + 1}`}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "w-8 bg-primary"
                : "w-3 bg-primary/40 hover:bg-primary/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
