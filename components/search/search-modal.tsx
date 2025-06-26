"use client";

import type React from "react";
import { useState, useEffect, ComponentProps } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2, LucideIcon } from "lucide-react";
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

interface EmptyStateProps {
  icon: LucideIcon; // lucide icon component
  title: string;
  description: string;
  className?: string; // optional extra classes
  iconProps?: ComponentProps<LucideIcon>; // forward any icon props you might need
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  iconProps,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12",
        className
      )}
    >
      {/* icon */}
      <Icon
        {...iconProps}
        className={cn(
          "mb-4 h-12 w-12 text-muted-foreground",
          iconProps?.className
        )}
      />

      {/* title */}
      <h3 className="mb-2 text-lg font-medium font-vazirmatn text-foreground">
        {title}
      </h3>

      {/* description */}
      <p className="max-w-xs text-sm text-muted-foreground font-vazirmatn">
        {description}
      </p>
    </div>
  );
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
      setResults(searchResults as any);
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

  const handleProductClick = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-xl p-0 gap-0"
        onKeyDown={handleKeyDown}
      >
        <DialogTitle className="sr-only">Search Products</DialogTitle>

        {/* 🔍 Search input */}
        <div className="p-4 border-b border">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="جستجو کنید..."
            title="search"
            autoFocus
            className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-brand font-vazirmatn
                     bg-background text-foreground"
          />
        </div>

        {/* 🏷️ Filters */}
        {uniqueCategories.length > 0 && (
          <div className="p-4 border-b border overflow-x-auto">
            <div className="flex gap-x-2 gap-x-reverse">
              {uniqueCategories.map((category) => (
                <Badge
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  className={cn(
                    "cursor-pointer font-vazirmatn",
                    selectedCategory !== category && "hover:bg-muted"
                  )}
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 📦 Results / states */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-muted-foreground font-vazirmatn">
                  {results.length} نتیجه برای «{query}»
                </h3>
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleSearch}
                  className="p-0 h-auto text-brand font-vazirmatn"
                >
                  مشاهده همه
                </Button>
              </div>

              <div className="space-y-2">
                {results.slice(0, 5).map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.id}`}
                    className="flex items-center p-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={handleProductClick}
                  >
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="mr-3 flex-1">
                      <h4 className="text-sm font-medium font-vazirmatn">
                        {item.name}
                      </h4>
                      <p className="text-sm text-muted-foreground font-vazirmatn">
                        {item.price.toLocaleString("fa-IR")} تومان
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {results.length > 5 && (
                <Button
                  onClick={handleSearch}
                  className="w-full rounded-full bg-muted hover:bg-muted/70 text-foreground font-vazirmatn"
                >
                  مشاهده همه {results.length} نتیجه
                </Button>
              )}
            </>
          ) : query ? (
            <EmptyState
              icon={Search}
              title="نتیجه‌ای یافت نشد"
              description={`هیچ محصولی با عبارت «${query}» یافت نشد. لطفاً عبارت دیگری را جستجو کنید.`}
            />
          ) : recentSearches.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-muted-foreground font-vazirmatn">
                  جستجوهای اخیر
                </h3>
                <Button
                  variant="link"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="p-0 h-auto text-muted-foreground font-vazirmatn"
                >
                  پاک کردن
                </Button>
              </div>

              <div className="space-y-2">
                {recentSearches.map((s, idx) => (
                  <button
                    key={idx}
                    className="flex items-center w-full p-2 rounded-lg hover:bg-muted transition-colors text-right"
                    onClick={() => selectRecentSearch(s)}
                  >
                    <Search className="h-4 w-4 text-muted-foreground ml-2" />
                    <span className="text-sm font-vazirmatn">{s}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={Search}
              title="جستجو در محصولات"
              description="نام محصول، شخصیت یا سری انیمه مورد نظر خود را جستجو کنید."
            />
          )}
        </div>

        {/* CTA */}
        {query && (
          <div className="p-4 border-t border">
            <Button
              onClick={handleSearch}
              className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
            >
              <Search className="ml-2 h-4 w-4" />
              جستجوی «{query}»
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
