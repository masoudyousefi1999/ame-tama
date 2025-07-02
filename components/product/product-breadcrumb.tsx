"use client";

import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";

interface ProductBreadcrumbProps {
  category: {
    id: number;
    name: string;
    slug: string;
  };
  productName: string;
}

export default function ProductBreadcrumb({
  category,
  productName,
}: ProductBreadcrumbProps) {
  return (
    <nav className="mb-6 flex text-sm" aria-label="Breadcrumb" dir="rtl">
      <ol className="flex items-center space-x-2 space-x-reverse">
        {/* Home */}
        <li>
          <Link
            href="/"
            className="transition-colors text-muted-foreground hover:text-primary"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">خانه</span>
          </Link>
        </li>

        <li className="flex items-center">
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        </li>

        {/* Category */}
        <li>
          <Link
            href={`/category/${category.slug}`}
            className="  transition-colors text-muted-foreground hover:text-primary"
          >
            {category.name}
          </Link>
        </li>

        <li className="flex items-center">
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        </li>

        {/* Current page */}
        <li>
          <span className="  line-clamp-1 text-foreground" aria-current="page">
            {productName}
          </span>
        </li>
      </ol>
    </nav>
  );
}
