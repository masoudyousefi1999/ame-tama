"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, Settings, MapPin, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  // اگر کاربر وارد نشده باشد، به صفحه اصلی هدایت می‌شود
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // اگر در حال بارگذاری است یا کاربر وارد نشده، چیزی نمایش نمی‌دهیم
  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="container py-8 mt-20">
      <h1 className="text-2xl font-bold mb-8">پروفایل من</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ----------- Sidebar: user info & nav ----------- */}
        <aside className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="relative h-24 w-24 mx-auto mb-4">
                <Image
                  src={user.avatar || "/placeholder.svg?height=96&width=96"}
                  alt={`${user.firstName} ${user.lastName}`}
                  fill
                  className="object-cover rounded-full"
                  sizes="96px"
                />
              </div>
              <CardTitle>
                {user.firstName} {user.lastName}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>

            <CardContent>
              <nav className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center p-2 rounded-lg bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400"
                >
                  <ShoppingBag className="h-4 w-4 ml-2" />
                  سفارش‌های من
                </Link>

                {[
                  {
                    href: "/profile/wishlist",
                    icon: Heart,
                    label: "علاقه‌مندی‌ها",
                  },
                  {
                    href: "/profile/addresses",
                    icon: MapPin,
                    label: "آدرس‌های من",
                  },
                  {
                    href: "/profile/settings",
                    icon: Settings,
                    label: "تنظیمات حساب کاربری",
                  },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex items-center p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <l.icon className="h-4 w-4 ml-2" />
                    {l.label}
                  </Link>
                ))}

                <button
                  onClick={logout}
                  className="flex items-center w-full text-right p-2 rounded-lg hover:bg-muted transition-colors text-destructive"
                >
                  <LogOut className="h-4 w-4 ml-2" />
                  خروج از حساب کاربری
                </button>
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* ----------- Main: recent orders (empty state) ----------- */}
        <section className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>سفارش‌های اخیر</CardTitle>
              <CardDescription>لیست سفارش‌های اخیر شما</CardDescription>
            </CardHeader>

            <CardContent>
              {/* empty-state */}
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  هنوز سفارشی ثبت نکرده‌اید
                </h3>
                <p className="text-muted-foreground mb-6">
                  به فروشگاه بروید و اولین سفارش خود را ثبت کنید
                </p>
                <Button
                  onClick={() => router.push("/shop")}
                  className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                >
                  <ShoppingBag className="ml-2 h-4 w-4" />
                  رفتن به فروشگاه
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
