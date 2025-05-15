"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import CartDropdown from "@/components/cart/cart-dropdown"
import UserMenu from "@/components/auth/user-menu"
import SearchBar from "@/components/search/search-bar"
import { getAllCategories } from "@/lib/categories"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const categoriesRef = useRef<HTMLDivElement>(null)
  const categories = getAllCategories()

  // ✅ Fix hydration mismatch with theme
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")
  const toggleCategories = () => setIsCategoriesOpen(!isCategoriesOpen)

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md",
        isScrolled ? "bg-white/80 dark:bg-gray-900/80 shadow-md" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-600 bg-clip-text text-transparent">
                AME-TAMA
              </span>
            </Link>

            <nav className="hidden md:flex items-center mr-8 gap-x-8">
              <Link
                href="/"
                className="text-sm font-medium hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
              >
                خانه
              </Link>

              <div className="relative" ref={categoriesRef}>
                <button
                  className="flex items-center text-sm font-medium hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
                  onClick={toggleCategories}
                >
                  دسته‌بندی‌ها
                  <ChevronDown className={cn("h-4 w-4 mr-1 transition-transform", isCategoriesOpen && "rotate-180")} />
                </button>

                {isCategoriesOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 py-2">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-vazirmatn"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/shop" className="text-sm font-medium hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn">
                فروشگاه
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn">
                درباره ما
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn">
                تماس با ما
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-x-4">
            <div className="hidden md:block w-64">
              <SearchBar />
            </div>

            {/* ✅ Theme toggle rendered only after mount */}
            {mounted && (
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">تغییر تم</span>
              </Button>
            )}

            <div className="md:hidden">
              <SearchBar />
            </div>

            <UserMenu />
            <CartDropdown />

            <Button variant="ghost" size="icon" className="md:hidden rounded-full" onClick={toggleMenu}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">منو</span>
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/"
              className="block text-sm font-medium hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
              onClick={toggleMenu}
            >
              خانه
            </Link>

            <div className="block text-sm font-medium font-vazirmatn">
              <div className="flex items-center justify-between" onClick={toggleCategories}>
                <span>دسته‌بندی‌ها</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", isCategoriesOpen && "rotate-180")} />
              </div>

              {isCategoriesOpen && (
                <div className="mt-2 pr-4 border-r border-gray-200 dark:border-gray-700">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="block py-2 text-sm hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
                      onClick={toggleMenu}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/shop" className="block text-sm font-medium hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn" onClick={toggleMenu}>
              فروشگاه
            </Link>
            <Link href="/about" className="block text-sm font-medium hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn" onClick={toggleMenu}>
              درباره ما
            </Link>
            <Link href="/contact" className="block text-sm font-medium hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn" onClick={toggleMenu}>
              تماس با ما
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
