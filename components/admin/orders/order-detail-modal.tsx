"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Package,
  CreditCard,
  Calendar,
  ExternalLink,
  Edit3,
} from "lucide-react";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
import type { Order } from "./orders-page-client";
import { formatPrice, formatPriceDivided } from "@/lib/format-price";
import { OrderEditModal } from "./order-edit-modal";

interface OrderDetailModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderUpdated?: (updatedOrder: Order) => void;
}

export function OrderDetailModal({
  order,
  open,
  onOpenChange,
  onOrderUpdated,
}: OrderDetailModalProps) {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [currentOrder, setCurrentOrder] = React.useState<Order | null>(order);

  React.useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  const handleOrderUpdate = (updatedOrder: Order) => {
    setCurrentOrder(updatedOrder);
    if (onOrderUpdated) {
      onOrderUpdated(updatedOrder);
    }
  };

  if (!currentOrder) return null;

  const calculateTotalPrice = (): number => {
    if (currentOrder.totalPrice !== null) return currentOrder.totalPrice;
    return currentOrder.items.reduce((total, item) => {
      const itemPrice = item.price || item.product.price;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const calculateFinalPrice = (): number => {
    if (currentOrder.finalPrice !== null) return currentOrder.finalPrice;
    return calculateTotalPrice();
  };

  const totalPrice = calculateTotalPrice();
  const finalPrice = calculateFinalPrice();
  const discount = totalPrice - finalPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] w-[95vw] sm:w-full bg-gray-800 border-gray-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]"
        dir="rtl"
      >
        <DialogHeader className="pr-10">
          <DialogTitle className="flex items-center gap-3 text-white flex-wrap">
            <span>جزئیات سفارش</span>
            <Badge
              variant="outline"
              className="font-mono text-xs border-gray-600 text-gray-300"
            >
              #{currentOrder.uuid.substring(0, 8)}
            </Badge>
            <div className="flex items-center gap-2 mr-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 hover:text-orange-200 border border-orange-500/30 hover:border-orange-500/50"
              >
                <Edit3 className="h-4 w-4 ml-2" />
                ویرایش
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:bg-gray-700 text-gray-300"
                onClick={() => onOpenChange(false)}
              >
                <Link href={`/admin/orders/${currentOrder.uuid}`}>
                  <ExternalLink className="h-4 w-4 ml-2" />
                  صفحه کامل
                </Link>
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pl-4" dir="rtl">
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">وضعیت</p>
                  <OrderStatusBadge status={currentOrder.status} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">تاریخ ایجاد</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-sm font-medium text-white">
                      {new Date(currentOrder.createdAt).toLocaleDateString(
                        "fa-IR"
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">آخرین بروزرسانی</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-sm font-medium text-white">
                      {new Date(currentOrder.updatedAt).toLocaleDateString(
                        "fa-IR"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-600 rounded-lg p-3 sm:p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-white text-sm sm:text-base">
                  <User className="h-4 w-4" />
                  اطلاعات مشتری
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">نام و نام خانوادگی</p>
                    <p className="font-medium text-white">
                      {currentOrder.user.firstName} {currentOrder.user.lastName}
                    </p>
                  </div>
                  <Separator className="bg-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">شماره تماس</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span className="font-mono font-medium text-white">
                        {currentOrder.user.phone}
                      </span>
                    </div>
                  </div>
                  {currentOrder.user.email && (
                    <React.Fragment>
                      <Separator className="bg-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">ایمیل</p>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="font-medium text-xs break-all text-white">
                            {currentOrder.user.email}
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>

              <div className="border border-gray-600 rounded-lg p-3 sm:p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-white text-sm sm:text-base">
                  <MapPin className="h-4 w-4" />
                  آدرس تحویل
                </h3>
                {currentOrder.user.addresses ? (
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">استان و شهر</p>
                      <p className="font-medium text-white">
                        {currentOrder.user.addresses[0].province} -{" "}
                        {currentOrder.user.addresses[0].city}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs text-gray-500">آدرس کامل</p>
                      <p className="font-medium text-xs leading-relaxed text-white">
                        {currentOrder.user.addresses[0].address}
                      </p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">پلاک</p>
                        <p className="font-medium text-white">
                          {currentOrder.user.addresses[0].houseNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">طبقه</p>
                        <p className="font-medium text-white">
                          {currentOrder.user.addresses[0].floorNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">کد پستی</p>
                        <p className="font-mono font-medium text-xs text-white">
                          {currentOrder.user.addresses[0].postalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">آدرسی ثبت نشده است</p>
                  </div>
                )}
              </div>
            </div>

            <div className="border border-gray-600 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold flex items-center gap-2 mb-4 text-white text-sm sm:text-base">
                <Package className="h-4 w-4" />
                محصولات سفارش (
                {currentOrder.items.length.toLocaleString("fa-IR")} عدد)
              </h3>
              <div className="space-y-3">
                {currentOrder.items.map((item, index) => {
                  const itemPrice = item.price || item.product.price;
                  const itemTotal = itemPrice * item.quantity;

                  return (
                    <div key={index}>
                      <div className="flex gap-3">
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
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

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm mb-2 line-clamp-1 text-white">
                            {item.product.name}
                          </h4>
                          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500">قیمت واحد:</span>
                              <span className="font-medium text-white">
                                {formatPriceDivided(itemPrice)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500">تعداد:</span>
                              <Badge
                                variant="secondary"
                                className="h-5 text-xs bg-gray-700 text-gray-300 border-gray-600"
                              >
                                {item.quantity.toLocaleString("fa-IR")}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500">جمع:</span>
                              <span className="font-bold text-green-400">
                                {formatPriceDivided(itemTotal)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < currentOrder.items.length - 1 && (
                        <Separator className="mt-3 bg-gray-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold flex items-center gap-2 mb-3 text-white text-sm sm:text-base">
                <CreditCard className="h-4 w-4" />
                خلاصه مالی
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">جمع کل:</span>
                  <span className="font-medium text-white">
                    {formatPriceDivided(totalPrice)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-sm text-red-400">
                    <span>تخفیف:</span>
                    <span className="font-medium">
                      -{formatPriceDivided(discount)}
                    </span>
                  </div>
                )}
                <Separator className="bg-gray-600" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm sm:text-base">
                    مبلغ نهایی:
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-green-400">
                    {formatPriceDivided(finalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>

      {/* Edit Modal */}
      <OrderEditModal
        order={currentOrder}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onOrderUpdated={handleOrderUpdate}
      />
    </Dialog>
  );
}
