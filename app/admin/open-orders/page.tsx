import { customFetch } from "@/lib/utils";
import { OpenOrdersPageClient } from "@/components/admin/orders/open-orders-page-client";
import { productLimit } from "@/lib/product-limit";

/**
 * Fetch open orders from the API
 */
async function getOpenOrders(
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

    const response = await customFetch(
      `/order/all?status=open&${queryParams.toString()}`,
      {
        next: { tags: ["orders", "open-orders", "admin"], revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch open orders: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      orders: result.orders || [],
      total: result.totalCount || result.orders?.length || 0,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching open orders:", error);
    return {
      orders: [],
      total: 0,
      page,
      limit,
    };
  }
}

export default async function OpenOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const page = Number.parseInt(params.page || "1", 10);
  const limit = Number.parseInt(params.limit || String(productLimit), 10);

  const data = await getOpenOrders(searchParams);

  return (
    <div className="space-y-4" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          سفارشات انجام نشده
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {data.total} سفارش باز
        </p>
      </div>

      <div className="bg-card/80 rounded-lg border border-border">
        <OpenOrdersPageClient
          initialOrders={data.orders}
          initialTotal={data.total}
          initialPage={page}
          initialLimit={limit}
        />
      </div>
    </div>
  );
}

