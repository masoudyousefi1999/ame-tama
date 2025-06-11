"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
    const searchResults = searchProducts(
      query,
      selectedCategories.length > 0 ? selectedCategories : null
    );

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

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0 font-vazirmatn">
          {query ? `نتایج جستجو برای "${query}"` : "همه محصولات"}
        </h1>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
          {/* نوار جستجو */}
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="جستجوی محصولات..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pr-10 rounded-full border-gray-300 dark:border-gray-700 font-vazirmatn"
            />
          </div>

          {/* انتخاب مرتب‌سازی */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-full border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 text-sm font-vazirmatn"
          >
            {sortOptions.map((option) => (
              <option
                key={option.id}
                value={option.id}
                className="font-vazirmatn"
              >
                {option.name}
              </option>
            ))}
          </select>

          {/* دکمه فیلتر برای موبایل */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="md:hidden rounded-full font-vazirmatn"
              >
                <Filter className="h-4 w-4 ml-2" />
                فیلترها
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="font-vazirmatn">فیلترها</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <h3 className="font-medium mb-3 font-vazirmatn">
                  دسته‌بندی‌ها
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox
                        id={`mobile-category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <Label
                        htmlFor={`mobile-category-${category.id}`}
                        className="mr-2 text-sm font-vazirmatn"
                      >
                        {category.name}
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
        {/* فیلترهای دسکتاپ */}
        <div className="hidden md:block w-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 h-fit">
          <h3 className="font-medium mb-4 font-vazirmatn">دسته‌بندی‌ها</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="mr-2 text-sm font-vazirmatn"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>

          {selectedCategories.length > 0 && (
            <Button
              variant="link"
              className="mt-4 p-0 h-auto text-purple-600 dark:text-purple-400 font-vazirmatn"
              onClick={() => setSelectedCategories([])}
            >
              پاک کردن فیلترها
            </Button>
          )}
        </div>

        {/* نتایج جستجو */}
        <div className="flex-1">
          {/* نمایش فیلترهای انتخاب شده */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategories.map((categoryId) => {
                const category = categories.find((c) => c.id === categoryId);
                return (
                  <Badge
                    key={categoryId}
                    className="bg-purple-500 hover:bg-purple-600 font-vazirmatn"
                    onClick={() => toggleCategory(categoryId)}
                  >
                    {category?.name}
                    <X className="h-3 w-3 mr-1" />
                  </Badge>
                );
              })}
              <Button
                variant="link"
                className="p-0 h-auto text-purple-600 dark:text-purple-400 text-sm font-vazirmatn"
                onClick={() => setSelectedCategories([])}
              >
                پاک کردن همه
              </Button>
            </div>
          )}

          {/* نمایش نتایج */}
          {isLoading ? (
            <p className="text-center text-gray-500 dark:text-gray-400 font-vazirmatn">
              در حال بارگیری...
            </p>
          ) : results.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 font-vazirmatn">
              هیچ نتیجه‌ای یافت نشد.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <Card
                  key={product.id}
                  className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold font-vazirmatn">
                      {product.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={(product as any)?.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover mb-4 rounded-md"
                    />
                    <p className="text-gray-700 dark:text-gray-300 font-vazirmatn">
                      {product.description}
                    </p>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">
                      تاریخ انتشار: {formatPersianDate(product.releaseDate)}
                    </span>
                    <p className="text-xl font-bold mt-2 font-vazirmatn">
                      {product.price.toLocaleString()} تومان
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full font-vazirmatn"
                      onClick={() => handleAddToCart(product)}
                    >
                      افزودن به سبد خرید
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
