import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { customFetch } from "@/lib/utils";

// This function will be run on the server side
export default async function CategoriesPage() {
  try {
    // Fetch data from the server-side API
    const res = await customFetch("/category/figures");
    const categories = await res.json();

    return (
      <div className="space-y-6" dir="rtl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            مدیریت دسته‌بندی‌ها
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            دسته‌بندی‌های محصولات را مدیریت کنید
          </p>
        </div>

        <CategoriesTable initialCategories={categories.children} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return <div>Error fetching categories. Please try again later.</div>;
  }
}
