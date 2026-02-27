import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { customFetch } from "@/lib/utils";
import Link from "next/link";
import {
  MessageSquare,
  Package,
  ShoppingCart,
  Users,
  FileText,
} from "lucide-react";

interface SiteInfo {
  totalUsers: number;
  totalComments: number;
  totalProducts: number;
  totalOrders: number;
  totalProductsInStock: number;
  totalBlogs: number;
}

async function getDashboardStats(): Promise<SiteInfo> {
  try {
    const data = await customFetch("/auth/site-info");
    const result = (await data.json()) as SiteInfo;
    return result as SiteInfo;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    // Return fallback data in case of error
    return {
      totalUsers: 0,
      totalComments: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalProductsInStock: 0,
      totalBlogs: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          داشبورد
        </h1>
        <p className="text-muted-foreground mt-1">خلاصه‌ای از وضعیت سیستم</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* کل کاربران */}
        <Link href="/admin/users">
          <Card className="bg-card/80 border-border hover:border-info/50 transition-colors cursor-pointer hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                کاربران
              </CardTitle>
              <div className="p-2 bg-info/10 rounded-lg">
                <Users className="h-4 w-4 text-info" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                کاربر ثبت شده
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* کل محصولات */}
        <Link href="/admin/products">
          <Card className="bg-card/80 border-border hover:border-success/50 transition-colors cursor-pointer hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                محصولات
              </CardTitle>
              <div className="p-2 bg-success/10 rounded-lg">
                <Package className="h-4 w-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalProducts}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.totalProductsInStock} محصول موجود
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* کل سفارشات */}
        <Link href="/admin/orders">
          <Card className="bg-card/80 border-border hover:border-warning/50 transition-colors cursor-pointer hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                سفارشات
              </CardTitle>
              <div className="p-2 bg-warning/10 rounded-lg">
                <ShoppingCart className="h-4 w-4 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                سفارش ثبت شده
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* کل نظرات */}
        <Link href="/admin/comments">
          <Card className="bg-card/80 border-border hover:border-primary/50 transition-colors cursor-pointer hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                نظرات
              </CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalComments}
              </div>
              <p className="text-xs text-muted-foreground mt-1">نظر ثبت شده</p>
            </CardContent>
          </Card>
        </Link>

        {/* کل بلاگ‌ها */}
        <Link href="#">
          <Card className="bg-card/80 border-border hover:border-info/50 transition-colors cursor-pointer hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                بلاگ‌ها
              </CardTitle>
              <div className="p-2 bg-info/10 rounded-lg">
                <FileText className="h-4 w-4 text-info" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalBlogs}
              </div>
              <p className="text-xs text-muted-foreground mt-1">بلاگ موجود</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
