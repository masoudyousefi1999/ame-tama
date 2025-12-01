"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, customFetch } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Users,
  Package,
  ShoppingCart,
  MessageSquare,
  Grid3X3,
  Menu,
  X,
  BarChart3,
  Home,
  Film,
  ShoppingBag,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface SiteInfo {
  totalUsers: number;
  totalComments: number;
  totalProducts: number;
  totalOrders: number;
}

const getNavigationItems = (siteInfo?: SiteInfo) => [
  { name: "داشبورد", href: "/admin", icon: BarChart3 },
  {
    name: "کاربران",
    href: "/admin/users",
    icon: Users,
    count: siteInfo?.totalUsers,
  },
  { name: "دسته‌بندی‌ها", href: "/admin/categories", icon: Grid3X3 },
  {
    name: "محصولات",
    href: "/admin/products",
    icon: Package,
    count: siteInfo?.totalProducts,
  },
  {
    name: "انیمه",
    href: "/admin/tags",
    icon: Film,
  },
  {
    name: "سفارشات",
    href: "/admin/orders",
    icon: ShoppingCart,
    count: siteInfo?.totalOrders,
    highlight: true,
  },
  {
    name: "سفارشات انجام نشده",
    href: "/admin/open-orders",
    icon: ShoppingBag,
  },
  {
    name: "نظرات کاربران",
    href: "/admin/comments",
    icon: MessageSquare,
    count: siteInfo?.totalComments,
  },
];

export function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [siteInfo, setSiteInfo] = useState<SiteInfo | undefined>(undefined);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch site info for badge counts
  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const response = await customFetch("/auth/site-info");
        const data = await response.json();
        setSiteInfo(data);
      } catch (error) {
        console.error("Error fetching site info:", error);
      }
    };

    if (mounted) {
      fetchSiteInfo();
    }
  }, [mounted]);

  const navigation = getNavigationItems(siteInfo);

  if (!mounted) return null;

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
        onClick={() => setSidebarOpen(false)}
      >
        {/* Mobile Sidebar Panel */}
        <div
          className="fixed top-0 right-0 h-full w-3/4 max-w-sm bg-background border-l border-border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-base font-bold text-foreground">پنل مدیریت</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="h-[calc(100%-73px)]">
            <nav className="space-y-1 p-4" dir="rtl">
              <div className="pb-3">
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                    prefetch={false}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex items-center">
                      <item.icon
                        className={cn(
                          "ml-3 h-5 w-5",
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.count && (
                      <Badge
                        variant={item.highlight ? "destructive" : "secondary"}
                        className={cn(
                          "font-medium",
                          item.highlight
                            ? "bg-destructive text-destructive-foreground"
                            : isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground"
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
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:right-0 lg:top-16 lg:bottom-0 z-30">
        <div className="flex flex-col flex-grow bg-background border-l border-border">
          <ScrollArea className="flex-1 px-4 py-4">
            <nav className="space-y-1" dir="rtl">
              {/* …"بازگشت به سایت" link… */}

              <div className="pt-2 pb-3">
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                          prefetch={false}
                          className={cn(
                            "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center">
                            <item.icon
                              className={cn(
                                "ml-3 h-5 w-5",
                                isActive
                                  ? "text-primary-foreground"
                                  : "text-muted-foreground group-hover:text-foreground"
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
                                "font-medium",
                                item.highlight
                                  ? "bg-destructive text-destructive-foreground"
                                  : isActive
                                  ? "bg-primary-foreground/20 text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {item.count}
                            </Badge>
                          )}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="left">{item.name}</TooltipContent>
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
      {!sidebarOpen && (
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="fixed bottom-6 left-6 z-40 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-full h-14 w-14 p-0"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      )}
    </>
  );
}
