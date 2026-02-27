import type React from "react";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context";
import { ImageProvider } from "@/context/image-context";
import { LoginModalProvider } from "@/context/login-modal-context";
import localFont from "next/font/local";
import LoginToastEffect from "@/components/LoginToastEffect";

const vazirmatn = localFont({
  src: "../fonts/vazir.ttf",
  variable: "--font-vazirmatn",
});

const langar = localFont({
  src: "../fonts/Langar-Regular.ttf",
  variable: "--font-langar",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      </head>
      <body
        className={`${vazirmatn.variable} ${langar.variable} min-h-screen overflow-x-hidden`}
        style={{ overscrollBehavior: "auto" }}
      >
        <LoginToastEffect />
        <LoginModalProvider>
          <AuthProvider>
            <ImageProvider>
              <div className="min-h-screen flex flex-col">{children}</div>
              <Toaster />
            </ImageProvider>
          </AuthProvider>
        </LoginModalProvider>
      </body>
    </html>
  );
}
