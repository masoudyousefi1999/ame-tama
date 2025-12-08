"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { MobileBottomNavbar } from "@/components/mobile-bottom-navbar";
import { MobileTopBar } from "@/components/mobile-top-bar";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if we're in admin routes
  const isAdminRoute = pathname.startsWith("/admin");
  const footerHiddenRoutes = ["/checkout", "/cart", "/login", "/auth"];
  const shouldHideFooter = footerHiddenRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && (
        <>
          <MobileTopBar />
          <Navbar />
          <main id="main-content" className="flex-1 pt-[50px]">
            {children}
            {!shouldHideFooter && <Footer />}
            <div className="h-16 lg:hidden" aria-hidden="true" />
          </main>
          <MobileBottomNavbar />
        </>
      )}

      {isAdminRoute && <main id="main-content">{children}</main>}
    </div>
  );
}
