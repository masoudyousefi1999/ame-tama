"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function AnimatedCharacter() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Character animation variants
  const characterVariants = {
    hover: {
      y: [0, -10, 0],
      transition: {
        y: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 3,
          ease: "easeInOut",
        },
      },
    },
    static: { y: 0 },
  }

  // Sweat drop animation variants
  const sweatDropVariants = {
    animate: {
      opacity: [0, 1, 0],
      y: [0, 30],
      x: [0, 5],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 2,
        repeatDelay: 1,
        ease: "easeInOut",
      },
    },
    static: { opacity: 0 },
  }

  // Question mark animation variants
  const questionMarkVariants = {
    animate: {
      opacity: [0, 1],
      scale: [0.8, 1.2, 1],
      y: [-10, 0],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 2,
        repeatDelay: 2,
        ease: "easeInOut",
      },
    },
    static: { opacity: 0 },
  }

  return (
    <div className="relative h-64 w-64 mx-auto">
      <motion.div
        className="relative z-10"
        variants={characterVariants}
        animate={prefersReducedMotion ? "static" : "hover"}
      >
        <img
          src="/images/404-character.png"
          alt=""
          className="h-64 w-auto mx-auto"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=256&width=256"
            e.currentTarget.alt = "صفحه یافت نشد"
          }}
        />

        {/* Sweat drop */}
        <motion.div
          className="absolute top-10 right-10 h-4 w-2 bg-blue-400 rounded-full"
          variants={sweatDropVariants}
          animate={prefersReducedMotion ? "static" : "animate"}
        />

        {/* Question mark */}
        <motion.div
          className="absolute top-0 left-10 text-2xl font-bold text-primary"
          variants={questionMarkVariants}
          animate={prefersReducedMotion ? "static" : "animate"}
        >
          ؟
        </motion.div>
      </motion.div>
    </div>
  )
}
