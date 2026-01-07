"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { toast } from "@/components/ui/use-toast";
import { ProductCard } from "@/components/product/product-card";

interface NewArrivalsProps {
  products: any[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const { addItem } = useCart();

  // افزودن محصول به سبد خرید
  const handleAddToCart = (product: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    addItem(product, 1);
    toast({
      title: "محصول به سبد خرید اضافه شد",
      description: `${product.name} به سبد خرید شما اضافه شد.`,
    });
  };

  // افزودن محصول به علاقه‌مندی‌ها
  const handleAddToWishlist = (product: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    toast({
      title: "محصول به علاقه‌مندی‌ها اضافه شد",
      description: `${product.name} به لیست علاقه‌مندی‌های شما اضافه شد.`,
    });
  };

  return (
    <section id="new-arrivals">
      {/* ————— Header ————— */}
      <div className="mb-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold leading-snug">محصولات&nbsp;جدید</h2>
          <p className="mt-1 text-muted-foreground">
            تازه‌ترین مجسمه‌های اضافه‌شده به AME-TAMA
          </p>
        </div>

        {/* desktop CTA */}
        <Button
          asChild
          variant="outline"
          className="hidden sm:inline-flex rounded-full border-primary/30 hover:bg-primary/5 dark:border-primary/50"
        >
          <Link href="/shop?tab=all&sort=newest">
            مشاهده&nbsp;همه
            <ArrowRight className="-scale-x-100 mr-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* ————— Product Grid ————— */}
      <div dir="rtl" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p, index) => (
          <div key={p?.id ?? p?.uuid ?? p?.slug}>
            <ProductCard
              product={p}
              showAddToCart
              showAddToWishlist
              eagerLoad={index < 3} // چند محصول اول سریع‌تر لود شوند
            />
          </div>
        ))}
      </div>

      {/* mobile CTA */}
      <Button
        asChild
        variant="outline"
        className="mt-6 w-full sm:hidden rounded-full border-primary/30 hover:bg-primary/5 dark:border-primary/50"
      >
        <Link href="/shop?tab=all&sort=newest">
          مشاهده&nbsp;همه&nbsp;محصولات&nbsp;جدید
          <ArrowRight className="-scale-x-100 mr-1.5 h-4 w-4" />
        </Link>
      </Button>
    </section>
  );
}
