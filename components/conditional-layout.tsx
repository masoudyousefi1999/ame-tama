"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { SkipLink } from "@/components/ui/skip-link";
import { MobileLayout } from "@/components/mobile-layout";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if we're in admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && (
        <>
          <SkipLink href="#main-content" />
          {/* Desktop Navbar */}
          <Navbar />
          {/* Mobile Layout */}
          <MobileLayout>{children}</MobileLayout>
        </>
      )}

      {isAdminRoute && <main id="main-content">{children}</main>}

      {!isAdminRoute && <Footer />}
    </>
  );
}
