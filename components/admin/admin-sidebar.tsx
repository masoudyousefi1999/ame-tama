"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Users,
  Package,
  ShoppingCart,
  Wallet,
  MapPin,
  Grid3X3,
  Menu,
  X,
  BarChart3,
  Home,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const navigation = [
  { name: "داشبورد", href: "/admin", icon: BarChart3 },
  { name: "کاربران", href: "/admin/users", icon: Users, count: 12 },
  { name: "دسته‌بندی‌ها", href: "/admin/categories", icon: Grid3X3 },
  { name: "محصولات", href: "/admin/products", icon: Package, count: 8 },
  {
    name: "سفارشات",
    href: "/admin/orders",
    icon: ShoppingCart,
    count: 5,
    highlight: true,
  },
  { name: "کیف پول", href: "/admin/wallet", icon: Wallet },
  { name: "آدرس‌ها", href: "/admin/addresses", icon: MapPin },
];

export function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        {/* …mobile header… */}
        <ScrollArea className="flex-1 px-4 py-4">
          <nav className="space-y-1" dir="rtl">
            {/* …“بازگشت به سایت” link… */}

            <div className="pt-2 pb-1">
              <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                مدیریت
              </p>
            </div>

            {navigation.map((item) => {
              // ——— MOBILE: exact‐only for "/admin" ———
              let isActive: boolean;
              if (item.href === "/admin") {
                isActive = pathname === "/admin";
              } else {
                isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-r-4 border-purple-500"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={cn(
                        "ml-3 h-5 w-5",
                        isActive ? "text-purple-500" : "text-gray-400"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.count && (
                    <Badge
                      variant={item.highlight ? "destructive" : "secondary"}
                      className={cn(
                        item.highlight ? "bg-red-500 hover:bg-red-600" : ""
                      )}
                    >
                      {item.count}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        {/* …footer with version info… */}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:right-0 lg:top-16 lg:bottom-0 z-30">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          <ScrollArea className="flex-1 px-4 py-4">
            <nav className="space-y-1" dir="rtl">
              {/* …“بازگشت به سایت” link… */}

              <div className="pt-2 pb-1">
                <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  مدیریت
                </p>
              </div>

              <TooltipProvider>
                {navigation.map((item) => {
                  let isActive: boolean;
                  if (item.href === "/admin") {
                    isActive = pathname === "/admin";
                  } else {
                    isActive =
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);
                  }

                  return (
                    <Tooltip key={item.name} delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                            isActive
                              ? "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-r-4 border-purple-500"
                              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                          )}
                        >
                          <div className="flex items-center">
                            <item.icon
                              className={cn(
                                "ml-3 h-5 w-5",
                                isActive ? "text-purple-500" : "text-gray-400"
                              )}
                            />
                            <span>{item.name}</span>
                          </div>
                          {item.count && (
                            <Badge
                              variant={
                                item.highlight ? "destructive" : "secondary"
                              }
                              className={cn(
                                item.highlight
                                  ? "bg-red-500 hover:bg-red-600"
                                  : ""
                              )}
                            >
                              {item.count}
                            </Badge>
                          )}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        {item.name}
                        {item.count &&
                          item.highlight &&
                          ` (${item.count} مورد جدید)`}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </nav>
          </ScrollArea>
          {/* …footer with version info… */}
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-20 right-4 z-40 bg-white dark:bg-gray-800 shadow-md rounded-full h-10 w-10"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
