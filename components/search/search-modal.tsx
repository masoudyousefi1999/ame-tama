"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Loader2, LucideIcon, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { customFetch } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { IProductType } from "@/lib/products";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (query: string) => void;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  iconProps?: React.ComponentProps<LucideIcon>;
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
      <Icon
        {...iconProps}
        className={cn(
          "mb-4 h-12 w-12 text-muted-foreground",
          iconProps?.className
        )}
      />
      <h3 className="mb-2 text-lg font-medium text-foreground">{title}</h3>
      <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
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
  const [results, setResults] = useState<IProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);

  // Load recent searches on mount
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

  // Clear search when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        onQueryChange("");
        setResults([]);
        setIsNavigating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onQueryChange]);

  // Search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("search", query.trim());
        const res = await customFetch(`/product/search?${params.toString()}`);
        const data = await res.json();

        let items: IProductType[] = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (data.products && Array.isArray(data.products)) {
          items = data.products;
        }

        setResults(items);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle search navigation
  const handleSearchNavigation = (searchQuery: string) => {
    if (!searchQuery.trim() || isNavigating) return;

    setIsNavigating(true);

    // Save to recent searches
    const updatedSearches = [
      searchQuery.trim(),
      ...recentSearches.filter((s) => s !== searchQuery.trim()),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem(
      "ame-tama-recent-searches",
      JSON.stringify(updatedSearches)
    );

    // Navigate to search page
    const searchUrl = `/search?q=${encodeURIComponent(searchQuery.trim())}`;

    // Use window.location for reliable navigation on all devices
    window.location.href = searchUrl;
  };

  // Handle recent search selection
  const handleRecentSearchClick = (searchTerm: string) => {
    onQueryChange(searchTerm);
  };

  // Clear recent searches
  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("ame-tama-recent-searches");
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      handleSearchNavigation(query);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-xl p-0 gap-0 max-h-[90vh] overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        <DialogTitle className="sr-only">جستجوی محصولات</DialogTitle>

        {/* Search Header */}
        <div className="p-4 border-b border-border bg-background sticky top-0 z-10">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="جستجو کنید..."
              className="w-full pr-10 pl-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              autoFocus
              disabled={isNavigating}
            />
            {query && (
              <button
                onClick={() => onQueryChange("")}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : results.length > 0 ? (
            <div className="p-4">
              {/* Results Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {results.length} نتیجه برای «{query}»
                </h3>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => handleSearchNavigation(query)}
                  disabled={isNavigating}
                  className="p-0 h-auto text-primary hover:text-primary/80"
                >
                  مشاهده همه
                </Button>
              </div>

              {/* Results List */}
              <div className="space-y-3">
                {results.slice(0, 5).map((item) => (
                  <button
                    key={item.uuid}
                    onClick={() => {
                      if (isNavigating) return;
                      setIsNavigating(true);
                      router.push(`/product/${item.slug}`);
                      setTimeout(() => onClose(), 200);
                    }}
                    className="w-full text-right"
                    disabled={isNavigating}
                  >
                    <div className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border">
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item?.productMedia[0]?.url || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="mr-3 flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.price.toLocaleString("fa-IR")} تومان
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : query ? (
            <EmptyState
              icon={Search}
              title="نتیجه‌ای یافت نشد"
              description={`هیچ محصولی با عبارت «${query}» یافت نشد. لطفاً عبارت دیگری را جستجو کنید.`}
            />
          ) : recentSearches.length > 0 ? (
            <div className="p-4">
              {/* Recent Searches Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  جستجوهای اخیر
                </h3>
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleClearRecentSearches}
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                >
                  پاک کردن
                </Button>
              </div>

              {/* Recent Searches List */}
              <div className="space-y-2">
                {recentSearches.map((searchTerm, idx) => (
                  <button
                    key={idx}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-muted transition-colors text-right"
                    onClick={() => handleRecentSearchClick(searchTerm)}
                  >
                    <Search className="h-4 w-4 text-muted-foreground ml-3" />
                    <span className="text-sm text-foreground">
                      {searchTerm}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="جستجو در محصولات"
              description="نام محصول، شخصیت یا سری انیمه مورد نظر خود را جستجو کنید."
            />
          )}
        </div>

        {/* Search Button */}
        {query.trim() && (
          <div className="p-4 border-t border-border bg-background">
            <Button
              onClick={() => handleSearchNavigation(query)}
              disabled={isNavigating}
              className="w-full rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isNavigating ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="ml-2 h-4 w-4" />
              )}
              جستجوی «{query}»
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
