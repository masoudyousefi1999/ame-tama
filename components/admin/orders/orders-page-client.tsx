"use client";

import { useState, useCallback, useMemo } from "react";
import { OrdersTable } from "./orders-table";
import { customFetch } from "@/lib/utils";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

export interface OrderItem {
  createdAt: string;
  updatedAt: string;
  quantity: number;
  price: number | null;
  product: {
    createdAt: string;
    updatedAt: string;
    uuid: string;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    rating: number;
    productMedia: Array<{
      order: number;
      isDefault: boolean;
      url: string;
    }>;
  };
}

export interface OrderAddress {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  houseNumber: string;
  floorNumber: string;
  default: boolean;
}

export interface OrderUser {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string | null;
  phone: string;
  addresses: any[];
}

export interface Order {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  totalPrice: number | null;
  finalPrice: number | null;
  status: string;
  trackingCode?: string;
  items: OrderItem[];
  user: OrderUser;
}

interface OrdersPageClientProps {
  initialOrders: Order[];
  initialTotal: number;
  initialPage: number;
  initialLimit: number;
}

/**
 * Client-side component for admin orders page with infinite scroll
 */
export function OrdersPageClient({
  initialOrders,
  initialTotal,
  initialPage,
  initialLimit,
}: OrdersPageClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialOrders.length < initialTotal);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch more orders from the API
   */
  const fetchMoreOrders = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(initialLimit),
      });

      const response = await customFetch(`/order/all?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }

      const result = await response.json();
      const newOrders = result.orders || [];

      // Deduplicate orders based on uuid
      setOrders((prevOrders) => {
        const existingUuids = new Set(prevOrders.map((o) => o.uuid));
        const uniqueNewOrders = newOrders.filter(
          (o: Order) => !existingUuids.has(o.uuid)
        );

        if (uniqueNewOrders.length === 0) {
          setHasMore(false);
          return prevOrders;
        }

        return [...prevOrders, ...uniqueNewOrders];
      });

      setPage(nextPage);

      // Check if there are more orders to load
      const totalLoadedOrders = orders.length + newOrders.length;
      setHasMore(totalLoadedOrders < initialTotal && newOrders.length > 0);
    } catch (err) {
      console.error("Error fetching more orders:", err);
      setError(err instanceof Error ? err.message : "خطا در بارگذاری سفارشات");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, initialLimit, orders.length, initialTotal]);

  /**
   * Handle order update from child components
   */
  const handleOrderUpdate = useCallback((updatedOrder: Order) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.uuid === updatedOrder.uuid ? updatedOrder : order
      )
    );
  }, []);

  // Use the custom infinite scroll hook
  const { loaderRef } = useInfiniteScroll({
    onLoadMore: fetchMoreOrders,
    hasMore,
    isLoading,
    threshold: 0.1,
    rootMargin: "200px",
  });

  // Memoize data object to prevent unnecessary re-renders
  const tableData = useMemo(
    () => ({
      orders,
      total: initialTotal,
      page,
      limit: initialLimit,
    }),
    [orders, initialTotal, page, initialLimit]
  );

  return (
    <div className="space-y-4">
      <OrdersTable data={tableData} onOrderUpdated={handleOrderUpdate} />

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-8" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500" />
            <span className="text-sm text-gray-400">
              در حال بارگذاری سفارشات...
            </span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          className="flex justify-center items-center py-4 text-red-400"
          dir="rtl"
        >
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* No more data indicator */}
      {!hasMore && orders.length > 0 && !isLoading && (
        <div
          className="flex justify-center items-center py-6 text-gray-500"
          dir="rtl"
        >
          <span className="text-sm">تمام سفارشات نمایش داده شدند</span>
        </div>
      )}

      {/* Empty state */}
      {orders.length === 0 && !isLoading && (
        <div
          className="flex flex-col justify-center items-center py-16 text-gray-400"
          dir="rtl"
        >
          <span className="text-lg mb-2">سفارشی یافت نشد</span>
          <span className="text-sm">هنوز سفارشی ثبت نشده است</span>
        </div>
      )}

      {/* Infinite scroll loader element */}
      {hasMore && <div ref={loaderRef} className="h-10" />}
    </div>
  );
}
