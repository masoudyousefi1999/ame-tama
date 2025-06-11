"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
// import logo from "@/public/photo_2025-05-20_19-04-16.jpg";

export default function SplashScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if this is the first load or a return visit
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (hasVisited) {
      // If returning in the same session, don't show splash screen
      setIsLoading(false);
      return;
    }

    // For first visit, show splash screen
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Mark that user has visited in this session
      sessionStorage.setItem("hasVisited", "true");
    }, 2500); // Show splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50"
          >
            <div className="relative w-40 h-40 mb-8">
              <Image
                // src={logo.src}
                src={'/placeholder.svg?height=200&width=200'}
                alt="AME-TAMA Logo"
                fill
                priority
                className="object-contain"
              />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-bold text-center mb-4 font-vazirmatn"
            >
              AME-TAMA
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-lg text-center text-gray-600 dark:text-gray-300 font-vazirmatn"
            >
              مجسمه‌های انیمه لوکس
            </motion.p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ delay: 0.8, duration: 1.5 }}
              className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-8"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  );
}
