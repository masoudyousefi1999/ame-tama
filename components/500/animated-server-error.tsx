"use client";

import { useEffect, useState } from "react";

export function AnimatedServerError() {
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
          src="/images/500-server.png"
          alt=""
          className="h-64 w-auto mx-auto"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=256&width=256";
            e.currentTarget.alt = "خطای سرور";
          }}
        />
      </div>
    </div>
  );
}
