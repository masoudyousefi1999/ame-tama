"use client";

import { useState } from "react";
import ShopHeader from "@/components/shop/shop-header";
import CategoryShowcase from "@/components/shop/category-showcase";
import FeaturedProducts from "@/components/shop/featured-products";
import NewArrivals from "@/components/shop/new-arrivals";
import ProductGrid from "@/components/shop/product-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllProducts } from "@/lib/products";
import { getAllCategories } from "@/lib/categories";

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("all");
  const products = getAllProducts();
  const categories = getAllCategories();

  // محصولات ویژه (با امتیاز بالا)
  const featuredProducts = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  // محصولات جدید
  const newProducts = [...products]
    .filter((product) => product.isNew)
    .sort(
      (a, b) =>
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    )
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      {/* هدر فروشگاه */}
      <ShopHeader />

      {/* تب‌های فروشگاه */}
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

        {/* محتوای تب دسته‌بندی‌ها */}
        <TabsContent value="categories" className="space-y-12">
          <CategoryShowcase categories={categories} />
          <FeaturedProducts products={featuredProducts} />
          <NewArrivals products={newProducts} />
        </TabsContent>

        {/* محتوای تب محصولات ویژه */}
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

        {/* محتوای تب همه محصولات */}
        <TabsContent value="all">
          <div dir="rtl" className="mb-8">
            <h2 className="text-2xl font-bold mb-2 font-vazirmatn">
              همه محصولات
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-vazirmatn">
              مشاهده و جستجو در تمامی مجسمه‌های انیمه موجود در فروشگاه AME-TAMA
            </p>
          </div>
          <ProductGrid products={products} showFilters={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
