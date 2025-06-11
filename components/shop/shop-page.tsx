"use client";

import { useEffect, useState } from "react";
import ShopHeader from "@/components/shop/shop-header";
import CategoryShowcase from "@/components/shop/category-showcase";
import FeaturedProducts from "@/components/shop/featured-products";
import NewArrivals from "@/components/shop/new-arrivals";
import ProductGrid from "@/components/shop/product-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllProducts, IProductType } from "@/lib/products";
import { getAllCategories, ICategoryType } from "@/lib/categories";

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<IProductType[]>([]);
  const [categories, setCategories] = useState<ICategoryType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const productsData = await getAllProducts();
      setProducts(productsData);

      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    };

    fetchData();
  }, []);

  // Don't try to process data before it's loaded
  if (!products.length) return <p>در حال بارگذاری محصولات...</p>;
  const featuredProducts = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  // const newProducts = [...products]
  //   .filter((product) => product.isNew)
  //   .sort(
  //     (a, b) =>
  //       new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  //   )
  //   .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <ShopHeader />

      <Tabs defaultValue="all" className="mt-12" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
          <TabsTrigger value="categories" className="font-vazirmatn">
            دسته‌بندی‌ها
          </TabsTrigger>
          <TabsTrigger value="featured" className="font-vazirmatn">
            محصولات ویژه
          </TabsTrigger>
          <TabsTrigger value="all" className="font-vazirmatn">
            همه محصولات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-12">
          <CategoryShowcase categories={categories} />
          <FeaturedProducts products={featuredProducts} />
          <NewArrivals products={products} />
        </TabsContent>

        <TabsContent value="featured">
          <div dir="rtl" className="mb-8">
            <h2 className="text-2xl font-bold mb-2 font-vazirmatn">
              محصولات ویژه
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-vazirmatn">
              مجموعه‌ای از برترین و محبوب‌ترین مجسمه‌های انیمه با بالاترین
              امتیاز از طرف کاربران
            </p>
          </div>
          <ProductGrid products={featuredProducts} showFilters={true} />
        </TabsContent>

        <TabsContent value="all">
          <div dir="rtl" className="mb-8">
            <h2 className="text-2xl font-bold mb-2 font-vazirmatn">
              همه محصولات
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-vazirmatn">
              مشاهده و جستجو در تمامی مجسمه‌های انیمه موجود در فروشگاه AME-TAMA
            </p>
          </div>
          <ProductGrid products={products} showFilters={false} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
