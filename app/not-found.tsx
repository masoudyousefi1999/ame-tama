"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SearchBar } from "@/components/404/search-bar"
import { HomeIcon, ShoppingBagIcon, HelpCircleIcon, ArrowRightIcon } from "lucide-react"
import { AnimatedCharacter } from "@/components/404/animated-character"
import { Animated404 } from "@/components/404/animated-404"
import { motion } from "framer-motion"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center overflow-hidden">
      <div className="mb-8 relative">
        <Animated404 />
        <AnimatedCharacter />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-4">صفحه مورد نظر یافت نشد!</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است. می‌توانید از طریق جستجو یا بازگشت به صفحه اصلی،
          محصول مورد نظر خود را پیدا کنید.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full max-w-md mb-8"
      >
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">جستجوی محصولات</h2>
            <SearchBar />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md"
      >
        <Button asChild variant="outline" className="gap-2">
          <Link href="/">
            <HomeIcon className="h-4 w-4" />
            <span>صفحه اصلی</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/shop">
            <ShoppingBagIcon className="h-4 w-4" />
            <span>فروشگاه</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/faq">
            <HelpCircleIcon className="h-4 w-4" />
            <span>سوالات متداول</span>
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
            <span>تماس با پشتیبانی</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}
