"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllProducts, getProductByCategorySlug } from "@/lib/products";
import { toast } from "@/components/ui/use-toast";
import ProductGrid from "@/components/shop/product-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ShopPageClientProps {
  initialProducts: any[];
  categories: any[];
  totalPages: number;
  currentPage: number;
  currentCategory?: string;
  currentSearch?: string;
}

export default function ShopPageClient({
  initialProducts,
  totalPages: initialTotalPages,
  currentSearch,
}: ShopPageClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [searchTerm, setSearchTerm] = useState(currentSearch || "");

  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchProducts = async (
    page: number,
    category?: string,
    search?: string
  ) => {
    try {
      setLoading(true);
      let fetchedProducts;

      if (category) {
        fetchedProducts = await getProductByCategorySlug(category);
      } else {
        fetchedProducts = await getAllProducts();
      }

      setProducts((fetchedProducts as any)?.products || []);
      setTotalPages((fetchedProducts as any)?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "خطا در بارگذاری محصولات",
        description:
          "امکان بارگذاری محصولات وجود ندارد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ───────────────────  Header  ─────────────────── */}
      <header className="mb-8 space-y-6">
        <h1 className="font-vazirmatn text-3xl font-extrabold text-card-foreground">
          فروشگاه
        </h1>

        {/* 🔍 Search bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 sm:flex-row sm:gap-2"
        >
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="جستجو در محصولات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              dir="rtl"
              className="w-full rounded-full pr-10 font-vazirmatn"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-gradient-to-r from-primary to-secondary text-white transition-colors hover:from-primary/90 hover:to-secondary/90"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {/* CategoryFilters component is kept commented out, but styles already brand-aware */}
        {/*
        <CategoryFilters
          categories={categories}
          selectedCategory={currentCategory}
          onCategoryChange={handleCategoryChange}
        />
        */}
      </header>

      {/* ───────────────────  Products Grid  ─────────────────── */}
      <ProductGrid
        products={products}
        loading={loading}
        // currentPage={currentPage}
        // totalPages={totalPages}
        // onPageChange={handlePageChange}
      />
    </div>
  );
}
