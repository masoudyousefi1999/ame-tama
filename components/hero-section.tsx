"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  useEffect(() => {
    function updateVH() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
    updateVH();
    window.addEventListener("resize", updateVH);
    window.addEventListener("orientationchange", updateVH);
    return () => {
      window.removeEventListener("resize", updateVH);
      window.removeEventListener("orientationchange", updateVH);
    };
  }, []);

  const scrollToProducts = () => {
    const section = document.getElementById("featured-products");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex h-[calc(var(--vh)*100)] w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-100">
        <img
          src="/luffy-naruto.webp"
          alt="مجسمه‌های لوکس انیمه"
          className="object-cover object-center h-full w-full"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.jpg";
          }}
        />
        {/* Enhanced fallback background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 opacity-60" />
      </div>

      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="relative z-10 flex w-full px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center space-y-6 p-8 md:p-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-bold text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight text-foreground drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
          >
            مجسمه‌های لوکس انیمه
            <br />
            برای کلکسیونرهای مشتاق
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-foreground/95 text-lg sm:text-xl md:text-2xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] max-w-prose mx-auto font-medium"
          >
            مجموعه‌ای از مجسمه‌های با کیفیت و دقیق ما را کشف کنید، جایی که هنر و
            اشتیاق در هر جزئیات ظریف به هم می‌رسند.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/shop">
              <Button
                size="lg"
                className="inline-flex items-center gap-3 px-10 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25 text-lg font-semibold rounded-full btn-primary"
              >
                مشاهده مجسمه‌های لوکس
                <ArrowRight className="h-6 w-6 rotate-180 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 z-20 pointer-events-none bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

      <motion.button
        onClick={scrollToProducts}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center z-10"
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
      </motion.button>
    </section>
  );
}
