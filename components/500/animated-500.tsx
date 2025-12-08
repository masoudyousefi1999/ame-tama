"use client";

import { useEffect, useState } from "react";

export function Animated500() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      {/* big “500” with glitch */}
      <div className="text-9xl font-bold text-destructive/20 dark:text-destructive/20 select-none">
        500
      </div>
    </div>
  );
}
