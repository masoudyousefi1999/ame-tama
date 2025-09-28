"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CartDropdown from "@/components/cart/cart-dropdown";
import UserMenu from "@/components/auth/user-menu";
import UnifiedSearch from "@/components/search/unified-search";
import {
  getRootCategories,
  getSubcategories,
  type ICategoryType,
} from "@/lib/categories";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/context/cart-context";

interface CategoryWithChildren extends ICategoryType {}

export default function Navbar() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<number | null>(
    null
  );
  const categoriesRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const { user, logout } = useAuth();
  const { clearCart } = useCart();

  const [categoryTree, setCategoryTree] = useState<CategoryWithChildren[]>([]);
  const [mobileCategories, setMobileCategories] = useState<any[]>([]);
  const [currentMobileLevel, setCurrentMobileLevel] = useState<string | null>(
    null
  );
  const [mobileCategoryPath, setMobileCategoryPath] = useState<
    { id: string; name: string; slug: string }[]
  >([]);

  const shouldRenderNavbar = !pathname.startsWith("/checkout/success");

  const parentRef = useRef<HTMLDivElement>(null);

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";
        const response = await fetch(`${baseUrl}/api/categories`, {
          credentials: "include", // Include cookies in the request
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const categories = await response.json();
        const rootCategories: any[] = [];
        categories.forEach((item: any) =>
          rootCategories.push(...item.children)
        );
        setCategoryTree(rootCategories);
        setMobileCategories(rootCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "خطا در بارگذاری دسته‌بندی‌ها",
          description: "مشکلی در بارگذاری دسته‌بندی‌ها رخ داد.",
          variant: "error",
        });
        setCategoryTree([]);
        setMobileCategories([]);
      }
    };
    if (!shouldRenderNavbar) {
      return; // This avoids rendering Navbar content
    }

    fetchCategories();
  }, []);

  // Handle scroll & outside clicks
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    const handleClickOutside = (e: MouseEvent) => {
      if (parentRef.current && !parentRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(e.target as Node)
      ) {
        setIsCategoriesOpen(false);
        setActiveCategory(null);
        setActiveSubcategory(null);
      }
    };
    window.addEventListener("scroll", onScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  // Mobile category navigation
  const handleMobileCategoryClick = (
    categoryId: string,
    categoryName: string,
    categorySlug: string
  ) => {
    try {
      const subs = getSubcategories(categoryId);
      if (subs.length > 0) {
        setMobileCategories(subs);
        setCurrentMobileLevel(categoryId);
        setMobileCategoryPath((p) => [
          ...p,
          { id: categoryId, name: categoryName, slug: categorySlug },
        ]);
      } else {
        // leaf, just close
        setIsOpen(false);
      }
    } catch {
      toast({
        title: "خطا در دسته‌بندی",
        description: "مشکلی در بارگذاری زیردسته‌ها رخ داد.",
        variant: "error",
      });
    }
  };

  // Go back up one level
  const handleMobileBackClick = () => {
    try {
      if (mobileCategoryPath.length <= 1) {
        const roots = getRootCategories();
        setMobileCategories(roots);
        setCurrentMobileLevel(null);
        setMobileCategoryPath([]);
      } else {
        const newPath = [...mobileCategoryPath];
        newPath.pop();
        const parentId = newPath[newPath.length - 1]?.id;
        if (parentId) {
          const subs = getSubcategories(parentId);
          setMobileCategories(subs);
          setCurrentMobileLevel(parentId);
          setMobileCategoryPath(newPath);
        }
      }
    } catch {
      toast({
        title: "خطا در ناوبری",
        description: "مشکلی در بازگشت به سطح قبلی رخ داد.",
        variant: "error",
      });
    }
  };

  const handleLogout = () => {
    try {
      logout();
      clearCart(); // Clear cart on logout
      setIsOpen(false);
      toast({ title: "خروج موفقیت‌آمیز" });
      window.location.reload(); // Force UI update after logout
    } catch {
      toast({
        title: "خطا در خروج",
        description: "مشکلی در خروج از حساب کاربری رخ داد.",
        variant: "error",
      });
    }
  };

  if (!shouldRenderNavbar) {
    return;
  }

  return (
    <header
      ref={parentRef}
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300 backdrop-blur-md",
        isScrolled
          ? "bg-popover/90 border-b border-border glass"
          : "bg-popover/80"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-2 md:py-4 overflow-visible">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 z-10 relative" prefetch={false}>
          <span className="text-xl md:text-2xl font-bold whitespace-nowrap gradient-text drop-shadow-sm">
            AME-TAMA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden lg:flex items-center space-x-6"
          role="navigation"
          aria-label="منوی اصلی"
        >
          <Link
            href="/"
            className="whitespace-nowrap p-2 text-foreground hover:text-accent transition-colors nav-link"
            prefetch={false}
          >
            خانه
          </Link>

          {/* Categories Dropdown */}
          <div ref={categoriesRef} className="relative">
            <button
              aria-expanded={isCategoriesOpen}
              aria-controls="category-menu"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="flex items-center p-2 text-foreground hover:text-accent transition-colors nav-link"
            >
              دسته‌بندی‌ها
              <ChevronDown
                className={cn(
                  "ml-1 h-4 w-4 transition-transform text-foreground",
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
                  className="absolute right-0 mt-1 bg-popover rounded-lg shadow-lg py-2 min-w-[220px] z-[60] dropdown-menu"
                >
                  {categoryTree.map((cat) => (
                    <div key={cat.id} className="relative">
                      <div
                        onMouseEnter={() => setActiveCategory(cat.id as any)}
                        className="flex justify-between items-center px-4 py-2 bg-popover hover:bg-muted cursor-pointer transition-colors"
                      >
                        <Link
                          href={`/category/figures/${cat.slug}`}
                          onClick={() => setIsCategoriesOpen(false)}
                          className="block flex-1 text-foreground transition-colors"
                          prefetch={false}
                        >
                          {cat.name}
                        </Link>
                        {cat.children?.length > 0 && (
                          <ChevronRight className="h-4 w-4 rotate-180 text-foreground" />
                        )}
                      </div>

                      {activeCategory === cat.id &&
                        cat.children?.length > 0 && (
                          <div
                            onMouseLeave={() => setActiveSubcategory(null)}
                            className="absolute right-full top-0 bg-popover rounded-lg shadow-lg py-2 min-w-[220px] mr-1 dropdown-menu"
                          >
                            {cat.children.map((sub) => (
                              <div key={sub.id} className="relative">
                                <div
                                  onMouseEnter={() =>
                                    setActiveSubcategory(sub.id)
                                  }
                                  className="flex justify-between items-center px-4 py-2 bg-popover hover:bg-muted cursor-pointer transition-colors"
                                >
                                  <Link
                                    href={`/category/${sub.slug}`}
                                    onClick={() => setIsCategoriesOpen(false)}
                                    className="block flex-1 text-foreground transition-colors"
                                    prefetch={false}
                                  >
                                    {sub.name}
                                  </Link>
                                  {sub.children?.length > 0 && (
                                    <ChevronRight className="h-4 w-4 rotate-180 text-foreground" />
                                  )}
                                </div>

                                {activeSubcategory === sub.id &&
                                  sub.children?.length > 0 && (
                                    <div className="absolute right-full top-0 bg-popover rounded-lg shadow-lg py-2 min-w-[220px] mr-1 dropdown-menu">
                                      {sub.children.map((lvl3) => (
                                        <Link
                                          key={lvl3.id}
                                          href={`/category/${lvl3.slug}`}
                                          onClick={() =>
                                            setIsCategoriesOpen(false)
                                          }
                                          prefetch={false}
                                          className="block px-4 py-2 whitespace-nowrap bg-popover hover:bg-muted transition-colors text-foreground"
                                        >
                                          {lvl3.name}
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

          <Link
            href="/shop"
            className="whitespace-nowrap p-2 text-foreground hover:text-accent transition-colors nav-link"
          >
            فروشگاه
          </Link>
          <Link
            href="/about"
            className="whitespace-nowrap p-2 text-foreground hover:text-accent transition-colors nav-link"
            prefetch={false}
          >
            درباره ما
          </Link>
          <Link
            href="/contact"
            className="whitespace-nowrap p-2 text-foreground hover:text-accent transition-colors nav-link"
            prefetch={false}
          >
            تماس با ما
          </Link>
          <Link
            href="/faq"
            className="whitespace-nowrap p-2 text-foreground hover:text-accent transition-colors nav-link"
            prefetch={false}
          >
            سوالات متداول
          </Link>
        </nav>

        {/* Actions & Hamburger */}
        <div className="flex items-center space-x-2 flex-shrink-0 overflow-visible">
          {/* Mobile Search */}
          <div className="lg:hidden flex-1 max-w-[200px]">
            <UnifiedSearch />
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:block w-64">
            <UnifiedSearch />
          </div>

          <UserMenu />
          <CartDropdown />

          {/* Mobile Hamburger */}
          <Button
            ref={hamburgerRef}
            variant="ghost"
            size="icon"
            aria-label={isOpen ? "بستن منو" : "بازکردن منو"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground hover:text-accent transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-[45] lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              ref={menuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 min-h-screen w-3/4 max-w-sm z-[50] overflow-y-auto bg-popover/95 backdrop-blur-xl border-l border-border before:absolute before:inset-0 before:bg-gradient-to-tr before:from-primary/10 before:via-accent/10 before:to-secondary/10 before:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_70%_20%,rgba(139,92,246,0.10),transparent_60%)] after:pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 overflow-y-auto min-h-screen">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {/** Quick links **/}
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    prefetch={false}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-card hover:bg-muted transition-colors"
                  >
                    <Home className="h-6 w-6 text-foreground mb-2" />
                    <span className="text-xs text-foreground">خانه</span>
                  </Link>
                  <Link
                    href="/shop"
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-card hover:bg-muted transition-colors"
                  >
                    <ShoppingBag className="h-6 w-6 text-foreground mb-2" />
                    <span className="text-xs text-foreground">فروشگاه</span>
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsOpen(false)}
                    prefetch={false}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-card hover:bg-muted transition-colors"
                  >
                    <Info className="h-6 w-6 text-foreground mb-2" />
                    <span className="text-xs text-foreground">درباره ما</span>
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    prefetch={false}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-card hover:bg-muted transition-colors"
                  >
                    <MessageSquare className="h-6 w-6 text-foreground mb-2" />
                    <span className="text-xs text-foreground">تماس</span>
                  </Link>
                  <Link
                    href="/faq"
                    onClick={() => setIsOpen(false)}
                    prefetch={false}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-card hover:bg-muted transition-colors"
                  >
                    <HelpCircle className="h-6 w-6 text-foreground mb-2" />
                    <span className="text-xs text-foreground">سوالات</span>
                  </Link>
                  <Link
                    href="/search"
                    onClick={() => setIsOpen(false)}
                    prefetch={false}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-card hover:bg-muted transition-colors"
                  >
                    <Search className="h-6 w-6 text-foreground mb-2" />
                    <span className="text-xs text-foreground">جستجو</span>
                  </Link>

                  {user && (
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      prefetch={false}
                      className="flex flex-col items-center justify-center p-3 rounded-lg bg-card hover:bg-muted transition-colors"
                    >
                      <User className="h-6 w-6 text-foreground mb-2" />
                      <span className="text-xs text-foreground">پروفایل</span>
                    </Link>
                  )}
                  {user && (
                    <button
                      onClick={handleLogout}
                      className="flex flex-col items-center justify-center p-3 rounded-lg bg-card hover:bg-muted transition-colors"
                    >
                      <LogOut className="h-6 w-6 text-foreground mb-2" />
                      <span className="text-xs text-foreground">خروج</span>
                    </button>
                  )}
                </div>

                {/* Mobile category path */}
                {mobileCategoryPath.length > 0 && (
                  <div className="flex items-center mb-4">
                    <button
                      onClick={handleMobileBackClick}
                      className="flex items-center text-sm text-accent transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 ml-1 text-accent" />
                      <span className="  text-accent">بازگشت</span>
                    </button>
                    <div className="flex items-center overflow-x-auto whitespace-nowrap ml-2">
                      {mobileCategoryPath.map((cat, i) => (
                        <div key={cat.id} className="flex items-center">
                          {i > 0 && (
                            <ChevronLeft className="h-3 w-3 mx-1 text-muted-foreground" />
                          )}
                          <Link
                            href={`/category/${cat.slug}`}
                            prefetch={false}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "text-sm transition-colors",
                              i === mobileCategoryPath.length - 1
                                ? "font-medium text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {cat.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <h3 className="font-medium mb-3 text-foreground">
                  {mobileCategoryPath.length > 0
                    ? "زیردسته‌ها"
                    : "دسته‌بندی‌ها"}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {mobileCategories.map((c) => (
                    <div key={c.id} className="flex items-center">
                      <Link
                        href={`/category/${c.slug}`}
                        prefetch={false}
                        onClick={() => setIsOpen(false)}
                        className="block p-2 bg-card rounded-lg text-sm hover:bg-muted transition-colors flex-1 text-foreground"
                        aria-label="جستجو در منو"
                      >
                        {c.name}
                      </Link>
                      {getSubcategories(c.id).length > 0 && (
                        <button
                          onClick={() =>
                            handleMobileCategoryClick(c.id, c.name, c.slug)
                          }
                          className="p-2 ml-1 bg-card rounded-lg hover:bg-muted transition-colors"
                          aria-label="نمایش زیردسته‌ها"
                        >
                          <ChevronLeft className="h-4 w-4 text-foreground" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
