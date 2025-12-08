"use client";

import { Animated404 } from "@/components/404/animated-404";
import { AnimatedCharacter } from "@/components/404/animated-character";
import {
  HomeIcon,
  ShoppingBagIcon,
  HelpCircleIcon,
  ArrowRightIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import UnifiedSearch from "@/components/search/unified-search";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center overflow-hidden">
      {/* illustration */}
      <div className="mb-8 relative">
        <Animated404 />
        <AnimatedCharacter />
      </div>

      {/* headline & copy */}
      <div>
        <h1 className="text-3xl font-bold mb-4">صفحه مورد نظر یافت نشد!</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
          می‌توانید از طریق جستجو یا بازگشت به صفحه اصلی، محصول مورد نظر خود را
          پیدا کنید.
        </p>
      </div>

      {/* search card */}
      <div className="w-full max-w-md mb-8">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">جستجوی محصولات</h2>
            <UnifiedSearch />
          </CardContent>
        </Card>
      </div>

      {/* quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md">
        {[
          { href: "/", icon: HomeIcon, label: "صفحه اصلی" },
          { href: "/shop", icon: ShoppingBagIcon, label: "فروشگاه" },
          { href: "/faq", icon: HelpCircleIcon, label: "سوالات متداول" },
        ].map((link) => (
          <Button asChild variant="outline" key={link.href} className="gap-2">
            <Link href={link.href} prefetch={false}>
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          </Button>
        ))}
      </div>

      {/* support link */}
      <div className="mt-12">
        <Button asChild variant="link" className="gap-1 text-muted-foreground">
          <Link href="/contact" prefetch={false}>
            تماس با پشتیبانی
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
