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
  Store,
  Search,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CartDropdown from "@/components/cart/cart-dropdown";
import UserMenu from "@/components/auth/user-menu";
import UnifiedSearch from "@/components/search/unified-search";
import { type ICategoryType } from "@/lib/categories";
import { toast } from "@/components/ui/use-toast";

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
        // Directly use categories instead of extracting children
        setCategoryTree(categories);
        setMobileCategories(categories);
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

  // Mobile category navigation for tags
  const handleMobileCategoryClick = (
    categoryId: string,
    categoryName: string,
    categorySlug: string
  ) => {
    try {
      const category = categoryTree.find(
        (cat) => cat.id.toString() === categoryId
      );
      if (category && category.tags.length > 0) {
        setMobileCategories(category.tags);
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
        description: "مشکلی در بارگذاری تگ‌ها رخ داد.",
        variant: "error",
      });
    }
  };

  // Go back up one level
  const handleMobileBackClick = () => {
    try {
      if (mobileCategoryPath.length <= 1) {
        setMobileCategories(categoryTree);
        setCurrentMobileLevel(null);
        setMobileCategoryPath([]);
      } else {
        const newPath = [...mobileCategoryPath];
        newPath.pop();
        const parentId = newPath[newPath.length - 1]?.id;
        if (parentId) {
          const category = categoryTree.find(
            (cat) => cat.id.toString() === parentId
          );
          if (category && category.tags.length > 0) {
            setMobileCategories(category.tags);
            setCurrentMobileLevel(parentId);
            setMobileCategoryPath(newPath);
          }
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

  if (!shouldRenderNavbar) {
    return;
  }

  return (
    <header
      ref={parentRef}
      className={cn(
        "fixed inset-x-0 z-40 transition-all duration-300",
        "backdrop-blur-xl",
        "before:absolute before:inset-0 before:bg-background/95",
        "after:absolute after:inset-0 after:bg-transparent",
        "border-b border-border",
        isScrolled ? "shadow-2xl shadow-black/20" : "shadow-lg shadow-black/10",
        // Hide on mobile, show only on desktop
        "hidden lg:block"
      )}
      style={{
        top: "calc(env(safe-area-inset-top, 0px) + 0)",
        backgroundColor: isScrolled
          ? "hsl(var(--background) / 0.95)"
          : "hsl(var(--background) / 0.9)",
      }}
    >
      <div className="relative z-10 container mx-auto flex items-center justify-between px-4 py-2 md:py-4 overflow-visible">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 z-10 relative" prefetch={false}>
          <span className="brand-name text-xl md:text-2xl font-bold whitespace-nowrap text-primary drop-shadow-sm">
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
            className="whitespace-nowrap p-2 text-foreground hover:text-primary/80 transition-colors duration-200 nav-link"
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
              className="flex items-center p-2 text-foreground hover:text-primary/80 transition-colors duration-200 nav-link"
            >
              دسته‌بندی‌ها
              <ChevronDown
                className={cn(
                  "ml-1 h-4 w-4 transition-transform text-foreground",
                  isCategoriesOpen && "rotate-180"
                )}
              />
            </button>
            {isCategoriesOpen && (
              <div
                id="category-menu"
                className="absolute right-0 mt-1 bg-gradient-to-br from-background via-muted/80 to-background rounded-lg shadow-lg py-2 min-w-[220px] z-[60] dropdown-menu border border-border/50 transition-opacity duration-150"
              >
                {categoryTree.map((cat) => (
                  <div
                    key={cat.id}
                    className="relative group"
                    onMouseEnter={() => setActiveCategory(cat.id as any)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    <div className="flex justify-between items-center px-4 py-2.5 bg-transparent hover:bg-muted cursor-pointer transition-all duration-200 rounded-md mx-2 my-1">
                      <Link
                        href={`/${cat.slug}`}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="block flex-1 text-foreground transition-colors"
                        prefetch={false}
                      >
                        {cat.name}
                      </Link>
                      {cat.tags?.length > 0 && (
                        <ChevronRight className="h-4 w-4 rotate-180 text-foreground" />
                      )}
                    </div>

                    {activeCategory === cat.id && cat.tags?.length > 0 && (
                      <div className="absolute right-full top-0 bg-gradient-to-br from-background via-muted/80 to-background rounded-lg shadow-lg py-2 min-w-[220px] dropdown-menu z-[70] border border-border/50 mr-[218px]">
                        {cat.tags.map((tag) => (
                          <div key={tag.uuid} className="relative">
                            <Link
                              href={`/${cat.slug}/${tag.slug}`}
                              onClick={() => setIsCategoriesOpen(false)}
                              className="block px-4 py-2.5 whitespace-nowrap bg-transparent hover:bg-muted/70 transition-all duration-200 text-foreground hover:text-primary/80 rounded-md mx-2 my-1"
                            >
                              {tag.name}
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/shop"
            className="whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/85 transition-all duration-200 nav-link shadow-sm transform-gpu active:scale-100"
          >
            <Store className="h-4 w-4" />
            <span>فروشگاه</span>
          </Link>
          <Link
            href="/anime"
            className="whitespace-nowrap p-2 text-foreground hover:text-primary/80 transition-colors duration-200 nav-link"
            prefetch={false}
          >
            لیست انمیه ها
          </Link>

          <Link
            href="/topic"
            className="whitespace-nowrap p-2 text-foreground hover:text-primary/80 transition-colors duration-200 nav-link"
            prefetch={false}
          >
            اخبار انیمه
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

          {/* Show user menu only on desktop; move user-related links to hamburger on mobile */}
          <div className="hidden lg:block">
            <UserMenu />
          </div>
          <CartDropdown />

          {/* Prominent Shop button on mobile */}
          <Link
            href="/shop"
            className="lg:hidden inline-flex items-center gap-1 rounded-md px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/85 transition-all duration-200 transform-gpu active:scale-100"
          >
            <Store className="h-5 w-5" />
            <span className="text-sm">فروشگاه</span>
          </Link>

          {/* Mobile Hamburger */}
          <Button
            ref={hamburgerRef}
            variant="ghost"
            size="icon"
            aria-label={isOpen ? "بستن منو" : "بازکردن منو"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary/80 transition-colors duration-200"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Panel */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-[45] lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div
            ref={menuRef}
            className="fixed top-0 right-0 min-h-screen w-3/4 max-w-sm z-[50] overflow-y-auto bg-gradient-to-br from-background via-muted/80 to-background/95 backdrop-blur-xl border-l border-border before:absolute before:inset-0 before:bg-gradient-to-tr before:from-primary/10 before:via-accent/10 before:to-secondary/10 before:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_70%_20%,rgba(139,92,246,0.10),transparent_60%)] after:pointer-events-none transition-transform duration-200"
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
                  href="/anime"
                  onClick={() => setIsOpen(false)}
                  prefetch={false}
                  className="flex flex-col items-center justify-center p-3 rounded-lg bg-card hover:bg-muted transition-colors"
                >
                  <span className="text-xs text-foreground">لیست انمیه ها</span>
                </Link>
                <Link
                  href="/topic"
                  onClick={() => setIsOpen(false)}
                  prefetch={false}
                  className="flex flex-col items-center justify-center p-3 rounded-lg bg-card hover:bg-muted transition-colors"
                >
                  <span className="text-xs text-foreground">اخبار انیمه</span>
                </Link>
                <div className="col-span-3 flex items-center justify-center p-3 rounded-lg bg-card">
                  <UserMenu />
                </div>
                <Link
                  href="/search"
                  onClick={() => setIsOpen(false)}
                  prefetch={false}
                  className="flex flex-col items-center justify-center p-3 rounded-lg bg-card hover:bg-muted transition-colors"
                >
                  <Search className="h-6 w-6 text-foreground mb-2" />
                  <span className="text-xs text-foreground">جستجو</span>
                </Link>
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
                          href={`/${cat.slug}`}
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
                {mobileCategoryPath.length > 0 ? "تگ‌ها" : "دسته‌بندی‌ها"}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {mobileCategories.map((c) => (
                  <div key={c.id || c.uuid} className="flex items-center">
                    <Link
                      href={`/${c.slug}`}
                      prefetch={false}
                      onClick={() => setIsOpen(false)}
                      className="block p-2 bg-card rounded-lg text-sm hover:bg-muted transition-colors flex-1 text-foreground"
                      aria-label="جستجو در منو"
                    >
                      {c.name}
                    </Link>
                    {c.tags?.length > 0 && (
                      <button
                        onClick={() =>
                          handleMobileCategoryClick(c.id, c.name, c.slug)
                        }
                        className="p-2 ml-1 bg-card rounded-lg hover:bg-muted transition-colors"
                        aria-label="نمایش تگ‌ها"
                      >
                        <ChevronLeft className="h-4 w-4 text-foreground" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
