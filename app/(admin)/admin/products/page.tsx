import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductsPageWrapper } from "@/components/admin/products/products-page-wrapper";
import { getAllProducts, type IProductType } from "@/lib/products";
import { productLimit } from "@/lib/product-limit";

/**
 * Transform IProductType to Product format for the table
 */
function transformProduct(product: IProductType) {
  return {
    uuid: product.uuid,
    name: product.name,
    slug: product.slug,
    price: product.price,
    quantity: product.quantity,
    category: product.category?.name || "بدون دسته‌بندی",
    rating: product.rating || 0,
    image: product.productMedia?.[0]?.url || "/placeholder.svg",
  };
}

/**
 * Fetch products from the API
 */
async function getProducts(
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>
) {
  const params = await searchParams;
  const page = Number.parseInt(params.page || "1", 10);
  const limit = Number.parseInt(params.limit || String(productLimit), 10);

  try {
    const result = await getAllProducts(page, limit, {
      next: { tags: ["products", "admin"] },
    });

    const products = (result.products || []).map(transformProduct);
    const total = result.totalCount || products.length;

    return {
      products,
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      total: 0,
      page,
      limit,
    };
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number.parseInt(params.page || "1", 10);
  const limit = Number.parseInt(params.limit || String(productLimit), 10);

  const data = await getProducts(searchParams);

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">محصولات</h1>
          <p className="text-gray-400 text-sm mt-1">{data.total} محصول</p>
        </div>
        <Button
          asChild
          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Link href="/admin/products/new" prefetch={false}>
            <Plus className="ml-2 h-4 w-4" />
            افزودن محصول
          </Link>
        </Button>
      </div>

      <ProductsPageWrapper
        initialProducts={data.products}
        initialTotal={data.total}
        initialPage={page}
        initialLimit={limit}
      />
    </div>
  );
}
