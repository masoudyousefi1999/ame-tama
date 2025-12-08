"use client";

import { useEffect, useState } from "react";

export function AnimatedCharacter() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="relative h-64 w-64 mx-auto">
      <div className="relative z-10">
        <img
          src="/images/404-character.png"
          alt=""
          className="h-64 w-auto mx-auto"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=256&width=256";
            e.currentTarget.alt = "صفحه یافت نشد";
          }}
        />

      </div>
    </div>
  );
}
