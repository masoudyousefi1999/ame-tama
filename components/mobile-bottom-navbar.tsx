"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Store, BookOpen, User, ShoppingBag } from "lucide-react";
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
      name: "اخبار",
      href: "/topic",
      icon: BookOpen,
      isActive: pathname.startsWith("/topic"),
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
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden mobile-bottom-navbar bg-background">
      {/* Navigation items */}
      <nav className="relative flex items-center justify-around p-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="tactile-button relative flex flex-col items-center justify-center rounded-2xl group shadow-sm px-4 py-2"
            >
              {/* Active indicator background */}
              {isActive && (
                <div className="absolute inset-0 bg-primary/20 rounded-2xl border border-primary/10" />
              )}

              {/* Icon container */}
              <div className="relative flex items-center justify-center pb-1">
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
                  <div className="absolute -top-3 -right-3">
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
                  "text-sm font-medium",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
