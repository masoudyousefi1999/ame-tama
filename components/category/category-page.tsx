"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import CategoryHeader from "@/components/category/category-header"
import CategoryFilters from "@/components/category/category-filters"
import CategoryProducts from "@/components/category/category-products"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { getProductsByCategory } from "@/lib/products"
import type { Category } from "@/lib/categories"

interface CategoryPageProps {
  category: Category
  sort: string
  filter?: string
  page: number
}

export default function CategoryPage({ category, sort, filter, page }: CategoryPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [products, setProducts] = useState(getProductsByCategory(category.id))
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [selectedFilters, setSelectedFilters] = useState<string[]>(filter ? filter.split(",") : [])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // تعداد محصولات در هر صفحه
  const PRODUCTS_PER_PAGE = 9

  // محاسبه تعداد کل صفحات
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)

  // محصولات صفحه فعلی
  const currentPageProducts = filteredProducts.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE)

  // اعمال فیلترها و مرتب‌سازی
  useEffect(() => {
    let result = [...products]

    // فیلتر بر اساس قیمت
    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // فیلترهای انتخاب شده
    if (selectedFilters.length > 0) {
      result = result.filter((product) => {
        if (selectedFilters.includes("new") && !product.isNew) return false
        if (selectedFilters.includes("limited") && !product.isLimited) return false
        if (selectedFilters.includes("in-stock") && product.availability !== "in-stock") return false
        return true
      })
    }

    // مرتب‌سازی
    switch (sort) {
      case "newest":
        result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
        break
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "popular":
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        break
    }

    setFilteredProducts(result)
  }, [products, priceRange, selectedFilters, sort])

  // تغییر URL با تغییر فیلترها
  const updateQueryParams = (newSort?: string, newFilters?: string[], newPage?: number) => {
    const params = new URLSearchParams()

    if (newSort || sort) params.set("sort", newSort || sort)
    if (newFilters?.length || selectedFilters.length) {
      params.set("filter", newFilters?.join(",") || selectedFilters.join(","))
    }
    if (newPage && newPage > 1) params.set("page", newPage.toString())

    router.push(`${pathname}?${params.toString()}`)
  }

  // تغییر مرتب‌سازی
  const handleSortChange = (newSort: string) => {
    updateQueryParams(newSort, selectedFilters, page)
  }

  // تغییر فیلترها
  const handleFilterChange = (newFilters: string[]) => {
    setSelectedFilters(newFilters)
    updateQueryParams(sort, newFilters, 1) // برگشت به صفحه اول با تغییر فیلترها
  }

  // تغییر محدوده قیمت
  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range)
  }

  // تغییر صفحه
  const handlePageChange = (newPage: number) => {
    updateQueryParams(sort, selectedFilters, newPage)
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      {/* هدر دسته‌بندی */}
      <CategoryHeader category={category} productCount={filteredProducts.length} />

      <div className="flex flex-col md:flex-row gap-8">
        {/* فیلترهای دسکتاپ */}
        <div className="hidden md:block w-64">
          <CategoryFilters
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            category={category}
          />
        </div>

        <div className="flex-1">
          {/* نوار مرتب‌سازی و فیلترها */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 font-vazirmatn">
                {filteredProducts.length} محصول
              </span>

              {/* دکمه فیلتر موبایل */}
              <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden rounded-full ml-2 font-vazirmatn">
                    <Filter className="h-4 w-4 ml-2" />
                    فیلترها
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle className="font-vazirmatn">فیلترها</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <CategoryFilters
                      priceRange={priceRange}
                      onPriceRangeChange={handlePriceRangeChange}
                      selectedFilters={selectedFilters}
                      onFilterChange={handleFilterChange}
                      category={category}
                      onClose={() => setIsMobileFiltersOpen(false)}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* مرتب‌سازی */}
            <div className="flex items-center mt-4 sm:mt-0 gap-x-4">
              <label htmlFor="sort" className="text-sm font-vazirmatn">
                مرتب‌سازی:
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-1 pl-8 pr-4 text-sm font-vazirmatn text-gray-900 dark:text-gray-100 appearance-none relative"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3csvg fill='none' stroke='%23999' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3e%3c/path%3e%3c/svg%3e\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "left 0.5rem center",
                  backgroundSize: "1rem 1rem",
                }}
              >
                <option value="newest" className="font-vazirmatn">
                  جدیدترین
                </option>
                <option value="price-asc" className="font-vazirmatn">
                  قیمت: کم به زیاد
                </option>
                <option value="price-desc" className="font-vazirmatn">
                  قیمت: زیاد به کم
                </option>
                <option value="popular" className="font-vazirmatn">
                  محبوب‌ترین
                </option>
              </select>

              {/* دکمه‌های تغییر نوع نمایش */}
              <div className="hidden sm:flex ml-4 border border-gray-300 dark:border-gray-700 rounded-full overflow-hidden">
                <button
                  className={`px-3 py-1 ${
                    viewMode === "grid"
                      ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                      : ""
                  }`}
                  onClick={() => setViewMode("grid")}
                  aria-label="نمایش شبکه‌ای"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button
                  className={`px-3 py-1 ${
                    viewMode === "list"
                      ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                      : ""
                  }`}
                  onClick={() => setViewMode("list")}
                  aria-label="نمایش لیستی"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* نمایش محصولات */}
          <CategoryProducts products={currentPageProducts} viewMode={viewMode} />

          {/* صفحه‌بندی */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-x-1 gap-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full font-vazirmatn"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  قبلی
                </Button>

                {Array.from({ length: totalPages }).map((_, index) => (
                  <Button
                    key={index}
                    variant={page === index + 1 ? "default" : "outline"}
                    size="sm"
                    className="rounded-full w-10 font-vazirmatn"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full font-vazirmatn"
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  بعدی
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
