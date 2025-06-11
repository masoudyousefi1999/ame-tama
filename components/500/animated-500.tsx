"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function Animated500() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Electric glitch effect for the 500 text
  const glitchVariants = {
    animate: {
      x: [0, -3, 3, -3, 0],
      opacity: [1, 0.8, 1, 0.8, 1],
      filter: [
        "brightness(1) contrast(1)",
        "brightness(1.2) contrast(1.5)",
        "brightness(1) contrast(1)",
        "brightness(1.2) contrast(1.5)",
        "brightness(1) contrast(1)",
      ],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "mirror",
        duration: 0.5,
        repeatDelay: 5,
      },
    },
    static: {},
  }

  // Circuit lines that light up around the 500
  const circuitLines = [
    { x1: -100, y1: 0, x2: -50, y2: 0, delay: 0 },
    { x1: 50, y1: 0, x2: 100, y2: 0, delay: 0.2 },
    { x1: 0, y1: -50, x2: 0, y2: -20, delay: 0.4 },
    { x1: 0, y1: 20, x2: 0, y2: 50, delay: 0.6 },
    { x1: -70, y1: -30, x2: -40, y2: -15, delay: 0.8 },
    { x1: 40, y1: 15, x2: 70, y2: 30, delay: 1 },
  ]

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <motion.div
        className="text-9xl font-bold text-red-500/20 dark:text-red-600/20 select-none"
        variants={glitchVariants as any}
        animate={prefersReducedMotion ? "static" : "animate"}
      >
        500
      </motion.div>

      {!prefersReducedMotion &&
        circuitLines.map((line, i) => (
          <motion.div
            key={i}
            className="absolute bg-red-400 dark:bg-red-600 rounded-full"
            style={{
              width: Math.abs(line.x2 - line.x1) || 2,
              height: Math.abs(line.y2 - line.y1) || 2,
              left: "50%",
              top: "50%",
              x: Math.min(line.x1, line.x2),
              y: Math.min(line.y1, line.y2),
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              transition: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                delay: line.delay,
                ease: "easeInOut",
              },
            }}
          />
        ))}
    </div>
  )
}
