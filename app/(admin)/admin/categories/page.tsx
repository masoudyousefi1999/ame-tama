import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { customFetch } from "@/lib/utils";

// This function will be run on the server side
export default async function CategoriesPage() {
  try {
    // Fetch data from the server-side API
    const res = await customFetch("/category");
    const categories = await res.json();

    // Ensure categories.children exists and is an array
    const categoriesList = categories || [];

    return (
      <div className="space-y-4" dir="rtl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">دسته‌بندی‌ها</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {categoriesList.length} دسته‌بندی
          </p>
        </div>

        <CategoriesTable initialCategories={categoriesList} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return (
      <div className="space-y-4" dir="rtl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">دسته‌بندی‌ها</h1>
          <p className="text-muted-foreground text-sm mt-1">
            خطا در بارگذاری دسته‌بندی‌ها
          </p>
        </div>
        <div className="text-destructive">
          Error fetching categories. Please try again later.
        </div>
      </div>
    );
  }
}
