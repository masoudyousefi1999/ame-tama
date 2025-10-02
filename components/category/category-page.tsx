"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CategoryFilters from "@/components/category/category-filters";
import CategoryProducts from "@/components/category/category-products";
import { type ICategoryType } from "@/lib/categories";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { customFetch } from "@/lib/utils";
import Link from "next/link";
import { IProductType } from "@/lib/products";
import { CustomImage as Image } from "@/components/ui/custom-image";
import CategoryHeader from "./category-header";
import { productLimit } from "@/lib/product-limit";
import { GoToTopButton } from "@/components/go-to-top-button";

interface CategoryPageProps {
  category: ICategoryType & { image: string };
  subcategories?: ICategoryType[];
  sort: string;
  filter?: string;
  page: number;
  products: IProductType[];
  totalCount: number;
  limit: number;
}

export default function CategoryPage({
  category,
  subcategories = [],
  sort,
  filter,
  page: initialPage,
  products: initialProducts,
  totalCount,
  limit,
}: CategoryPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    filter ? filter.split(",") : []
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length < totalCount);
  const loader = useRef<HTMLDivElement | null>(null);

  // Infinite scroll effect
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loader, hasMore, loading]);

  const handlePriceRangeChange = useCallback((range: [number, number]) => {
    setPriceRange(range);
  }, []);

  const handleFilterChange = useCallback((filters: string[]) => {
    setSelectedFilters(filters);
  }, []);

  const handleSortChange = useCallback(
    (newSort: string) => {
      const params = new URLSearchParams(searchParams.toString());
      newSort !== "newest"
        ? params.set("sort", newSort)
        : params.delete("sort");
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.replace(newUrl);
    },
    [searchParams, pathname, router]
  );

  const fetchMore = useCallback(async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      let url = `/product/category/${category.slug}?page=${nextPage}&limit=${productLimit}`;
      const res = await customFetch(url, { method: "GET" });
      const result = await res.json();
      const newProducts = result.products || [];
      setProducts((prev: IProductType[]) => {
        const existingUuids = new Set(prev.map((p: IProductType) => p.uuid));
        const filteredNew = newProducts.filter(
          (p: IProductType) => !existingUuids.has(p.uuid)
        );
        return [...prev, ...filteredNew];
      });
      setPage((prev) => prev + 1);
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(newProducts.length === productLimit);
      }
    } catch (error) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, category.slug]);

  // Memoize breadcrumb items
  const breadcrumbItems = useMemo(() => {
    return category.name === "figures"
      ? [{ label: "اکشن فیگور", href: `/category/`, isCurrent: true }]
      : [
          { label: "اکشن فیگور", href: `/category/figures` },
          {
            label: category.name,
            href: `/category/figures/${category.slug}`,
            isCurrent: true,
          },
        ];
  }, [category.name, category.slug]);

  // Memoize subcategories section
  const subcategoriesSection = useMemo(() => {
    if (subcategories.length === 0) return null;

    return (
      <section className="mb-14">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-2xl font-extrabold text-transparent tracking-tight">
            زیردسته‌های&nbsp;{category.name}
          </h2>
          <span className="text-xs text-muted-foreground lg:hidden">
            ← پیمایش افقی →
          </span>
        </div>
        <div className="scrollbar-thin scrollbar-thumb-border dark:scrollbar-thumb-border flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-8 md:overflow-visible lg:grid-cols-4 xl:grid-cols-5">
          {subcategories.map((subcat) => (
            <Link
              key={subcat.id}
              prefetch={false}
              href={`/category/figures/${subcat.slug}`}
              className="group relative aspect-square w-32 flex-none snap-start overflow-hidden rounded-3xl transition-all duration-300 hover:scale-105 hover:rotate-2 sm:w-36 md:w-full"
            >
              <Image
                src={subcat.image ?? "/placeholder.jpg"}
                alt={subcat.name}
                fill
                sizes="(max-width:640px) 8rem, (max-width:768px) 9rem, 18vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1"
                loading="lazy"
                quality={75}
              />
              <div className="absolute inset-0 flex items-end justify-center pb-4">
                <span className="font-sans text-xs font-semibold tracking-wide text-accent sm:text-sm md:text-base drop-shadow-lg">
                  {subcat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }, [subcategories, category.name]);

  return (
    <div className="container mx-auto mt-16 px-4 py-8 md:mt-24">
      {/* breadcrumb */}
      <Breadcrumb items={breadcrumbItems} className="mb-4" />

      {/* hero header */}
      <CategoryHeader category={category} />

      {/* sub-categories */}
      {subcategoriesSection}

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* desktop filters */}
        <div className="hidden w-64 flex-shrink-0 lg:block">
          <CategoryFilters
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            category={category}
          />
        </div>

        {/* mobile filter & sort */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span>فیلترها</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0 sm:w-[400px]">
              <div className="h-full overflow-y-auto p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="  text-lg font-medium">فیلترها</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFilterOpen(false)}
                    className="h-8 w-8 rounded-full"
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
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <label htmlFor="mobile-sort" className="sr-only">
              مرتب‌سازی
            </label>
            <select
              id="mobile-sort"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-sm text-foreground bg-transparent border-none focus:ring-0"
              aria-label="مرتب‌سازی محصولات"
            >
              <option value="newest">جدیدترین</option>
              <option value="price-asc">قیمت: کم به زیاد</option>
              <option value="price-desc">قیمت: زیاد به کم</option>
              <option value="popular">محبوب‌ترین</option>
            </select>
          </div>
        </div>

        {/* products */}
        <div className="flex-1">
          <div className="mb-6 hidden justify-end lg:flex">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">مرتب‌سازی:</span>
              <label htmlFor="desktop-sort" className="sr-only">
                مرتب‌سازی
              </label>
              <select
                id="desktop-sort"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm text-foreground bg-transparent border-none focus:ring-0"
                aria-label="مرتب‌سازی محصولات"
              >
                <option value="newest">جدیدترین</option>
                <option value="price-asc">قیمت: کم به زیاد</option>
                <option value="price-desc">قیمت: زیاد به کم</option>
                <option value="popular">محبوب‌ترین</option>
              </select>
            </div>
          </div>

          <CategoryProducts products={products} viewMode="grid" />
          {loading && (
            <div className="flex justify-center py-8">
              <span className="text-muted-foreground">در حال بارگذاری...</span>
            </div>
          )}
          <div ref={loader} />
        </div>
      </div>
    </div>
  );
}
