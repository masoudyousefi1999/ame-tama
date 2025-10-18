"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Settings, MapPin, ShoppingBag, LogOut } from "lucide-react";

import { useAuth } from "@/context/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomImage as Image } from "@/components/ui/custom-image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { customFetch } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { OrderCard } from "@/components/order/order-card";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // اگر کاربر وارد نشده باشد، به صفحه اصلی هدایت می‌شود
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!isLoading && user) {
      (async () => {
        setIsLoadingOrders(true);
        try {
          const response = await customFetch("/order/history");
          const data = await response.json();
          if (response.ok && data.orders) {
            const transformed = data.orders.map((order: any) => ({
              ...order,
              id: order.uuid,
              date: new Date(order.createdAt).toLocaleDateString("fa-IR"),
              total: order.finalPrice || order.totalPrice,
            }));
            setOrders(transformed);
          } else {
            setOrders([]);
          }
        } catch {
          setOrders([]);
        } finally {
          setIsLoadingOrders(false);
        }
      })();
    }
  }, [user, isLoading]);

  // اگر در حال بارگذاری است یا کاربر وارد نشده، چیزی نمایش نمی‌دهیم
  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-24 lg:mt-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 pt-6">
        <Breadcrumb
          items={[{ label: "پروفایل من", href: "/profile", isCurrent: true }]}
          className="mb-6"
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-16 lg:py-24 overflow-hidden">
        {/* Animated background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900" />

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-purple-500/30 animate-pulse" />

        {/* Floating orbs */}
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-28 h-28 bg-purple-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        />
        <div
          className="absolute bottom-32 right-20 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        />

        {/* Radial gradients for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.4),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.4),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.3),transparent_50%)]" />

        {/* Animated mesh gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/10 to-transparent animate-pulse"
          style={{ animationDuration: "6s" }}
        />

        {/* Top overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            پروفایل من
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium">
            مدیریت حساب کاربری و سفارش‌های شما
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 mt-12">
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
                    prefetch={false}
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
                      aria-label="تنظیمات پروفایل"
                      prefetch={false}
                    >
                      <l.icon className="h-4 w-4 ml-2" />
                      {l.label}
                    </Link>
                  ))}

                  <button
                    onClick={logout}
                    className="flex items-center w-full text-right p-2 rounded-lg hover:bg-muted transition-colors text-destructive"
                    aria-label="خروج از حساب کاربری"
                  >
                    <LogOut className="h-4 w-4 ml-2" />
                    خروج از حساب کاربری
                  </button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* ----------- Main: recent orders ----------- */}
          <section className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>سفارش‌های اخیر</CardTitle>
                <CardDescription>لیست ۳ سفارش آخر شما</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : orders.length === 0 ? (
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
                      <ShoppingBag className="ml-2 h-5 w-5" />
                      رفتن به فروشگاه
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      {orders.slice(0, 3).map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          variant="compact"
                        />
                      ))}
                    </div>
                    <div className="mt-8 text-center">
                      <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full border-border hover:bg-accent hover:text-accent-foreground"
                        onClick={() => router.push("/profile/orders")}
                      >
                        مشاهده همه سفارش‌ها
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
