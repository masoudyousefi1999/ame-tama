import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function OrderNotFound() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center p-4"
      dir="rtl"
    >
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                سفارش یافت نشد
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                سفارش مورد نظر شما وجود ندارد یا حذف شده است.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/admin/orders">
                <ArrowLeft className="ml-2 h-4 w-4" />
                بازگشت به لیست سفارشات
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
