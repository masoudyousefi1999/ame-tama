"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { ProductsTable } from "./products-table";
import { customFetch } from "@/lib/utils";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import type { IProductType } from "@/lib/products";
import { Search } from "lucide-react";

interface Product {
  uuid: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  category: string;
  rating: number;
  image: string;
}

interface ProductsPageClientProps {
  initialProducts: Product[];
  initialTotal: number;
  initialPage: number;
  initialLimit: number;
  searchResults?: any[];
  searchQuery?: string;
  onSearchResults?: (results: any[], query: string) => void;
}

/**
 * Client-side component for admin products page with infinite scroll
 * Implements professional infinite scroll pattern similar to shop page
 * Now supports live search results
 */
export function ProductsPageClient({
  initialProducts,
  initialTotal,
  initialPage,
  initialLimit,
  searchResults = [],
  searchQuery = "",
  onSearchResults,
}: ProductsPageClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length < initialTotal);
  const [error, setError] = useState<string | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);

  /**
   * Transform IProductType to Product format for the table
   */
  const transformProduct = useCallback((product: IProductType): Product => {
    return {
      uuid: product.uuid,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: product.quantity,
      category: product.category?.name || "بدون دسته‌بندی",
      rating: product.rating || 0,
      image: product.productMedia?.[0]?.url || "/placeholder.svg",
    };
  }, []);

  /**
   * Effect to handle search results updates
   */
  useEffect(() => {
    if (searchQuery.length === 0) {
      // Reset to initial products when search is cleared
      setProducts(initialProducts);
      setIsSearchMode(false);
      setHasMore(initialProducts.length < initialTotal);
      setPage(initialPage);
    } else if (searchResults.length >= 0) {
      // Transform and display search results
      const transformedResults = searchResults.map(transformProduct);
      setProducts(transformedResults);
      setIsSearchMode(true);
      setHasMore(false); // No infinite scroll in search mode
      setPage(1);
    }
  }, [
    searchResults,
    searchQuery,
    initialProducts,
    initialTotal,
    initialPage,
    transformProduct,
  ]);

  /**
   * Fetch more products from the API
   * Implements deduplication and error handling
   */
  const fetchMoreProducts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(initialLimit),
      });

      const response = await customFetch(`/product?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const result = await response.json();

      // Handle both array response and object response
      let newProductsRaw: IProductType[] = [];
      if (Array.isArray(result)) {
        newProductsRaw = result;
      } else {
        newProductsRaw = result.products || [];
      }

      // Transform products to table format
      const newProducts = newProductsRaw.map(transformProduct);

      // Deduplicate products based on uuid
      setProducts((prevProducts) => {
        const existingUuids = new Set(prevProducts.map((p) => p.uuid));
        const uniqueNewProducts = newProducts.filter(
          (p) => !existingUuids.has(p.uuid)
        );

        // If no new unique products, we've reached the end
        if (uniqueNewProducts.length === 0) {
          setHasMore(false);
          return prevProducts;
        }

        return [...prevProducts, ...uniqueNewProducts];
      });

      setPage(nextPage);

      // Check if there are more products to load
      const totalLoadedProducts = products.length + newProducts.length;
      setHasMore(totalLoadedProducts < initialTotal && newProducts.length > 0);
    } catch (err) {
      console.error("Error fetching more products:", err);
      setError(err instanceof Error ? err.message : "خطا در بارگذاری محصولات");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [
    isLoading,
    hasMore,
    page,
    initialLimit,
    products.length,
    initialTotal,
    transformProduct,
  ]);

  // Use the custom infinite scroll hook
  const { loaderRef } = useInfiniteScroll({
    onLoadMore: fetchMoreProducts,
    hasMore,
    isLoading,
    threshold: 0.1,
    rootMargin: "200px",
  });

  // Memoize data object to prevent unnecessary re-renders
  const tableData = useMemo(
    () => ({
      products,
      total: isSearchMode ? products.length : initialTotal,
      page,
      limit: initialLimit,
    }),
    [products, initialTotal, page, initialLimit, isSearchMode]
  );

  return (
    <div className="space-y-4">
      {/* Search mode indicator */}
      {isSearchMode && (
        <div className="px-6 pt-4" dir="rtl">
          <div className="flex items-center justify-between bg-purple-900/20 border border-purple-700 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-300">
                نتایج جستجو: {products.length} محصول یافت شد
              </span>
            </div>
          </div>
        </div>
      )}

      <ProductsTable data={tableData} />

      {/* Loading indicator */}
      {isLoading && !isSearchMode && (
        <div className="flex justify-center items-center py-8" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500" />
            <span className="text-sm text-gray-400">
              در حال بارگذاری محصولات...
            </span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          className="flex justify-center items-center py-4 text-red-400"
          dir="rtl"
        >
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* No more data indicator */}
      {!hasMore && products.length > 0 && !isLoading && !isSearchMode && (
        <div
          className="flex justify-center items-center py-6 text-gray-500"
          dir="rtl"
        >
          <span className="text-sm">تمام محصولات نمایش داده شدند</span>
        </div>
      )}

      {/* Empty state for normal mode */}
      {products.length === 0 && !isLoading && !isSearchMode && (
        <div
          className="flex flex-col justify-center items-center py-16 text-gray-400"
          dir="rtl"
        >
          <span className="text-lg mb-2">محصولی یافت نشد</span>
          <span className="text-sm">هنوز محصولی اضافه نشده است</span>
        </div>
      )}

      {/* Empty state for search mode */}
      {products.length === 0 && !isLoading && isSearchMode && (
        <div
          className="flex flex-col justify-center items-center py-16 text-gray-400"
          dir="rtl"
        >
          <Search className="h-16 w-16 mb-4 text-gray-600" />
          <span className="text-lg mb-2">محصولی یافت نشد</span>
          <span className="text-sm">نتیجه‌ای برای جستجوی شما پیدا نشد</span>
        </div>
      )}

      {/* Infinite scroll loader element */}
      {hasMore && !isSearchMode && <div ref={loaderRef} className="h-10" />}
    </div>
  );
}
