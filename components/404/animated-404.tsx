"use client";

import { useEffect, useState } from "react";

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

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <div className="text-9xl font-bold text-primary/10 select-none">
        404
      </div>
    </div>
  );
}
