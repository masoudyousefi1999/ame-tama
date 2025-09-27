"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Loader2, X, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customFetch } from "@/lib/utils";
import { IProductType } from "@/lib/products";
import { formatPriceDivided } from "@/lib/format-price";

interface UnifiedSearchProps {
  className?: string;
}

export default function UnifiedSearch({ className = "" }: UnifiedSearchProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load recent searches
  useEffect(() => {
    const stored = localStorage.getItem("ame-tama-recent-searches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing recent searches:", error);
      }
    }
  }, []);

  // Close search when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
      setQuery("");
      setResults([]);
    };

    // Listen for route changes
    window.addEventListener("beforeunload", handleRouteChange);
    return () => window.removeEventListener("beforeunload", handleRouteChange);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Search functionality
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
        const response = await customFetch(`/product/search?${params}`);

        if (response.ok) {
          const data = await response.json();

          // Handle different response formats
          if (Array.isArray(data)) {
            setResults(data);
          } else if (data.products && Array.isArray(data.products)) {
            setResults(data.products);
          } else if (data.data && Array.isArray(data.data)) {
            setResults(data.data);
          } else {
            setResults([]);
          }
        } else {
          setResults([]);
        }
      } catch (error) {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Save recent search
  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const updated = [
      searchTerm,
      ...recentSearches.filter((s) => s !== searchTerm),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("ame-tama-recent-searches", JSON.stringify(updated));
  };

  // Handle product click
  const handleProductClick = (product: IProductType) => {
    if (isNavigating) return;

    setIsNavigating(true);
    saveRecentSearch(query);
    router.push(`/product/${product.slug}`);
    setTimeout(() => {
      setIsOpen(false);
      setIsNavigating(false);
    }, 200);
  };

  // Handle show all click
  const handleShowAll = () => {
    if (isNavigating) return;

    setIsNavigating(true);
    saveRecentSearch(query);
    const searchUrl = `/search?q=${encodeURIComponent(query.trim())}`;
    window.location.href = searchUrl;
  };

  // Handle recent search click
  const handleRecentSearch = (searchTerm: string) => {
    setQuery(searchTerm);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("ame-tama-recent-searches");
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      handleShowAll();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setQuery("");
  };

  // Handle backdrop click - enhanced for better reliability
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not any child elements
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  // Handle touch events for mobile
  const handleBackdropTouch = (e: React.TouchEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle search input click
  const handleSearchClick = () => {
    setIsOpen(true);
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Mobile: Magnifying Glass Icon */}
      <div className="md:hidden">
        <button
          onClick={handleSearchClick}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="جستجو"
          type="button"
        >
          <Search className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Desktop: Search Input */}
      <div
        className="hidden md:block relative cursor-pointer"
        onClick={handleSearchClick}
      >
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجوی محصولات..."
          className="w-full pr-10 pl-4 py-3 text-base cursor-pointer"
          onKeyDown={handleKeyDown}
          disabled={isNavigating}
          readOnly={!isOpen}
        />
        {query && isOpen && (
          <button
            onClick={handleClearSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded"
            type="button"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Search Results Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={handleBackdropClick}
          onTouchEnd={handleBackdropTouch}
        >
          {/* Mobile: Full backdrop for easier closing */}
          <div
            className="md:hidden absolute inset-0"
            onClick={handleBackdropClick}
          />

          <div
            className="absolute top-4 left-4 right-4 bottom-4 md:top-16 md:left-1/2 md:right-auto md:bottom-auto md:w-96 md:-translate-x-1/2 bg-background rounded-lg shadow-lg flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex-shrink-0">
              {/* Mobile: Header with close button */}
              <div className="md:hidden flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">جستجو</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  type="button"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو کنید..."
                  className="w-full pr-10 pl-4 py-3 text-base"
                  onKeyDown={handleKeyDown}
                  disabled={isNavigating}
                />
                {query && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded"
                    type="button"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
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
                      onClick={handleShowAll}
                      disabled={isNavigating}
                      className="p-0 h-auto text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      مشاهده همه
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Results List */}
                  <div className="space-y-2">
                    {results.slice(0, 5).map((item) => (
                      <div
                        key={item.uuid}
                        onClick={() => handleProductClick(item)}
                        className="w-full text-right p-3 rounded-lg hover:bg-muted active:bg-muted/80 transition-all duration-200 border border-transparent hover:border-border hover:shadow-sm touch-manipulation min-h-[60px] cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                            <Image
                              src={
                                item?.productMedia[0]?.url || "/placeholder.svg"
                              }
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {formatPriceDivided(item.price)}
                            </p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : query ? (
                <div className="flex flex-col items-center justify-center text-center py-12 px-4">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    نتیجه‌ای یافت نشد
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    هیچ محصولی با عبارت «{query}» یافت نشد. لطفاً عبارت دیگری را
                    جستجو کنید.
                  </p>
                </div>
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
                      onClick={clearRecentSearches}
                      className="p-0 h-auto text-muted-foreground hover:text-foreground"
                    >
                      پاک کردن
                    </Button>
                  </div>

                  {/* Recent Searches List */}
                  <div className="space-y-1">
                    {recentSearches.map((searchTerm, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleRecentSearch(searchTerm)}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-muted transition-all duration-200 text-right touch-manipulation cursor-pointer group"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground ml-3 group-hover:text-primary transition-colors" />
                        <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                          {searchTerm}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 px-4">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">جستجو کنید</h3>
                  <p className="text-sm text-muted-foreground">
                    نام محصول، دسته‌بندی یا شخصیت مورد نظر خود را جستجو کنید.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border flex-shrink-0">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className="hidden md:block">
                  برای بستن روی پس‌زمینه کلیک کنید
                </span>
                <span className="md:hidden">برای بستن روی X کلیک کنید</span>
                <span>Enter برای جستجو</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
