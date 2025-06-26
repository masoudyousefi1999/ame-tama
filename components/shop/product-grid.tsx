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
      <div className="py-16 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40"
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
        <h3 className="mb-2 text-lg font-medium font-vazirmatn">
          محصولی یافت نشد
        </h3>
        <p className="font-vazirmatn text-muted-foreground">
          با معیارهای فیلتر فعلی محصولی یافت نشد. لطفاً فیلترها را تغییر دهید.
        </p>
        {showFilters && (
          <Button
            variant="outline"
            className="mt-4 rounded-full font-vazirmatn hover:bg-purple-50 dark:hover:bg-purple-900/10"
            onClick={clearAllFilters}
          >
            پاک کردن فیلترها
          </Button>
        )}
      </div>
    );
  }

  /* ---------- MAIN LAYOUT ---------- */
  return (
    <div dir="rtl" className="flex flex-col gap-10 md:flex-row md:gap-12">
      {/* ───────────────── DESKTOP SIDEBAR ───────────────── */}
      {showFilters && (
        <div className="hidden w-64 md:block">
          <div className="sticky top-24 space-y-6 rounded-2xl bg-card p-6 shadow-lg ring-1 ring-border/30">
            {/* ─ Price range ─ */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-muted-foreground font-vazirmatn">
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
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="font-vazirmatn">
                  {priceRange[0].toLocaleString("fa-IR")}K
                </span>
                <span className="font-vazirmatn">
                  {priceRange[1].toLocaleString("fa-IR")}K
                </span>
              </div>
            </div>

            {/* ─ Categories ─ */}
            <div className="border-t border-border/60 pt-6">
              <h3 className="mb-4 text-sm font-semibold text-muted-foreground font-vazirmatn">
                دسته‌بندی‌ها
              </h3>
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

            {/* ─ Status filters ─ */}
            <div className="border-t border-border/60 pt-6">
              <h3 className="mb-4 text-sm font-semibold text-muted-foreground font-vazirmatn">
                وضعیت
              </h3>
              <div className="space-y-2">
                {[
                  { id: "new", label: "محصولات جدید" },
                  { id: "limited", label: "نسخه‌های محدود" },
                  { id: "in-stock", label: "فقط موجود" },
                ].map((f) => (
                  <div key={f.id} className="flex items-center">
                    <Checkbox
                      id={`filter-${f.id}`}
                      checked={selectedFilters.includes(f.id)}
                      onCheckedChange={() => toggleFilter(f.id)}
                    />
                    <Label
                      htmlFor={`filter-${f.id}`}
                      className="mr-2 text-sm font-vazirmatn"
                    >
                      {f.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* ─ Sorting ─ */}
            <div className="border-t border-border/60 pt-6">
              <h3 className="mb-4 text-sm font-semibold text-muted-foreground font-vazirmatn">
                مرتب‌سازی
              </h3>
              {[
                { id: "newest", label: "جدیدترین" },
                { id: "price-asc", label: "قیمت: کم به زیاد" },
                { id: "price-desc", label: "قیمت: زیاد به کم" },
                { id: "popular", label: "محبوب‌ترین" },
              ].map((s) => (
                <div key={s.id} className="flex items-center space-x-reverse">
                  <input
                    type="radio"
                    id={`sort-${s.id}`}
                    name="sort"
                    className="ml-2 accent-purple-600"
                    checked={sortBy === s.id}
                    onChange={() => setSortBy(s.id)}
                  />
                  <Label
                    htmlFor={`sort-${s.id}`}
                    className="text-sm font-vazirmatn"
                  >
                    {s.label}
                  </Label>
                </div>
              ))}
            </div>

            {/* ─ Clear filters ─ */}
            {(selectedFilters.length > 0 ||
              selectedCategories.length > 0 ||
              priceRange[0] > 0 ||
              priceRange[1] < 500 ||
              sortBy !== "newest") && (
              <div className="border-t border-border/60 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full font-vazirmatn hover:bg-purple-50 dark:hover:bg-purple-900/10"
                  onClick={clearAllFilters}
                >
                  پاک کردن فیلترها
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────── MAIN COLUMN ───────────────── */}
      <div className="flex-1">
        {/* Mobile top-bar */}
        {showFilters && (
          <div className="mb-6 flex flex-wrap items-center justify-between">
            <div className="flex items-center">
              <span className="ml-2 text-sm font-vazirmatn text-muted-foreground">
                {filteredProducts.length} محصول
              </span>

              {/* Mobile filter button */}
              <Sheet
                open={isMobileFiltersOpen}
                onOpenChange={setIsMobileFiltersOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 rounded-full font-vazirmatn md:hidden"
                  >
                    <Filter className="ml-2 h-4 w-4" />
                    فیلترها
                  </Button>
                </SheetTrigger>

                {/* Mobile drawer content */}
                {/* 👉 all classes inside the drawer mirror the desktop ones */}
                <SheetContent side="right" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle className="font-vazirmatn">فیلترها</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 py-4">
                    {/* Price, categories, status, sort – identical markup omitted for brevity */}
                    {/* …you can reuse the blocks above, keeping the new classes… */}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Selected filter chips */}
            {showFilters && (
              <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
                {/* Category chips */}
                {selectedCategories.map((cid) => {
                  const cat = categories.find((c) => c.uuid === cid);
                  return (
                    cat && (
                      <Badge
                        key={cid}
                        className="bg-purple-600 hover:bg-purple-700 font-vazirmatn"
                        onClick={() => toggleCategory(cid)}
                      >
                        {cat.name}
                        <X className="mr-1 h-3 w-3" />
                      </Badge>
                    )
                  );
                })}

                {/* Status chips */}
                {["new", "limited", "in-stock"].map(
                  (f) =>
                    selectedFilters.includes(f) && (
                      <Badge
                        key={f}
                        className="bg-purple-600 hover:bg-purple-700 font-vazirmatn"
                        onClick={() => toggleFilter(f)}
                      >
                        {f === "new"
                          ? "محصولات جدید"
                          : f === "limited"
                          ? "نسخه‌های محدود"
                          : "فقط موجود"}
                        <X className="mr-1 h-3 w-3" />
                      </Badge>
                    )
                )}

                {/* Clear-all chip */}
                {(selectedFilters.length > 0 ||
                  selectedCategories.length > 0) && (
                  <Badge
                    variant="outline"
                    className="cursor-pointer border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/10 font-vazirmatn"
                    onClick={() => {
                      setSelectedFilters([]);
                      setSelectedCategories([]);
                    }}
                  >
                    پاک کردن فیلترها
                    <X className="mr-1 h-3 w-3" />
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {/* Products grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, idx) => (
            <ProductCard key={idx} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
