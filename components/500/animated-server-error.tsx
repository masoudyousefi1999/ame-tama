"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function AnimatedServerError() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Server/robot animation variants
  const serverVariants = {
    animate: {
      rotate: [-2, 2, -2],
      transition: {
        rotate: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 1,
          ease: "easeInOut",
        },
      },
    },
    static: { rotate: 0 },
  }

  // Smoke/steam animation variants
  const smokeVariants = {
    animate: (i: number) => ({
      opacity: [0, 0.8, 0],
      y: [0, -30],
      x: [0, i % 2 === 0 ? 10 : -10],
      scale: [0.5, 1.5],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 2,
        delay: i * 0.5,
        ease: "easeOut",
      },
    }),
    static: { opacity: 0 },
  }

  // Spark animation variants
  const sparkVariants = {
    animate: (i: number) => ({
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5],
      x: [0, (i % 2 === 0 ? 1 : -1) * 20],
      y: [0, -10],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 0.8,
        delay: i * 0.2,
        ease: "easeOut",
      },
    }),
    static: { opacity: 0 },
  }

  return (
    <div className="relative h-64 w-64 mx-auto">
      <motion.div
        className="relative z-10"
        variants={serverVariants}
        animate={prefersReducedMotion ? "static" : "animate"}
      >
        <img
          src="/images/500-server.png"
          alt=""
          className="h-64 w-auto mx-auto"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=256&width=256"
            e.currentTarget.alt = "خطای سرور"
          }}
        />

        {/* Smoke/steam effects */}
        {!prefersReducedMotion &&
          [0, 1, 2].map((i) => (
            <motion.div
              key={`smoke-${i}`}
              className="absolute top-10 left-1/2 h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700"
              custom={i}
              variants={smokeVariants}
              animate="animate"
            />
          ))}

        {/* Spark effects */}
        {!prefersReducedMotion &&
          [0, 1, 2, 3].map((i) => (
            <motion.div
              key={`spark-${i}`}
              className="absolute top-20 right-10 h-2 w-2 rounded-full bg-yellow-400"
              custom={i}
              variants={sparkVariants}
              animate="animate"
            />
          ))}
      </motion.div>
    </div>
  )
}
