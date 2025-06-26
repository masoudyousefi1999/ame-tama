"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const categories = [
  { id: "one-piece", name: "وان پیس" },
  { id: "naruto", name: "ناروتو" },
  { id: "demon-slayer", name: "شیطان کش" },
  { id: "jujutsu-kaisen", name: "جوجوتسو کایزن" },
  { id: "attack-on-titan", name: "حمله به تایتان" },
  { id: "my-hero-academia", name: "آکادمی قهرمان من" },
];

export default function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);

    // Scroll to products section
    const productsSection = document.getElementById("featured-products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* ───── header ───── */}
        <div className="mb-10 text-center">
          <h2 className="font-vazirmatn text-primary text-3xl font-bold mb-4">
            جستجو بر اساس سری انیمه
          </h2>
          <p className="mx-auto max-w-2xl font-vazirmatn text-muted-foreground">
            مجسمه‌های لوکس ما از سری‌های انیمه مورد علاقه خود را کاوش کنید، هر
            کدام با دقت استثنایی در جزئیات ساخته شده‌اند.
          </p>
        </div>

        {/* ───── filter chips ───── */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {/* all-series chip */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick("all")}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 font-vazirmatn",
              activeCategory === "all"
                ? "group rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl font-vazirmatn"
                : "bg-card text-foreground hover:shadow-md"
            )}
          >
            همه سری‌ها
          </motion.button>

          {/* dynamic category chips */}
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 font-vazirmatn",
                activeCategory === category.id
                  ? "group rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl font-vazirmatn"
                  : "bg-card text-foreground hover:shadow-md"
              )}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
