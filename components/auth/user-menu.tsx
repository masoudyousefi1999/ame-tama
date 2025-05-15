"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { User, LogOut, ShoppingBag, Heart, Settings, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"
import AuthModal from "@/components/auth/auth-modal"

export default function UserMenu() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // بستن منو با کلیک خارج از آن
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // تغییر وضعیت باز/بسته بودن منو
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // باز کردن مودال احراز هویت
  const openAuthModal = () => {
    setIsMenuOpen(false)
    setIsAuthModalOpen(true)
  }

  // خروج از حساب کاربری
  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* دکمه کاربر */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full relative"
        onClick={toggleMenu}
        aria-label="منوی کاربر"
      >
        {user ? (
          <div className="relative h-8 w-8 rounded-full overflow-hidden">
            <Image
              src={user.avatar || "/placeholder.svg?height=32&width=32"}
              alt={`${user.firstName} ${user.lastName}`}
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
        ) : (
          <User className="h-5 w-5" />
        )}
      </Button>

      {/* منوی کاربر */}
      <div
        className={cn(
          "absolute left-0 md:left-auto md:right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 transition-all duration-300 transform origin-top",
          isMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none",
        )}
      >
        {user ? (
          <>
            {/* هدر منو برای کاربر وارد شده */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={user.avatar || "/placeholder.svg?height=40&width=40"}
                    alt={`${user.firstName} ${user.lastName}`}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="mr-3">
                  <h4 className="text-sm font-medium font-vazirmatn">
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-vazirmatn">{user.email}</p>
                </div>
              </div>
            </div>

            {/* گزینه‌های منو */}
            <div className="py-2">
              <Link
                href="/profile"
                className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-vazirmatn"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserCircle className="h-4 w-4 ml-2 text-gray-500 dark:text-gray-400" />
                پروفایل من
              </Link>
              <Link
                href="/profile/orders"
                className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-vazirmatn"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag className="h-4 w-4 ml-2 text-gray-500 dark:text-gray-400" />
                سفارش‌های من
              </Link>
              <Link
                href="/profile/wishlist"
                className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-vazirmatn"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-4 w-4 ml-2 text-gray-500 dark:text-gray-400" />
                علاقه‌مندی‌ها
              </Link>
              <Link
                href="/profile/settings"
                className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-vazirmatn"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-4 w-4 ml-2 text-gray-500 dark:text-gray-400" />
                تنظیمات
              </Link>
              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
              <button
                className="flex items-center w-full text-right px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-vazirmatn"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 ml-2" />
                خروج از حساب کاربری
              </button>
            </div>
          </>
        ) : (
          <>
            {/* هدر منو برای کاربر وارد نشده */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-medium font-vazirmatn">حساب کاربری</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-vazirmatn">وارد شوید یا حساب جدید بسازید</p>
            </div>

            {/* گزینه‌های منو */}
            <div className="p-4 space-y-2">
              <Button
                className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
                onClick={openAuthModal}
              >
                ورود / ثبت‌نام
              </Button>
            </div>
          </>
        )}
      </div>

      {/* مودال احراز هویت */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}
