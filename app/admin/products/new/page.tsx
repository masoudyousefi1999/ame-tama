import { ProductForm } from "@/components/admin/products/product-form";
import { customFetch } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
  slug: string;
  uuid: string;
  description?: string;
  children: Category[];
  image?: string;
}

/**
 * Fetch categories from API
 */
async function getCategories(): Promise<Category[]> {
  try {
    const response = await customFetch("/category/figures", {
      method: "GET",
      next: { tags: ["categories"] },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data = await response.json();

    // Return children (subcategories) which are the actual product categories
    return data.children || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-4" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-white">ایجاد محصول جدید</h1>
        <p className="text-gray-400 text-sm mt-1">
          محصول جدید به کاتالوگ اضافه کنید
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
