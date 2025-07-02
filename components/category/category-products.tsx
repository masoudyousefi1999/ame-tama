"use client";

import type React from "react";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { toast } from "@/components/ui/use-toast";
import { ProductCard } from "@/components/product/product-card";
import type { IProductType } from "@/lib/products";

interface CategoryProductsProps {
  products: IProductType[];
  viewMode: "grid" | "list";
}

export default function CategoryProducts({
  products,
  viewMode,
}: CategoryProductsProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const { addItem } = useCart();

  // افزودن محصول به سبد خرید
  const handleAddToCart = (product: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      addItem(product, 1);
      toast({
        title: "محصول به سبد خرید اضافه شد",
        description: `${product.name} به سبد خرید شما اضافه شد.`,
      });
    } catch (error) {
      toast({
        title: "خطا در افزودن به سبد خرید",
        description: "مشکلی در افزودن محصول به سبد خرید رخ داد.",
        variant: "destructive",
      });
    }
  };

  // افزودن محصول به علاقه‌مندی‌ها
  const handleAddToWishlist = (product: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      toast({
        title: "محصول به علاقه‌مندی‌ها اضافه شد",
        description: `${product.name} به لیست علاقه‌مندی‌های شما اضافه شد.`,
      });
    } catch (error) {
      toast({
        title: "خطا در افزودن به علاقه‌مندی‌ها",
        description: "مشکلی در افزودن محصول به علاقه‌مندی‌ها رخ داد.",
        variant: "destructive",
      });
    }
  };

  // اگر محصولی وجود نداشت
  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto mb-4 h-12 w-12 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mb-2 text-lg font-medium">محصولی یافت نشد</h3>
        <p className="  text-muted-foreground">
          با معیارهای فیلتر فعلی محصولی یافت نشد. لطفاً فیلترها را تغییر دهید.
        </p>
      </div>
    );
  }

  /* ---------- list view ---------- */
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.uuid}
            className="rounded-lg bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            <ProductCard
              product={product}
              variant="wishlist"
              className="border-0 shadow-none"
              showAddToCart
              showAddToWishlist
            />
          </div>
        ))}
      </div>
    );
  }

  /* ---------- grid view (default) ---------- */
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.uuid}
          product={product}
          showAddToCart
          showAddToWishlist
        />
      ))}
    </div>
  );
}
