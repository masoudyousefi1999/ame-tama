"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Package, ExternalLink } from "lucide-react";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
import { OrderDetailModal } from "./order-detail-modal";
import type { Order } from "./orders-page-client";
import { formatPrice } from "@/lib/format-price";

interface OrdersTableProps {
  data: {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  };
  onOrderUpdated?: (updatedOrder: Order) => void;
}

export function OrdersTable({ data, onOrderUpdated }: OrdersTableProps) {
  const { orders } = data;
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Calculate total price from order items
   */
  const calculateTotalPrice = (order: Order): number => {
    if (order.totalPrice !== null) return order.totalPrice;

    return order.items.reduce((total, item) => {
      const itemPrice = item.price || item.product.price;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  /**
   * Calculate final price (same as total if not specified)
   */
  const calculateFinalPrice = (order: Order): number => {
    if (order.finalPrice !== null) return order.finalPrice;
    return calculateTotalPrice(order);
  };

  /**
   * Get user full name
   */
  const getUserName = (order: Order): string => {
    return `${order.user.firstName} ${order.user.lastName}`;
  };

  /**
   * Handle view order details
   */
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleOrderUpdate = (updatedOrder: Order) => {
    // Update the order in the local state
    const updatedOrders = orders.map((order) =>
      order.uuid === updatedOrder.uuid ? updatedOrder : order
    );

    // Update the data object
    data.orders = updatedOrders;

    // Notify parent component
    if (onOrderUpdated) {
      onOrderUpdated(updatedOrder);
    }

    // Update selected order if it's the same
    if (selectedOrder && selectedOrder.uuid === updatedOrder.uuid) {
      setSelectedOrder(updatedOrder);
    }
  };

  return (
    <div className="overflow-hidden" dir="rtl">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-transparent">
              <TableHead className="text-right text-gray-300">
                شناسه سفارش
              </TableHead>
              <TableHead className="text-right text-gray-300">مشتری</TableHead>
              <TableHead className="text-right text-gray-300">تلفن</TableHead>
              <TableHead className="text-right text-gray-300">
                تعداد محصولات
              </TableHead>
              <TableHead className="text-right text-gray-300">
                قیمت کل
              </TableHead>
              <TableHead className="text-right text-gray-300">
                قیمت نهایی
              </TableHead>
              <TableHead className="text-right text-gray-300">وضعیت</TableHead>
              <TableHead className="text-right text-gray-300">
                تاریخ ایجاد
              </TableHead>
              <TableHead className="text-left text-gray-300">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow className="border-gray-700">
                <TableCell
                  colSpan={9}
                  className="text-center py-12 text-gray-400"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Package className="h-12 w-12 text-gray-600" />
                    <span>سفارشی یافت نشد</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const totalPrice = calculateTotalPrice(order);
                const finalPrice = calculateFinalPrice(order);
                const userName = getUserName(order);

                return (
                  <TableRow
                    key={order.uuid}
                    className="border-gray-700 hover:bg-gray-700/30 transition-colors"
                  >
                    <TableCell className="text-right font-medium text-white">
                      <span className="text-xs">
                        #{order.uuid.substring(0, 8)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-gray-400">
                      {userName}
                    </TableCell>
                    <TableCell className="text-right text-gray-400 text-sm font-mono">
                      {order.user.phone}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="secondary"
                        className="font-medium bg-gray-700 text-gray-300 border-gray-600"
                      >
                        {order.items.length}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-white">
                      {formatPrice(totalPrice)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-400">
                      {formatPrice(finalPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                          className="hover:bg-gray-700 text-gray-300 hover:text-white"
                          title="مشاهده سریع"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="hover:bg-gray-700 text-gray-300 hover:text-white"
                          title="صفحه کامل"
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

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onOrderUpdated={handleOrderUpdate}
      />
    </div>
  );
}
