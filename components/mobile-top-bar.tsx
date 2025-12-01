"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, User, Home, Store, BookOpen } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import UnifiedSearch from "@/components/search/unified-search";

const MAIN_LINKS = [
  { label: "خانه", href: "/", icon: Home },
  { label: "فروشگاه", href: "/shop", icon: Store },
  { label: "انیمه‌ها", href: "/anime", icon: BookOpen },
  { label: "اخبار انیمه", href: "/topic", icon: BookOpen },
  { label: "تماس با ما", href: "/contact", icon: BookOpen },
  { label: "سوالات متداول", href: "/faq", icon: BookOpen },
];

export function MobileTopBar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  const accountLinks = user
    ? [
        { label: "پروفایل من", href: "/profile" },
        { label: "سفارش‌ها", href: "/profile/orders" },
        { label: "علاقه‌مندی‌ها", href: "/profile/wishlist" },
        { label: "آدرس‌های من", href: "/profile/addresses" },
      ]
    : [{ label: "ورود / ثبت نام", href: "/auth/login" }];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div
        className="lg:hidden fixed left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border"
        style={{
          top: "calc(env(safe-area-inset-top, 0px) + 0rem)",
        }}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/30 bg-card text-foreground shadow-sm transition-all duration-200 hover:border-primary/70 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label="باز کردن منو"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>

          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-foreground brand-name"
            prefetch={false}
          >
            AME-TAMA
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border/30 bg-card text-foreground shadow-sm transition-all duration-200 hover:border-primary/70 hover:text-primary/80"
              prefetch={false}
              aria-label="سبد خرید"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount ? (
                <Badge className="absolute -top-2 -right-2 h-5 min-w-[20px] rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                  {itemCount > 99 ? "99+" : itemCount}
                </Badge>
              ) : null}
            </Link>
            <UnifiedSearch mobileButtonClassName="flex h-10 w-10 items-center justify-center rounded-xl border border-border/30 bg-card text-foreground shadow-sm transition-all duration-200 hover:border-primary/70 hover:text-primary/80" />
          </div>
        </div>
      </div>

      <SheetContent
        side="right"
        className="w-full max-w-xs bg-background pb-0 pt-0 text-foreground"
      >
        <SheetHeader className="px-6 pt-6 pb-4 text-right">
          <SheetTitle className="text-xl font-bold">منوی اصلی</SheetTitle>
          <p className="text-sm text-muted-foreground">
            دسترسی سریع به بخش‌های مهم سایت
          </p>
        </SheetHeader>

        <div className="h-px bg-border/30" />

        <div className="max-h-[600px] overflow-y-auto px-6 pb-10 pt-4">
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border/30 bg-card p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-accent/80 text-primary-foreground shadow-lg">
              {typeof user?.avatar === "string" && user?.avatar?.trim() !== "" ? (
                <img
                  src={user.avatar}
                  alt={user.firstName || "Avatar"}
                  className="h-full w-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                خوش آمدید{user?.firstName ? "،" : ""}
              </p>
              <p className="text-base font-semibold">
                {user?.firstName
                  ? `${user.firstName} ${user.lastName ?? ""}`.trim()
                  : "کاربر مهمان"}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-right">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                صفحات
              </p>
              <nav className="space-y-2">
                {MAIN_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        prefetch={false}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-xl border border-border/30 px-3 py-3 text-sm font-medium transition-all",
                          isActive
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-border/30 bg-card hover:border-primary/20 hover:bg-primary/3 transition-all duration-200"
                        )}
                      >
                        <span>{link.label}</span>
                        <link.icon className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                حساب کاربری
              </p>
              <nav className="space-y-2">
                {accountLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className={cn(
                        "block rounded-xl border border-border/30 bg-card px-3 py-3 text-sm font-medium transition-all",
                        pathname.startsWith(link.href)
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "hover:border-primary/20 hover:bg-primary/3 transition-all duration-200"
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
