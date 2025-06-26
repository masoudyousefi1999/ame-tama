"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, LogOut, Settings, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import LoginModal from "@/components/auth/login-modal";

export default function UserMenu() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleLoginSuccess = () => {
    // This will be called when login is successful
    // The auth context should update and this component will re-render
  };

  if (!user) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsLoginModalOpen(true)}
          className="hidden md:flex font-vazirmatn"
        >
          <User className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsLoginModalOpen(true)}
          className="md:hidden"
          aria-label="ورود / ثبت‌نام"
        >
          <User className="h-5 w-5" />
        </Button>
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="منوی کاربر"
            className="rounded-full overflow-hidden border-2 border-border h-9 w-9 box-border"
          >
            <div className="relative h-[36px] w-[36px]">
              <Image
                src={user.avatar || "/placeholder.svg?height=40&width=40"}
                alt={`${user.firstName || "کاربر"} ${user.lastName || ""}`}
                fill
                sizes="36px"
                priority
                className="object-cover"
              />
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="fixed z-[100] w-56">
          {/* user info */}
          <div className="flex items-center p-2">
            <div className="relative h-10 w-10 mr-3 shrink-0 overflow-hidden rounded-full">
              <Image
                src={user.avatar || "/placeholder.svg?height=40&width=40"}
                alt={`${user.firstName || "کاربر"} ${user.lastName || ""}`}
                fill
                sizes="40px"
                priority
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium font-vazirmatn">
                {user.firstName || "کاربر"} {user.lastName || ""}
              </p>
              <p className="truncate text-xs text-muted-foreground font-vazirmatn">
                {user.email || ""}
              </p>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer font-vazirmatn">
              <User className="ml-2 h-4 w-4" />
              پروفایل من
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/profile/orders"
              className="cursor-pointer font-vazirmatn"
            >
              <ShoppingBag className="ml-2 h-4 w-4" />
              سفارش‌های من
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/profile/wishlist"
              className="cursor-pointer font-vazirmatn"
            >
              <Heart className="ml-2 h-4 w-4" />
              علاقه‌مندی‌ها
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/profile/settings"
              className="cursor-pointer font-vazirmatn"
            >
              <Settings className="ml-2 h-4 w-4" />
              تنظیمات
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600 dark:text-red-400 font-vazirmatn"
          >
            <LogOut className="ml-2 h-4 w-4" />
            خروج از حساب کاربری
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
