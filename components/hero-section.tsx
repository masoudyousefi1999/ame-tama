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
    <section className="relative h-screen overflow-hidden flex items-center justify-center">
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
        <div className="max-w-3xl mx-auto text-center px-4 space-y-4 md:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className={`
                text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold
                bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500
                drop-shadow-lg font-vazirmatn px-2
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
            <p className="text-xs sm:text-sm md:text-base text-white drop-shadow font-vazirmatn leading-relaxed">
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
                className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group font-vazirmatn text-xs sm:text-sm"
              >
                مشاهده مجسمه‌های لوکس
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1 rotate-180" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-20 pointer-events-none" />

      {/* Scroll Button - Centered at Bottom */}
      <motion.button
        onClick={scrollToProducts}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-4 z-30 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 sm:w-8 sm:h-8 animate-bounce text-white"
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
