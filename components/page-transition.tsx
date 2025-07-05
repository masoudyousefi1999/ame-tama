"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

// Check if the user prefers reduced motion
const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [previousPath, setPreviousPath] = useState(pathname);

  // Skip animation on first render for better initial load performance
  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  // Track previous path for better transition direction
  useEffect(() => {
    setPreviousPath(pathname);
  }, [pathname]);

  // Determine if this is a product page
  const isProductPage = pathname.includes("/product/");
  const wasProductPage = previousPath.includes("/product/");

  // Different animation variants based on page type and direction
  const variants = {
    hidden: {
      opacity: 0,
      x: isProductPage ? 0 : 20,
      y: isProductPage ? 20 : 0,
      scale: isProductPage ? 0.98 : 1,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : isProductPage ? 0.4 : 0.3,
        ease: "easeInOut",
        staggerChildren: isProductPage ? 0.1 : 0,
      },
    },
    exit: {
      opacity: 0,
      x: isProductPage ? 0 : -20,
      y: isProductPage ? -20 : 0,
      scale: isProductPage ? 0.98 : 1,
      transition: {
        duration: prefersReducedMotion ? 0 : isProductPage ? 0.3 : 0.2,
        ease: "easeInOut",
      },
    },
  };

  // Product page specific variants
  const productVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: "easeIn",
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={isFirstRender ? "visible" : "hidden"}
        animate="visible"
        exit="exit"
        variants={isProductPage ? productVariants : variants}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
