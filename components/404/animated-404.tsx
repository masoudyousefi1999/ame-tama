"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Animated404() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [particles, setParticles] = useState<
    {
      id: number;
      size: number;
      x: number;
      y: number;
      duration: number;
      delay: number;
    }[]
  >([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    setParticles(
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        size: Math.random() * 6 + 2,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 100,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  // Glitch effect for the 404 text
  const glitchVariants = {
    animate: {
      x: [0, -2, 0, 2, 0],
      y: [0, 1, 0, -1, 0],
      filter: [
        "drop-shadow(0 0 0 rgba(0, 0, 0, 0))",
        "drop-shadow(2px 2px 0 rgba(255, 0, 0, 0.5))",
        "drop-shadow(-2px -2px 0 rgba(0, 255, 255, 0.5))",
        "drop-shadow(0 0 0 rgba(0, 0, 0, 0))",
      ],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "mirror",
        duration: 5,
        repeatDelay: 7,
      },
    },
    static: {},
  };

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <motion.div
        className="text-9xl font-bold text-primary/10 select-none"
        variants={glitchVariants as any}
        animate={prefersReducedMotion ? "static" : "animate"}
      >
        404
      </motion.div>

      {!prefersReducedMotion &&
        particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/20"
            style={{
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              x: [particle.x, -particle.x, particle.x],
              y: [particle.y, -particle.y, particle.y],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: particle.duration,
              delay: particle.delay,
              ease: "linear",
            }}
          />
        ))}
    </div>
  );
}
