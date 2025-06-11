"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getSubcategories } from "@/lib/categories";
import type { ICategoryType } from "@/lib/categories";
import Link from "next/link";

interface CategoryFiltersProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  category: ICategoryType;
  onClose?: () => void;
}

export default function CategoryFilters({
  priceRange,
  onPriceRangeChange,
  selectedFilters,
  onFilterChange,
  category,
  onClose,
}: CategoryFiltersProps) {
  const [localPriceRange, setLocalPriceRange] =
    useState<[number, number]>(priceRange);
  const [localFilters, setLocalFilters] = useState<string[]>(selectedFilters);

  // دریافت زیردسته‌های این دسته‌بندی
  const subcategories = getSubcategories(category.uuid);

  // همگام‌سازی با props
  useEffect(() => {
    setLocalPriceRange(priceRange);
    setLocalFilters(selectedFilters);
  }, [priceRange, selectedFilters]);

  // تغییر محدوده قیمت
  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]]);
  };

  // اعمال تغییرات محدوده قیمت
  const applyPriceRange = () => {
    onPriceRangeChange(localPriceRange);
  };

  // تغییر فیلترها
  const toggleFilter = (filterId: string) => {
    const newFilters = localFilters.includes(filterId)
      ? localFilters.filter((id) => id !== filterId)
      : [...localFilters, filterId];

    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  // پاک کردن همه فیلترها
  const clearAllFilters = () => {
    setLocalPriceRange([0, 500]);
    setLocalFilters([]);
    onPriceRangeChange([0, 500]);
    onFilterChange([]);
    if (onClose) onClose();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
      {/* نمایش زیردسته‌ها در فیلتر */}
      {subcategories.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-4 font-vazirmatn">
            زیردسته‌های {category.name}
          </h3>
          <div className="space-y-2">
            {subcategories.map((subcat) => (
              <Link
                key={subcat.id}
                href={`/category/${subcat.slug}`}
                className="block p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-vazirmatn"
              >
                {subcat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-medium mb-4 font-vazirmatn">محدوده قیمت (تومان)</h3>
        <Slider
          defaultValue={[localPriceRange[0], localPriceRange[1]]}
          value={[localPriceRange[0], localPriceRange[1]]}
          max={500}
          step={10}
          onValueChange={handlePriceChange}
          onValueCommit={applyPriceRange}
          className="mb-6"
        />
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span className="font-vazirmatn">
            {localPriceRange[0].toLocaleString("fa-IR")}K
          </span>
          <span className="font-vazirmatn">
            {localPriceRange[1].toLocaleString("fa-IR")}K
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="font-medium mb-4 font-vazirmatn">وضعیت</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox
              id="filter-new"
              checked={localFilters.includes("new")}
              onCheckedChange={() => toggleFilter("new")}
            />
            <Label htmlFor="filter-new" className="mr-2 text-sm font-vazirmatn">
              محصولات جدید
            </Label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="filter-limited"
              checked={localFilters.includes("limited")}
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
              checked={localFilters.includes("in-stock")}
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

      {/* فیلترهای مخصوص دسته‌بندی */}
      {/* {category.filters && category.filters.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="font-medium mb-4 font-vazirmatn">{category.filterTitle || "ویژگی‌ها"}</h3>
          <div className="space-y-2">
            {category.filters.map((filter) => (
              <div key={filter.id} className="flex items-center">
                <Checkbox
                  id={`filter-${filter.id}`}
                  checked={localFilters.includes(filter.id)}
                  onCheckedChange={() => toggleFilter(filter.id)}
                />
                <Label htmlFor={`filter-${filter.id}`} className="mr-2 text-sm font-vazirmatn">
                  {filter.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* دکمه پاک کردن فیلترها */}
      {(localFilters.length > 0 ||
        localPriceRange[0] > 0 ||
        localPriceRange[1] < 500) && (
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
  );
}
