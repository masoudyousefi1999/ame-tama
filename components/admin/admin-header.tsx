"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export function AdminHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
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
      await logout();
      toast({
        title: "خروج موفقیت‌آمیز",
        description: "شما با موفقیت از پنل ادمین خارج شدید",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در خروج رخ داد",
        variant: "destructive",
      });
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-200 bg-gray-900 border-b",
        isScrolled ? "border-gray-800 shadow-lg" : "border-gray-800/50"
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
            <div className="p-2 bg-purple-600 rounded-lg group-hover:bg-purple-700 transition-colors">
              <svg
                className="h-5 w-5 text-white"
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
              <h1 className="text-base font-bold text-white">پنل مدیریت</h1>
              <p className="text-xs text-gray-500">AME-TAMA</p>
            </div>
          </Link>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* User Info */}
          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-1.5 bg-purple-600 rounded-full">
                <User className="h-3 w-3 text-white" />
              </div>
              <div className="text-sm">
                <p className="text-gray-200 font-medium text-xs">
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
              className="gap-2 border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">بازگشت</span>
            </Button>
          </Link>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            size="sm"
            className="gap-2 bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">خروج</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
