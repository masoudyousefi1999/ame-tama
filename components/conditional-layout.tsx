"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { SkipLink } from "@/components/ui/skip-link";

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
          <Navbar />
        </>
      )}

      <main id="main-content" className={isAdminRoute ? "" : "min-h-screen"}>
        {children}
      </main>

      {!isAdminRoute && <Footer />}
    </>
  );
}
