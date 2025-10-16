"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { customFetch } from "@/lib/utils";

interface ProductSearchProps {
  onSearchResults?: (results: any[], query: string) => void;
}

/**
 * Product search component with live search (debounced)
 * Automatically searches when user types at least 3 characters
 */
export function ProductSearch({ onSearchResults }: ProductSearchProps) {
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Perform the actual search using the API
   */
  const performSearch = useCallback(
    async (query: string) => {
      try {
        const params = new URLSearchParams({
          search: query,
          page: "1",
          limit: "20",
        });

        const response = await customFetch(
          `/product/search?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to search products");
        }

        const data = await response.json();

        // Handle both array and object response formats
        const results = Array.isArray(data) ? data : data.products || [];

        // Notify parent component with results
        if (onSearchResults) {
          onSearchResults(results, query);
        }
      } catch (error) {
        console.error("Search error:", error);
        if (onSearchResults) {
          onSearchResults([], query);
        }
      } finally {
        setIsSearching(false);
      }
    },
    [onSearchResults]
  );

  /**
   * Debounced search effect
   * Triggers search after user stops typing for 500ms
   */
  useEffect(() => {
    // Only search if query is at least 3 characters
    if (search.length < 3) {
      // Reset results if search is cleared
      if (search.length === 0 && onSearchResults) {
        onSearchResults([], "");
      }
      return;
    }

    setIsSearching(true);

    // Debounce: wait 500ms after user stops typing
    const timer = setTimeout(() => {
      performSearch(search);
    }, 500);

    // Cleanup: cancel previous timer if user keeps typing
    return () => clearTimeout(timer);
  }, [search, onSearchResults, performSearch]);

  /**
   * Clear search and reset results
   */
  const handleClear = () => {
    setSearch("");
    if (onSearchResults) {
      onSearchResults([], "");
    }
  };

  return (
    <div dir="rtl">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />

        <Input
          placeholder="جستجوی محصولات... (حداقل 3 کاراکتر)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10 pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
        />

        {/* Loading spinner or clear button */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {isSearching ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500" />
          ) : search.length > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-300 transition-colors"
              aria-label="پاک کردن جستجو"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Search status message */}
      {search.length > 0 && search.length < 3 && (
        <p className="text-xs text-gray-500 mt-2">
          حداقل 3 کاراکتر برای جستجو وارد کنید
        </p>
      )}
    </div>
  );
}
