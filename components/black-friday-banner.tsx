"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export default function BlackFridayBanner() {
  return (
    <Link
      href="/shop"
      className={cn(
        "w-full bg-black text-foreground text-center px-4 py-2.5 md:py-3",
        "fixed top-0 left-0 right-0 z-[60]",
        "overflow-hidden",
        "cursor-pointer",
        "border-b border-destructive/30",
      )}
      aria-label="تخفیف روی تمامی محصولات به مناسبت بلک فرایدی"
    >
      <div className="container mx-auto">
        <p className="text-xs sm:text-sm md:text-base font-medium flex items-center justify-center gap-2 whitespace-nowrap">
          <span>🎉</span>
          <span className="text-secondary">
            تخفیف روی تمام محصولات به مدت یک هفته به مناسبت بلک فرایدی
          </span>
          <span>🎉</span>
        </p>
      </div>
    </Link>
  );
}
