import Link from "next/link";
import Image from "@/components/ui/custom-image";
import { cn } from "@/lib/utils";

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

function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/${category.slug}`}
      prefetch={false}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card bg-opacity-50 transition-all duration-300 shadow-card hover:shadow-2xl hover:scale-[1.02]"
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            quality={80}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
            <span className="text-4xl opacity-50">📦</span>
          </div>
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
}

export default function CategoryShowcase({
  categories,
}: CategoryShowcaseProps) {
  const displayedCategories = categories.slice(0, 6);

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
