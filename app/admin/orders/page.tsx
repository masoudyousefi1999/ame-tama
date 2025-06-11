import { OrdersTable } from "@/components/admin/orders/orders-table"

// This would fetch from your API
async function getOrders() {
  // Simulate API call - replace with actual API call
  return [
    {
      id: "1",
      user: "جان دو",
      totalPrice: 199.99,
      finalPrice: 179.99,
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      user: "جین اسمیت",
      totalPrice: 299.99,
      finalPrice: 299.99,
      status: "shipped",
      createdAt: new Date().toISOString(),
    },
  ]
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6" dir="rtl">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-vazirmatn">سفارشات</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 font-vazirmatn">مدیریت سفارشات مشتریان و تحویل</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <OrdersTable orders={orders} />
      </div>
    </div>
  )
}
