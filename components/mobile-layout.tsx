"use client";

import { MobileBottomNavbar } from "./mobile-bottom-navbar";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <>
      {/* Main Content with proper spacing for bottom navbar only */}
      <main 
        id="main-content" 
        className="min-h-screen lg:pt-0 lg:pb-0"
        // style={{
        //   paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))',
        // }}
      >
        {children}
      </main>

      {/* Mobile Bottom Navbar */}
      <MobileBottomNavbar />
    </>
  );
}
