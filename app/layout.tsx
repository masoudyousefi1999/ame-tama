import type React from "react"
import "@/app/globals.css"
import { Vazirmatn } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { CartProvider } from "@/context/cart-context"
import { AuthProvider } from "@/context/auth-context"

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
})

export const metadata = {
  title: "AME-TAMA | مجسمه‌های انیمه لوکس",
  description:
    "مجسمه‌های انیمه لوکس برای کلکسیونرهای مشتاق. مجموعه‌ای از مجسمه‌های با کیفیت و دقیق از سری‌های انیمه مورد علاقه شما را کشف کنید.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa-IR" dir="rtl" suppressHydrationWarning>
      <body className={vazirmatn.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <Navbar />
              {children}
              <Footer />
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
