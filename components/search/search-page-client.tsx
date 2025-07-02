"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchProducts } from "@/lib/search";
import { toast } from "@/components/ui/use-toast";
import ProductGrid from "@/components/shop/product-grid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchPageClientProps {
  initialResults: any[];
  query: string;
  currentPage: number;
  totalPages: number;
}

export default function SearchPageClient({
  initialResults,
  query: initialQuery,
  currentPage,
  totalPages: initialTotalPages,
}: SearchPageClientProps) {
  const [results, setResults] = useState(initialResults);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [query, setQuery] = useState(initialQuery);

  const router = useRouter();
  const searchParams = useSearchParams();

  const performSearch = async (searchQuery: string, page = 1) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const searchResults = await searchProducts(searchQuery);
      setResults((searchResults as any)?.products || []);
      setTotalPages((searchResults as any)?.totalPages || 1);
    } catch (error) {
      console.error("Error searching products:", error);
      toast({
        title: "خطا در جستجو",
        description: "امکان جستجو وجود ندارد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
      setResults([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ── Header ────────────────────────────────────── */}
      <header className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">جستجو</h1>

        {/* 🔍 Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="جستجو در محصولات..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-background border focus:ring-brand"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {initialQuery && (
          <p className="text-muted-foreground">
            نتایج جستجو برای «{initialQuery}»
          </p>
        )}
      </header>

      {/* ── Results grid ──────────────────────────────── */}
      <ProductGrid
        products={results}
        loading={loading}
        /* paging props kept but commented */
      />
    </div>
  );
}
