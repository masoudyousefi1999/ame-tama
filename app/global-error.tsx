"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HomeIcon, RefreshCcwIcon, ArrowRightIcon } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="fa" dir="rtl">
      <body>
        <div className="container flex flex-col items-center justify-center min-h-screen py-12 text-center">
          {/* giant “500” & illustration */}
          <div className="mb-8 relative">
            <div className="text-9xl font-bold text-destructive/20 select-none">
              500
            </div>
            <div className="relative z-10 h-64 w-64 mx-auto">
              <img
                src="/placeholder.svg?height=256&width=256"
                alt="خطای سرور"
                className="h-64 w-auto mx-auto"
              />
            </div>
          </div>

          {/* message copy */}
          <div>
            <h1 className="text-3xl font-bold mb-4">
              خطای سیستمی رخ داده است!
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              متأسفانه یک خطای جدی در سیستم رخ داده است. تیم فنی ما در حال بررسی
              و رفع این مشکل است. لطفاً صفحه را دوباره بارگذاری کنید یا بعداً
              مراجعه نمایید.
            </p>
          </div>

          {/* what-to-do card */}
          <div className="w-full max-w-md mb-8">
            <Card>
              <CardContent className="pt-6 pb-6">
                <h2 className="text-lg font-semibold mb-4">
                  چه کاری می‌توانید انجام دهید؟
                </h2>
                <ul className="text-right space-y-2 text-muted-foreground">
                  <li>• صفحه را دوباره بارگذاری کنید</li>
                  <li>• به صفحه اصلی بروید</li>
                  <li>• بعداً دوباره تلاش کنید</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* primary actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
            <Button onClick={reset} className="gap-2">
              <RefreshCcwIcon className="h-4 w-4" />
              تلاش مجدد
            </Button>

            <Button asChild variant="outline" className="gap-2">
              <Link href="/">
                <HomeIcon className="h-4 w-4" />
                صفحه اصلی
              </Link>
            </Button>
          </div>

          {/* support link */}
          <div className="mt-12">
            <Button
              asChild
              variant="link"
              className="gap-1 text-muted-foreground"
            >
              <Link href="/contact">
                گزارش مشکل به پشتیبانی
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
