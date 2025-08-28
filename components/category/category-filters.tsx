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
    <div className="space-y-6 rounded-lg bg-card p-6 shadow-sm">
      {/* sub-categories */}
      {subcategories.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-4 font-medium">زیردسته‌های {category.name}</h3>

          <div className="space-y-2">
            {subcategories.map((subcat) => (
              <Link
                key={subcat.id}
                href={`/category/${subcat.slug}`}
                className="block rounded-lg bg-muted p-2 text-sm transition-colors hover:bg-muted/80"
                prefetch={false}
              >
                {subcat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* price slider */}
      <div>
        <h3 className="mb-4 font-medium">محدوده قیمت (تومان)</h3>
        <Slider
          max={500}
          step={10}
          value={[localPriceRange[0], localPriceRange[1]]}
          defaultValue={[localPriceRange[0], localPriceRange[1]]}
          onValueChange={handlePriceChange}
          onValueCommit={applyPriceRange}
          className="mb-6"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{localPriceRange[0].toLocaleString("fa-IR")}K</span>
          <span>{localPriceRange[1].toLocaleString("fa-IR")}K</span>
        </div>
      </div>

      {/* status filters */}
      <div className="border-t border-border pt-6">
        <h3 className="mb-4 font-medium">وضعیت</h3>
        <div className="space-y-2">
          {[
            { id: "new", label: "محصولات جدید" },
            { id: "limited", label: "نسخه‌های محدود" },
            { id: "in-stock", label: "فقط موجود" },
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center">
              <Checkbox
                id={`filter-${id}`}
                checked={localFilters.includes(id)}
                onCheckedChange={() => toggleFilter(id)}
              />
              <Label htmlFor={`filter-${id}`} className="mr-2 text-sm">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* clear-all */}
      {(localFilters.length > 0 ||
        localPriceRange[0] > 0 ||
        localPriceRange[1] < 500) && (
        <div className="border-t border-border pt-6">
          <Button
            size="sm"
            variant="outline"
            onClick={clearAllFilters}
            className="w-full rounded-full"
          >
            پاک کردن فیلترها
          </Button>
        </div>
      )}
    </div>
  );
}
