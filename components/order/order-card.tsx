"use client";

import { useRouter } from "next/navigation";
import { Package, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
import { formatPriceDivided } from "@/lib/format-price";

interface OrderItem {
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
  status: string;
  totalPrice?: number;
  finalPrice?: number;
  items: OrderItem[];
  id: string;
  date: string;
  total: number;
}

interface OrderCardProps {
  order: Order;
  variant?: "compact" | "detailed";
  showProductPreview?: boolean;
  maxProducts?: number;
}

export function OrderCard({ order, variant = "detailed" }: OrderCardProps) {
  const router = useRouter();

  if (variant === "compact") {
    return (
      <div className="group relative bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="text-sm font-mono font-semibold text-white">
                    #{order.id.slice(0, 8)}
                  </span>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                {order.date}
              </p>
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
            {/* Products Count */}
            <div className="bg-muted/30 rounded-xl p-3 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">تعداد محصولات</p>
              <p className="text-lg font-bold text-foreground">
                {order.items.length} عدد
              </p>
            </div>

            {/* Total Price */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-3 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">مبلغ کل</p>
              <p className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {formatPriceDivided(order.total)}
              </p>
            </div>

            {/* Action Button - Full width on mobile */}
            <div className="col-span-2 md:col-span-1 flex items-end">
              <Button
                onClick={() => router.push(`/profile/orders/${order.id}`)}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
              >
                <span>مشاهده جزئیات</span>
                <svg
                  className="mr-2 h-4 w-4 transition-transform group-hover/btn:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Detailed variant (for profile page)
  return (
    <div className="group relative bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
                <Package className="h-4 w-4 text-primary" />
                <span className="text-sm font-mono font-semibold text-white">
                  #{order.id.slice(0, 8)}
                </span>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              {order.date}
            </p>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">مبلغ کل</p>
            <p className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {formatPriceDivided(order.total)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">وضعیت</p>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">تاریخ</p>
            <p className="text-lg font-semibold text-foreground">{order.date}</p>
          </div>
        </div>
        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={() => router.push(`/profile/orders/${order.id}`)}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
          >
            <span>مشاهده جزئیات</span>
            <svg
              className="mr-2 h-4 w-4 transition-transform group-hover/btn:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
