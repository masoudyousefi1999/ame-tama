"use client";

import { useEffect } from "react";

export default function ViewportHeightFix() {
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      
      // Also set actual height for mobile to prevent white space
      if (window.innerWidth <= 768) {
        const actualHeight = window.innerHeight;
        document.documentElement.style.setProperty("--actual-height", `${actualHeight}px`);
        
        // Chrome specific fix
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        
        if (isChrome) {
          // Force exact viewport height for Chrome
          document.body.style.height = `${actualHeight}px`;
          document.body.style.minHeight = `${actualHeight}px`;
          document.body.style.maxHeight = `${actualHeight}px`;
          document.documentElement.style.height = `${actualHeight}px`;
          document.documentElement.style.minHeight = `${actualHeight}px`;
          
          // Prevent any overflow
          document.body.style.overflowY = 'auto';
          document.body.style.overflowX = 'hidden';
          document.documentElement.style.overflow = 'hidden';
        } else {
          document.body.style.height = `${actualHeight}px`;
          document.body.style.minHeight = `${actualHeight}px`;
          document.documentElement.style.height = `${actualHeight}px`;
        }
        
        // Ensure bottom navbar is at bottom - Chrome specific
        const bottomNav = document.querySelector('.mobile-bottom-navbar');
        if (bottomNav) {
          const navElement = bottomNav as HTMLElement;
          navElement.style.bottom = '0';
          navElement.style.position = 'fixed';
          navElement.style.marginBottom = '0';
          navElement.style.paddingBottom = '0';
          navElement.style.transform = 'translateY(0)';
          
          if (isChrome) {
            // Chrome specific: remove any padding that might cause gap
            navElement.style.paddingBottom = '0';
            navElement.style.marginBottom = '0';
            // Force it to absolute bottom
            navElement.style.setProperty('bottom', '0', 'important');
            navElement.style.setProperty('position', 'fixed', 'important');
          }
        }
      }
    };

    setViewportHeight(); // Initial set
    
    // Use requestAnimationFrame for smooth updates
    let rafId: number;
    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(setViewportHeight);
    };
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
