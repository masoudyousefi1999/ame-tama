"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/context/cart-context";
import { toast } from "@/components/ui/use-toast";
import { getAllCategories, ICategoryType } from "@/lib/categories";
import { ProductCard } from "../product/product-card";

interface ProductGridProps {
  products: any[];
  showFilters?: boolean;
  loading: boolean;
}

export default function ProductGrid({
  products,
  showFilters = false,
}: ProductGridProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const { addItem } = useCart();
  const [categories, setCategories] = useState<ICategoryType[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      const categories = (await getAllCategories()) as ICategoryType[];
      if (categories) {
        setCategories(categories);
      }
    };
  }, []);

  // اعمال فیلترها و مرتب‌سازی
  useEffect(() => {
    let result = [...products];

    // فیلتر بر اساس قیمت
    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // فیلتر بر اساس دسته‌بندی
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // فیلترهای انتخاب شده
    if (selectedFilters.length > 0) {
      result = result.filter((product) => {
        if (selectedFilters.includes("new") && !product.isNew) return false;
        if (selectedFilters.includes("limited") && !product.isLimited)
          return false;
        if (
          selectedFilters.includes("in-stock") &&
          product.availability !== "in-stock"
        )
          return false;
        return true;
      });
    }

    // مرتب‌سازی
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        );
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
    }

    setFilteredProducts(result);
  }, [products, priceRange, selectedFilters, selectedCategories, sortBy]);

  // افزودن محصول به سبد خرید
  const handleAddToCart = (product: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    addItem(product, 1);
    toast({
      title: "محصول به سبد خرید اضافه شد",
      description: `${product.name} به سبد خرید شما اضافه شد.`,
    });
  };

  // افزودن محصول به علاقه‌مندی‌ها
  const handleAddToWishlist = (product: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    toast({
      title: "محصول به علاقه‌مندی‌ها اضافه شد",
      description: `${product.name} به لیست علاقه‌مندی‌های شما اضافه شد.`,
    });
  };

  // تغییر محدوده قیمت
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  // تغییر فیلترها
  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  // تغییر دسته‌بندی‌ها
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // پاک کردن همه فیلترها
  const clearAllFilters = () => {
    setPriceRange([0, 500]);
    setSelectedFilters([]);
    setSelectedCategories([]);
    setSortBy("newest");
  };

  // اگر محصولی وجود نداشت
  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-medium mb-2 font-vazirmatn">
          محصولی یافت نشد
        </h3>
        <p className="text-gray-500 dark:text-gray-400 font-vazirmatn">
          با معیارهای فیلتر فعلی محصولی یافت نشد. لطفاً فیلترها را تغییر دهید.
        </p>
        {showFilters && (
          <Button
            variant="outline"
            className="mt-4 rounded-full border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-vazirmatn"
            onClick={clearAllFilters}
          >
            پاک کردن فیلترها
          </Button>
        )}
      </div>
    );
  }

  return (
    <div dir="rtl" className="flex flex-col md:flex-row gap-8">
      {/* فیلترهای دسکتاپ */}
      {showFilters && (
        <div className="hidden md:block w-64">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6 sticky top-24">
            <div>
              <h3 className="font-medium mb-4 font-vazirmatn">
                محدوده قیمت (تومان)
              </h3>
              <Slider
                defaultValue={[priceRange[0], priceRange[1]]}
                value={[priceRange[0], priceRange[1]]}
                max={500}
                step={10}
                onValueChange={handlePriceChange}
                className="mb-6"
              />
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span className="font-vazirmatn">
                  {priceRange[0].toLocaleString("fa-IR")}K
                </span>
                <span className="font-vazirmatn">
                  {priceRange[1].toLocaleString("fa-IR")}K
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-medium mb-4 font-vazirmatn">دسته‌بندی‌ها</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.uuid)}
                      onCheckedChange={() => toggleCategory(category.uuid)}
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="mr-2 text-sm font-vazirmatn"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-medium mb-4 font-vazirmatn">وضعیت</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="filter-new"
                    checked={selectedFilters.includes("new")}
                    onCheckedChange={() => toggleFilter("new")}
                  />
                  <Label
                    htmlFor="filter-new"
                    className="mr-2 text-sm font-vazirmatn"
                  >
                    محصولات جدید
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="filter-limited"
                    checked={selectedFilters.includes("limited")}
                    onCheckedChange={() => toggleFilter("limited")}
                  />
                  <Label
                    htmlFor="filter-limited"
                    className="mr-2 text-sm font-vazirmatn"
                  >
                    نسخه‌های محدود
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="filter-in-stock"
                    checked={selectedFilters.includes("in-stock")}
                    onCheckedChange={() => toggleFilter("in-stock")}
                  />
                  <Label
                    htmlFor="filter-in-stock"
                    className="mr-2 text-sm font-vazirmatn"
                  >
                    فقط موجود
                  </Label>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-medium mb-4 font-vazirmatn">مرتب‌سازی</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sort-newest"
                    name="sort"
                    checked={sortBy === "newest"}
                    onChange={() => setSortBy("newest")}
                    className="ml-2"
                  />
                  <Label
                    htmlFor="sort-newest"
                    className="text-sm font-vazirmatn"
                  >
                    جدیدترین
                  </Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sort-price-asc"
                    name="sort"
                    checked={sortBy === "price-asc"}
                    onChange={() => setSortBy("price-asc")}
                    className="ml-2"
                  />
                  <Label
                    htmlFor="sort-price-asc"
                    className="text-sm font-vazirmatn"
                  >
                    قیمت: کم به زیاد
                  </Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sort-price-desc"
                    name="sort"
                    checked={sortBy === "price-desc"}
                    onChange={() => setSortBy("price-desc")}
                    className="ml-2"
                  />
                  <Label
                    htmlFor="sort-price-desc"
                    className="text-sm font-vazirmatn"
                  >
                    قیمت: زیاد به کم
                  </Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sort-popular"
                    name="sort"
                    checked={sortBy === "popular"}
                    onChange={() => setSortBy("popular")}
                    className="ml-2"
                  />
                  <Label
                    htmlFor="sort-popular"
                    className="text-sm font-vazirmatn"
                  >
                    محبوب‌ترین
                  </Label>
                </div>
              </div>
            </div>

            {/* دکمه پاک کردن فیلترها */}
            {(selectedFilters.length > 0 ||
              selectedCategories.length > 0 ||
              priceRange[0] > 0 ||
              priceRange[1] < 500 ||
              sortBy !== "newest") && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full font-vazirmatn"
                  onClick={clearAllFilters}
                >
                  پاک کردن فیلترها
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex-1">
        {/* نوار مرتب‌سازی و فیلترها برای موبایل */}
        {showFilters && (
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 font-vazirmatn">
                {filteredProducts.length} محصول
              </span>

              {/* دکمه فیلتر موبایل */}
              <Sheet
                open={isMobileFiltersOpen}
                onOpenChange={setIsMobileFiltersOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="md:hidden rounded-full ml-2 font-vazirmatn"
                  >
                    <Filter className="h-4 w-4 ml-2" />
                    فیلترها
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle className="font-vazirmatn">فیلترها</SheetTitle>
                  </SheetHeader>
                  <div className="py-4 space-y-6">
                    <div>
                      <h3 className="font-medium mb-4 font-vazirmatn">
                        محدوده قیمت (تومان)
                      </h3>
                      <Slider
                        defaultValue={[priceRange[0], priceRange[1]]}
                        value={[priceRange[0], priceRange[1]]}
                        max={500}
                        step={10}
                        onValueChange={handlePriceChange}
                        className="mb-6"
                      />
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-vazirmatn">
                          {priceRange[0].toLocaleString("fa-IR")}K
                        </span>
                        <span className="font-vazirmatn">
                          {priceRange[1].toLocaleString("fa-IR")}K
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h3 className="font-medium mb-4 font-vazirmatn">
                        دسته‌بندی‌ها
                      </h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center">
                            <Checkbox
                              id={`mobile-category-${category.id}`}
                              checked={selectedCategories.includes(
                                category.uuid
                              )}
                              onCheckedChange={() =>
                                toggleCategory(category.uuid)
                              }
                            />
                            <Label
                              htmlFor={`mobile-category-${category.id}`}
                              className="mr-2 text-sm font-vazirmatn"
                            >
                              {category.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h3 className="font-medium mb-4 font-vazirmatn">وضعیت</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox
                            id="mobile-filter-new"
                            checked={selectedFilters.includes("new")}
                            onCheckedChange={() => toggleFilter("new")}
                          />
                          <Label
                            htmlFor="mobile-filter-new"
                            className="mr-2 text-sm font-vazirmatn"
                          >
                            محصولات جدید
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            id="mobile-filter-limited"
                            checked={selectedFilters.includes("limited")}
                            onCheckedChange={() => toggleFilter("limited")}
                          />
                          <Label
                            htmlFor="mobile-filter-limited"
                            className="mr-2 text-sm font-vazirmatn"
                          >
                            نسخه‌های محدود
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            id="mobile-filter-in-stock"
                            checked={selectedFilters.includes("in-stock")}
                            onCheckedChange={() => toggleFilter("in-stock")}
                          />
                          <Label
                            htmlFor="mobile-filter-in-stock"
                            className="mr-2 text-sm font-vazirmatn"
                          >
                            فقط موجود
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h3 className="font-medium mb-4 font-vazirmatn">
                        مرتب‌سازی
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="mobile-sort-newest"
                            name="mobile-sort"
                            checked={sortBy === "newest"}
                            onChange={() => setSortBy("newest")}
                            className="ml-2"
                          />
                          <Label
                            htmlFor="mobile-sort-newest"
                            className="text-sm font-vazirmatn"
                          >
                            جدیدترین
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="mobile-sort-price-asc"
                            name="mobile-sort"
                            checked={sortBy === "price-asc"}
                            onChange={() => setSortBy("price-asc")}
                            className="ml-2"
                          />
                          <Label
                            htmlFor="mobile-sort-price-asc"
                            className="text-sm font-vazirmatn"
                          >
                            قیمت: کم به زیاد
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="mobile-sort-price-desc"
                            name="mobile-sort"
                            checked={sortBy === "price-desc"}
                            onChange={() => setSortBy("price-desc")}
                            className="ml-2"
                          />
                          <Label
                            htmlFor="mobile-sort-price-desc"
                            className="text-sm font-vazirmatn"
                          >
                            قیمت: زیاد به کم
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="mobile-sort-popular"
                            name="mobile-sort"
                            checked={sortBy === "popular"}
                            onChange={() => setSortBy("popular")}
                            className="ml-2"
                          />
                          <Label
                            htmlFor="mobile-sort-popular"
                            className="text-sm font-vazirmatn"
                          >
                            محبوب‌ترین
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* دکمه پاک کردن فیلترها */}
                    {(selectedFilters.length > 0 ||
                      selectedCategories.length > 0 ||
                      priceRange[0] > 0 ||
                      priceRange[1] < 500 ||
                      sortBy !== "newest") && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full rounded-full font-vazirmatn"
                          onClick={() => {
                            clearAllFilters();
                            setIsMobileFiltersOpen(false);
                          }}
                        >
                          پاک کردن فیلترها
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* نمایش فیلترهای انتخاب شده */}
            {showFilters && (
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                {selectedCategories.map((categoryId) => {
                  const category = categories.find(
                    (c) => c.uuid === categoryId
                  );
                  return (
                    category && (
                      <Badge
                        key={categoryId}
                        className="bg-purple-500 hover:bg-purple-600 font-vazirmatn"
                        onClick={() => toggleCategory(categoryId)}
                      >
                        {category.name}
                        <X className="h-3 w-3 mr-1" />
                      </Badge>
                    )
                  );
                })}
                {selectedFilters.includes("new") && (
                  <Badge
                    className="bg-purple-500 hover:bg-purple-600 font-vazirmatn"
                    onClick={() => toggleFilter("new")}
                  >
                    محصولات جدید
                    <X className="h-3 w-3 mr-1" />
                  </Badge>
                )}
                {selectedFilters.includes("limited") && (
                  <Badge
                    className="bg-purple-500 hover:bg-purple-600 font-vazirmatn"
                    onClick={() => toggleFilter("limited")}
                  >
                    نسخه‌های محدود
                    <X className="h-3 w-3 mr-1" />
                  </Badge>
                )}
                {selectedFilters.includes("in-stock") && (
                  <Badge
                    className="bg-purple-500 hover:bg-purple-600 font-vazirmatn"
                    onClick={() => toggleFilter("in-stock")}
                  >
                    فقط موجود
                    <X className="h-3 w-3 mr-1" />
                  </Badge>
                )}
                {(selectedFilters.length > 0 ||
                  selectedCategories.length > 0) && (
                  <Badge
                    variant="outline"
                    className="border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300 cursor-pointer font-vazirmatn"
                    onClick={() => {
                      setSelectedFilters([]);
                      setSelectedCategories([]);
                    }}
                  >
                    پاک کردن فیلترها
                    <X className="h-3 w-3 mr-1" />
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {/* نمایش محصولات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard product={product} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
