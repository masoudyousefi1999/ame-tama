"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export function AdminHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      logout();
      toast({
        title: "خروج موفقیت‌آمیز",
        description: "شما با موفقیت از پنل ادمین خارج شدید",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در خروج رخ داد",
        variant: "error",
      });
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-200 bg-background border-b",
        isScrolled ? "border-border shadow-lg" : "border-border/50",
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-3 group"
            prefetch={false}
          >
            <div className="p-2 bg-primary rounded-lg group-hover:bg-primary/90 transition-colors">
              <svg
                className="h-5 w-5 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-foreground">
                پنل مدیریت
              </h1>
              <p className="text-xs text-muted-foreground">AME-TAMA</p>
            </div>
          </Link>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* User Info */}
          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg border border-border">
              <div className="p-1.5 bg-primary rounded-full">
                <User className="h-3 w-3 text-primary-foreground" />
              </div>
              <div className="text-sm">
                <p className="text-foreground font-medium text-xs">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
          )}

          {/* Back to Site Button */}
          <Link href="/" prefetch={false}>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border bg-card hover:bg-muted text-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">بازگشت</span>
            </Button>
          </Link>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            size="sm"
            className="gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">خروج</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
