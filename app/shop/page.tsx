import { getAllProducts, IProductType } from "@/lib/products";
import ShopPageClient from "@/components/shop/shop-page-client";
import { productLimit } from "@/lib/product-limit";
import { Metadata } from "next";

const baseUrl = "https://ame-tama.com";

export const generateMetadata = (): Metadata => {
  return {
    metadataBase: new URL(baseUrl),
    title: "فروشگاه | خرید اکشن فیگور انیمه‌ای",
    description:
      "خرید اکشن فیگور انیمه ای با بهترین قیمت و کیفیت از فروشگاه آمه‌تاما",
  };
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  const { page: currentPage, search } = await searchParams;

  let products: IProductType[] = [];
  let totalCount = 0;
  const limit = productLimit;
  const page = Number.parseInt(currentPage || "1");

  try {
    const fetchedProducts = await getAllProducts(page, limit);
    products = fetchedProducts.products || [];
    totalCount = fetchedProducts.totalCount || 0;
  } catch (error) {
    console.error("Error fetching shop data:", error);
    products = [];
    totalCount = 0;
  }

  return (
    <ShopPageClient
      initialProducts={products}
      totalCount={totalCount}
      currentPage={page}
      limit={limit}
    />
  );
}
