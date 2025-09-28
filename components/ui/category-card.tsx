"use client";

import { memo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useImagePreload } from "@/components/ui/smart-preload";
import { CategoryImage } from "@/components/ui/category-image";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard = memo(({ category }: CategoryCardProps) => {
  const isMobile = useIsMobile();

  // Preload category image when component mounts
  useImagePreload(category.image || "", !!category.image, 200);

  return (
    <Link
      href={`/category/${category.slug}`}
      prefetch={false}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card bg-opacity-50 transition-all duration-300",
        // Reduce effects on mobile for better performance
        isMobile
          ? "shadow-md"
          : "shadow-card hover:shadow-2xl hover:scale-[1.02]"
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        <CategoryImage
          src={category.image || ""}
          alt={category.name}
          className="transition-transform duration-500 group-hover:scale-105"
          fallbackIcon="📦"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {category.description}
          </p>
        )}
        {category.productCount !== undefined && (
          <p className="text-xs text-muted-foreground">
            {category.productCount} محصول
          </p>
        )}
      </div>
    </Link>
  );
});

CategoryCard.displayName = "CategoryCard";
