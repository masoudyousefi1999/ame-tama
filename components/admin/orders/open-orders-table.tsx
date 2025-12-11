"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, User, Phone, Mail } from "lucide-react";
import { formatPrice } from "@/lib/format-price";
import type { OpenOrder } from "./open-orders-page-client";
import Image from "@/components/ui/custom-image";

interface OpenOrdersTableProps {
  data: {
    orders: OpenOrder[];
    total: number;
    page: number;
    limit: number;
  };
}

export function OpenOrdersTable({ data }: OpenOrdersTableProps) {
  const { orders } = data;

  /**
   * Calculate total price from order items
   */
  const calculateTotalPrice = (order: OpenOrder): number => {
    if (order.totalPrice !== null) return order.totalPrice;

    return order.items.reduce((total, item) => {
      const itemPrice = item.price || item.product.price;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  /**
   * Get user full name
   */
  const getUserName = (order: OpenOrder): string => {
    return `${order.user.firstName} ${order.user.lastName}`;
  };

  /**
   * Get default product image
   */
  const getProductImage = (
    product: OpenOrder["items"][0]["product"]
  ): string => {
    const defaultMedia = product.productMedia?.find((media) => media.isDefault);
    return (
      defaultMedia?.url ||
      product.productMedia?.[0]?.url ||
      "/placeholder.svg?height=60&width=60"
    );
  };

  return (
    <div className="overflow-hidden" dir="rtl">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-right text-foreground">
                کاربر
              </TableHead>
              <TableHead className="text-right text-foreground">
                محصولات
              </TableHead>
              <TableHead className="text-right text-foreground">
                تعداد آیتم‌ها
              </TableHead>
              <TableHead className="text-right text-foreground">
                مجموع قیمت
              </TableHead>
              <TableHead className="text-right text-foreground">
                تاریخ
              </TableHead>
              <TableHead className="text-left text-foreground">
                عملیات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow className="border-border">
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  هیچ سفارش بازی یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const totalPrice = calculateTotalPrice(order);
                const itemsCount = order.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );

                return (
                  <TableRow
                    key={order.uuid}
                    className="border-border hover:bg-muted/30 transition-colors"
                  >
                    {/* User Info */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">
                            {getUserName(order)}
                          </span>
                        </div>
                        {order.user.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{order.user.phone}</span>
                          </div>
                        )}
                        {order.user.email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[200px]">
                              {order.user.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Products */}
                    <TableCell>
                      <div className="space-y-2 max-w-[400px]">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div
                            key={`${item.product.uuid}-${index}`}
                            className="flex items-center gap-3"
                          >
                            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                              <Image
                                src={getProductImage(item.product)}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {item.product.name}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>تعداد: {item.quantity}</span>
                                <span>•</span>
                                <span>
                                  {formatPrice(
                                    (item.price || item.product.price) *
                                      item.quantity
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            + {order.items.length - 3} محصول دیگر
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Items Count */}
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-muted text-muted-foreground"
                      >
                        {itemsCount} آیتم
                      </Badge>
                    </TableCell>

                    {/* Total Price */}
                    <TableCell className="text-right font-semibold text-foreground">
                      {formatPrice(totalPrice)}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="مشاهده جزئیات"
                        >
                          <Link href={`/admin/orders/${order.uuid}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
