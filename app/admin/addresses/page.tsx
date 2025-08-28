import { AddressesTable } from "@/components/admin/addresses/addresses-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

// This would fetch from your API
async function getAddresses() {
  // Simulate API call - replace with actual API call
  return [
    {
      id: "1",
      user: "جان دو",
      province: "تهران",
      city: "تهران",
      address: "خیابان ولیعصر",
      postalCode: "1234567890",
      houseNumber: "123",
      floorNumber: "2",
    },
    {
      id: "2",
      user: "جین اسمیت",
      province: "اصفهان",
      city: "اصفهان",
      address: "خیابان چهارباغ",
      postalCode: "8765432109",
      houseNumber: "456",
      floorNumber: "5",
    },
  ];
}

export default async function AddressesPage() {
  const addresses = await getAddresses();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            آدرس‌ها
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            مدیریت آدرس‌های مشتریان
          </p>
        </div>
        <Button
          asChild
          className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full"
        >
          <Link href="/admin/addresses/new"  prefetch={false}>
            <Plus className="ml-2 h-4 w-4" />
            افزودن آدرس
          </Link>
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <AddressesTable addresses={addresses} />
      </div>
    </div>
  );
}
