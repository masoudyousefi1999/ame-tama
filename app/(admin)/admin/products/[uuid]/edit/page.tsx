import { ProductForm } from "@/components/admin/products/product-form";
import { customFetch } from "@/lib/utils";
import { notFound } from "next/navigation";
import { ITagType } from "@/lib/tags";
import { IProductType } from "@/lib/products";

interface Category {
  id: number;
  name: string;
  slug: string;
  uuid: string;
  description?: string;
  children: Category[];
  image?: string;
}

interface ProductDetail {
  series: string;
  character: string;
  description: string;
  specifications?: Record<string, any> | null;
}

interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

interface ProductMedia {
  order: number;
  isDefault: boolean;
  url: string;
}

interface APIProduct {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  rating: number;
  detail: ProductDetail;
  category: ProductCategory;
  productMedia: ProductMedia[];
  tags?: ITagType[];
}

/**
 * Flatten categories to get all categories including children
 */
function flattenCategories(categories: Category[]): Category[] {
  const result: Category[] = [];

  function traverse(cats: Category[]) {
    for (const cat of cats) {
      // Add the category itself
      result.push({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        uuid: cat.uuid,
        description: cat.description,
        children: [],
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
async function getCategories(): Promise<Category[]> {
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
      return flattenCategories(data);
    }

    // If it's an object with children array
    if (data && Array.isArray(data.children)) {
      return flattenCategories(data.children);
    }

    // Fallback: return empty array
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Fetch product data from API
 */
async function getProduct(uuid: string): Promise<IProductType> {
  try {
    const response = await customFetch(`/product/uuid/${uuid}`, {
      method: "GET",
      next: { tags: ["product", uuid] },
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const apiProduct: APIProduct = await response.json();

    // Transform API response to form format
    return {
      createdAt: apiProduct.createdAt,
      updatedAt: apiProduct.updatedAt,
      uuid: apiProduct.uuid,
      name: apiProduct.name,
      slug: apiProduct.slug,
      price: apiProduct.price,
      quantity: apiProduct.quantity,
      rating: apiProduct.rating,
      category: apiProduct.category,
      detail: {
        series: apiProduct.detail?.series || "",
        character: apiProduct.detail?.character || "",
        description: apiProduct.detail?.description || "",
        specifications:
          typeof apiProduct.detail?.specifications === "string"
            ? apiProduct.detail.specifications
            : JSON.stringify(apiProduct.detail?.specifications || ""),
      } as any,
      productMedia:
        apiProduct.productMedia?.map((media, index) => ({
          mediaId: `media-${index}`,
          order: media.order,
          isDefault: media.isDefault,
          url: media.url,
        })) || [],
      tags: apiProduct.tags || [],
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  // Fetch product and categories in parallel
  const [product, categories] = await Promise.all([
    getProduct(uuid),
    getCategories(),
  ]);

  return (
    <div className="space-y-4" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">ویرایش محصول</h1>
        <p className="text-muted-foreground text-sm mt-1">{product.name}</p>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  );
}
