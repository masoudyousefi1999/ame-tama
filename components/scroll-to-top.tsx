"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

/**
 * ScrollToTop component that resets scroll position when navigating between pages
 * This component should be added to the root layout to ensure it's present on all pages
 */
function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Small delay to allow page transition to start before scrolling
    // This prevents jarring scroll during transition animation
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant", // Immediate scrolling
      });
    }, 50); // Small delay to sync with page transition

    return () => clearTimeout(timer);
  }, [pathname, searchParams]); // Re-run when the route changes

  // This component doesn't render anything
  return null;
}

export default function ScrollToTopWrapper() {
  return (
    <Suspense fallback={null}>
      <ScrollToTop />
    </Suspense>
  );
}
