"use client";
import heroImage from "@/public/naruto-luffy-clap.jpg";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const scrollToProducts = () => {
    const section = document.getElementById("featured-products");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-[env(safe-area-inset-bottom)]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage.src}
          alt="مجسمه‌های لوکس انیمه"
          fill
          priority
          className="w-full h-full object-cover object-center"
          placeholder="blur"
          blurDataURL="/placeholder.svg?height=400&width=500"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40 z-10" />

      {/* Text Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-20 flex items-center justify-center h-full">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className={`
                text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6
                bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500
                drop-shadow-lg font-vazirmatn
              `}
            >
              مجسمه‌های لوکس انیمه برای کلکسیونرهای مشتاق
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-white drop-shadow font-vazirmatn">
              مجموعه‌ای از مجسمه‌های با کیفیت و دقیق ما را کشف کنید، جایی که هنر
              و اشتیاق در هر جزئیات ظریف به هم می‌رسند.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/shop">
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group font-vazirmatn"
              >
                مشاهده مجسمه‌های لوکس
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rotate-180" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-20 pointer-events-none" />

      {/* Scroll Button */}
      <motion.button
        onClick={scrollToProducts}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 animate-bounce text-white"
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
