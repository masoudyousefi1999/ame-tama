"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useWishlist } from "@/context/wishlist-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { IProductType } from "@/lib/products";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/auth-context";
import { useLoginModal } from "@/context/login-modal-context";
import { useCart } from "@/context/cart-context";

export interface ProductCardProps {
  product: IProductType;
  variant?: "default" | "wishlist" | "compact" | "order";
  onAddToCart?: (product: IProductType) => void;
  onAddToWishlist?: (product: IProductType) => void;
  onRemoveFromWishlist?: (productUuid: string) => void;
  showAddToCart?: boolean;
  showAddToWishlist?: boolean;
  showRemoveFromWishlist?: boolean;
  className?: string;
  index?: number;
}

export function ProductCard({
  product,
  variant = "default",
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  showAddToCart = true,
  showAddToWishlist = true,
  showRemoveFromWishlist = false,
  className,
  index = 0,
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

  // Always show hover actions on mobile
  useEffect(() => {
    if (isMobile) setHovered(true);
  }, [isMobile]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fa-IR").format(price) + " تومان";

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
    } catch (error) {
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
    } catch (error) {
      toast({
        variant: "error",
        title: "خطا",
        description: "مشکلی در مدیریت علاقه‌مندی‌ها رخ داد",
        duration: 2000,
      });
    }
  };

  // ─────── COMPACT VARIANT ───────
  if (variant === "compact") {
    return (
      <motion.div
        className={cn(
          "flex items-center p-3 rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300 hover-lift",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
          <Image
            src={product.productMedia?.[0]?.url || "/placeholder.svg"}
            alt={product.name}
            fill
            className={cn(
              "object-contain transition-all duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            sizes="64px"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 product-skeleton" />
          )}
        </div>

        <div className="mr-3 flex-1 min-w-0">
          <h3 className="line-clamp-1 text-sm font-medium text-foreground">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatPrice(product.price)}
          </p>
        </div>

        {showAddToCart && (
          <Button
            size="sm"
            variant="ghost"
            className="flex-shrink-0 hover:bg-primary/10 transition-colors"
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        )}
      </motion.div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // ORDER  ─────────────────────────────────────────────────
  if (variant === "order") {
    return (
      <motion.div
        className={cn(
          "flex items-center p-4 rounded-xl bg-card hover:bg-accent transition-all duration-300 hover-lift",
          className
        )}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <div className="relative ml-4 h-20 w-20 overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.productMedia?.[0]?.url || "/placeholder.svg"}
            alt={product.name}
            fill
            className={cn(
              "object-contain transition-all duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            sizes="80px"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 product-skeleton" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-foreground">{product.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatPrice(product.price)}
          </p>
        </div>

        <p className="text-right font-medium text-primary">
          {formatPrice(product.price)}
        </p>
      </motion.div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // WISHLIST  ───────────────────────────────────────────────
  if (variant === "wishlist") {
    return (
      <motion.div
        className={cn(
          "group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-300 hover-lift",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        {/* image */}
        <div className="relative h-48 bg-muted">
          <Image
            src={product.productMedia?.[0]?.url || "/placeholder.svg"}
            alt={product.name}
            fill
            className={cn(
              "object-contain p-4 transition-all duration-500 product-image-hover",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 product-skeleton" />
          )}

          {/* remove btn */}
          {showRemoveFromWishlist && (
            <motion.button
              onClick={handleWishlistToggle}
              className="absolute left-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          )}

          {/* badges */}
          <div className="absolute right-2 top-2 z-20 flex flex-col items-end gap-1">
            {product.quantity === 0 && (
              <Badge variant="destructive" className="text-2xs product-badge-improved">
                ناموجود
              </Badge>
            )}
            {product.quantity > 0 && product.quantity < 10 && (
              <Badge variant="destructive" className="text-2xs product-badge-improved">
                موجودی محدود
              </Badge>
            )}
          </div>
        </div>

        {/* details */}
        <div className="space-y-3 p-4">
          <Link href={`/product/${product.slug}`}>
            <h3 className="line-clamp-2 text-base font-semibold transition-colors hover:text-primary leading-relaxed">
              {product.name}
            </h3>
          </Link>

          {/* rating */}
          {product.rating && (
            <div className="flex items-center text-amber-400">
              <Star className="h-4 w-4 fill-amber-400" />
              <span className="mr-1 text-sm">{product.rating.toFixed(1)}</span>
            </div>
          )}

          {/* price + add-to-cart */}
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-bold price-improved">
              {formatPrice(product.price)}
            </p>

            {showAddToCart && (
              <Button
                size="sm"
                className="rounded-full bg-primary hover:bg-primary/90 px-3 py-1 text-xs shadow-lg transition-all duration-200 hover:scale-105"
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                <ShoppingCart className="ml-1 h-4 w-4" />
                افزودن
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // DEFAULT  ────────────────────────────────────────────────
  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 product-card-hover",
        className
      )}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* image */}
        <div className="relative h-64 overflow-hidden bg-muted md:h-72 lg:h-80">
          <Image
            src={product.productMedia?.[0]?.url || "/placeholder.svg"}
            alt={product.name}
            fill
            priority
            sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
            className={cn(
              "object-cover transition-all duration-700 product-image-hover",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 product-skeleton" />
          )}

          {/* enhanced gradient overlay */}
          <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* quick view overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <div className="flex items-center gap-2 text-white">
              <Eye className="h-5 w-5" />
              <span className="text-sm font-medium">مشاهده محصول</span>
            </div>
          </motion.div>

          {/* badges */}
          <div className="absolute right-3 top-3 z-30 flex flex-col items-end gap-1">
            {product.quantity === 0 && (
              <Badge variant="destructive" className="text-2xs shadow-lg product-badge-improved">
                ناموجود
              </Badge>
            )}
            {product.quantity > 0 && product.quantity < 10 && (
              <Badge variant="destructive" className="text-2xs shadow-lg product-badge-improved">
                موجودی محدود
              </Badge>
            )}
          </div>

          {/* wishlist icon */}
          {showAddToWishlist && (
            <motion.button
              onClick={handleWishlistToggle}
              className="absolute left-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full wishlist-button-improved transition-all duration-200 shadow-lg"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors duration-200",
                  isInWishlist(product.uuid)
                    ? "fill-destructive text-destructive"
                    : "text-muted-foreground hover:text-destructive"
                )}
              />
            </motion.button>
          )}
        </div>

        {/* details */}
        <div className="space-y-3 p-4">
          <h3 className="line-clamp-2 text-base font-semibold transition-colors hover:text-primary leading-relaxed">
            {product.name}
          </h3>

          {product.rating && (
            <div className="flex items-center text-amber-400 text-sm">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={cn(
                    "h-4 w-4 transition-all duration-200",
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

          <p className="text-lg font-bold price-improved">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
