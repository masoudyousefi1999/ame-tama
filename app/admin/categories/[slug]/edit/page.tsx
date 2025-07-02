import { CategoryForm } from "@/components/admin/categories/category-form";
import { customFetch } from "@/lib/utils";

// This would fetch from your API
async function getCategory(slug: string) {
  try {
    const response = await customFetch(`/category/${slug}`);

    if (!response.ok) {
      throw new Error("Failed to fetch category");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching category:", error);
    // Return a placeholder for error cases
    return {
      id: 1,
      name: "دسته‌بندی",
      slug: "category",
      description: "توضیحات دسته‌بندی",
      parentId: null,
      image: "/placeholder.svg?height=200&width=200",
    };
  }
}

export default async function EditCategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategory(params.slug);

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          ویرایش دسته‌بندی
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          اطلاعات دسته‌بندی را ویرایش کنید
        </p>
      </div>

      <CategoryForm category={category} />
    </div>
  );
}
