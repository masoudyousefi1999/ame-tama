"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackToTopButtonProps {
  threshold?: number;
  containerId?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * Floating "back to top" button that detects scroll on window and an optional container.
 * Defaults to listening to `#main-content` and the window to cover both layouts.
 */
export function BackToTopButton({
  threshold = 120,
  containerId = "main-content",
  className,
  ariaLabel = "بازگشت به بالا",
}: BackToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mainContent = containerId
      ? (document.getElementById(containerId) as HTMLElement | null)
      : null;

    const getScrollTop = () => {
      const candidates = [
        window.pageYOffset,
        document.documentElement?.scrollTop,
      ].filter((v) => typeof v === "number") as number[];
      return Math.max(...candidates, 0);
    };

    const handleScroll = () => {
      setVisible(getScrollTop() > threshold);
    };

    handleScroll(); // initialize on mount

    window.addEventListener("scroll", handleScroll, { passive: true });
    if (mainContent) {
      mainContent.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (mainContent) {
        mainContent.removeEventListener("scroll", handleScroll);
      }
    };
  }, [threshold, containerId]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const mainContent = containerId
      ? (document.getElementById(containerId) as HTMLElement | null)
      : null;
    if (mainContent && mainContent.scrollTop > 0) {
      mainContent.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!visible) return null;

  return (
    <Button
      onClick={handleClick}
      size="icon"
      className={cn(
        "fixed bottom-24 right-4 z-60 h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground md:bottom-12",
        className,
      )}
      aria-label={ariaLabel}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
