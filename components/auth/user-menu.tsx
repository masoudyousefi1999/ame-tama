"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import LoginModal from "@/components/auth/login-modal";
import { useLoginModal } from "@/context/login-modal-context";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/context/cart-context";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const { isLoginModalOpen, openLoginModal, closeLoginModal } = useLoginModal();
  const [isOpen, setIsOpen] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  // Always listen for mousedown (bubble phase)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        parentRef.current &&
        !parentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown on navigation
  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false);
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    clearCart(); // Clear cart on logout
    setIsOpen(false);
    toast({
      variant: "success",
      title: "خروج موفقیت‌آمیز",
      description: "شما با موفقیت از حساب کاربری خارج شدید.",
    });
  };

  const handleLoginSuccess = () => {
    // Auth context will update and this component will re-render
  };

  if (!user) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={openLoginModal}
          className="hidden md:flex"
        >
          <User className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={openLoginModal}
          className="md:hidden"
          aria-label="ورود / ثبت‌نام"
        >
          <User className="h-5 w-5" />
        </Button>
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={closeLoginModal}
          onSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  return (
    <div ref={parentRef} className="relative" dir="rtl">
      <Button
        variant="ghost"
        size="icon"
        aria-label="منوی کاربر"
        className="rounded-full overflow-hidden border-2 border-border h-9 w-9 box-border"
        onClick={() => setIsOpen((open) => !open)}
      >
        <div className="relative h-[36px] w-[36px]">
          <Image
            src={
              typeof user.avatar === "string" && user.avatar.trim() !== ""
                ? user.avatar
                : "/placeholder.svg?height=40&width=40"
            }
            alt={`${user.firstName || "کاربر"} ${user.lastName || ""}`}
            fill
            sizes="36px"
            priority
            className="object-cover"
          />
        </div>
      </Button>
      {/* Dropdown menu, always rendered, visibility toggled by isOpen */}
      <div
        className={cn(
          "dropdown-menu absolute mt-2 w-64 sm:w-72 max-w-xs sm:max-w-sm rounded-2xl shadow-2xl z-50 overflow-hidden transition-all duration-300 origin-top",
          "bg-gradient-to-br from-gray-900/90 via-slate-900/80 to-indigo-900/90 backdrop-blur-xl border border-gray-700/60",
          "before:absolute before:inset-0 before:bg-gradient-to-tr before:from-purple-500/10 before:via-indigo-500/10 before:to-cyan-500/10 before:animate-pulse before:pointer-events-none",
          "px-2 sm:px-0",
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none",
          "right-0" // Ensure it's right-aligned for RTL
        )}
        style={{
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          maxWidth: "95vw",
          left: 0, // Force alignment to the right side
          right: "auto", // Ensures that the dropdown starts from the right side of the icon
        }}
      >
        {/* user info */}
        <div className="flex items-center gap-4 p-4 pb-2 bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-transparent">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-primary shadow-lg">
            <Image
              src={
                typeof user.avatar === "string" && user.avatar.trim() !== ""
                  ? user.avatar
                  : "/placeholder.svg?height=40&width=40"
              }
              alt={`${user.firstName || "کاربر"} ${user.lastName || ""}`}
              fill
              sizes="48px"
              priority
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-base mb-1 text-white drop-shadow">
              {user.firstName || "کاربر"} {user.lastName || ""}
            </p>
            <p className="truncate text-xs text-indigo-200/80">
              {user.email || ""}
            </p>
          </div>
        </div>
        <div className="my-2 border-t border-gray-700/60" />
        <ul className="py-1" role="none">
          <li>
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-white hover:bg-indigo-800/40 rounded-xl transition-colors duration-150 cursor-pointer"
              onClick={() => setIsOpen(false)}
              role="menuitem"
            >
              <User className="ml-2 h-4 w-4 text-indigo-300" />
              پروفایل من
            </Link>
          </li>
          <li>
            <Link
              href="/profile/orders"
              className="flex items-center px-4 py-2 text-sm text-white hover:bg-indigo-800/40 rounded-xl transition-colors duration-150 cursor-pointer"
              onClick={() => setIsOpen(false)}
              role="menuitem"
            >
              <ShoppingBag className="ml-2 h-4 w-4 text-indigo-300" />
              سفارش‌های من
            </Link>
          </li>
          <li>
            <Link
              href="/profile/wishlist"
              className="flex items-center px-4 py-2 text-sm text-white hover:bg-indigo-800/40 rounded-xl transition-colors duration-150 cursor-pointer"
              onClick={() => setIsOpen(false)}
              role="menuitem"
            >
              <Heart className="ml-2 h-4 w-4 text-indigo-300" />
              علاقه‌مندی‌ها
            </Link>
          </li>
          <li>
            <Link
              href="/profile/settings"
              className="flex items-center px-4 py-2 text-sm text-white hover:bg-indigo-800/40 rounded-xl transition-colors duration-150 cursor-pointer"
              onClick={() => setIsOpen(false)}
              role="menuitem"
            >
              <Settings className="ml-2 h-4 w-4 text-indigo-300" />
              تنظیمات
            </Link>
          </li>
        </ul>
        <div className="my-2 border-t border-gray-700/60" />
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 rounded-xl transition-colors duration-150 cursor-pointer"
          role="menuitem"
        >
          <LogOut className="ml-2 h-4 w-4 text-red-300" />
          خروج از حساب کاربری
        </button>
      </div>
    </div>
  );
}
