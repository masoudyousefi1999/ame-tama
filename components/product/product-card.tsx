"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useWishlist } from "@/context/wishlist-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { IProductType } from "@/lib/products";
import { useAuth } from "@/context/auth-context";
import { useLoginModal } from "@/context/login-modal-context";
import { useCart } from "@/context/cart-context";
import {
  formatPriceDivided,
  calculateDiscountPercentage,
} from "@/lib/format-price";
import Image from "@/components/ui/custom-image";

export interface ProductCardProps {
  product: IProductType;
  showAddToCart?: boolean;
  showAddToWishlist?: boolean;
  showProductName?: boolean; // New prop to show product name
  className?: string;
  eagerLoad?: boolean; // For LCP optimization
}

export function ProductCard({
  product,
  showAddToCart = true,
  showProductName = false, // Default to false
  className,
  eagerLoad = false,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();
  const { addItem } = useCart();
  const {
    addToWishlist: addToWishlistContext,
    removeFromWishlist: removeFromWishlistContext,
    isInWishlist,
  } = useWishlist();
  const { toast } = useToast();

  const tagSlug = product?.tags[0]?.slug;
  const categorySlug = product?.category?.slug;

  useEffect(() => {
    if (isMobile) setHovered(true);
  }, [isMobile]);

  const isInStock = useMemo(
    () => product.quantity && product.quantity > 0,
    [product.quantity]
  );

  const ratingValue = useMemo(() => {
    const rawRating = product.rating;
    if (typeof rawRating === "number") {
      return Number.isFinite(rawRating) ? rawRating : null;
    }

    const parsed = parseFloat(String(rawRating));
    return Number.isFinite(parsed) ? parsed : null;
  }, [product.rating]);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!user) {
        toast({
          variant: "info",
          title: "ورود به حساب کاربری",
          description:
            "برای افزودن محصول به سبد خرید، ابتدا وارد حساب کاربری خود شوید",
          duration: 2000,
        });
        openLoginModal();
        return;
      }

      try {
        addItem(product.uuid, 1);
        toast({
          variant: "cart",
          title: "محصول به سبد خرید اضافه شد",
          description: `${product.name} با موفقیت به سبد خرید شما اضافه شد`,
          duration: 2000,
        });
      } catch {
        toast({
          variant: "error",
          title: "خطا",
          description: "مشکلی در افزودن محصول به سبد خرید رخ داد",
          duration: 2000,
        });
      }
    },
    [user, product.uuid, product.name, addItem, toast, openLoginModal]
  );

  const handleWishlistToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!user) {
        toast({
          variant: "info",
          title: "ورود به حساب کاربری",
          description:
            "برای افزودن محصول به علاقه‌مندی‌ها، ابتدا وارد حساب کاربری خود شوید",
          duration: 2000,
        });
        openLoginModal();
        return;
      }

      try {
        if (isInWishlist(product.uuid)) {
          removeFromWishlistContext(product.uuid);
          toast({
            variant: "wishlist",
            title: "محصول از علاقه‌مندی‌ها حذف شد",
            description: `${product.name} از لیست علاقه‌مندی‌های شما حذف شد`,
            duration: 2000,
          });
        } else {
          addToWishlistContext(product);
          toast({
            variant: "wishlist",
            title: "محصول به علاقه‌مندی‌ها اضافه شد",
            description: `${product.name} به لیست علاقه‌مندی‌های شما اضافه شد`,
            duration: 2000,
          });
        }
      } catch {
        toast({
          variant: "error",
          title: "خطا",
          description: "مشکلی در مدیریت علاقه‌مندی‌ها رخ داد",
          duration: 2000,
        });
      }
    },
    [
      user,
      product.uuid,
      product.name,
      isInWishlist,
      addToWishlistContext,
      removeFromWishlistContext,
      toast,
      openLoginModal,
    ]
  );

  // Memoize the card content to prevent unnecessary re-renders
  const cardContent = useMemo(
    () => (
      <div
        data-product-card
        className={cn(
          "group relative transition-all duration-300 rounded-2xl border border-border bg-card bg-opacity-50 cursor-pointer",
          // Reduce backdrop-blur and transforms for better performance
          isMobile
            ? "shadow-card"
            : "shadow-card hover:shadow-xl hover:scale-[1.01]",
          className
        )}
        onMouseEnter={() => !isMobile && setHovered(true)}
        onMouseLeave={() => !isMobile && setHovered(false)}
      >
        <Link
          href={`/${categorySlug}/${tagSlug}/${product.slug}`}
          className="block"
          prefetch={false}
          onClick={(e) => {
            // Add visual feedback for instant response
            const card = e.currentTarget.closest(
              "[data-product-card]"
            ) as HTMLElement;
            if (card) {
              card.style.transform = "scale(0.98)";
              card.style.transition = "transform 0.1s ease-out";
              setTimeout(() => {
                card.style.transform = "scale(1)";
              }, 100);
            }
          }}
        >
          {/* تصویر */}
          <div className="relative aspect-[1] w-full overflow-hidden rounded-t-2xl">
            <Image
              src={product.productMedia?.[0]?.url || "/placeholder.svg"}
              alt={product.name}
              quality={isMobile ? 50 : 70}
              fill
              loading={eagerLoad ? "eager" : "lazy"}
              priority={eagerLoad}
              fetchPriority={eagerLoad ? "high" : "auto"}
              className={cn(
                "object-cover w-full h-full transition-opacity duration-300",
                // Subtle hover without extra scale/brightness to avoid repaints
                !isMobile && hovered && "opacity-95"
              )}
            />

            {/* Badge تخفیف */}
            {product.discountPrice && (
              <div className="absolute top-5 -left-4 z-30 p-2 rounded-full text-center">
                <div
                  className="
        bg-red-500
        text-white
        text-sm
        font-bold
        px-6
        py-1
        rounded-full
        flex
        items-center
        justify-center
      "
                >
                  %
                  {calculateDiscountPercentage(
                    product.price,
                    product.discountPrice
                  )}
                </div>
              </div>
            )}

            {/* نمایش نوع محصول (فقط در صفحه تگ) */}
            {showProductName && (
              <div className="absolute top-0 left-0 z-20">
                <Badge className="text-sm font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 shadow-xl rounded-br-lg rounded-tl-none rounded-tr-none rounded-bl-none px-3 py-1">
                  {product.category?.name || "بدون دسته‌بندی"}
                </Badge>
              </div>
            )}

            {/* موجودی */}
            <div className="absolute top-2 right-2 z-20 space-y-1">
              {product.quantity === 0 && (
                <Badge variant="destructive" className="text-xs shadow-md">
                  ناموجود
                </Badge>
              )}
              {product.quantity > 0 && product.quantity < 3 && (
                <Badge variant="warning" className="text-xs shadow-md">
                  ⚡ تنها {product.quantity} عدد باقی مانده
                </Badge>
              )}
            </div>
          </div>

          {/* جزئیات */}
          <div
            className={cn(
              "p-3 md:p-4 space-y-2 md:space-y-3 rounded-b-2xl transition-colors duration-300",
              isMobile ? "bg-card/80" : "bg-card/70"
            )}
          >
            <h3 className="text-sm md:text-base font-semibold leading-relaxed text-card-foreground line-clamp-2 group-hover:text-primary/80 transition-colors duration-200">
              {product.name}
            </h3>

            {ratingValue !== null && (
              <div className="flex items-center text-amber-400 text-xs md:text-sm">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={cn(
                      "h-3 w-3 md:h-4 md:w-4",
                      idx < Math.round(ratingValue)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/40"
                    )}
                  />
                ))}
                <span className="mr-1 text-xs text-muted-foreground">
                  ({ratingValue.toFixed(1)})
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-1">
                {product.discountPrice ? (
                  <>
                    {/* قیمت اصلی با خط قرمز */}
                    <p className="text-sm line-through text-destructive decoration-destructive">
                      {formatPriceDivided(product.price)}
                    </p>
                    {/* قیمت تخفیف خورده */}
                    <p className="text-base md:text-lg font-bold text-primary">
                      {formatPriceDivided(product.discountPrice)}
                    </p>
                  </>
                ) : (
                  <p className="text-base md:text-lg font-bold text-primary">
                    {formatPriceDivided(product.price)}
                  </p>
                )}
              </div>
              {showAddToCart && (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className="rounded-full bg-primary hover:bg-primary/85 text-primary-foreground px-3 md:px-4 py-1 md:py-1.5 text-xs shadow-md transition-all duration-200 flex-shrink-0"
                >
                  <ShoppingCart className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                  افزودن
                </Button>
              )}
            </div>
          </div>
        </Link>
      </div>
    ),
    [
      isMobile,
      className,
      product.slug,
      product.name,
      product.productMedia,
      product.quantity,
      ratingValue,
      product.price,
      imageLoaded,
      imageError,
      showAddToCart,
      showProductName, // Add new prop to dependencies
      isInStock,
      formatPriceDivided,
      hovered,
      handleWishlistToggle,
      handleAddToCart,
    ]
  );

  return cardContent;
}
