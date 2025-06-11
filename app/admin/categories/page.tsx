import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { customFetch } from "@/lib/utils";

// This would fetch from your API
async function getCategories() {
  const res = await customFetch("/category/figures");

  const categories = await res.json();

  return categories.children;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-vazirmatn">
          مدیریت دسته‌بندی‌ها
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 font-vazirmatn">
          دسته‌بندی‌های محصولات را مدیریت کنید
        </p>
      </div>

      <CategoriesTable initialCategories={categories} />
    </div>
  );
}
