"use client";

import { useState, useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  disabled?: boolean;
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  disabled = false,
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pullIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        setIsAtTop(scrollTop === 0);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;

    const touch = e.touches[0];
    setStartY(touch.clientY);
    setIsPulling(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || isRefreshing || !isAtTop) return;

    const touch = e.touches[0];
    const currentY = touch.clientY;
    const distance = currentY - startY;

    if (distance > 0) {
      e.preventDefault();
      const pullDistance = Math.min(distance * 0.5, threshold * 1.5);
      setPullDistance(pullDistance);
      setIsPulling(true);
    }
  };

  const handleTouchEnd = async () => {
    if (disabled || isRefreshing || !isPulling) return;

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error("Refresh failed:", error);
      } finally {
        setIsRefreshing(false);
      }
    }

    // Reset states
    setIsPulling(false);
    setPullDistance(0);
    setStartY(0);
  };

  const getPullIndicatorOpacity = () => {
    if (!isPulling) return 0;
    return Math.min(pullDistance / threshold, 1);
  };

  const getPullIndicatorScale = () => {
    if (!isPulling) return 0.5;
    return Math.min(pullDistance / threshold, 1);
  };

  const getPullIndicatorRotation = () => {
    if (!isPulling) return 0;
    return (pullDistance / threshold) * 360;
  };

  return (
    <div className="relative">
      {/* Pull Indicator */}
      <div
        ref={pullIndicatorRef}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-200 ease-out"
        style={{
          transform: `translateX(-50%) translateY(${Math.max(
            pullDistance - 20,
            -60
          )}px)`,
          opacity: getPullIndicatorOpacity(),
        }}
      >
        <div className="flex flex-col items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full shadow-lg">
          <RefreshCw
            className={`w-6 h-6 text-white transition-transform duration-200 ${
              isRefreshing ? "animate-spin" : ""
            }`}
            style={{
              transform: `scale(${getPullIndicatorScale()}) rotate(${getPullIndicatorRotation()}deg)`,
            }}
          />
        </div>
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            {pullDistance >= threshold
              ? "رها کنید تا رفرش شود"
              : "بکشید تا رفرش شود"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={containerRef}
        className="h-full overflow-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: isPulling
            ? `translateY(${Math.min(pullDistance * 0.3, 20)}px)`
            : "translateY(0)",
          transition: isPulling ? "none" : "transform 0.3s ease-out",
        }}
      >
        {children}
      </div>

      {/* Background Overlay */}
      {isPulling && (
        <div
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent transition-opacity duration-200"
          style={{
            height: `${Math.min(pullDistance * 0.5, 100)}px`,
            opacity: Math.min(pullDistance / threshold, 0.3),
          }}
        />
      )}
    </div>
  );
}
