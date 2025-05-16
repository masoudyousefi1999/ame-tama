"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CartDropdown from "@/components/cart/cart-dropdown";
import UserMenu from "@/components/auth/user-menu";
import SearchBar from "@/components/search/search-bar";
import { getAllCategories } from "@/lib/categories";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const categoriesRef = useRef<HTMLDivElement>(null);
  const categories = getAllCategories();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    const onClick = (e: MouseEvent) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(e.target as Node)
      ) {
        setIsCategoriesOpen(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  return (
    <header
      role="navigation"
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/90 dark:bg-gray-900/90 shadow" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-2 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span
            className="text-xl md:text-2xl font-bold whitespace-nowrap flex-shrink-0
+              text-indigo-600 dark:text-indigo-300 drop-shadow-lg"
          >
            AME-TAMA
          </span>
        </Link>

        {/* Desktop Nav – now only shows at ≥1024px */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link href="/" className="whitespace-nowrap p-2">
            خانه
          </Link>

          {/* Categories dropdown */}
          <div ref={categoriesRef} className="relative">
            <button
              aria-expanded={isCategoriesOpen}
              aria-controls="category-menu"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="flex items-center p-2 whitespace-nowrap"
            >
              دسته‌بندی‌ها
              <ChevronDown
                className={cn(
                  "ml-1 h-4 w-4 transition-transform",
                  isCategoriesOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {isCategoriesOpen && (
                <motion.div
                  id="category-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-1 bg-white dark:bg-gray-800 rounded shadow-lg py-2"
                >
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/category/${c.slug}`}
                      onClick={() => setIsCategoriesOpen(false)}
                      className="block px-4 py-2 whitespace-nowrap"
                    >
                      {c.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/shop" className="whitespace-nowrap p-2">
            فروشگاه
          </Link>
          <Link href="/about" className="whitespace-nowrap p-2">
            درباره ما
          </Link>
          <Link href="/contact" className="whitespace-nowrap p-2">
            تماس با ما
          </Link>
        </nav>

        {/* Actions & Hamburger */}
        <div className="flex items-center space-x-2">
          {/* Desktop Search – ≥1024px */}
          <div className="hidden lg:block w-64">
            <SearchBar />
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="تغییر تم"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2"
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
          )}

          {/* User & Cart */}
          <UserMenu />
          <CartDropdown />

          {/* Mobile Hamburger – shows below 1024px */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="بازکردن منو"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2"
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Panel – below 1024px */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden lg:hidden bg-white dark:bg-gray-900"
          >
            <div className="space-y-2 px-4 py-3">
              <SearchBar />

              <Link href="/" className="block p-2">
                خانه
              </Link>

              <div>
                <button
                  aria-expanded={isCategoriesOpen}
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex w-full items-center justify-between p-2"
                >
                  <span>دسته‌بندی‌ها</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isCategoriesOpen && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="pl-4"
                    >
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/category/${c.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="block p-2"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/shop" className="block p-2">
                فروشگاه
              </Link>
              <Link href="/about" className="block p-2">
                درباره ما
              </Link>
              <Link href="/contact" className="block p-2">
                تماس با ما
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
