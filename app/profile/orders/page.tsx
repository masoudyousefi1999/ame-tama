"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Truck, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BackButton } from "@/components/ui/back-button";
import { ProductCard } from "@/components/product/product-card";
import { toast } from "@/components/ui/use-toast";

// Sample order data - updated to match API schema
const sampleOrders = [
  {
    createdAt: "2025-05-15T08:30:00.000Z",
    updatedAt: "2025-05-18T15:45:00.000Z",
    uuid: "order-58b1f289-be86-4344-8d07-3a55a01badbe",
    totalPrice: 1250000,
    finalPrice: 1125000,
    status: "delivered",
    // Additional fields for UI compatibility
    id: "ORD-1234",
    date: "1402/08/15",
    total: 1250000,
    items: [
      {
        createdAt: "2025-05-15T08:30:00.000Z",
        updatedAt: "2025-05-15T08:30:00.000Z",
        quantity: 1,
        price: 850000,
        product: {
          uuid: "prod-58b1f289-be86-4344-8d07-3a55a01badbe",
          name: "هدفون بی سیم سونی WH-1000XM4",
          slug: "sony-wh-1000xm4-wireless-headphones",
          price: 850000,
          detail: {
            series: "سونی",
            character: "هدفون",
            description: "هدفون بی سیم با کیفیت بالا",
          },
          category: {
            id: 13,
            name: "لوازم جانبی",
            slug: "accessories",
          },
          productMedia: [
            {
              order: 1,
              isDefault: true,
              url: "/placeholder.svg?height=80&width=80",
            },
          ],
        },
        // Additional fields for UI compatibility
        id: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        createdAt: "2025-05-15T08:30:00.000Z",
        updatedAt: "2025-05-15T08:30:00.000Z",
        quantity: 1,
        price: 400000,
        product: {
          uuid: "prod-7c877e90-bcc0-4fe6-8d5d-8fcae85f0066",
          name: "شارژر وایرلس سامسونگ",
          slug: "samsung-wireless-charger",
          price: 400000,
          detail: {
            series: "سامسونگ",
            character: "شارژر",
            description: "شارژر وایرلس با کیفیت بالا",
          },
          category: {
            id: 13,
            name: "لوازم جانبی",
            slug: "accessories",
          },
          productMedia: [
            {
              order: 1,
              isDefault: true,
              url: "/placeholder.svg?height=80&width=80",
            },
          ],
        },
        // Additional fields for UI compatibility
        id: 2,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    tracking: {
      carrier: "پست پیشتاز",
      number: "TRK789456123",
      updates: [
        { date: "1402/08/15", status: "تحویل داده شد", location: "تهران" },
        { date: "1402/08/14", status: "در حال تحویل", location: "تهران" },
        { date: "1402/08/12", status: "ارسال شده", location: "اصفهان" },
      ],
    },
  },
  {
    createdAt: "2025-05-10T14:20:00.000Z",
    updatedAt: "2025-05-12T10:30:00.000Z",
    uuid: "order-8d988f91-cdd1-5fe7-9e6e-9fdaf96f0077",
    totalPrice: 3200000,
    finalPrice: 3000000,
    status: "processing",
    // Additional fields for UI compatibility
    id: "ORD-5678",
    date: "1402/07/22",
    total: 3200000,
    items: [
      {
        createdAt: "2025-05-10T14:20:00.000Z",
        updatedAt: "2025-05-10T14:20:00.000Z",
        quantity: 1,
        price: 3200000,
        product: {
          uuid: "prod-8d988f91-cdd1-5fe7-9e6e-9fdaf96f0077",
          name: "لپ تاپ ایسوس ZenBook",
          slug: "asus-zenbook-laptop",
          price: 3200000,
          detail: {
            series: "ایسوس",
            character: "لپ‌تاپ",
            description: "لپ‌تاپ با کیفیت بالا",
          },
          category: {
            id: 13,
            name: "لوازم جانبی",
            slug: "accessories",
          },
          productMedia: [
            {
              order: 1,
              isDefault: true,
              url: "/placeholder.svg?height=80&width=80",
            },
          ],
        },
        // Additional fields for UI compatibility
        id: 3,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    tracking: {
      carrier: "تیپاکس",
      number: "TRK456789123",
      updates: [
        {
          date: "1402/07/23",
          status: "در حال پردازش",
          location: "انبار مرکزی",
        },
      ],
    },
  },
  {
    createdAt: "2025-04-20T09:15:00.000Z",
    updatedAt: "2025-04-21T11:30:00.000Z",
    uuid: "order-9e099g02-dee2-6gf8-af7f-agfbga7g0088",
    totalPrice: 750000,
    finalPrice: null,
    status: "cancelled",
    // Additional fields for UI compatibility
    id: "ORD-9012",
    date: "1402/06/10",
    total: 750000,
    items: [
      {
        createdAt: "2025-04-20T09:15:00.000Z",
        updatedAt: "2025-04-20T09:15:00.000Z",
        quantity: 1,
        price: 750000,
        product: {
          uuid: "prod-9e099g02-dee2-6gf8-af7f-agfbga7g0088",
          name: "اسپیکر بلوتوثی JBL",
          slug: "jbl-bluetooth-speaker",
          price: 750000,
          detail: {
            series: "JBL",
            character: "اسپیکر",
            description: "اسپیکر بلوتوثی با کیفیت بالا",
          },
          category: {
            id: 13,
            name: "لوازم جانبی",
            slug: "accessories",
          },
          productMedia: [
            {
              order: 1,
              isDefault: true,
              url: "/placeholder.svg?height=80&width=80",
            },
          ],
        },
        // Additional fields for UI compatibility
        id: 4,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    tracking: null,
  },
];

// Status badge component
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

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState(sampleOrders);
  const [selectedOrder, setSelectedOrder] = useState<
    (typeof sampleOrders)[0] | null
  >(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // اگر کاربر وارد نشده باشد، به صفحه اصلی هدایت می‌شود
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // Load orders data
  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;

      setIsLoadingOrders(true);
      try {
        // Here you would normally fetch orders from your API
        // const fetchedOrders = await getOrdersByUserId(user.id)
        // setOrders(fetchedOrders)

        // For now, using sample data
        setOrders(sampleOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
        toast({
          title: "خطا در بارگذاری سفارش‌ها",
          description: "مشکلی در بارگذاری سفارش‌های شما رخ داد.",
          variant: "destructive",
        });
        setOrders([]);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    loadOrders();
  }, [user]);

  // اگر در حال بارگذاری است یا کاربر وارد نشده، چیزی نمایش نمی‌دهیم
  if (isLoading || !user) {
    return null;
  }

  const handleOrderSelect = (order: (typeof sampleOrders)[0]) => {
    try {
      setSelectedOrder(order);
    } catch (error) {
      toast({
        title: "خطا در نمایش جزئیات سفارش",
        description: "مشکلی در نمایش جزئیات سفارش رخ داد.",
        variant: "destructive",
      });
    }
  };

  /* …imports & sampleOrders unchanged… */

  // ———————————————————————————————————————————————————————————
  // Status badge (unchanged colors, still uses brand/utility scales)
  // ———————————————————————————————————————————————————————————
  const OrderStatusBadge = ({ status }: { status: string }) => {
    /* …same… */
  };

  // ———————————————————————————————————————————————————————————
  // Helpers & component start (unchanged)
  // ———————————————————————————————————————————————————————————

  return (
    <div className="container py-8 mt-20">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <BackButton href="/profile" label="بازگشت به پروفایل" />
        <Breadcrumb
          items={[
            { label: "پروفایل", href: "/profile" },
            { label: "سفارش‌های من", href: "/profile/orders", isCurrent: true },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        {orders.length > 0 ? (
          <>
            {/* ---------------- History table ---------------- */}
            <Card>
              <CardHeader>
                <CardTitle className="font-vazirmatn">
                  تاریخچه سفارش‌ها
                </CardTitle>
                <CardDescription className="font-vazirmatn">
                  لیست سفارش‌های شما و وضعیت آن‌ها
                </CardDescription>
              </CardHeader>

              <CardContent>
                {isLoadingOrders ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto" />
                    <p className="mt-2 text-sm text-muted-foreground font-vazirmatn">
                      در حال بارگذاری...
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-muted">
                        <TableRow>
                          {[
                            "شماره سفارش",
                            "تاریخ",
                            "مبلغ کل",
                            "وضعیت",
                            "عملیات",
                          ].map((h) => (
                            <TableHead key={h} className="font-vazirmatn">
                              {h}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium font-vazirmatn">
                              {order.id}
                            </TableCell>
                            <TableCell className="font-vazirmatn">
                              {order.date}
                            </TableCell>
                            <TableCell className="font-vazirmatn">
                              {formatPrice(order.total)}
                            </TableCell>
                            <TableCell>
                              <OrderStatusBadge status={order.status} />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                className="font-vazirmatn"
                                onClick={() => handleOrderSelect(order)}
                              >
                                مشاهده جزئیات
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ---------------- Selected order ---------------- */}
            {selectedOrder && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="font-vazirmatn">
                      جزئیات سفارش {selectedOrder.id}
                    </CardTitle>
                    <OrderStatusBadge status={selectedOrder.status} />
                  </div>
                  <CardDescription className="font-vazirmatn">
                    تاریخ سفارش: {selectedOrder.date}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Tabs defaultValue="items">
                    <TabsList className="mb-4">
                      <TabsTrigger value="items" className="font-vazirmatn">
                        <Package className="ml-2 h-4 w-4" />
                        اقلام سفارش
                      </TabsTrigger>
                      <TabsTrigger value="tracking" className="font-vazirmatn">
                        <Truck className="ml-2 h-4 w-4" />
                        پیگیری ارسال
                      </TabsTrigger>
                    </TabsList>

                    {/* ---------- Items tab ---------- */}
                    <TabsContent value="items">
                      <div className="space-y-4">
                        {selectedOrder.items.map((it) => (
                          <ProductCard
                            key={it.id}
                            product={{
                              id: it.id,
                              name: it.product.name,
                              price: it.price,
                              image: it.product.productMedia[0].url,
                            }}
                            variant="order"
                            showAddToCart={false}
                            showAddToWishlist={false}
                          />
                        ))}

                        <div className="pt-4 border-t border-border mt-6 flex justify-between">
                          <span className="font-medium font-vazirmatn">
                            مجموع:
                          </span>
                          <span className="font-bold font-vazirmatn">
                            {formatPrice(selectedOrder.total)}
                          </span>
                        </div>
                      </div>
                    </TabsContent>

                    {/* ---------- Tracking tab ---------- */}
                    <TabsContent value="tracking">
                      {selectedOrder.tracking ? (
                        <div className="space-y-4">
                          <div className="bg-muted p-4 rounded-lg">
                            <p className="font-vazirmatn">
                              <span className="font-medium ml-2">
                                شرکت پستی:
                              </span>
                              {selectedOrder.tracking.carrier}
                            </p>
                            <p className="font-vazirmatn">
                              <span className="font-medium ml-2">
                                کد رهگیری:
                              </span>
                              {selectedOrder.tracking.number}
                            </p>
                          </div>

                          <div className="relative border-r border-border pr-6 mr-3 space-y-6 py-2">
                            {selectedOrder.tracking.updates.map((u, i) => (
                              <div key={i} className="relative">
                                <div className="absolute right-[-28px] top-0 h-4 w-4 rounded-full bg-purple-600" />
                                <div
                                  className={`absolute right-[-24px] top-4 h-full w-[2px] ${
                                    i ===
                                    selectedOrder.tracking.updates.length - 1
                                      ? "bg-transparent"
                                      : "bg-purple-600"
                                  }`}
                                />
                                <div className="mb-1 font-vazirmatn">
                                  {u.date}
                                </div>
                                <div className="font-medium font-vazirmatn">
                                  {u.status}
                                </div>
                                <div className="text-sm text-muted-foreground font-vazirmatn">
                                  {u.location}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                          <h3 className="text-lg font-medium mb-2 font-vazirmatn">
                            اطلاعات ارسال موجود نیست
                          </h3>
                          <p className="text-muted-foreground font-vazirmatn">
                            این سفارش هنوز ارسال نشده یا اطلاعات ارسال آن ثبت
                            نشده است
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          /* ---------------- Empty state ---------------- */
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-medium mb-2 font-vazirmatn">
                هنوز سفارشی ثبت نکرده‌اید
              </h3>
              <p className="text-muted-foreground mb-6 font-vazirmatn">
                به فروشگاه بروید و اولین سفارش خود را ثبت کنید
              </p>
              <Button
                onClick={() => router.push("/shop")}
                className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
              >
                <Package className="ml-2 h-4 w-4" />
                رفتن به فروشگاه
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
