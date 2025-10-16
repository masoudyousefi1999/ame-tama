"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Package, Clock, ArrowRight, Truck, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { toast } from "@/components/ui/use-toast";
import { customFetch } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
import { formatPriceDivided } from "@/lib/format-price";

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

interface Order {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  totalPrice: number;
  finalPrice: number;
  status: string;
  items: ApiOrderItem[];
  trackingCode?: string;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);

  // Copy tracking link to clipboard
  const copyTrackingLink = async () => {
    if (!order?.trackingCode) return;
    
    const trackingUrl = `https://tracking.post.ir/?id=${order.trackingCode}`;
    
    try {
      await navigator.clipboard.writeText(trackingUrl);
      toast({
        title: "لینک کپی شد",
        description: "لینک رهگیری مرسوله به کلیپ‌بورد کپی شد",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast({
        title: "خطا در کپی کردن",
        description: "نمی‌توان لینک را کپی کرد",
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
      return;
    }

    if (user && params.uuid) {
      fetchOrderDetail();
    }
  }, [user, isLoading, params.uuid]);

  const fetchOrderDetail = async () => {
    try {
      setIsLoadingOrder(true);
      const response = await customFetch(`/order/${params.uuid}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data);
      } else {
        toast({
          title: "خطا در دریافت جزئیات سفارش",
          description: "سفارش مورد نظر یافت نشد",
          variant: "error",
        });
        router.push("/profile/orders");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast({
        title: "خطا در دریافت اطلاعات",
        description: "مشکلی در ارتباط با سرور رخ داد",
        variant: "error",
      });
      router.push("/profile/orders");
    } finally {
      setIsLoadingOrder(false);
    }
  };

  if (isLoading || !user) {
    return null;
  }

  if (isLoadingOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const totalPrice =
    order.totalPrice ||
    order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalPrice = order.finalPrice || totalPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-24 mt-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 mt-8">
        <Breadcrumb
          items={[
            { label: "پروفایل من", href: "/profile" },
            { label: "سفارش‌ها", href: "/profile/orders" },
            {
              label: `سفارش #${order.uuid.slice(0, 8)}`,
              href: `/profile/orders/${order.uuid}`,
              isCurrent: true,
            },
          ]}
          className="mb-6 mt-8"
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 mt-8">
        {/* Back Button */}
        <Button
          onClick={() => router.push("/profile/orders")}
          variant="ghost"
          className="mb-6 text-white hover:text-orange-400 hover:bg-white/10"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          بازگشت به لیست سفارشات
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-6 w-6" />
                  <h1 className="text-2xl font-bold">
                    سفارش #{order.uuid.slice(0, 8)}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          {/* Tracking Code Section */}
          <div className="bg-gray-800/80 rounded-2xl p-4 sm:p-6 mb-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl self-start sm:self-auto">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-2">
                  رهگیری مرسوله پستی
                </h3>
                {order.trackingCode ? (
                  <>
                    <p className="text-sm text-gray-400 mb-4">
                      برای پیگیری وضعیت ارسال مرسوله خود، روی دکمه زیر کلیک کنید
                    </p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="bg-gray-700/50 rounded-lg px-4 py-3 border border-gray-600 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">
                            کد رهگیری:
                          </span>
                          <button
                            onClick={copyTrackingLink}
                            className="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded hover:bg-gray-600/50"
                            title="کپی لینک رهگیری"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-white font-mono font-semibold break-all">
                          {order.trackingCode}
                        </span>
                      </div>
                      <a
                        href={`https://tracking.post.ir/?id=${order.trackingCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
                      >
                        <Truck className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          رهگیری مرسوله در سایت پست
                        </span>
                        <span className="sm:hidden">رهگیری در پست</span>
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="bg-gray-700/50 rounded-lg px-4 py-3 border border-gray-600 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="bg-yellow-500/20 p-2 rounded-lg self-start">
                          <Clock className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium">
                            هنوز مرسوله ارسال نشده است
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            به محض ارسال، کد رهگیری قابل نمایش خواهد بود
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="bg-gray-800/80 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <div className="h-1 w-1 rounded-full bg-orange-500"></div>
              محصولات سفارش
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-700/50 hover:bg-gray-700/80 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-orange-500"
                  onClick={() => router.push(`/product/${item.product.slug}`)}
                >
                  {/* Product Image */}
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-600 shadow-sm">
                    <img
                      src={
                        item.product.productMedia.find((m) => m.isDefault)
                          ?.url || "/placeholder.svg"
                      }
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold mb-2 line-clamp-2 text-white group-hover:text-orange-400 transition-colors">
                      {item.product.name}
                    </h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-white">
                          {item.quantity}
                        </span>
                        عدد
                      </span>
                      <span className="text-gray-600 hidden sm:inline">•</span>
                      <span className="font-semibold text-white">
                        {formatPriceDivided(item.price)}
                      </span>
                    </div>
                  </div>

                  {/* Total Price for Item */}
                  <div className="flex justify-between sm:block sm:text-right mt-2 sm:mt-0">
                    <span className="text-xs text-gray-400 sm:hidden">
                      جمع:
                    </span>
                    <p className="text-xs text-gray-400 mb-1 hidden sm:block">
                      جمع
                    </p>
                    <p className="text-base font-bold text-white">
                      {formatPriceDivided(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Price Summary */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <span className="text-gray-400 text-sm">تعداد اقلام:</span>
                    <span className="text-white font-semibold">
                      {order.items.length} محصول
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-white font-bold text-lg">
                      مبلغ کل سفارش:
                    </span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                      {formatPriceDivided(finalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
