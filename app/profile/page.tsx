"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Settings,
  MapPin,
  ShoppingBag,
  LogOut,
  Package,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "@/context/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { customFetch } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const OrderStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "delivered":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/20 dark:text-green-400">
          <CheckCircle className="ml-1 h-3 w-3" />
          تحویل شده
        </Badge>
      );
    case "processing":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800/20 dark:text-blue-400">
          <Clock className="ml-1 h-3 w-3" />
          در حال پردازش
        </Badge>
      );
    case "shipped":
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-800/20 dark:text-purple-400">
          <Truck className="ml-1 h-3 w-3" />
          ارسال شده
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800/20 dark:text-red-400">
          <AlertCircle className="ml-1 h-3 w-3" />
          لغو شده
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          <Clock className="ml-1 h-3 w-3" />
          نامشخص
        </Badge>
      );
  }
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fa-IR").format(price) + " تومان";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-24 mt-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 mt-8">
        <Breadcrumb
          items={[{ label: "پروفایل من", href: "/profile", isCurrent: true }]}
          className="mb-6"
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
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
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-medium">
            مدیریت حساب کاربری و سفارش‌های شما
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="relative h-16 w-16">
              <Image
                src={user.avatar || "/placeholder.svg?height=64&width=64"}
                alt={`${user.firstName} ${user.lastName}`}
                fill
                className="object-cover rounded-full border-4 border-white/20"
                sizes="64px"
              />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-white/80">{user.email}</p>
            </div>
          </div>
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
                       prefetch={false}
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
                        <Card key={order.id} className="overflow-hidden">
                          <CardHeader className="bg-muted/50">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div>
                                <CardTitle className="text-lg">
                                  سفارش #{order.id.slice(0, 8)}
                                </CardTitle>
                                <CardDescription>
                                  {order.date} • {order.items.length} محصول
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-4">
                                <OrderStatusBadge status={order.status} />
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                  مبلغ کل
                                </p>
                                <p className="text-lg font-semibold">
                                  {formatPrice(order.total)}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                  وضعیت
                                </p>
                                <OrderStatusBadge status={order.status} />
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                  تاریخ
                                </p>
                                <p className="text-lg font-semibold">
                                  {order.date}
                                </p>
                              </div>
                            </div>
                            {/* Order items preview */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {order.items
                                .slice(0, 3)
                                .map((item: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                                  >
                                    <div className="relative h-12 w-12 flex-shrink-0">
                                      <img
                                        src={
                                          item.product.productMedia.find(
                                            (m: any) => m.isDefault
                                          )?.url || "/placeholder.svg"
                                        }
                                        alt={item.product.name}
                                        className="object-cover rounded-md"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">
                                        {item.product.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {item.quantity} عدد
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              {order.items.length > 3 && (
                                <div className="flex items-center justify-center p-3 bg-muted/30 rounded-lg">
                                  <p className="text-sm text-muted-foreground">
                                    +{order.items.length - 3} محصول دیگر
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
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
