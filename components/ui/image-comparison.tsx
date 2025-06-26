"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ResponsiveImage } from "./responsive-image";

interface ImageComparisonProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  className?: string;
}

/** ----------------------------------------------------------------
 *  Image-before / after slider – only **styles** adapted to design-tokens
 *  ---------------------------------------------------------------- */
export function ImageComparison({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  className,
}: ImageComparisonProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  /* ———————————————————————— helpers ———————————————————————— */
  const handleMove = (clientX: number) => {
    if (!containerRef.current || !isDragging.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const newPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(newPosition);
  };

  const handleMouseDown = () => (isDragging.current = true);
  const handleMouseUp = () => (isDragging.current = false);
  const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

  /* —————————————————————— lifecycle —————————————————————— */
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  /* —————————————————————— render —————————————————————— */
  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      className={cn(
        "relative w-full aspect-square overflow-hidden cursor-col-resize select-none",
        "rounded-lg border bg-muted/10" /* tokenised wrapper */,
        className
      )}
    >
      {/* BEFORE  */}
      <ResponsiveImage
        src={beforeSrc}
        alt={beforeAlt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="absolute inset-0 object-cover"
      />

      {/* AFTER  */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <ResponsiveImage
          src={afterSrc}
          alt={afterAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* SLIDER HANDLE  */}
      <div
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        className={cn(
          "absolute inset-y-0 w-0.5 bg-border shadow-sm" /* vertical rail */,
          "z-20 flex items-center justify-center"
        )}
      >
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2",
            "flex h-8 w-8 items-center justify-center rounded-full",
            "bg-background text-foreground shadow-lg",
            "ring-1 ring-border"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 rtl:rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8L22 12L18 16" />
            <path d="M6 8L2 12L6 16" />
          </svg>
        </div>
      </div>
    </div>
  );
}
