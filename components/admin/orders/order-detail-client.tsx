"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  Package,
  CreditCard,
  Calendar,
  Hash,
} from "lucide-react";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
import type { Order } from "./orders-page-client";
import { formatPrice, formatPriceDivided } from "@/lib/format-price";

interface OrderDetailClientProps {
  order: Order;
}

export function OrderDetailClient({ order }: OrderDetailClientProps) {
  /**
   * Calculate total price from order items
   */
  const calculateTotalPrice = (): number => {
    if (order.totalPrice !== null) return order.totalPrice;

    return order.items.reduce((total, item) => {
      const itemPrice = item.price || item.product.price;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  /**
   * Calculate final price
   */
  const calculateFinalPrice = (): number => {
    if (order.finalPrice !== null) return order.finalPrice;
    return calculateTotalPrice();
  };

  const totalPrice = calculateTotalPrice();
  const finalPrice = calculateFinalPrice();
  const discount = totalPrice - finalPrice;

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              جزئیات سفارش
            </h1>
            <Badge variant="outline" className="font-mono text-xs">
              #{order.uuid.substring(0, 8)}
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            مشاهده اطلاعات کامل سفارش
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Link>
        </Button>
      </div>

      {/* Order Status and Date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            وضعیت سفارش
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                وضعیت
              </p>
              <OrderStatusBadge status={order.status} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                تاریخ ایجاد
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                آخرین بروزرسانی
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="font-medium">
                  {new Date(order.updatedAt).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              اطلاعات مشتری
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                نام و نام خانوادگی
              </p>
              <p className="font-medium text-lg">
                {order.user.firstName} {order.user.lastName}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                شماره تماس
              </p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="font-mono font-medium">
                  {order.user.phone}
                </span>
              </div>
            </div>
            {order.user.email && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    ایمیل
                  </p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{order.user.email}</span>
                  </div>
                </div>
              </>
            )}
            <Separator />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                نقش کاربر
              </p>
              <Badge variant="secondary">{order.user.role}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              آدرس تحویل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.user.addresses.length > 0 ? (
              <>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    استان و شهر
                  </p>
                  <p className="font-medium">
                    {order.user.addresses[0].province} - {order.user.addresses[0].city}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    آدرس کامل
                  </p>
                  <p className="font-medium leading-relaxed">
                    {order.user.addresses[0].address}
                  </p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      پلاک
                    </p>
                    <p className="font-medium">{order.user.addresses[0].houseNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      طبقه
                    </p>
                    <p className="font-medium">{order.user.addresses[0].floorNumber}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    کد پستی
                  </p>
                  <p className="font-mono font-medium text-lg">
                    {order.user.addresses[0].postalCode}
                  </p>
                </div>
                {order.user.addresses[0].default && (
                  <>
                    <Separator />
                    <Badge variant="default" className="w-fit">
                      آدرس پیش‌فرض
                    </Badge>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400">
                  آدرسی ثبت نشده است
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            محصولات سفارش ({order.items.length} محصول)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => {
              const itemPrice = item.price || item.product.price;
              const itemTotal = itemPrice * item.quantity;

              return (
                <div key={index}>
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                      <Image
                        src={
                          item.product.productMedia?.[0]?.url ||
                          "/placeholder.svg"
                        }
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        کد محصول: {item.product.uuid.substring(0, 8)}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 dark:text-gray-400">
                            قیمت واحد:
                          </span>
                          <span className="font-medium">
                            {formatPrice(itemPrice)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 dark:text-gray-400">
                            تعداد:
                          </span>
                          <Badge variant="secondary">{item.quantity}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 dark:text-gray-400">
                            جمع:
                          </span>
                          <span className="font-bold text-green-600 dark:text-green-400">
                            {formatPriceDivided(itemTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < order.items.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Price Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            خلاصه مالی
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                جمع کل محصولات:
              </span>
              <span className="font-medium text-lg">
                {formatPrice(totalPrice)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between items-center text-red-600 dark:text-red-400">
                <span>تخفیف:</span>
                <span className="font-medium">
                  -{formatPrice(discount)}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                مبلغ نهایی:
              </span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatPrice(finalPrice)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
