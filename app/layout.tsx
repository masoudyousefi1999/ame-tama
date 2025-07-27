import type React from "react";
import "@/app/globals.css";
import "simplebar-react/dist/simplebar.min.css";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { ImageProvider } from "@/context/image-context";
import { SkipLink } from "@/components/ui/skip-link";
import ViewportHeightFix from "@/components/viewport-height-fix";
import PageTransition from "@/components/page-transition";
import dynamic from "next/dynamic";
import { LoginModalProvider } from "@/context/login-modal-context";
import LoginToastEffect from "@/components/LoginToastEffect";
const baseUrl = "https://ame-tama.com";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
});

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: "AME-TAMA | آمه تاما",
  description: "خرید اکشن فیگور های انیمه ای با بهترین قیمت و کیفیت",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "AME-TAMA",
    description: "خرید اکشن فیگور های انیمه ای با کیفیت و قیمت مناسب",
    url: "https://ame-tama.com",
    siteName: "AME-TAMA",
    images: [
      {
        url: "/og-image.jpg", // این عکس باید داخل پوشه public باشه
        width: 1200,
        height: 630,
        alt: "AME-TAMA فروشگاه فیگور انیمه‌ای",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AME-TAMA",
    description: "خرید اکشن فیگور های انیمه ای با بهترین قیمت",
    images: ["/og-image.jpg"],
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${vazirmatn.variable} h-full overflow-x-hidden`}>
        <LoginToastEffect />
        <ViewportHeightFix />
        <ScrollToTop />
        <LoginModalProvider>
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
                </ImageProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LoginModalProvider>
      </body>
    </html>
  );
}
