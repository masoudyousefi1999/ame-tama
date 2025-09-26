"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { searchProducts, type SearchResult } from "@/lib/search";
import { useCart } from "@/context/cart-context";
import { formatPriceDivided } from "@/lib/format-price";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// تبدیل تاریخ به فرمت فارسی
const formatPersianDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// دسته‌بندی‌های محصولات
const categories = [
  { id: "one-piece", name: "وان پیس" },
  { id: "naruto", name: "ناروتو" },
  { id: "demon-slayer", name: "شیطان کش" },
  { id: "jujutsu-kaisen", name: "جوجوتسو کایزن" },
  { id: "attack-on-titan", name: "حمله به تایتان" },
  { id: "my-hero-academia", name: "آکادمی قهرمان من" },
];

// گزینه‌های مرتب‌سازی
const sortOptions = [
  { id: "relevance", name: "مرتبط‌ترین" },
  { id: "price-asc", name: "قیمت: کم به زیاد" },
  { id: "price-desc", name: "قیمت: زیاد به کم" },
  { id: "newest", name: "جدیدترین" },
];

export default function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [sortBy, setSortBy] = useState("relevance");
  const { addItem } = useCart();

  // جستجوی محصولات
  useEffect(() => {
    setIsLoading(true);
    searchProducts(
      query,
      selectedCategories.length > 0 ? selectedCategories : null
    ).then((searchResults) => {
      // مرتب‌سازی نتایج
      const sortedResults = [...searchResults];
      switch (sortBy) {
        case "price-asc":
          sortedResults.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          sortedResults.sort((a, b) => b.price - a.price);
          break;
        case "newest":
          sortedResults.sort(
            (a, b) =>
              new Date(b.releaseDate).getTime() -
              new Date(a.releaseDate).getTime()
          );
          break;
        default:
          // مرتب‌سازی بر اساس ارتباط (پیش‌فرض)
          break;
      }

      setResults(sortedResults);
      setIsLoading(false);
    });
  }, [query, selectedCategories, sortBy]);

  // تغییر وضعیت انتخاب دسته‌بندی
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // افزودن محصول به سبد خرید
  const handleAddToCart = (product: SearchResult) => {
    addItem(product as any, 1);
    toast({
      title: "محصول به سبد خرید اضافه شد",
      description: `${product.name} به سبد خرید شما اضافه شد.`,
    });
  };

  // Navigate to product page
  const handleProductClick = (product: SearchResult) => {
    router.push(`/product/${product.slug}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      {/* ── Header row ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">
          {query ? `نتایج جستجو برای «${query}»` : "همه محصولات"}
        </h1>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
          {/* 🔍 search */}
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="جستجوی محصولات..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pr-10 rounded-full bg-background border"
            />
          </div>

          {/* sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-full border bg-background px-4 py-2 text-sm"
          >
            {sortOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>

          {/* mobile filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden rounded-full">
                <Filter className="h-4 w-4 ml-2" /> فیلترها
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>فیلترها</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <h3 className="font-medium mb-3">دسته‌بندی‌ها</h3>
                <div className="space-y-2">
                  {categories.map((c) => (
                    <div key={c.id} className="flex items-center">
                      <Checkbox
                        id={`mobile-category-${c.id}`}
                        checked={selectedCategories.includes(c.id)}
                        onCheckedChange={() => toggleCategory(c.id)}
                      />
                      <Label
                        htmlFor={`mobile-category-${c.id}`}
                        className="mr-2 text-sm"
                      >
                        {c.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* ── desktop filters ───────────────────────── */}
        <aside className="hidden md:block w-64 bg-background rounded-lg shadow-sm p-6 h-fit">
          <h3 className="font-medium mb-4">دسته‌بندی‌ها</h3>
          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center">
                <Checkbox
                  id={`category-${c.id}`}
                  checked={selectedCategories.includes(c.id)}
                  onCheckedChange={() => toggleCategory(c.id)}
                />
                <Label htmlFor={`category-${c.id}`} className="mr-2 text-sm">
                  {c.name}
                </Label>
              </div>
            ))}
          </div>

          {selectedCategories.length > 0 && (
            <Button
              variant="link"
              className="mt-4 p-0 h-auto text-brand"
              onClick={() => setSelectedCategories([])}
            >
              پاک کردن فیلترها
            </Button>
          )}
        </aside>

        {/* ── results column ───────────────────────── */}
        <main className="flex-1">
          {/* active filter badges */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategories.map((id) => {
                const cat = categories.find((c) => c.id === id);
                return (
                  <Badge
                    key={id}
                    className="bg-brand hover:bg-brand/90"
                    onClick={() => toggleCategory(id)}
                  >
                    {cat?.name}
                    <X className="h-3 w-3 mr-1" />
                  </Badge>
                );
              })}
              <Button
                variant="link"
                className="p-0 h-auto text-brand text-sm"
                onClick={() => setSelectedCategories([])}
              >
                پاک کردن همه
              </Button>
            </div>
          )}

          {/* list / states */}
          {isLoading ? (
            <p className="text-center text-muted-foreground">در حال بارگیری…</p>
          ) : results.length === 0 ? (
            <p className="text-center text-muted-foreground">
              هیچ نتیجه‌ای یافت نشد.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((p) => (
                <Card
                  key={p.id}
                  className="bg-background shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow active:scale-[0.98] touch-manipulation"
                  onClick={() => handleProductClick(p)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold hover:text-primary transition-colors">
                      {p.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={(p as any).imageUrl || "/placeholder.svg"}
                      alt={p.name}
                      className="w-full h-48 object-cover mb-4 rounded-md"
                    />
                    <p className="text-foreground/80">{p.description}</p>
                    <span className="text-xs text-muted-foreground">
                      تاریخ انتشار: {formatPersianDate(p.releaseDate)}
                    </span>
                    <p className="text-xl font-bold mt-2">
                      {formatPriceDivided(p.price)}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleAddToCart(p);
                      }}
                    >
                      افزودن به سبد خرید
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
