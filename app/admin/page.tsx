import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { customFetch } from "@/lib/utils";
import { MessageSquare, Package, ShoppingCart, Users } from "lucide-react";

interface SiteInfo {
  totalUsers: number;
  totalComments: number;
  totalProducts: number;
  totalOrders: number;
}

async function getDashboardStats(): Promise<SiteInfo> {
  try {
    const data = await customFetch("/auth/site-info");
    const result = (await data.json()) as SiteInfo;
    console.log(result);
    return result as SiteInfo;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    // Return fallback data in case of error
    return {
      totalUsers: 0,
      totalComments: 0,
      totalProducts: 0,
      totalOrders: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">داشبورد</h1>
        <p className="text-gray-400 mt-1">خلاصه‌ای از وضعیت سیستم</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* کل کاربران */}
        <Card className="bg-gray-800/80 border-gray-700 hover:border-blue-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              کاربران
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalUsers}
            </div>
            <p className="text-xs text-gray-500 mt-1">کاربر ثبت شده</p>
          </CardContent>
        </Card>

        {/* کل محصولات */}
        <Card className="bg-gray-800/80 border-gray-700 hover:border-green-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              محصولات
            </CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Package className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalProducts}
            </div>
            <p className="text-xs text-gray-500 mt-1">محصول موجود</p>
          </CardContent>
        </Card>

        {/* کل سفارشات */}
        <Card className="bg-gray-800/80 border-gray-700 hover:border-orange-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              سفارشات
            </CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalOrders}
            </div>
            <p className="text-xs text-gray-500 mt-1">سفارش ثبت شده</p>
          </CardContent>
        </Card>

        {/* کل نظرات */}
        <Card className="bg-gray-800/80 border-gray-700 hover:border-purple-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              نظرات
            </CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <MessageSquare className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalComments}
            </div>
            <p className="text-xs text-gray-500 mt-1">نظر ثبت شده</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
