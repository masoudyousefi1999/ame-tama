"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HomeIcon, RefreshCcwIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { AnimatedServerError } from "@/components/500/animated-server-error"
import { Animated500 } from "@/components/500/animated-500"
import { motion } from "framer-motion"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center overflow-hidden">
      <div className="mb-8 relative">
        <Animated500 />
        <AnimatedServerError />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-4">خطای سرور رخ داده است!</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          متأسفانه در پردازش درخواست شما مشکلی پیش آمده است. تیم فنی ما در حال بررسی و رفع این مشکل است. لطفاً صفحه را
          دوباره بارگذاری کنید یا به صفحه اصلی بازگردید.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full max-w-md mb-8"
      >
        <Card>
          <CardContent className="pt-6 pb-6">
            <h2 className="text-lg font-semibold mb-4">چه کاری می‌توانید انجام دهید؟</h2>
            <ul className="text-right space-y-2 text-muted-foreground">
              <li>• صفحه را دوباره بارگذاری کنید</li>
              <li>• به صفحه قبلی بازگردید</li>
              <li>• به صفحه اصلی بروید</li>
              <li>• بعداً دوباره تلاش کنید</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md"
      >
        <Button onClick={() => reset()} variant="default" className="gap-2">
          <RefreshCcwIcon className="h-4 w-4" />
          <span>تلاش مجدد</span>
        </Button>
        <Button onClick={() => window.history.back()} variant="outline" className="gap-2">
          <ArrowLeftIcon className="h-4 w-4" />
          <span>بازگشت</span>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/">
            <HomeIcon className="h-4 w-4" />
            <span>صفحه اصلی</span>
          </Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-12"
      >
        <Button asChild variant="link" className="gap-1 text-muted-foreground">
          <Link href="/contact">
            <span>گزارش مشکل به پشتیبانی</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>

      {process.env.NODE_ENV === "development" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-8 p-4 bg-red-50 dark:bg-red-950/20 rounded-md text-left max-w-md w-full"
        >
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">خطای توسعه:</h3>
          <p className="text-xs font-mono text-red-700 dark:text-red-300 break-all">{error.message}</p>
          {error.digest && (
            <p className="text-xs font-mono text-red-600 dark:text-red-400 mt-1">Digest: {error.digest}</p>
          )}
        </motion.div>
      )}
    </div>
  )
}
