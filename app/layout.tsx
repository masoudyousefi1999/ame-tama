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
  title: "آمه تاما | AME-TAMA | خرید فیگور و اکشن فیگور انیمه‌ای، لباس و اکسسوری",
  description:
    "آمه تاما (AME-TAMA) فروشگاه خرید فیگور انیمه‌ای و اکشن فیگور با تنوع بالا و قیمت مناسب. خرید لباس انیمه‌ای و اکسسوری انیمه‌ای با ارسال سریع و موجودی به‌روز.",
  keywords: [
    // برند
    "آمه تاما",
    "AME-TAMA",
    "AMETAMA",

    // سرچ‌های اصلی
    "خرید فیگور انیمه ای",
    "خرید اکشن فیگور انیمه ای",
    "فروشگاه فیگور انیمه",
    "اکشن فیگور انیمه",
    "فیگور انیمه",

    // لباس و اکسسوری
    "خرید لباس انیمه ای",
    "لباس انیمه ای",
    "خرید اکسسوری انیمه ای",
    "اکسسوری انیمه ای",

    // ترکیبی با برند
    "خرید فیگور از آمه تاما",
    "خرید اکشن فیگور از آمه تاما",
    "خرید لباس انیمه ای از آمه تاما",
    "خرید اکسسوری انیمه ای از آمه تاما",
  ],
  authors: [{ name: "آمه تاما | AME-TAMA" }],
  creator: "آمه تاما | AME-TAMA",
  publisher: "آمه تاما | AME-TAMA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "آمه تاما | AME-TAMA",
    description:
      "خرید فیگور انیمه‌ای و اکشن فیگور از آمه تاما (AME-TAMA) با تنوع بالا و قیمت مناسب. لباس انیمه‌ای و اکسسوری انیمه‌ای با ارسال سریع.",
    url: baseUrl,
    siteName: "آمه تاما | AME-TAMA",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "/favicon.jpg",
        width: 1200,
        height: 630,
        alt: "آمه تاما | AME-TAMA - خرید فیگور و اکشن فیگور انیمه‌ای",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "آمه تاما | AME-TAMA",
    description:
      "خرید فیگور انیمه‌ای و اکشن فیگور از آمه تاما (AME-TAMA) + لباس انیمه‌ای و اکسسوری انیمه‌ای با ارسال سریع.",
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
        {/* {process.env.NODE_ENV === "production" && ( */}
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){
                             if (!window.location.pathname.startsWith('/admin')) {
                                 c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                                 t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                                 y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                             }
                         })(window, document, "clarity", "script", "sy8ocvwyz3");`,
            }}
            defer
          ></script>
        {/* )} */}
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
