"use client";

import React, { useState, useEffect } from "react";
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
}

export function ProductCard({
  product,
  showAddToCart = true,
  showAddToWishlist = true,
  className,
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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fa-IR").format(price / 10) + " تومان";

  const isInStock = product.quantity && product.quantity > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
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
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
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
  };

  return (
    <div
      className={cn(
        "group relative transition-all duration-300 rounded-2xl border border-border bg-card bg-opacity-50 backdrop-blur-md shadow-card hover:shadow-2xl hover:scale-[1.02]",
        className
      )}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* تصویر */}
        <div className="relative aspect-[1/1.25] w-full overflow-hidden rounded-t-2xl">
          <Image
            src={product.productMedia?.[0]?.url || "/placeholder.svg"}
            alt={product.name}
            quality={70}
            fill
            sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
            priority
            className={cn(
              "object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-110",
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
              className="absolute top-3 left-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-primary/80 text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow transition-all duration-300"
            >
              <Heart className="h-5 w-5" />
            </button>
          )}

          {/* موجودی */}
          <div className="absolute top-3 right-3 z-20 space-y-1">
            {product.quantity === 0 && (
              <Badge variant="destructive" className="text-2xs shadow-md">
                ناموجود
              </Badge>
            )}
            {product.quantity > 0 && product.quantity < 3 && (
              <Badge variant="destructive" className="text-2xs shadow-md">
                موجودی محدود
              </Badge>
            )}
          </div>
        </div>

        {/* جزئیات */}
        <div className="p-4 space-y-3 bg-card/60 backdrop-blur-xl rounded-b-2xl transition-colors duration-300">
          <h3 className="text-base font-semibold leading-relaxed text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {product.rating && (
            <div className="flex items-center text-amber-400 text-sm">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={cn(
                    "h-4 w-4",
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
            <p className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </p>
            {showAddToCart && (
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={!isInStock}
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 text-xs shadow-md transition-all duration-300"
              >
                <ShoppingCart className="ml-1 h-4 w-4" />
                افزودن
              </Button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
