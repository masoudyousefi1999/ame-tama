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
    <div className="space-y-4" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-white">
          ویرایش دسته‌بندی
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {category.name}
        </p>
      </div>

      <CategoryForm category={category} />
    </div>
  );
}
