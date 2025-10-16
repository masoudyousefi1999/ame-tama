import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { customFetch } from "@/lib/utils";

// This function will be run on the server side
export default async function CategoriesPage() {
  try {
    // Fetch data from the server-side API
    const res = await customFetch("/category/figures");
    const categories = await res.json();

    return (
      <div className="space-y-4" dir="rtl">
        <div>
          <h1 className="text-2xl font-bold text-white">دسته‌بندی‌ها</h1>
          <p className="text-gray-400 text-sm mt-1">
            {categories.children?.length || 0} دسته‌بندی
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
