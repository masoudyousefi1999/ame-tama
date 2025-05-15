"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/categories";

interface CategoryShowcaseProps {
  categories: Category[];
}

export default function CategoryShowcase({
  categories,
}: CategoryShowcaseProps) {
  return (
    <section id="categories">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          className="hidden sm:flex rounded-full border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-vazirmatn"
          asChild
        >
          <Link href="/shop?tab=all">
            مشاهده همه
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold mb-2 font-vazirmatn text-right">
            دسته‌بندی‌های انیمه
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-vazirmatn">
            مجسمه‌های لوکس از سری‌های انیمه محبوب خود را کشف کنید
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              href={`/category/${category.slug}`}
              className="block group relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              {/* تصویر دسته‌بندی */}
              <Image
                src={category.image || "/placeholder.svg?height=400&width=600"}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* محتوای دسته‌بندی */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors font-vazirmatn text-right">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-200 line-clamp-2 mb-4 font-vazirmatn text-right">
                  {category.description}
                </p>
                <div className="flex justify-end items-center text-sm font-medium text-purple-300 group-hover:text-white transition-colors font-vazirmatn">
                  مشاهده مجسمه‌ها
                  <ArrowRight className="mr-1 h-4 w-4 transition-transform group-hover:translate-x-1 rotate-180" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 sm:hidden">
        <Button
          variant="outline"
          className="w-full rounded-full border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-vazirmatn"
          asChild
        >
          <Link href="/shop?tab=all">
            مشاهده همه دسته‌بندی‌ها
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
