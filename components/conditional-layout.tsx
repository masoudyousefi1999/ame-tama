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
          <main
            id="main-content"
            className="flex-1 pt-[40px] pb-[calc(64px+env(safe-area-inset-bottom,0px))]"
          >
            {children}
            {!shouldHideFooter && <Footer />}
          </main>
          <MobileBottomNavbar />
        </>
      )}

      {isAdminRoute && (
        <main
          id="main-content"
          className="flex-1 pt-[50px] pb-[calc(64px+env(safe-area-inset-bottom,0px))]"
        >
          {children}
        </main>
      )}
    </div>
  );
}
