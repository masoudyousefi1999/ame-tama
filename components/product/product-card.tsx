"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Star } from "lucide-react";
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

export interface ProductCardProps {
  product: IProductType;
  showAddToCart?: boolean;
  showAddToWishlist?: boolean;
  className?: string;
  eagerLoad?: boolean; // For LCP optimization
}

export function ProductCard({
  product,
  showAddToCart = true,
  showAddToWishlist = true,
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

  useEffect(() => {
    if (isMobile) setHovered(true);
  }, [isMobile]);

  // Memoize expensive calculations
  const formatPrice = useCallback(
    (price: number) =>
      new Intl.NumberFormat("fa-IR").format(price / 10) + " تومان",
    []
  );

  const isInStock = useMemo(
    () => product.quantity && product.quantity > 0,
    [product.quantity]
  );

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
          href={`/product/${product.slug}`}
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
              quality={isMobile ? 60 : 75}
              width={600}
              height={600}
              loading={eagerLoad ? "eager" : "lazy"}
              priority={eagerLoad}
              fetchPriority={eagerLoad ? "high" : "auto"}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className={cn(
                "object-cover w-full h-full transition-opacity duration-500 ease-out",
                // Subtle hover without extra scale/brightness to avoid repaints
                !isMobile && hovered && "opacity-95",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}

            {/* علاقه‌مندی */}
            {showAddToWishlist && (
              <button
                onClick={handleWishlistToggle}
                className="absolute top-2 left-2 z-20 flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full bg-primary/80 text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow transition-all duration-300"
              >
                <Heart className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            )}

            {/* موجودی */}
            <div className="absolute top-2 right-2 z-20 space-y-1">
              {product.quantity === 0 && (
                <Badge variant="destructive" className="text-xs shadow-md">
                  ناموجود
                </Badge>
              )}
              {product.quantity > 0 && product.quantity < 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs shadow-md bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
                >
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
            <h3 className="text-sm md:text-base font-semibold leading-relaxed text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {product.rating && (
              <div className="flex items-center text-amber-400 text-xs md:text-sm">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={cn(
                      "h-3 w-3 md:h-4 md:w-4",
                      idx < Math.round(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/40"
                    )}
                  />
                ))}
                <span className="mr-1 text-xs text-muted-foreground">
                  ({product.rating.toFixed(1)})
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-base md:text-lg font-bold text-primary">
                {formatPrice(product.price)}
              </p>
              {showAddToCart && (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-3 md:px-4 py-1 md:py-1.5 text-xs shadow-md transition-all duration-300"
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
      product.rating,
      product.price,
      imageLoaded,
      imageError,
      showAddToWishlist,
      showAddToCart,
      isInStock,
      formatPrice,
      hovered,
      handleWishlistToggle,
      handleAddToCart,
    ]
  );

  return cardContent;
}
