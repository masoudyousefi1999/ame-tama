"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Clock, Truck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BackButton } from "@/components/ui/back-button";
import { toast } from "@/components/ui/use-toast";
import { customFetch } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { OrderCard } from "@/components/order/order-card";
import GradientHero from "@/components/ui/gradient-hero";

// API Order interfaces
interface ApiOrderItem {
  createdAt: string;
  updatedAt: string;
  quantity: number;
  price: number;
  product: {
    createdAt: string;
    updatedAt: string;
    uuid: string;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    rating: number;
    productMedia: {
      order: number;
      isDefault: boolean;
      url: string;
    }[];
  };
}

interface ApiOrder {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  totalPrice: number;
  finalPrice: number;
  status: string;
  items: ApiOrderItem[];
}

// Extended order interface for UI compatibility
interface Order extends ApiOrder {
  id: string;
  date: string;
  total: number;
  tracking?: {
    carrier: string;
    number: string;
    updates: Array<{
      date: string;
      status: string;
      location: string;
    }>;
  } | null;
}

// Orders will be fetched from the backend API

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch orders from backend
  const fetchOrders = async (status?: string) => {
    try {
      setIsLoadingOrders(true);
      const url =
        status && status !== "all"
          ? `/order/history?status=${status}`
          : "/order/history";
      const response = await customFetch(url);
      const data = await response.json();

      if (response.ok && data.orders) {
        // Transform API orders to UI format
        const transformedOrders: Order[] = data.orders.map(
          (apiOrder: ApiOrder) => ({
            ...apiOrder,
            id: apiOrder.uuid,
            date: new Date(apiOrder.createdAt).toLocaleDateString("fa-IR"),
            total: apiOrder.finalPrice || apiOrder.totalPrice,
            tracking: null, // API doesn't provide tracking info yet
          })
        );

        setOrders(transformedOrders);
      } else {
        toast({
          title: "خطا در دریافت سفارشات",
          description: "مشکلی در دریافت سفارشات رخ داد",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "خطا در دریافت سفارشات",
        description: "مشکلی در ارتباط با سرور رخ داد",
        variant: "error",
      });
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // اگر کاربر وارد نشده باشد، به صفحه اصلی هدایت می‌شود
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    } else if (user) {
      fetchOrders();
    }
  }, [user, isLoading, router]);

  // Fetch orders when tab changes
  useEffect(() => {
    if (user && activeTab) {
      fetchOrders(activeTab);
    }
  }, [activeTab, user]);

  // اگر در حال بارگذاری است یا کاربر وارد نشده، چیزی نمایش نمی‌دهیم
  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:mt-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 mt-8">
        <Breadcrumb
          items={[
            { label: "پروفایل من", href: "/profile" },
            { label: "سفارش‌ها", href: "/profile/orders", isCurrent: true },
          ]}
          className="mb-6"
        />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <GradientHero
          title="سفارش‌های من"
          description="مدیریت و پیگیری سفارش‌های شما"
          stats={[
            { label: `${orders.length} سفارش` }
          ]}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 mt-12">
        {/* top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <BackButton href="/profile" label="بازگشت به پروفایل" />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          {/* ---------------------------------------------------------------- */}
          {/*  Tabs header                                                    */}
          {/* ---------------------------------------------------------------- */}
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 max-w-3xl mx-auto mb-8 bg-card/50 border border-border">
            {[
              { value: "all", icon: Package, label: "همه", mobileLabel: "همه" },
              {
                value: "confirmed",
                icon: CheckCircle,
                label: "تایید شده",
                mobileLabel: "تایید",
              },
              {
                value: "shipping",
                icon: Truck,
                label: "در حال ارسال",
                mobileLabel: "ارسال",
              },
              {
                value: "shipped",
                icon: Package,
                label: "ارسال شده",
                mobileLabel: "ارسال شده",
              },
              {
                value: "cancelled",
                icon: Clock,
                label: "لغو شده",
                mobileLabel: "لغو",
              },
            ].map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="flex items-center justify-center px-3 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <t.icon className="ml-2 h-4 w-4" />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden text-xs">{t.mobileLabel}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ================================================================ */}
          {/*  Tab content                                                    */}
          {/* ================================================================ */}
          {["all", "confirmed", "shipping", "shipped", "cancelled"].map(
            (tabValue) => (
              <TabsContent key={tabValue} value={tabValue}>
                {isLoadingOrders ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-6" dir="rtl">
                    {orders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        variant="compact"
                      />
                    ))}
                  </div>
                ) : (
                  /* empty-state */
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      هنوز سفارشی ثبت نکرده‌اید
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      به فروشگاه بروید و اولین سفارش خود را ثبت کنید
                    </p>
                    <Button
                      onClick={() => router.push("/shop")}
                      className="rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      <Package className="ml-2 h-4 w-4" />
                      رفتن به فروشگاه
                    </Button>
                  </div>
                )}
              </TabsContent>
            )
          )}
        </Tabs>
      </div>
    </div>
  );
}
