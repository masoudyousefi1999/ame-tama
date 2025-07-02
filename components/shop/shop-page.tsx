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

      {/* ─────────────── Tabs ─────────────── */}
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="mt-12">
        <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-3 rounded-full bg-muted/40 p-1">
          <TabsTrigger
            value="categories"
            className="  rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            دسته‌بندی‌ها
          </TabsTrigger>
          <TabsTrigger
            value="featured"
            className="  rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            محصولات ویژه
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="  rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            همه محصولات
          </TabsTrigger>
        </TabsList>

        {/* ─────────────── Categories tab ─────────────── */}
        <TabsContent value="categories" className="space-y-12">
          <CategoryShowcase categories={categories} />
          <FeaturedProducts products={featuredProducts} />
          <NewArrivals products={products} />
        </TabsContent>

        {/* ─────────────── Featured tab ─────────────── */}
        <TabsContent value="featured">
          <header dir="rtl" className="mb-8">
            <h2 className="  text-2xl font-bold text-card-foreground">
              محصولات ویژه
            </h2>
            <p className="  text-muted-foreground">
              مجموعه‌ای از برترین و محبوب‌ترین مجسمه‌های انیمه با بالاترین
              امتیاز از طرف کاربران
            </p>
          </header>

          <ProductGrid
            loading={false}
            products={featuredProducts}
            showFilters
          />
        </TabsContent>

        {/* ─────────────── All products tab ─────────────── */}
        <TabsContent value="all">
          <header dir="rtl" className="mb-8">
            <h2 className="  text-2xl font-bold text-card-foreground">
              همه محصولات
            </h2>
            <p className="  text-muted-foreground">
              مشاهده و جستجو در تمامی مجسمه‌های انیمه موجود در
              فروشگاه&nbsp;AME-TAMA
            </p>
          </header>

          <ProductGrid
            loading={false}
            products={products}
            showFilters={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
