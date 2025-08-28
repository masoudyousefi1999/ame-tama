"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

interface CategoryShowcaseProps {
  categories: Category[];
}

const CategoryCard = memo(({ category }: { category: Category }) => {
  const isMobile = useIsMobile();

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
        {category.image && (
          <img
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
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

export default function CategoryShowcase({
  categories,
}: CategoryShowcaseProps) {
  const isMobile = useIsMobile();

  // Memoize displayed categories to prevent unnecessary re-renders
  const displayedCategories = useMemo(() => {
    // Show fewer categories on mobile for better performance
    return isMobile ? categories.slice(0, 4) : categories.slice(0, 6);
  }, [categories, isMobile]);

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">هیچ دسته‌بندی‌ای یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {displayedCategories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
