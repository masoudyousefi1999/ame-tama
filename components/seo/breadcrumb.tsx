"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryPath } from "@/lib/categories";
import { getSiteUrl } from "@/lib/site-url";
import Script from "next/script";

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  categoryId?: string; // اضافه کردن شناسه دسته‌بندی برای نمایش مسیر کامل
}

export default function Breadcrumb({
  items,
  className,
  categoryId,
}: BreadcrumbProps) {
  // اگر شناسه دسته‌بندی وجود داشت، مسیر کامل دسته‌بندی را دریافت می‌کنیم
  let breadcrumbItems = [...items];

  if (categoryId) {
    const categoryPath = getCategoryPath(categoryId);

    // حذف آخرین آیتم که همان دسته‌بندی فعلی است (چون در items هم وجود دارد)
    if (categoryPath.length > 1) {
      const parentCategories = categoryPath.slice(0, -1);

      // اضافه کردن دسته‌بندی‌های والد به مسیر
      breadcrumbItems = [
        { name: "خانه", path: "/" },
        ...parentCategories.map((cat) => ({
          name: cat.name,
          path: `/category/${cat.slug}`,
        })),
        ...items.slice(1), // حذف "خانه" از items اصلی چون قبلاً اضافه شده
      ];
    }
  }

  // ساخت structured data برای breadcrumb
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path.startsWith("http") ? item.path : getSiteUrl(item.path),
    })),
  };

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav
        aria-label="breadcrumb"
        className={cn(
          "flex items-center text-sm text-muted-foreground",
          className
        )}
      >
        <ol className="flex items-center gap-x-2 gap-x-reverse overflow-x-auto whitespace-nowrap">
          {breadcrumbItems.map((item, idx) => (
            <li key={item.path} className="flex items-center">
              {idx > 0 && <ChevronLeft className="h-4 w-4 mx-1" />}

              {idx === breadcrumbItems.length - 1 ? (
                <span
                  className="text-foreground font-medium"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="hover:text-brand transition-colors"
                  prefetch={false}
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
