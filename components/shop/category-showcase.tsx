"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ICategoryType } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface CategoryShowcaseProps {
  categories: ICategoryType[];
}

export default function CategoryShowcase({
  categories,
}: CategoryShowcaseProps) {
  return (
    <section id="categories">
      {/* ————— Header ————— */}
      <div className="mb-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold font-vazirmatn leading-snug">
            دسته‌بندی‌های&nbsp;انیمه
          </h2>
          <p className="mt-1 text-muted-foreground">
            مجسمه‌های لوکس از سری‌های محبوب خود را کشف کنید
          </p>
        </div>

        {/* CTA – hidden on <640px to avoid crowding */}
        <Button
          asChild
          variant="outline"
          className="hidden sm:inline-flex rounded-full border-primary/30 hover:bg-primary/5 dark:border-primary/50 font-vazirmatn"
        >
          <Link href="/shop?tab=all" prefetch={false}>
            مشاهده&nbsp;همه
            <ArrowRight className="mr-1.5 h-4 w-4 -scale-x-100" />
          </Link>
        </Button>
      </div>

      {/* ————— Grid ————— */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => (
          <motion.article
            key={cat.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            viewport={{ once: true }}
          >
            <Link
              href={`/category/${cat.slug}`}
              className={cn(
                "group relative block h-60 rounded-3xl overflow-hidden shadow-sm",
                "ring-1 ring-gray-100 dark:ring-gray-800 hover:shadow-lg transition-shadow"
              )}
            >
              {/* image */}
              <Image
                src={cat.image || "/placeholder.svg"}
                alt={cat.name}
                fill
                priority={i < 3} /* LCP hint */
                sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* overlay */}
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent"
              />

              {/* copy */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="font-vazirmatn font-semibold text-lg sm:text-xl tracking-tight group-hover:text-primary-200">
                  {cat.name}
                </h3>

                {cat.description && (
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/80">
                    {cat.description}
                  </p>
                )}

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-200 group-hover:translate-x-0.5 transition-transform">
                  مشاهده&nbsp;مجسمه‌ها
                  <ArrowRight className="h-4 w-4 -scale-x-100" />
                </span>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      {/* mobile full-width CTA */}
      <Button
        asChild
        variant="outline"
        className="mt-6 w-full sm:hidden rounded-full border-primary/30 hover:bg-primary/5 dark:border-primary/50 font-vazirmatn"
      >
        <Link href="/shop?tab=all">
          مشاهده&nbsp;همه&nbsp;دسته‌بندی‌ها
          <ArrowRight className="mr-1.5 h-4 w-4 -scale-x-100" />
        </Link>
      </Button>
    </section>
  );
}
