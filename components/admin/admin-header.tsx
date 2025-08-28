"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, Moon, Settings, Sun, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function AdminHeader() {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: string; title: string; read: boolean }[]
  >([
    { id: "1", title: "سفارش جدید ثبت شد", read: false },
    { id: "2", title: "محصول جدید اضافه شد", read: false },
    { id: "3", title: "پیام جدید از پشتیبانی", read: true },
  ]);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-16 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white hidden sm:block">
              پنل مدیریت
            </h2>
          </div>

          <div
            className="flex items-center space-x-4 space-x-reverse"
            dir="rtl"
          >
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Sun className="h-5 w-5 text-yellow-500" />
                <span className="sr-only">تغییر تم</span>
              </Button>
            )}

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full h-9 w-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    اعلان‌ها
                  </h3>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                    >
                      علامت همه به عنوان خوانده شده
                    </Button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      اعلان جدیدی ندارید
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`p-3 cursor-pointer ${
                          !notification.read
                            ? "bg-purple-50 dark:bg-purple-900/20"
                            : ""
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3" dir="rtl">
                          <div
                            className={`h-2 w-2 mt-2 rounded-full flex-shrink-0 ${
                              !notification.read
                                ? "bg-purple-500"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              ۱۰ دقیقه پیش
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
                <DropdownMenuSeparator />
                <div className="p-2 text-center">
                  <Link
                    href="/admin/notifications"
                    prefetch={false}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                  >
                    مشاهده همه اعلان‌ها
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user?.avatar || ""}
                      alt={user?.firstName || "کاربر"}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                      {user?.firstName?.charAt(0)?.toUpperCase() || "ا"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col space-y-1" dir="rtl">
                    <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">
                      {user?.firstName || "کاربر سیستم"}
                    </p>
                    <p className="text-xs leading-none text-gray-500 dark:text-gray-400 mt-1">
                      {user?.email || "admin@example.com"}
                    </p>
                  </div>
                </div>
                <DropdownMenuItem className="p-3 cursor-pointer" dir="rtl">
                  <User className="ml-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span>پروفایل</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer" dir="rtl">
                  <Settings className="ml-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span>تنظیمات</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="p-3 cursor-pointer text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={logout}
                  dir="rtl"
                >
                  <LogOut className="ml-2 h-4 w-4" />
                  <span>خروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
