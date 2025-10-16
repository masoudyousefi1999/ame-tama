"use client";

import { useState, useCallback } from "react";
import { ProductSearch } from "./product-search";
import { ProductsPageClient } from "./products-page-client";

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

interface ProductsPageWrapperProps {
  initialProducts: Product[];
  initialTotal: number;
  initialPage: number;
  initialLimit: number;
}

/**
 * Wrapper component that connects ProductSearch with ProductsPageClient
 * Handles communication between search component and products display
 */
export function ProductsPageWrapper({
  initialProducts,
  initialTotal,
  initialPage,
  initialLimit,
}: ProductsPageWrapperProps) {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Handle search results from ProductSearch component
   * This callback is passed to ProductSearch and called when search completes
   */
  const handleSearchResults = useCallback((results: any[], query: string) => {
    setSearchResults(results);
    setSearchQuery(query);
  }, []);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-gray-800/80 rounded-lg border border-gray-700 p-4">
        <ProductSearch onSearchResults={handleSearchResults} />
      </div>

      {/* Products Table with Infinite Scroll */}
      <div className="bg-gray-800/80 rounded-lg border border-gray-700">
        <ProductsPageClient
          initialProducts={initialProducts}
          initialTotal={initialTotal}
          initialPage={initialPage}
          initialLimit={initialLimit}
          searchResults={searchResults}
          searchQuery={searchQuery}
          onSearchResults={handleSearchResults}
        />
      </div>
    </div>
  );
}
