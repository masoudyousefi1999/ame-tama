"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 dark:from-purple-900/40 dark:to-indigo-900/40 backdrop-blur-sm z-10" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-30 dark:opacity-20" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-purple-300 to-indigo-300 dark:from-purple-200 dark:to-indigo-200 bg-clip-text text-transparent font-vazirmatn">
              مجسمه‌های لوکس انیمه برای کلکسیونرهای مشتاق
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-vazirmatn">
              مجموعه‌ای از مجسمه‌های با کیفیت و دقیق ما را کشف کنید، جایی که هنر
              و اشتیاق در هر جزئیات ظریف به هم می‌رسند.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href={"/shop"}>
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group font-vazirmatn"
              >
                مشاهده مجسمه‌های لوکس
                <ArrowRight className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rotate-180" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
