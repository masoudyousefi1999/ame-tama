"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

export function GoToTopButton() {
  const [visible, setVisible] = useState(false);

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const shouldBeVisible = scrollY > 200; // Increased threshold for mobile

    setVisible(shouldBeVisible);
  }, []);

  useEffect(() => {
    // Use passive event listener for better performance
    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: false,
    });

    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 p-2.5 md:p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/80 transition-colors duration-200"
      aria-label="بازگشت به بالا"
    >
      <ChevronUp className="h-5 w-5 md:h-6 md:w-6" />
    </button>
  );
}
