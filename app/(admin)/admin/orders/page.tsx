import { OrdersPageClient } from "@/components/admin/orders/orders-page-client";
import { customFetch } from "@/lib/utils";
import { productLimit } from "@/lib/product-limit";

/**
 * Fetch orders from the API
 */
async function getOrders(
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>
) {
  const params = await searchParams;
  const page = Number.parseInt(params.page || "1", 10);
  const limit = Number.parseInt(params.limit || String(productLimit), 10);

  try {
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const response = await customFetch(`/order/all?${queryParams.toString()}`, {
      next: { tags: ["orders", "admin"], revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      orders: result.orders || [],
      total: result.totalCount || result.orders?.length || 0,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      orders: [],
      total: 0,
      page,
      limit,
    };
  }
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const page = Number.parseInt(params.page || "1", 10);
  const limit = Number.parseInt(params.limit || String(productLimit), 10);

  const data = await getOrders(searchParams);

  return (
    <div className="space-y-4" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-white">
          سفارشات
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {data.total} سفارش
        </p>
      </div>

      <div className="bg-gray-800/80 rounded-lg border border-gray-700">
        <OrdersPageClient
          initialOrders={data.orders}
          initialTotal={data.total}
          initialPage={page}
          initialLimit={limit}
        />
      </div>
    </div>
  );
}
