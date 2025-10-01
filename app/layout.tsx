import type React from "react";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { ImageProvider } from "@/context/image-context";
import { SkipLink } from "@/components/ui/skip-link";
import ViewportHeightFix from "@/components/viewport-height-fix";
import dynamic from "next/dynamic";
import { LoginModalProvider } from "@/context/login-modal-context";
import LoginToastEffect from "@/components/LoginToastEffect";
import localFont from "next/font/local";
import SchemaOrg from "@/components/seo/schema-org";
import Script from "next/script";

const baseUrl = "https://ame-tama.com";

const vazirmatn = localFont({
  src: "./fonts/vazir.ttf",
  variable: "--font-vazirmatn",
});

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: "AME-TAMA | آمه تاما",
  description: "خرید اکشن فیگور های انیمه ای با بهترین قیمت و کیفیت",
  keywords: "فیگور انیمه, اکشن فیگور, مجسمه انیمه, AME-TAMA, خرید فیگور",
  authors: [{ name: "AME-TAMA" }],
  creator: "AME-TAMA",
  publisher: "AME-TAMA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "AME-TAMA",
    description: "خرید اکشن فیگور های انیمه ای با کیفیت و قیمت مناسب",
    url: "https://ame-tama.com",
    siteName: "AME-TAMA",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "/favicon.jpg",
        width: 1200,
        height: 630,
        alt: "AME-TAMA فروشگاه فیگور انیمه‌ای",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AME-TAMA",
    description: "خرید اکشن فیگور های انیمه ای با بهترین قیمت",
    images: ["/favicon.jpg"],
    creator: "@masoudyousefi99",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        {/* Resource hints for better performance */}
        <link
          rel="preconnect"
          href="https://ame-tama.storage.c2.liara.space"
          crossOrigin="anonymous"
        />
        {/* Additional performance hints */}
        <link rel="preconnect" href="https://www.clarity.ms" />
        {/* Performance optimization */}
        <meta name="format-detection" content="telephone=no" />
        {process.env.NODE_ENV === "production" && (
          <>
            <Script id="ms-clarity" strategy="afterInteractive">
              {`(function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "sy8ocvwyz3");`}
            </Script>
          </>
        )}
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
                  <main id="main-content" className="min-h-screen">
                    {children}
                  </main>
                  <Footer />
                  <Toaster />
                </ImageProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LoginModalProvider>
        <SchemaOrg type="organization" data={{}} />
        <SchemaOrg type="website" data={{}} />
      </body>
    </html>
  );
}
