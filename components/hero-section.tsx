"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useImagePreload } from "./ui/smart-preload";

export default function HeroSection() {
  const isMobile = useIsMobile();

  // Preload hero image only when component mounts (not in layout)
  useImagePreload("/luffy-naruto.webp", true, 0);

  // Optimized VH update with throttling
  const updateVH = useCallback(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, []);

  useEffect(() => {
    updateVH();

    // Use passive event listeners for better performance
    window.addEventListener("resize", updateVH, { passive: true });
    window.addEventListener("orientationchange", updateVH, { passive: true });

    return () => {
      window.removeEventListener("resize", updateVH);
      window.removeEventListener("orientationchange", updateVH);
    };
  }, [updateVH]);

  const scrollToProducts = useCallback(() => {
    const section = document.getElementById("featured-products");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section className="hero-section relative flex h-[calc(var(--vh)*100)] w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-100">
        <Image
          src="/luffy-naruto.webp"
          alt="مجسمه‌های لوکس انیمه"
          fill
          priority
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          quality={isMobile ? 30 : 40}
          style={{
            objectFit: "cover",
            objectPosition: "center",
            backgroundColor: "#22223b",
          }}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
        {/* Optimized fallback background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 opacity-60" />
      </div>

      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="relative z-10 flex w-full px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center space-y-6 p-8 md:p-12">
          <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight text-foreground drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            مجسمه‌های لوکس انیمه
            <br />
            برای کلکسیونرهای مشتاق
          </h1>
          <p className="text-foreground/95 text-lg sm:text-xl md:text-2xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] max-w-prose mx-auto font-medium">
            مجموعه‌ای از مجسمه‌های با کیفیت و دقیق ما را کشف کنید، جایی که هنر و
            اشتیاق در هر جزئیات ظریف به هم می‌رسند.
          </p>
          <div>
            <Link href="/shop">
              <Button
                size="lg"
                className="inline-flex items-center gap-3 px-10 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25 text-lg font-semibold rounded-full btn-primary"
              >
                مشاهده مجسمه‌های لوکس
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 z-20 pointer-events-none bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

      <button
        onClick={scrollToProducts}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center z-10"
        aria-label="اسکرول به محصولات"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 animate-bounce text-white drop-shadow-lg sm:h-8 sm:w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </section>
  );
}
