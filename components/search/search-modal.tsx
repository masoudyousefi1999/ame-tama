"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { searchProducts, type SearchResult } from "@/lib/search";
import { DialogTitle } from "@radix-ui/react-dialog";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (query: string) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  query,
  onQueryChange,
}: SearchModalProps) {
  const router = useRouter();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const storedSearches = localStorage.getItem("ame-tama-recent-searches");
    if (storedSearches) {
      try {
        setRecentSearches(JSON.parse(storedSearches));
      } catch (error) {
        console.error("Error parsing recent searches:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(true);
      const searchResults = searchProducts(query);
      setResults(searchResults);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedCategory]);

  const uniqueCategories = Array.from(
    new Set(results.map((item) => item.category))
  );

  const handleSearch = () => {
    if (!query.trim()) return;

    const updatedSearches = [
      query,
      ...recentSearches.filter((s) => s !== query),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem(
      "ame-tama-recent-searches",
      JSON.stringify(updatedSearches)
    );

    router.push(
      `/search?q=${encodeURIComponent(query)}${
        selectedCategory
          ? `&category=${encodeURIComponent(selectedCategory)}`
          : ""
      }`
    );
    onClose();
  };

  const selectRecentSearch = (search: string) => {
    onQueryChange(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("ame-tama-recent-searches");
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-xl p-0 gap-0"
        onKeyDown={handleKeyDown}
      >
        <DialogTitle className="sr-only">Search Products</DialogTitle>
        {/* 🔍 Search Input */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="جستجو کنید..."
            title="search"
            autoFocus
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-vazirmatn"
          />
        </div>

        {/* 🏷️ Filters */}
        {uniqueCategories.length > 0 && (
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 overflow-x-auto">
            <div className="flex gap-x-2 gap-x-reverse">
              {uniqueCategories.map((category) => (
                <Badge
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  className={cn(
                    "cursor-pointer font-vazirmatn",
                    selectedCategory === category
                      ? "bg-purple-500 hover:bg-purple-600"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 📦 Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 font-vazirmatn">
                  {results.length} نتیجه برای "{query}"
                </h3>
                <Button
                  variant="link"
                  size="sm"
                  className="text-purple-600 dark:text-purple-400 p-0 h-auto font-vazirmatn"
                  onClick={handleSearch}
                >
                  مشاهده همه
                </Button>
              </div>

              <div className="space-y-2">
                {results.slice(0, 5).map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.id}`}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={onClose}
                  >
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="mr-3 flex-1">
                      <h4 className="text-sm font-medium font-vazirmatn">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">
                        {item.price.toLocaleString("fa-IR")} تومان
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {results.length > 5 && (
                <Button
                  className="w-full rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-vazirmatn"
                  onClick={handleSearch}
                >
                  مشاهده همه {results.length} نتیجه
                </Button>
              )}
            </div>
          ) : query ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="text-lg font-medium mb-2 font-vazirmatn">
                نتیجه‌ای یافت نشد
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-vazirmatn">
                هیچ محصولی با عبارت "{query}" یافت نشد. لطفاً عبارت دیگری را
                جستجو کنید.
              </p>
            </div>
          ) : recentSearches.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 font-vazirmatn">
                  جستجوهای اخیر
                </h3>
                <Button
                  variant="link"
                  size="sm"
                  className="text-gray-500 dark:text-gray-400 p-0 h-auto font-vazirmatn"
                  onClick={clearRecentSearches}
                >
                  پاک کردن
                </Button>
              </div>

              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    className="flex items-center w-full text-right p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => selectRecentSearch(search)}
                  >
                    <Search className="h-4 w-4 text-gray-400 ml-2" />
                    <span className="text-sm font-vazirmatn">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="text-lg font-medium mb-2 font-vazirmatn">
                جستجو در محصولات
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-vazirmatn">
                نام محصول، شخصیت یا سری انیمه مورد نظر خود را جستجو کنید.
              </p>
            </div>
          )}
        </div>

        {/* ✅ Footer Action */}
        {query && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <Button
              className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
              onClick={handleSearch}
            >
              <Search className="ml-2 h-4 w-4" />
              جستجوی "{query}"
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
