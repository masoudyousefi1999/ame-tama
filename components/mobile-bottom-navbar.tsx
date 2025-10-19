"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Store, Search, User, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  isActive?: boolean;
}

export function MobileBottomNavbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user } = useAuth();

  // Don't show on admin pages, checkout pages, or success pages
  const shouldHide =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.includes("success");

  if (shouldHide) {
    return null;
  }

  const cartItemsCount = itemCount || 0;

  const navItems: NavItem[] = [
    {
      name: "خانه",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      name: "فروشگاه",
      href: "/shop",
      icon: Store,
      isActive: pathname === "/shop",
    },
    {
      name: "جستجو",
      href: "/search",
      icon: Search,
      isActive: pathname === "/search",
    },
    {
      name: "سفارشات",
      href: "/cart",
      icon: ShoppingBag,
      badge: cartItemsCount > 0 ? cartItemsCount : undefined,
      isActive: pathname === "/cart",
    },
    {
      name: user ? "پروفایل" : "ورود",
      href: user ? "/profile" : "/auth/login",
      icon: User,
      isActive: pathname.startsWith("/profile") || pathname.startsWith("/auth"),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Background with blur and gradient */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-xl border-t border-border/50">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/100 via-background/95 to-transparent" />

        {/* Subtle glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      {/* Navigation items */}
      <nav className="relative flex items-center justify-around px-2 py-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="tactile-button relative flex flex-col items-center justify-center p-2 rounded-2xl group shadow-sm"
            >
              {/* Active indicator background */}
              {isActive && (
                <div className="absolute inset-0 bg-primary/20 rounded-2xl border border-primary/30" />
              )}

              {/* Icon container */}
              <div className="relative flex items-center justify-center">
                <Icon
                  className={cn(
                    "h-6 w-6",
                    isActive
                      ? "text-primary scale-110"
                      : "text-muted-foreground group-hover:text-foreground group-hover:scale-105"
                  )}
                />

                {/* Badge for cart items */}
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1">
                    <Badge
                      variant="destructive"
                      className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 border-2 border-background shadow-lg"
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </Badge>
                  </div>
                )}

                {/* Ripple effect on tap */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-primary/20" />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-xs mt-1 font-medium",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {item.name}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-background/95 backdrop-blur-xl" />
    </div>
  );
}
