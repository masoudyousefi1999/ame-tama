import type React from "react";
import "@/app/globals.css";
import { Vazirmatn } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { ImageProvider } from "@/context/image-context";
import { SkipLink } from "@/components/ui/skip-link";
import ViewportHeightFix from "@/components/viewport-height-fix";
import SplashScreen from "@/components/splash-screen";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import PageTransition from "@/components/page-transition";
import dynamic from "next/dynamic";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
});

export const metadata = {
  title: "AME-TAMA | مجسمه‌های انیمه لوکس",
  description:
    "مجسمه‌های انیمه لوکس برای کلکسیونرهای مشتاق. مجموعه‌ای از مجسمه‌های با کیفیت و دقیق از سری‌های انیمه مورد علاقه شما را کشف کنید.",
  generator: "v0.dev",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AME-TAMA",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ScrollToTop = dynamic(() => import("@/components/scroll-to-top"), {
    ssr: true,
  });

  return (
    <html lang="fa-IR" dir="rtl" suppressHydrationWarning className="h-full">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/pwa-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/pwa-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/pwa-icon.png"
        />
        <link rel="mask-icon" href="/icons/pwa-icon.png" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
      </head>
      <body className={`${vazirmatn.variable} h-full overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={true}
        >
          <SplashScreen>
            <ViewportHeightFix />
            <ScrollToTop />
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <ImageProvider>
                    <SkipLink href="#main-content" />
                    <Navbar />
                    <PageTransition>
                      <main id="main-content" className="min-h-screen">
                        {children}
                      </main>
                    </PageTransition>
                    <Footer />
                    <Toaster />
                    <PWAInstallPrompt />
                  </ImageProvider>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </SplashScreen>
        </ThemeProvider>
      </body>
    </html>
  );
}
