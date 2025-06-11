"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Menu,
  X,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  Home,
  ShoppingBag,
  Info,
  MessageSquare,
  HelpCircle,
  User,
  LogOut,
  Search,
  ChevronLeft,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import CartDropdown from "@/components/cart/cart-dropdown"
import UserMenu from "@/components/auth/user-menu"
import SearchBar from "@/components/search/search-bar"
import { getAllCategories, getRootCategories, getSubcategories, type ICategoryType } from "@/lib/categories"
import { useAuth } from "@/context/auth-context"
import { toast } from "@/components/ui/use-toast"

// تعریف نوع برای دسته‌بندی‌های سلسله مراتبی در منو
interface CategoryWithChildren extends ICategoryType {}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [activeSubcategory, setActiveSubcategory] = useState<number | null>(null)
  const { theme, setTheme } = useTheme()
  const categoriesRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const [categoryTree, setCategoryTree] = useState<CategoryWithChildren[]>([])
  const [mobileCategories, setMobileCategories] = useState<any[]>([])
  const [currentMobileLevel, setCurrentMobileLevel] = useState<string | null>(null)
  const [mobileCategoryPath, setMobileCategoryPath] = useState<{ id: string; name: string; slug: string }[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getAllCategories()
        const rootCategories: any = []

        categories.map((item) => {
          rootCategories.push(...item.children)
        })

        setCategoryTree(rootCategories)
        setMobileCategories(rootCategories)
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "خطا در بارگذاری دسته‌بندی‌ها",
          description: "مشکلی در بارگذاری دسته‌بندی‌ها رخ داد.",
          variant: "destructive",
        })
        // Set empty arrays as fallback
        setCategoryTree([])
        setMobileCategories([])
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => setMounted(true), [])

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    const onClick = (e: MouseEvent) => {
      // Close categories dropdown when clicking outside
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setIsCategoriesOpen(false)
        setActiveCategory(null)
        setActiveSubcategory(null)
      }

      // Close hamburger menu when clicking outside
      if (
        isOpen &&
        menuRef.current &&
        hamburgerRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    window.addEventListener("scroll", onScroll)
    document.addEventListener("mousedown", onClick)

    return () => {
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("mousedown", onClick)
    }
  }, [isOpen])

  // Function to close menu after navigation
  const handleNavigation = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth

    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.paddingRight = `${scrollBarWidth}px`
    } else {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }

    return () => {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }
  }, [isOpen])

  // مدیریت کلیک روی دسته‌بندی در منوی موبایل
  const handleMobileCategoryClick = (categoryId: string, categoryName: string, categorySlug: string) => {
    try {
      const subcategories = getSubcategories(categoryId)

      if (subcategories.length > 0) {
        setMobileCategories(subcategories)
        setCurrentMobileLevel(categoryId)
        setMobileCategoryPath([...mobileCategoryPath, { id: categoryId, name: categoryName, slug: categorySlug }])
      } else {
        // اگر زیردسته‌ای نداشت، به صفحه دسته‌بندی هدایت می‌شود
        handleNavigation()
      }
    } catch (error) {
      console.error("Error handling mobile category click:", error)
      toast({
        title: "خطا در دسته‌بندی",
        description: "مشکلی در بارگذاری زیردسته‌ها رخ داد.",
        variant: "destructive",
      })
    }
  }

  // بازگشت به سطح قبلی در منوی موبایل
  const handleMobileBackClick = () => {
    try {
      if (mobileCategoryPath.length <= 1) {
        // بازگشت به سطح اصلی
        const rootCategories = getRootCategories()
        setMobileCategories(rootCategories)
        setCurrentMobileLevel(null)
        setMobileCategoryPath([])
      } else {
        // بازگشت به سطح قبلی
        const newPath = [...mobileCategoryPath]
        newPath.pop()
        const parentId = newPath[newPath.length - 1]?.id

        if (parentId) {
          const parentSubcategories = getSubcategories(parentId)
          setMobileCategories(parentSubcategories)
          setCurrentMobileLevel(parentId)
          setMobileCategoryPath(newPath)
        } else {
          const rootCategories = getRootCategories()
          setMobileCategories(rootCategories)
          setCurrentMobileLevel(null)
          setMobileCategoryPath([])
        }
      }
    } catch (error) {
      console.error("Error handling mobile back click:", error)
      toast({
        title: "خطا در ناوبری",
        description: "مشکلی در بازگشت به سطح قبلی رخ داد.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    try {
      logout()
      handleNavigation()
      toast({
        title: "خروج موفقیت‌آمیز",
        description: "با موفقیت از حساب کاربری خود خارج شدید.",
      })
    } catch (error) {
      toast({
        title: "خطا در خروج",
        description: "مشکلی در خروج از حساب کاربری رخ داد.",
        variant: "destructive",
      })
    }
  }

  return (
    <header
      role="navigation"
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 shadow-md backdrop-blur-sm"
          : "bg-white/10 dark:bg-transparent backdrop-blur-sm",
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-2 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 z-10 relative">
          <span className="text-xl md:text-2xl font-bold whitespace-nowrap flex-shrink-0 text-indigo-600 dark:text-indigo-300 drop-shadow-lg">
            AME-TAMA
          </span>
        </Link>

        {/* Desktop Nav – shows at ≥1024px */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link href="/" className="whitespace-nowrap p-2 hover:text-purple-600 transition-colors font-vazirmatn">
            خانه
          </Link>

          {/* Categories dropdown - hierarchical */}
          <div ref={categoriesRef} className="relative">
            <button
              aria-expanded={isCategoriesOpen}
              aria-controls="category-menu"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="flex items-center p-2 whitespace-nowrap hover:text-purple-600 transition-colors font-vazirmatn"
            >
              دسته‌بندی‌ها
              <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform", isCategoriesOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {isCategoriesOpen && (
                <motion.div
                  id="category-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 min-w-[220px] z-50"
                >
                  {categoryTree.map((category) => (
                    <div key={category.id} className="relative">
                      <div
                        className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onMouseEnter={() => setActiveCategory(category.id as any)}
                      >
                        <Link
                          href={`/category/figures/${category.slug}`}
                          onClick={() => setIsCategoriesOpen(false)}
                          className="block whitespace-nowrap transition-colors font-vazirmatn flex-1"
                        >
                          {category.name}
                        </Link>
                        {category.children && category.children.length > 0 && (
                          <ChevronRight className="h-4 w-4 rotate-180" />
                        )}
                      </div>

                      {/* Subcategories dropdown */}
                      {activeCategory === category.id && category.children && category.children.length > 0 && (
                        <div
                          className="absolute right-full top-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 min-w-[220px] mr-1"
                          onMouseLeave={() => setActiveSubcategory(null)}
                        >
                          {category.children.map((subCategory) => (
                            <div key={subCategory.id} className="relative">
                              <div
                                className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                onMouseEnter={() => setActiveSubcategory(subCategory.id)}
                              >
                                <Link
                                  href={`/category/${subCategory.slug}`}
                                  onClick={() => setIsCategoriesOpen(false)}
                                  className="block whitespace-nowrap transition-colors font-vazirmatn flex-1"
                                >
                                  {subCategory.name}
                                </Link>
                                {subCategory.children && subCategory.children.length > 0 && (
                                  <ChevronRight className="h-4 w-4 rotate-180" />
                                )}
                              </div>

                              {/* Level 3 categories */}
                              {activeSubcategory === subCategory.id &&
                                subCategory.children &&
                                subCategory.children.length > 0 && (
                                  <div className="absolute right-full top-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 min-w-[220px] mr-1">
                                    {subCategory.children.map((level3) => (
                                      <Link
                                        key={level3.id}
                                        href={`/category/${level3.slug}`}
                                        onClick={() => setIsCategoriesOpen(false)}
                                        className="block px-4 py-2 whitespace-nowrap hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-vazirmatn"
                                      >
                                        {level3.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/shop" className="whitespace-nowrap p-2 hover:text-purple-600 transition-colors font-vazirmatn">
            فروشگاه
          </Link>
          <Link href="/about" className="whitespace-nowrap p-2 hover:text-purple-600 transition-colors font-vazirmatn">
            درباره ما
          </Link>
          <Link
            href="/contact"
            className="whitespace-nowrap p-2 hover:text-purple-600 transition-colors font-vazirmatn"
          >
            تماس با ما
          </Link>
          <Link href="/faq" className="whitespace-nowrap p-2 hover:text-purple-600 transition-colors font-vazirmatn">
            سوالات متداول
          </Link>
        </nav>

        {/* Actions & Hamburger */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Mobile Search – shows below 1024px */}
          <div className="lg:hidden flex-1 max-w-[200px]">
            <SearchBar isScrolled={isScrolled} />
          </div>

          {/* Desktop Search – shows at ≥1024px */}
          <div className="hidden lg:block w-64">
            <SearchBar isScrolled={isScrolled} />
          </div>

          {/* Desktop Theme Toggle – shows at ≥1024px */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="تغییر تم"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden lg:flex p-2"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}

          {/* User & Cart */}
          <UserMenu />
          <CartDropdown />

          {/* Mobile Hamburger – shows below 1024px */}
          <Button
            ref={hamburgerRef}
            variant="ghost"
            size="icon"
            aria-label={isOpen ? "بستن منو" : "بازکردن منو"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 z-50"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Panel – below 1024px */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              ref={menuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 min-h-screen w-3/4 max-w-sm bg-white dark:bg-gray-900 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 overflow-y-auto min-h-screen">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Link
                    href="/"
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    onClick={handleNavigation}
                  >
                    <Home className="h-6 w-6 mb-2" />
                    <span className="text-xs font-vazirmatn">خانه</span>
                  </Link>

                  <Link
                    href="/shop"
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    onClick={handleNavigation}
                  >
                    <ShoppingBag className="h-6 w-6 mb-2" />
                    <span className="text-xs font-vazirmatn">فروشگاه</span>
                  </Link>

                  <Link
                    href="/about"
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    onClick={handleNavigation}
                  >
                    <Info className="h-6 w-6 mb-2" />
                    <span className="text-xs font-vazirmatn">درباره ما</span>
                  </Link>

                  <Link
                    href="/contact"
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    onClick={handleNavigation}
                  >
                    <MessageSquare className="h-6 w-6 mb-2" />
                    <span className="text-xs font-vazirmatn">تماس</span>
                  </Link>

                  <Link
                    href="/faq"
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    onClick={handleNavigation}
                  >
                    <HelpCircle className="h-6 w-6 mb-2" />
                    <span className="text-xs font-vazirmatn">سوالات</span>
                  </Link>

                  <Link
                    href="/search"
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    onClick={handleNavigation}
                  >
                    <Search className="h-6 w-6 mb-2" />
                    <span className="text-xs font-vazirmatn">جستجو</span>
                  </Link>

                  {user && (
                    <Link
                      href="/profile"
                      className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      onClick={handleNavigation}
                    >
                      <User className="h-6 w-6 mb-2" />
                      <span className="text-xs font-vazirmatn">پروفایل</span>
                    </Link>
                  )}

                  {user && (
                    <button
                      onClick={handleLogout}
                      className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="h-6 w-6 mb-2" />
                      <span className="text-xs font-vazirmatn">خروج</span>
                    </button>
                  )}

                  {mounted && (
                    <button
                      onClick={() => {
                        setTheme(theme === "dark" ? "light" : "dark")
                      }}
                      className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {theme === "dark" ? (
                        <>
                          <Sun className="h-6 w-6 mb-2" />
                          <span className="text-xs font-vazirmatn">روشن</span>
                        </>
                      ) : (
                        <>
                          <Moon className="h-6 w-6 mb-2" />
                          <span className="text-xs font-vazirmatn">تیره</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="mt-8">
                  {/* نمایش مسیر دسته‌بندی در موبایل */}
                  {mobileCategoryPath.length > 0 && (
                    <div className="flex items-center mb-4">
                      <button
                        onClick={handleMobileBackClick}
                        className="flex items-center text-sm text-purple-600 dark:text-purple-400"
                      >
                        <ChevronRight className="h-4 w-4 ml-1" />
                        <span className="font-vazirmatn">بازگشت</span>
                      </button>

                      <div className="flex items-center overflow-x-auto whitespace-nowrap ml-2">
                        {mobileCategoryPath.map((cat, index) => (
                          <div key={cat.id} className="flex items-center">
                            {index > 0 && <ChevronLeft className="h-3 w-3 mx-1 text-gray-400" />}
                            <Link
                              href={`/category/${cat.slug}`}
                              className={cn(
                                "text-sm font-vazirmatn",
                                index === mobileCategoryPath.length - 1
                                  ? "font-medium text-gray-900 dark:text-gray-100"
                                  : "text-gray-500 dark:text-gray-400",
                              )}
                              onClick={handleNavigation}
                            >
                              {cat.name}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <h3 className="font-medium mb-3 font-vazirmatn">
                    {mobileCategoryPath.length > 0 ? "زیردسته‌ها" : "دسته‌بندی‌ها"}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {mobileCategories.map((c) => (
                      <div key={c.id} className="flex items-center">
                        <Link
                          href={`/category/${c.slug}`}
                          onClick={handleNavigation}
                          className="block p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-vazirmatn flex-1"
                        >
                          {c.name}
                        </Link>
                        {getSubcategories(c.id).length > 0 && (
                          <button
                            onClick={() => handleMobileCategoryClick(c.id, c.name, c.slug)}
                            className="p-2 ml-1 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
