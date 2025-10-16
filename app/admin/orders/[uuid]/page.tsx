import { notFound } from "next/navigation";
import { customFetch } from "@/lib/utils";
import { OrderDetailClient } from "@/components/admin/orders/order-detail-client";
import type { Order } from "@/components/admin/orders/orders-page-client";

/**
 * Fetch single order details from API
 */
async function getOrderDetails(uuid: string): Promise<Order | null> {
  try {
    const response = await customFetch(`/order/${uuid}`, {
      next: { tags: ["order", uuid], revalidate: 30 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    return null;
  }
}

interface OrderDetailPageProps {
  params: Promise<{ uuid: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { uuid } = await params;
  const order = await getOrderDetails(uuid);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6" dir="rtl">
      <OrderDetailClient order={order} />
    </div>
  );
}
