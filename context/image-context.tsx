"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useNetworkStatus } from "@/hooks/use-network-status";

type ImageQuality = "low" | "medium" | "high" | "auto";
type ImageLoadingStrategy = "eager" | "lazy" | "progressive" | "auto";

interface ImageContextType {
  quality: ImageQuality;
  loadingStrategy: ImageLoadingStrategy;
  preferredFormat: "avif" | "webp" | "jpeg" | "auto";
  useLowQualityPlaceholder: boolean;
  setQuality: (quality: ImageQuality) => void;
  setLoadingStrategy: (strategy: ImageLoadingStrategy) => void;
  setPreferredFormat: (format: "avif" | "webp" | "jpeg" | "auto") => void;
  setUseLowQualityPlaceholder: (use: boolean) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [quality, setQuality] = useState<ImageQuality>("auto");
  const [loadingStrategy, setLoadingStrategy] =
    useState<ImageLoadingStrategy>("auto");
  const [preferredFormat, setPreferredFormat] = useState<
    "avif" | "webp" | "jpeg" | "auto"
  >("auto");
  const [useLowQualityPlaceholder, setUseLowQualityPlaceholder] =
    useState<boolean>(true);

  const networkStatus = useNetworkStatus();

  // Adjust settings based on network conditions and device type
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    if (!networkStatus.online) {
      // If offline, use low quality and lazy loading
      setQuality("low");
      setLoadingStrategy("lazy");
      return;
    }

    // If save data is enabled or on mobile with slow connection
    if (
      networkStatus.saveData ||
      (isMobile &&
        networkStatus.effectiveType &&
        ["slow-2g", "2g"].includes(networkStatus.effectiveType))
    ) {
      setQuality("low");
      setLoadingStrategy("lazy");
      setUseLowQualityPlaceholder(false);
      return;
    }

    // Based on connection speed with mobile-specific adjustments
    if (networkStatus.effectiveType) {
      switch (networkStatus.effectiveType) {
        case "slow-2g":
        case "2g":
          setQuality("low");
          setLoadingStrategy("lazy");
          break;
        case "3g":
          // On mobile 3G, use lower quality than desktop
          setQuality(isMobile ? "low" : "medium");
          setLoadingStrategy("lazy");
          break;
        case "4g":
          // On mobile 4G, still use medium quality to save bandwidth
          setQuality(isMobile ? "medium" : "high");
          setLoadingStrategy(isMobile ? "lazy" : "progressive");
          break;
      }
    } else {
      // Default fallback - be conservative on mobile
      setQuality(isMobile ? "medium" : "high");
      setLoadingStrategy(isMobile ? "lazy" : "progressive");
    }
  }, [networkStatus]);

  return (
    <ImageContext.Provider
      value={{
        quality,
        loadingStrategy,
        preferredFormat,
        useLowQualityPlaceholder,
        setQuality,
        setLoadingStrategy,
        setPreferredFormat,
        setUseLowQualityPlaceholder,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}

export function useImageSettings() {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error("useImageSettings must be used within an ImageProvider");
  }
  return context;
}
