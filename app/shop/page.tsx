import { getAllProducts, getProductByCategorySlug } from "@/lib/products";
import { getAllCategories, ICategoryType } from "@/lib/categories";
import ShopPageClient from "@/components/shop/shop-page-client";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; page?: string };
}) {
  let products = [];
  let categories: ICategoryType[] = [];
  let totalPages = 1;

  try {
    const fetchedCategories = await getAllCategories();
    categories = fetchedCategories || [];

    const category = searchParams.category;

    let fetchedProducts;
    if (category) {
      fetchedProducts = await getProductByCategorySlug(category);
    } else {
      fetchedProducts = await getAllProducts();
    }

    products = (fetchedProducts as any)?.products || [];
    totalPages = (fetchedProducts as any)?.totalPages || 1;
  } catch (error) {
    console.error("Error fetching shop data:", error);
    products = [];
    categories = [];
    totalPages = 1;
  }

  return (
    <ShopPageClient
      initialProducts={products}
      categories={categories}
      totalPages={totalPages}
      currentPage={Number.parseInt(searchParams.page || "1")}
      currentCategory={searchParams.category}
      currentSearch={searchParams.search}
    />
  );
}
