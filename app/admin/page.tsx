import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react"

// This would typically fetch from your API
async function getDashboardStats() {
  // Simulate API call
  return {
    totalUsers: 1234,
    totalProducts: 567,
    totalOrders: 89,
    totalRevenue: 12345.67,
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6" dir="rtl">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-vazirmatn">داشبورد</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 font-vazirmatn">به پنل مدیریت خوش آمدید</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 font-vazirmatn">
              کل کاربران
            </CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white font-vazirmatn">
              {stats.totalUsers.toLocaleString("fa-IR")}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-vazirmatn">۱۲٪ افزایش نسبت به ماه گذشته</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 font-vazirmatn">
              کل محصولات
            </CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white font-vazirmatn">
              {stats.totalProducts.toLocaleString("fa-IR")}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-vazirmatn">۸٪ افزایش نسبت به ماه گذشته</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 font-vazirmatn">
              کل سفارشات
            </CardTitle>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white font-vazirmatn">
              {stats.totalOrders.toLocaleString("fa-IR")}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-vazirmatn">۲۳٪ افزایش نسبت به ماه گذشته</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 font-vazirmatn">
              کل درآمد
            </CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white font-vazirmatn">
              ${stats.totalRevenue.toLocaleString("fa-IR")}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-vazirmatn">۱۵٪ افزایش نسبت به ماه گذشته</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
