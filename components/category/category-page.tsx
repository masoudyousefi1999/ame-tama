"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CategoryFilters from "@/components/category/category-filters";
import CategoryProducts from "@/components/category/category-products";
import { type ICategoryType } from "@/lib/categories";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IProductType } from "@/lib/products";
import Image from "next/image";

interface CategoryPageProps {
  category: ICategoryType & { image: string };
  subcategories?: ICategoryType[];
  sort: string;
  filter?: string;
  page: number;
  products: IProductType[];
}

export default function CategoryPage({
  category,
  subcategories = [],
  sort,
  filter,
  page,
  products,
}: CategoryPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    filter ? filter.split(",") : []
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // sync URL params with state
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    sort !== "newest" ? params.set("sort", sort) : params.delete("sort");
    selectedFilters.length
      ? params.set("filter", selectedFilters.join(","))
      : params.delete("filter");
    page > 1 ? params.set("page", page.toString()) : params.delete("page");

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.replace(newUrl, { scroll: false });
  }, [sort, selectedFilters, page, pathname, router, searchParams]);

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    newSort !== "newest" ? params.set("sort", newSort) : params.delete("sort");
    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.replace(newUrl);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16 md:mt-24">
      {/* Breadcrumb */}
      <Breadcrumb
        items={
          category.name === "figures"
            ? [{ label: "اکشن فیگور", href: `/category/`, isCurrent: true }]
            : [
                { label: "اکشن فیگور", href: `/category/figures` },
                {
                  label: category.name,
                  href: `/category/figures/${category.slug}`,
                  isCurrent: true,
                },
              ]
        }
        className="mb-4"
      />

      {/* Category Header with full, uncropped image */}
      <div className="w-full h-64 relative mb-8 rounded-lg overflow-hidden">
        <Image
          src={category.image || "/placeholder.jpg"}
          alt={category.name}
          fill
          sizes="100vw"
          style={{ objectFit: "contain" }}
          priority
        />
        <h1 className="absolute bottom-4 left-4 text-3xl font-extrabold text-black drop-shadow-lg font-vazirmatn">
          {category?.name === "figures" ? "فیگور ها" : category.name}
        </h1>
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-extrabold font-vazirmatn tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              زیردسته‌های&nbsp;{category.name}
            </h2>
            <span className="lg:hidden text-xs font-vazirmatn text-gray-400 dark:text-gray-500">
              ← پیمایش افقی →
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-8 md:overflow-visible">
            {subcategories.map((subcat) => (
              <Link
                key={subcat.id}
                href={`/category/figures/${subcat.slug}`}
                className="relative flex-none w-32 sm:w-36 md:w-full aspect-square snap-start rounded-3xl overflow-hidden group transition-transform duration-300 hover:-rotate-x-2 hover:rotate-y-2"
              >
                <div className="absolute inset-0 rounded-3xl backdrop-blur-xl bg-white/30 dark:bg-gray-800/30 shadow-xl shadow-black/5 ring-1 ring-white/20 dark:ring-black/40 transition-all duration-300 group-hover:shadow-2xl" />
                <Image
                  src={subcat.image ?? "/placeholder.jpg"}
                  alt={subcat.name}
                  fill
                  sizes="(max-width: 640px) 8rem, (max-width: 768px) 9rem, 18vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <span className="font-vazirmatn text-xs sm:text-sm md:text-base font-semibold text-white drop-shadow-lg tracking-wide">
                    {subcat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <CategoryFilters
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            category={category}
          />
        </div>

        {/* Mobile Filters & Sort */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span className="font-vazirmatn">فیلترها</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
              <div className="p-6 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium text-lg font-vazirmatn">
                    فیلترها
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFilterOpen(false)}
                    className="rounded-full h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CategoryFilters
                  priceRange={priceRange}
                  onPriceRangeChange={handlePriceRangeChange}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  category={category}
                  onClose={() => setIsFilterOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-transparent text-sm border-none focus:ring-0 font-vazirmatn"
            >
              <option value="newest">جدیدترین</option>
              <option value="price-asc">قیمت: کم به زیاد</option>
              <option value="price-desc">قیمت: زیاد به کم</option>
              <option value="popular">محبوب‌ترین</option>
            </select>
          </div>
        </div>

        {/* Products */}
        <div className="flex-1">
          <div className="hidden lg:flex justify-end mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">
                مرتب‌سازی:
              </span>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-transparent text-sm border-none focus:ring-0 font-vazirmatn"
              >
                <option value="newest">جدیدترین</option>
                <option value="price-asc">قیمت: کم به زیاد</option>
                <option value="price-desc">قیمت: زیاد به کم</option>
                <option value="popular">محبوب‌ترین</option>
              </select>
            </div>
          </div>
          <CategoryProducts products={products} viewMode={"grid"} />
        </div>
      </div>
    </div>
  );
}
