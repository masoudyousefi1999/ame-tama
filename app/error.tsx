"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  HomeIcon,
  RefreshCcwIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";
import { AnimatedServerError } from "@/components/500/animated-server-error";
import { Animated500 } from "@/components/500/animated-500";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center overflow-hidden">
      {/* animated 500 graphic */}
      <div className="mb-8 relative">
        <Animated500 />
        <AnimatedServerError />
      </div>

      {/* title & copy */}
      <div>
        <h1 className="text-3xl font-bold mb-4">خطای سرور رخ داده است!</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          متأسفانه در پردازش درخواست شما مشکلی پیش آمده است. تیم فنی ما در حال
          بررسی و رفع این مشکل است. لطفاً صفحه را دوباره بارگذاری کنید یا به
          صفحه اصلی بازگردید.
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
              <li>• به صفحه قبلی بازگردید</li>
              <li>• به صفحه اصلی بروید</li>
              <li>• بعداً دوباره تلاش کنید</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* main action buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md">
        <Button onClick={reset} className="gap-2">
          <RefreshCcwIcon className="h-4 w-4" />
          تلاش مجدد
        </Button>
        <Button
          onClick={() => window.history.back()}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          بازگشت
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/" prefetch={false}>
            <HomeIcon className="h-4 w-4" />
            صفحه اصلی
          </Link>
        </Button>
      </div>

      {/* support link */}
      <div className="mt-12">
        <Button asChild variant="link" className="gap-1 text-muted-foreground">
          <Link href="/contact"  prefetch={false}>
            گزارش مشکل به پشتیبانی
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* dev-only error block */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-destructive/10 rounded-md text-left max-w-md w-full">
          <h3 className="text-sm font-semibold text-destructive mb-2">
            خطای توسعه:
          </h3>
          <p className="text-xs font-mono text-destructive break-all">
            {error.message}
          </p>
          {error.digest && (
            <p className="text-xs font-mono text-destructive/70 mt-1">
              Digest: {error.digest}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
