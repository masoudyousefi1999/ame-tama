"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Store, BookOpen, User, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  avatarUrl?: string | null;
  badge?: number;
  isActive?: boolean;
}

export function MobileBottomNavbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Don't show on admin pages, checkout pages, or success pages
  const shouldHide =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.includes("success");

  if (shouldHide) {
    return null;
  }

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
      name: "محصولات انیمه",
      href: "/anime",
      icon: Layers,
      isActive: pathname.startsWith("/anime"),
    },
    {
      name: user ? "پروفایل" : "ورود",
      href: user ? "/profile" : "/login",
      icon: user?.avatar ? undefined : User,
      avatarUrl: user?.avatar ?? null,
      isActive: pathname.startsWith("/profile") || pathname.startsWith("/auth"),
    },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden mobile-bottom-navbar bg-background/95 backdrop-blur-md border-t border-border/50"
      style={{
        paddingTop: `0.375rem`,
        paddingBottom: `0.375rem`,
      }}
    >
      {/* Navigation items */}
      <nav className="relative flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const showAvatar = !!item.avatarUrl;
          const isActive = item.isActive;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="tactile-button relative flex flex-col items-center justify-center rounded-lg group px-2 py-0.5 min-w-0 flex-1"
            >
              {/* Active indicator background */}
              {isActive && (
                <div className="absolute inset-0 bg-primary/15 rounded-lg" />
              )}

              {/* Icon container */}
              <div className="relative flex items-center justify-center mb-0.5">
                {showAvatar ? (
                  <span
                    className={cn(
                      "h-5 w-5 overflow-hidden rounded-full border border-border/50 transition-transform",
                      isActive
                        ? "scale-105 border-primary/50"
                        : "group-hover:scale-105"
                    )}
                  >
                    {typeof item?.avatarUrl === "string" && item?.avatarUrl?.trim() !== "" ? (
                      <img
                        src={item?.avatarUrl}
                        alt="آواتار کاربر"
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center">
                        <User className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                  </span>
                ) : (
                  Icon && (
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                  )
                )}

                {/* Badge for cart items */}
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1">
                    <Badge
                      variant="destructive"
                      className="h-4 w-4 min-w-[16px] rounded-full p-0 flex items-center justify-center text-[10px] font-bold bg-destructive border border-background shadow-sm"
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] leading-tight font-medium truncate w-full text-center px-0.5",
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
