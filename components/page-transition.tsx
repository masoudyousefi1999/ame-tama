"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { type ReactNode, useEffect, useState } from "react"

// Check if the user prefers reduced motion
const prefersReducedMotion =
  typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isFirstRender, setIsFirstRender] = useState(true)

  // Skip animation on first render for better initial load performance
  useEffect(() => {
    setIsFirstRender(false)
  }, [])

  // Different animation variants based on RTL direction
  const variants = {
    hidden: {
      opacity: 0,
      x: pathname.includes("/product/") ? 0 : 20, // No horizontal movement for product pages
      scale: pathname.includes("/product/") ? 0.98 : 1,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      x: pathname.includes("/product/") ? 0 : -20, // No horizontal movement for product pages
      transition: {
        duration: prefersReducedMotion ? 0 : 0.2,
        ease: "easeInOut",
      },
    },
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={isFirstRender ? "visible" : "hidden"}
        animate="visible"
        exit="exit"
        variants={variants}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
