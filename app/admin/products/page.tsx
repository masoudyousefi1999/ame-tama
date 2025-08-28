import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductsTable } from "@/components/admin/products/products-table";
import { ProductSearch } from "@/components/admin/products/product-search";

// This would fetch from your API
async function getProducts(searchParams: {
  page?: string;
  limit?: string;
  search?: string;
}) {
  const page = Number.parseInt(searchParams.page || "1");
  const limit = Number.parseInt(searchParams.limit || "10");
  const search = searchParams.search || "";

  // Simulate API call - replace with actual API call
  return {
    products: [
      {
        uuid: "1",
        name: "آیفون ۱۵ پرو",
        slug: "iphone-15-pro",
        price: 999.99,
        quantity: 50,
        category: "گوشی هوشمند",
        rating: 4.8,
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        uuid: "2",
        name: "سامسونگ گلکسی S24",
        slug: "samsung-galaxy-s24",
        price: 899.99,
        quantity: 30,
        category: "گوشی هوشمند",
        rating: 4.6,
        image: "/placeholder.svg?height=50&width=50",
      },
    ],
    total: 2,
    page,
    limit,
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string; search?: string };
}) {
  const data = await getProducts(searchParams);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            محصولات
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            مدیریت کاتالوگ محصولات
          </p>
        </div>
        <Button
          asChild
          className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full"
        >
          <Link href="/admin/products/new"  prefetch={false}>
            <Plus className="ml-2 h-4 w-4" />
            افزودن محصول
          </Link>
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <ProductSearch />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <ProductsTable data={data} />
      </div>
    </div>
  );
}
