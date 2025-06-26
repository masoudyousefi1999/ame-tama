import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { customFetch } from "@/lib/utils";

// This function will be run on every request
export async function getServerSideProps() {
  try {
    // Fetch data from the server-side API
    const res = await customFetch("/category/figures");
    const categories = await res.json();
    return {
      props: {
        categories: categories.children, // Pass the categories to the page
      },
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      props: {
        categories: [], // Return an empty array if the fetch fails
      },
    };
  }
}

export default function CategoriesPage({ categories }: { categories: any[] }) {
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
