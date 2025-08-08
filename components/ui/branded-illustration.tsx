"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BrandedIllustrationProps {
  variant?: "hero" | "section" | "footer";
  className?: string;
}

export function BrandedIllustration({
  variant = "section",
  className,
}: BrandedIllustrationProps) {
  const isMobile = useIsMobile();
  const baseClasses = "absolute pointer-events-none opacity-10 z-20";

  // Always render something to prevent hook mismatch
  if (isMobile) {
    return (
      <div className={cn(baseClasses, "inset-0", className)}>
        {/* Minimal mobile version - just a simple background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className={cn(baseClasses, "inset-0", className)}>
        {/* Simplified anime character silhouettes */}
        <div className="absolute top-10 left-10 w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M50 20c-8 0-15 7-15 15s7 15 15 15 15-7 15-15-7-15-15-15zm0 25c-5 0-10-5-10-10s5-10 10-10 10 5 10 10-5 10-10 10z"
              fill="currentColor"
              className="text-primary"
            />
            <path
              d="M30 60c0-5 5-10 10-10h20c5 0 10 5 10 10v20H30V60z"
              fill="currentColor"
              className="text-primary"
            />
          </svg>
        </div>

        <div className="absolute top-20 right-20 w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent"
            />
            <path
              d="M30 50c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z"
              fill="currentColor"
              className="text-accent"
            />
          </svg>
        </div>
      </div>
    );
  }

  if (variant === "section") {
    return (
      <div className={cn(baseClasses, "inset-0", className)}>
        {/* Simplified geometric patterns */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-16 h-16 border-2 border-primary/20 rounded-full"></div>
          <div className="absolute top-20 right-20 w-12 h-12 bg-accent/20 rounded-lg transform rotate-45"></div>
          <div className="absolute bottom-10 left-1/4 w-20 h-20 border border-primary/10 rounded-full"></div>
          <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-accent/15 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={cn(baseClasses, "inset-0", className)}>
        {/* Simplified wave patterns */}
        <div className="absolute bottom-0 left-0 w-full h-20">
          <svg viewBox="0 0 1200 120" className="w-full h-full">
            <path
              d="M0,60 C300,30 600,90 1200,60 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-primary/5"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(baseClasses, "inset-0", className)}>
      {/* Fallback minimal version */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
    </div>
  );
}

// Optimized floating anime elements for background decoration
export function FloatingElements() {
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize positions to prevent recalculation
  const starPositions = useMemo(
    () => [
      { left: "10%", top: "20%", delay: "0.5s", duration: "3s" },
      { left: "85%", top: "15%", delay: "1.2s", duration: "2.5s" },
      { left: "25%", top: "75%", delay: "0.8s", duration: "3.5s" },
      { left: "70%", top: "80%", delay: "1.5s", duration: "2.8s" },
      { left: "45%", top: "35%", delay: "0.3s", duration: "3.2s" },
      { left: "90%", top: "60%", delay: "1.8s", duration: "2.7s" },
    ],
    []
  );

  const circlePositions = useMemo(
    () => [
      {
        left: "15%",
        top: "10%",
        width: "12px",
        height: "12px",
        delay: "0.7s",
        duration: "4s",
      },
      {
        left: "80%",
        top: "85%",
        width: "16px",
        height: "16px",
        delay: "1.3s",
        duration: "3.5s",
      },
      {
        left: "60%",
        top: "25%",
        width: "10px",
        height: "10px",
        delay: "0.9s",
        duration: "4.2s",
      },
      {
        left: "35%",
        top: "90%",
        width: "14px",
        height: "14px",
        delay: "1.6s",
        duration: "3.8s",
      },
    ],
    []
  );

  // Always render a container to prevent hook mismatch
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {/* Render minimal version on mobile for performance */}
      {isMobile ? (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-30" />
      ) : !isClient ? (
        // SSR version with predefined positions
        <>
          {starPositions.map((pos, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: pos.left,
                top: pos.top,
                animationDelay: pos.delay,
                animationDuration: pos.duration,
              }}
            >
              <svg className="w-4 h-4 text-primary/30" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </div>
          ))}

          {circlePositions.map((pos, i) => (
            <div
              key={`circle-${i}`}
              className="absolute rounded-full bg-accent/10 animate-bounce"
              style={{
                left: pos.left,
                top: pos.top,
                width: pos.width,
                height: pos.height,
                animationDelay: pos.delay,
                animationDuration: pos.duration,
              }}
            />
          ))}
        </>
      ) : (
        // Client-side version with reduced animations
        <>
          {/* Reduced number of floating stars for better performance */}
          {starPositions.map((pos, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: pos.left,
                top: pos.top,
                animationDelay: pos.delay,
                animationDuration: pos.duration,
              }}
            >
              <svg className="w-4 h-4 text-primary/30" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </div>
          ))}

          {/* Reduced number of floating circles for better performance */}
          {circlePositions.map((pos, i) => (
            <div
              key={`circle-${i}`}
              className="absolute rounded-full bg-accent/10 animate-bounce"
              style={{
                left: pos.left,
                top: pos.top,
                width: pos.width,
                height: pos.height,
                animationDelay: pos.delay,
                animationDuration: pos.duration,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
