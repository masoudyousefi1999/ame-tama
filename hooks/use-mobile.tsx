"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Set initial value
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(isMobileDevice);
    };

    // Check on mount
    checkMobile();

    // Use ResizeObserver for better performance than matchMedia
    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === document.body) {
            const isMobileDevice = entry.contentRect.width < MOBILE_BREAKPOINT;
            setIsMobile(isMobileDevice);
          }
        }
      });
      resizeObserver.observe(document.body);
    } else {
      // Fallback to matchMedia if ResizeObserver is not available
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
      const onChange = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      };
      mql.addEventListener("change", onChange);

      return () => mql.removeEventListener("change", onChange);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return isMobile;
}
