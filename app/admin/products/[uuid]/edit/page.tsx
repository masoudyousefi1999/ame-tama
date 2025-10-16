import { ProductForm } from "@/components/admin/products/product-form";
import { customFetch } from "@/lib/utils";
import { notFound } from "next/navigation";

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

/**
 * Fetch product data from API
 */
async function getProduct(uuid: string) {
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
      uuid: apiProduct.uuid,
      name: apiProduct.name,
      slug: apiProduct.slug,
      price: apiProduct.price,
      quantity: apiProduct.quantity,
      rating: apiProduct.rating,
      categoryId: String(apiProduct.category?.id || ""),
      categoryUuid: apiProduct.category?.uuid || "",
      detail: {
        series: apiProduct.detail?.series || "",
        character: apiProduct.detail?.character || "",
        description: apiProduct.detail?.description || "",
        specifications:
          typeof apiProduct.detail?.specifications === "string"
            ? apiProduct.detail.specifications
            : JSON.stringify(apiProduct.detail?.specifications || ""),
      },
      productMedia:
        apiProduct.productMedia?.map((media, index) => ({
          mediaId: `media-${index}`,
          order: media.order,
          isDefault: media.isDefault,
          url: media.url,
        })) || [],
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
        <h1 className="text-2xl font-bold text-white">ویرایش محصول</h1>
        <p className="text-gray-400 text-sm mt-1">{product.name}</p>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  );
}
