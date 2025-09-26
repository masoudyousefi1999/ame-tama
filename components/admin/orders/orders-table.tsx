"use client";

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
import { Eye } from "lucide-react";
import { OrderStatusBadge } from "@/components/order/order-status-badge";

interface Order {
  id: string;
  user: string;
  totalPrice: number;
  finalPrice: number;
  status: string;
  createdAt: string;
}

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="overflow-hidden" dir="rtl">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 dark:border-gray-700">
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                شناسه سفارش
              </TableHead>
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                مشتری
              </TableHead>
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                قیمت کل
              </TableHead>
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                قیمت نهایی
              </TableHead>
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                وضعیت
              </TableHead>
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                تاریخ ایجاد
              </TableHead>
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium text-left">
                عملیات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow
                key={order.id}
                className={`border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50/50 dark:bg-gray-700/25"
                }`}
              >
                <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                  #{order.id}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  {order.user}
                </TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                  ${order.totalPrice.toLocaleString("fa-IR")}
                </TableCell>
                <TableCell className="font-semibold text-green-600 dark:text-green-400">
                  ${order.finalPrice.toLocaleString("fa-IR")}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                </TableCell>
                <TableCell className="text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Link href={`/admin/orders/${order.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
