import { ProductForm } from "@/components/admin/products/product-form";
import { customFetch } from "@/lib/utils";
import { ProductCategory } from "@/lib/products";

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
 * Flatten categories to get all categories including children
 */
function flattenCategories(categories: Category[]): ProductCategory[] {
  const result: ProductCategory[] = [];
  
  function traverse(cats: Category[]) {
    for (const cat of cats) {
      // Add the category itself
      result.push({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        uuid: cat.uuid,
      });
      
      // Traverse children if they exist
      if (cat.children && cat.children.length > 0) {
        traverse(cat.children);
      }
    }
  }
  
  traverse(categories);
  return result;
}

/**
 * Fetch categories from API
 */
async function getCategories(): Promise<ProductCategory[]> {
  try {
    const response = await customFetch("/category", {
      method: "GET",
      next: { tags: ["categories"] },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data = await response.json();

    // Handle both array and object responses
    if (Array.isArray(data)) {
      // If it's already an array, flatten it to get all categories including children
      const flattened = flattenCategories(data);
      console.log("Fetched categories:", flattened.length, flattened);
      return flattened;
    }
    
    // If it's an object with children array
    if (data && Array.isArray(data.children)) {
      const flattened = flattenCategories(data.children);
      console.log("Fetched categories from children:", flattened.length, flattened);
      return flattened;
    }

    // If data itself is a single category object, return it as array
    if (data && data.id && data.uuid) {
      return [{
        id: data.id,
        uuid: data.uuid,
        name: data.name,
        slug: data.slug,
      }];
    }

    // Fallback: return empty array
    console.warn("No categories found in response:", data);
    return [];
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
        <h1 className="text-2xl font-bold text-foreground">ایجاد محصول جدید</h1>
        <p className="text-muted-foreground text-sm mt-1">
          محصول جدید به کاتالوگ اضافه کنید
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
