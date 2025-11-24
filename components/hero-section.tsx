"use client";

import { useEffect, useCallback, useState } from "react";
import { CustomImage as Image } from "@/components/ui/custom-image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowDown, Sparkles, Star, Users, ShoppingBag } from "lucide-react";

export default function HeroSection() {
  const isMobile = useIsMobile();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToProducts = useCallback(() => {
    const section = document.getElementById("featured-products");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section className="hero-section relative flex w-full items-center justify-center overflow-hidden">
      {/* Background with multiple layers */}
      <div className="absolute inset-0">
        {/* Main background image */}
        <div className="absolute inset-0">
          <Image
            src="/luffy-naruto.webp"
            alt="مجسمه‌های لوکس انیمه"
            fill
            priority
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            quality={isMobile ? 60 : 70}
            style={{
              objectFit: "cover",
              objectPosition: isMobile ? "center 30%" : "center",
              backgroundColor: "#22223b",
            }}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        </div>

        {/* Animated gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-blue-900/70 to-indigo-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60" />
        {/* 
        Floating particles effect */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute top-20 left-10 w-2 h-2 bg-white/60 rounded-full animate-pulse"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          />
          <div
            className="absolute top-40 right-20 w-1 h-1 bg-purple-400/80 rounded-full animate-pulse"
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          />
          <div
            className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-blue-400/70 rounded-full animate-pulse"
            style={{ animationDelay: "2s", animationDuration: "3.5s" }}
          />
          <div
            className="absolute bottom-20 right-1/3 w-1 h-1 bg-indigo-400/80 rounded-full animate-pulse"
            style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex w-full px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center space-y-8 sm:space-y-10 md:space-y-12 p-4 sm:p-6 md:p-8 lg:p-12">
          {/* Brand Name */}
          <div
            className={`transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h2 className="brand-name text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent tracking-wider">
              AME-TAMA
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/70 font-medium mt-1 sm:mt-2 tracking-wide">
              آمه تاما
            </p>
          </div>

          {/* Badge */}
          <div
            className={`inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 backdrop-blur-sm transition-all duration-1000 delay-200 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
            <span className="text-xs sm:text-sm font-medium text-purple-200">
              مجموعه‌ای از بهترین فیگور های انیمه ای
            </span>
          </div>

          {/* Main heading - simplified */}
          <h1
            className={`font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-[0.9] tracking-tight transition-all duration-1000 delay-400 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              هر فیگور یه داستانه…
            </span>
          </h1>

          {/* Single CTA Button */}
          <div
            className={`transition-all duration-1000 delay-600 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Link href="/shop">
              <Button
                size="lg"
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg font-semibold rounded-full"
              >
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                مشاهده محصولات
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-40 z-20 pointer-events-none bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Scroll indicator */}
      <button
        onClick={scrollToProducts}
        className="absolute bottom-[100px] sm:bottom-20 md:bottom-[100px] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-30 group"
        aria-label="اسکرول به محصولات"
      >
        <span className="text-white/60 text-xs font-medium mb-2 group-hover:text-white/80 transition-colors">
          اسکرول کنید
        </span>
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/40 rounded-full flex justify-center group-hover:border-white/60 transition-colors">
          <div className="w-1 h-2 sm:h-3 bg-white/60 rounded-full mt-1.5 sm:mt-2 animate-bounce group-hover:bg-white/80 transition-colors" />
        </div>
      </button>
    </section>
  );
}
