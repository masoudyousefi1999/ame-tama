"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BackButton } from "@/components/ui/back-button";
import { ProductCard } from "@/components/product/product-card";
import { useWishlist } from "@/context/wishlist-context";

export default function WishlistPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { wishlist, removeFromWishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState("");

  // اگر کاربر وارد نشده باشد، به صفحه اصلی هدایت می‌شود
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // اگر در حال بارگذاری است یا کاربر وارد نشده، چیزی نمایش نمی‌دهیم
  if (isLoading || !user) {
    return null;
  }

  const handleAddToCart = (product: any) => {
    addItem(product, 1);

    toast({
      title: "به سبد خرید اضافه شد",
      description: `${product.name} به سبد خرید شما اضافه شد`,
    });
  };

  // Filter wishlist based on search query
  const filteredWishlist = wishlist.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-24 lg:mt-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 pt-6">
        <Breadcrumb
          items={[
            { label: "پروفایل من", href: "/profile" },
            {
              label: "علاقه‌مندی‌ها",
              href: "/profile/wishlist",
              isCurrent: true,
            },
          ]}
          className="mb-6"
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Animated background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900 via-rose-900 to-red-900" />

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-rose-500/30 to-red-500/30 animate-pulse" />

        {/* Floating orbs */}
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-pink-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-rose-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-28 h-28 bg-red-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        />
        <div
          className="absolute bottom-32 right-20 w-20 h-20 bg-pink-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        />

        {/* Radial gradients for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(236,72,153,0.4),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(244,63,94,0.4),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.3),transparent_50%)]" />

        {/* Animated mesh gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-transparent via-pink-500/10 to-transparent animate-pulse"
          style={{ animationDuration: "6s" }}
        />

        {/* Top overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-pink-200 to-rose-200 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            علاقه‌مندی‌های من
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-medium">
            مجسمه‌های انیمه و اکشن فیگورهای مورد علاقه شما
          </p>
          <div className="flex items-center justify-center gap-4">
            <Heart className="h-12 w-12 text-white/80" />
            <div className="text-left">
              <h2 className="text-xl font-bold text-white">
                {wishlist.length} محصول
              </h2>
              <p className="text-white/80">در لیست علاقه‌مندی‌های شما</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 lg:mt-12">
        {/* top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <BackButton href="/profile" label="بازگشت به پروفایل" />
        </div>

        <Card>
          {/* ------------------------------------------------------------ */}
          {/*  Card header                                                */}
          {/* ------------------------------------------------------------ */}
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>مجسمه‌های مورد علاقه من</CardTitle>
              <CardDescription>
                فیگورهای انیمه و اکشن فیگورهای مورد علاقه شما
              </CardDescription>
            </div>

            {/* search box */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="جستجو در مجسمه‌های مورد علاقه..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </CardHeader>

          {/* ------------------------------------------------------------ */}
          {/*  Card body                                                  */}
          {/* ------------------------------------------------------------ */}
          <CardContent>
            {filteredWishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredWishlist.map((item) => (
                  <ProductCard
                    key={item.uuid}
                    product={item}
                    variant="wishlist"
                    onAddToCart={handleAddToCart}
                    onRemoveFromWishlist={removeFromWishlist}
                    showRemoveFromWishlist
                  />
                ))}
              </div>
            ) : (
              /* empty-state */
              <div className="text-center py-12">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  لیست مجسمه‌های مورد علاقه شما خالی است
                </h3>
                <p className="text-muted-foreground mb-6">
                  فیگورهای انیمه و اکشن فیگورهای مورد علاقه خود را به این لیست
                  اضافه کنید
                </p>
                <Button
                  onClick={() => router.push("/shop")}
                  className="rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                >
                  <Search className="ml-2 h-4 w-4" />
                  مشاهده محصولات
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
