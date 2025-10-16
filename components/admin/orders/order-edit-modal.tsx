"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { customFetch } from "@/lib/utils";
import { Loader2, Edit3 } from "lucide-react";
import type { Order } from "./orders-page-client";

// Order status enum
export enum OrderStatusEnum {
  OPEN = "open",
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPING = "shipping",
  SHIPPED = "shipped",
  CANCELLED = "cancelled",
}

// Persian labels for status
const statusLabels: Record<OrderStatusEnum, string> = {
  [OrderStatusEnum.OPEN]: "باز",
  [OrderStatusEnum.PENDING]: "در انتظار",
  [OrderStatusEnum.CONFIRMED]: "تایید شده",
  [OrderStatusEnum.SHIPPING]: "در حال ارسال",
  [OrderStatusEnum.SHIPPED]: "ارسال شده",
  [OrderStatusEnum.CANCELLED]: "لغو شده",
};

interface OrderEditModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderUpdated?: (updatedOrder: Order) => void;
}

export function OrderEditModal({
  order,
  open,
  onOpenChange,
  onOrderUpdated,
}: OrderEditModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    status: "",
    trackingCode: "",
  });

  // Initialize form data when order changes
  React.useEffect(() => {
    if (order) {
      setFormData({
        status: order.status || "",
        trackingCode: order.trackingCode || "",
      });
    }
  }, [order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setIsLoading(true);
    try {
      const payload = {
        status: formData.status,
        trackingCode: formData.trackingCode || null,
      };

      const response = await customFetch(`/order/update/${order.uuid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "سفارش با موفقیت به‌روزرسانی شد",
          description: "تغییرات سفارش اعمال شد",
        });

        // Update the order in parent component
        if (onOrderUpdated) {
          const updatedOrder = {
            ...order,
            status: formData.status,
            trackingCode: formData.trackingCode,
          };
          onOrderUpdated(updatedOrder);
        }

        onOpenChange(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "خطا در به‌روزرسانی سفارش",
          description: errorData.message || "مشکلی در به‌روزرسانی سفارش رخ داد",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "خطا در به‌روزرسانی سفارش",
        description: "مشکلی در ارتباط با سرور رخ داد",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md bg-gray-800 border-gray-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]"
        dir="rtl"
      >
        <DialogHeader className="pr-10">
          <DialogTitle className="flex items-center gap-2 text-white flex-wrap">
            <Edit3 className="h-5 w-5" />
            ویرایش سفارش
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order ID */}
          <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
            <Label className="text-xs text-gray-400">شماره سفارش</Label>
            <div className="text-sm font-mono text-white">
              #{order.uuid.substring(0, 8)}
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm text-gray-300">
              وضعیت سفارش
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="انتخاب وضعیت" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="text-white hover:bg-gray-600 focus:bg-gray-600"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tracking Code */}
          <div className="space-y-2">
            <Label htmlFor="trackingCode" className="text-sm text-gray-300">
              کد رهگیری (اختیاری)
            </Label>
            <Input
              id="trackingCode"
              type="text"
              value={formData.trackingCode}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  trackingCode: e.target.value,
                }))
              }
              placeholder="کد رهگیری مرسوله"
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={isLoading}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 ml-2" />
                  ذخیره تغییرات
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
