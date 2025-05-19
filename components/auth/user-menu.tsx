"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import AuthModal from "@/components/auth/auth-modal";

export default function UserMenu() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

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

  if (!user) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAuthModalOpen(true)}
          className="hidden md:flex font-vazirmatn"
        >
          <User className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsAuthModalOpen(true)}
          className="md:hidden"
          aria-label="ورود / ثبت‌نام"
        >
          <User className="h-5 w-5" />
        </Button>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 h-9 w-9 box-border"
            aria-label="منوی کاربر"
          >
            <div className="relative h-[36px] w-[36px]">
              <Image
                src={user.avatar || "/placeholder.svg?height=40&width=40"}
                alt={`${user.firstName} ${user.lastName}`}
                fill
                className="object-cover"
                sizes="36px"
                priority
              />
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 z-[100] fixed">
        <div className="flex items-center justify-start p-2">
  <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3 shrink-0">
    <Image
      src={user.avatar || "/placeholder.svg?height=40&width=40"}
      alt={`${user.firstName} ${user.lastName}`}
      fill
      className="object-cover"
      sizes="40px"
      priority
    />
  </div>
  <div className="min-w-0">
    <p className="font-medium truncate font-vazirmatn">
      {user.firstName} {user.lastName}
    </p>
    <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-vazirmatn">
      {user.email}
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
            className="text-red-600 dark:text-red-400 cursor-pointer font-vazirmatn"
          >
            <LogOut className="ml-2 h-4 w-4" />
            خروج از حساب کاربری
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
