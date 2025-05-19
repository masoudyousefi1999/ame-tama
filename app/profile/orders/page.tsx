"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Package, Truck, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { BackButton } from "@/components/ui/back-button"
import { ProductCard } from "@/components/product/product-card"

// Sample order data
const sampleOrders = [
  {
    id: "ORD-1234",
    date: "1402/08/15",
    total: 1250000,
    status: "delivered",
    items: [
      {
        id: 1,
        name: "هدفون بی سیم سونی WH-1000XM4",
        price: 850000,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 2,
        name: "شارژر وایرلس سامسونگ",
        price: 400000,
        quantity: 1,
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
    id: "ORD-5678",
    date: "1402/07/22",
    total: 3200000,
    status: "processing",
    items: [
      {
        id: 3,
        name: "لپ تاپ ایسوس ZenBook",
        price: 3200000,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    tracking: {
      carrier: "تیپاکس",
      number: "TRK456789123",
      updates: [{ date: "1402/07/23", status: "در حال پردازش", location: "انبار مرکزی" }],
    },
  },
  {
    id: "ORD-9012",
    date: "1402/06/10",
    total: 750000,
    status: "cancelled",
    items: [
      {
        id: 4,
        name: "اسپیکر بلوتوثی JBL",
        price: 750000,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    tracking: null,
  },
]

// Status badge component
const OrderStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "delivered":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/20 dark:text-green-400">
          <CheckCircle className="ml-1 h-3 w-3" />
          تحویل شده
        </Badge>
      )
    case "processing":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800/20 dark:text-blue-400">
          <Clock className="ml-1 h-3 w-3" />
          در حال پردازش
        </Badge>
      )
    case "shipped":
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-800/20 dark:text-purple-400">
          <Truck className="ml-1 h-3 w-3" />
          ارسال شده
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800/20 dark:text-red-400">
          <AlertCircle className="ml-1 h-3 w-3" />
          لغو شده
        </Badge>
      )
    default:
      return (
        <Badge variant="outline">
          <Clock className="ml-1 h-3 w-3" />
          نامشخص
        </Badge>
      )
  }
}

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان"
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [orders, setOrders] = useState(sampleOrders)
  const [selectedOrder, setSelectedOrder] = useState<(typeof sampleOrders)[0] | null>(null)

  // اگر کاربر وارد نشده باشد، به صفحه اصلی هدایت می‌شود
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  // اگر در حال بارگذاری است یا کاربر وارد نشده، چیزی نمایش نمی‌دهیم
  if (isLoading || !user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <BackButton href="/profile" label="بازگشت به پروفایل" />
        </div>
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
            <Card>
              <CardHeader>
                <CardTitle className="font-vazirmatn">تاریخچه سفارش‌ها</CardTitle>
                <CardDescription className="font-vazirmatn">لیست سفارش‌های شما و وضعیت آن‌ها</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-vazirmatn">شماره سفارش</TableHead>
                        <TableHead className="font-vazirmatn">تاریخ</TableHead>
                        <TableHead className="font-vazirmatn">مبلغ کل</TableHead>
                        <TableHead className="font-vazirmatn">وضعیت</TableHead>
                        <TableHead className="font-vazirmatn">عملیات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium font-vazirmatn">{order.id}</TableCell>
                          <TableCell className="font-vazirmatn">{order.date}</TableCell>
                          <TableCell className="font-vazirmatn">{formatPrice(order.total)}</TableCell>
                          <TableCell>
                            <OrderStatusBadge status={order.status} />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="font-vazirmatn"
                              onClick={() => setSelectedOrder(order)}
                            >
                              مشاهده جزئیات
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {selectedOrder && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="font-vazirmatn">جزئیات سفارش {selectedOrder.id}</CardTitle>
                    <OrderStatusBadge status={selectedOrder.status} />
                  </div>
                  <CardDescription className="font-vazirmatn">تاریخ سفارش: {selectedOrder.date}</CardDescription>
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

                    <TabsContent value="items">
                      <div className="space-y-4">
                        {selectedOrder.items.map((item) => (
                          <ProductCard
                            key={item.id}
                            product={{
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              image: item.image,
                            }}
                            variant="order"
                            showAddToCart={false}
                            showAddToWishlist={false}
                          />
                        ))}

                        <div className="pt-4 border-t mt-6">
                          <div className="flex justify-between items-center">
                            <span className="font-medium font-vazirmatn">مجموع:</span>
                            <span className="font-bold font-vazirmatn">{formatPrice(selectedOrder.total)}</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="tracking">
                      {selectedOrder.tracking ? (
                        <div className="space-y-4">
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <p className="font-vazirmatn">
                              <span className="font-medium ml-2">شرکت پستی:</span>
                              {selectedOrder.tracking.carrier}
                            </p>
                            <p className="font-vazirmatn">
                              <span className="font-medium ml-2">کد رهگیری:</span>
                              {selectedOrder.tracking.number}
                            </p>
                          </div>

                          <div className="relative border-r pr-6 mr-3 space-y-6 py-2">
                            {selectedOrder.tracking.updates.map((update, index) => (
                              <div key={index} className="relative">
                                <div className="absolute right-[-28px] top-0 h-4 w-4 rounded-full bg-purple-600"></div>
                                <div
                                  className={`absolute right-[-24px] top-4 h-full w-[2px] ${
                                    index === selectedOrder.tracking.updates.length - 1
                                      ? "bg-transparent"
                                      : "bg-purple-600"
                                  }`}
                                ></div>
                                <div className="mb-1 font-vazirmatn">{update.date}</div>
                                <div className="font-medium font-vazirmatn">{update.status}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">
                                  {update.location}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <AlertCircle className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                          <h3 className="text-lg font-medium mb-2 font-vazirmatn">اطلاعات ارسال موجود نیست</h3>
                          <p className="text-gray-500 dark:text-gray-400 font-vazirmatn">
                            این سفارش هنوز ارسال نشده یا اطلاعات ارسال آن ثبت نشده است
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
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium mb-2 font-vazirmatn">هنوز سفارشی ثبت نکرده‌اید</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 font-vazirmatn">
                به فروشگاه بروید و اولین سفارش خود را ثبت کنید
              </p>
              <Button
                className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
                onClick={() => router.push("/shop")}
              >
                <Package className="ml-2 h-4 w-4" />
                رفتن به فروشگاه
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
