"use client";

import { useEffect } from "react";
import heroImage from "@/public/luffy-naruto.webp";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroImage.src}
          alt="مجسمه‌های لوکس انیمه"
          fill
          priority
          placeholder="blur"
          blurDataURL="/placeholder.svg?height=400&width=500"
          className="object-cover object-center h-full w-full"
        />
      </div>

      <div className="absolute inset-0 bg-black/20 dark:bg-black/40 z-10" />

      <div className="relative z-10 flex w-full px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center space-y-6 p-8 md:p-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-vazirmatn font-semi-bold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight text-foreground drop-shadow-[0_8px_10px_rgba(0,0,0,0.7)]"
          >
            مجسمه‌های لوکس انیمه
            <br />
            برای کلکسیونرهای مشتاق
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-vazirmatn text-foreground/90 text-base sm:text-lg md:text-xl leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] max-w-prose mx-auto"
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
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground shadow-xl transition-transform duration-300 hover:scale-105 hover:bg-primary/90 focus-visible-ring font-vazirmatn"
              >
                مشاهده مجسمه‌های لوکس
                <ArrowRight className="h-5 w-5 rotate-180 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 z-20 pointer-events-none bg-gradient-to-t from-foreground/60 via-foreground/40 to-transparent dark:from-background/60 dark:via-background/40 dark:to-transparent" />

      <motion.button
        onClick={scrollToProducts}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 animate-bounce text-foreground drop-shadow-lg sm:h-8 sm:w-8"
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
