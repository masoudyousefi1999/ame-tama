import type React from "react";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { ImageProvider } from "@/context/image-context";
import { BreadcrumbProvider } from "@/context/breadcrumb-context";
import { LoginModalProvider } from "@/context/login-modal-context";
import localFont from "next/font/local";
import Script from "next/script";
import LoginToastEffect from "@/components/LoginToastEffect";
import SchemaOrg from "@/components/seo/schema-org";
import ConditionalLayout from "@/components/conditional-layout";
import ScrollToTop from "@/components/scroll-to-top";

const baseUrl = "https://ame-tama.com";

const vazirmatn = localFont({
  src: "./fonts/vazir.ttf",
  variable: "--font-vazirmatn",
});

const langar = localFont({
  src: "./fonts/Langar-Regular.ttf",
  variable: "--font-langar",
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
    title: "AME-TAMA | آمه تاما",
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
    title: "AME-TAMA | آمه تاما",
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

async function fetchCategories() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";
    const res = await fetch(`${baseUrl}/api/categories`, {
      next: { revalidate: 600, tags: ["categories"] },
    });
    if (!res.ok) {
      return [];
    }
    return await res.json();
  } catch {
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await fetchCategories();

  return (
    <html lang="fa-IR" dir="rtl" suppressHydrationWarning className="h-full">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="format-detection" content="telephone=no" />
        <meta
          httpEquiv="Cache-Control"
          content="public, max-age=31536000, immutable"
        />
        {process.env.NODE_ENV === "production" && (
          <Script id="ms-clarity-proxy" strategy="lazyOnload">
            {`
              (function() {
                if (window.location.pathname.startsWith('/admin')) return;
                var s = document.createElement('script');
                s.async = true;
                s.src = '/api/clarity';
                document.head.appendChild(s);
              })();
            `}
          </Script>
        )}
      </head>
      <body
        className={`${vazirmatn.variable} ${langar.variable} min-h-screen overflow-x-hidden`}
      >
        <LoginToastEffect />
        <ScrollToTop />
        <LoginModalProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ImageProvider>
                  <BreadcrumbProvider>
                    <ConditionalLayout categories={categories}>
                      {children}
                    </ConditionalLayout>
                  </BreadcrumbProvider>
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
