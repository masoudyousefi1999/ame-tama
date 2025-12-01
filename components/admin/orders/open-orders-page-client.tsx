"use client";

import { useState, useCallback, useMemo } from "react";
import { OpenOrdersTable } from "./open-orders-table";
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

export interface OpenOrder {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  totalPrice: number | null;
  finalPrice: number | null;
  status: string;
  items: OrderItem[];
  user: OrderUser;
}

interface OpenOrdersPageClientProps {
  initialOrders: OpenOrder[];
  initialTotal: number;
  initialPage: number;
  initialLimit: number;
}

export function OpenOrdersPageClient({
  initialOrders,
  initialTotal,
  initialPage,
  initialLimit,
}: OpenOrdersPageClientProps) {
  const [orders, setOrders] = useState<OpenOrder[]>(initialOrders);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialOrders.length < initialTotal
  );

  /**
   * Fetch more orders
   */
  const fetchMoreOrders = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const nextPage = page + 1;
      const queryParams = new URLSearchParams({
        page: String(nextPage),
        limit: String(initialLimit),
        status: "open",
      });

      const response = await customFetch(
        `/order/all?${queryParams.toString()}`,
        {
          method: "GET",
          next: { tags: ["orders", "open-orders"], revalidate: 60 },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch more orders");
      }

      const result = await response.json();
      const newOrders = result.orders || [];
      const newTotal = result.totalCount || result.orders?.length || 0;

      if (newOrders.length > 0) {
        setOrders((prev) => {
          const updatedOrders = [...prev, ...newOrders];
          setHasMore(updatedOrders.length < newTotal);
          return updatedOrders;
        });
        setPage(nextPage);
        setTotal(newTotal);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more orders:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, initialLimit, isLoading, hasMore]);

  /**
   * Infinite scroll observer
   */
  const { lastElementRef } = useInfiniteScroll({
    onLoadMore: fetchMoreOrders,
    hasMore,
    isLoading,
  });

  /**
   * Table data
   */
  const tableData = useMemo(
    () => ({
      orders,
      total,
      page,
      limit: initialLimit,
    }),
    [orders, total, page, initialLimit]
  );

  return (
    <div className="space-y-4" dir="rtl">
      <OpenOrdersTable data={tableData} />

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div
          ref={lastElementRef}
          className="flex justify-center py-4"
          style={{ minHeight: "1px" }}
        >
          {isLoading && (
            <div className="text-sm text-muted-foreground">
              در حال بارگذاری...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

