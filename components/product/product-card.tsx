"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/context/wishlist-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { IProductType } from "@/lib/products";

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
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
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
    if (onAddToCart) onAddToCart(product);
    else
      toast({
        title: "محصول به سبد خرید اضافه شد",
        description: `${product.name} به سبد خرید شما اضافه شد.`,
      });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.uuid)) {
      if (onRemoveFromWishlist) onRemoveFromWishlist(product.uuid);
      else removeFromWishlistContext(product.uuid);
    } else {
      if (onAddToWishlist) onAddToWishlist(product);
      else addToWishlistContext(product as any);
    }
  };

  // ─────── COMPACT VARIANT ───────
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow",
          className
        )}
      >
        <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={product.productMedia?.[0]?.url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain"
            sizes="64px"
          />
        </div>
        <div className="mr-3 flex-1 min-w-0">
          <h3 className="text-sm font-medium line-clamp-1 font-vazirmatn">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">
            {formatPrice(product.price)}
          </p>
        </div>
        {showAddToCart && (
          <Button
            size="sm"
            variant="ghost"
            className="flex-shrink-0"
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  // ─────── ORDER VARIANT ───────
  if (variant === "order") {
    return (
      <div
        className={cn(
          "flex items-center p-4 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
          className
        )}
      >
        <div className="relative h-20 w-20 ml-4 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={product.productMedia?.[0]?.url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain"
            sizes="80px"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium font-vazirmatn">{product.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">
            {formatPrice(product.price)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium font-vazirmatn">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    );
  }

  // ─────── WISHLIST VARIANT ───────
  if (variant === "wishlist") {
    return (
      <motion.div
        className={cn(
          "group relative rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
          <Image
            src={product.productMedia?.[0]?.url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Remove from Wishlist Button */}
          {showRemoveFromWishlist && (
            <button
              onClick={handleWishlistToggle}
              className="absolute top-2 left-2 h-8 w-8 rounded-full bg-red-600/80 flex items-center justify-center text-white hover:bg-red-700 transition-colors z-10"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">حذف از علاقه‌مندی‌ها</span>
            </button>
          )}

          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-10">
            {product.quantity === 0 && (
              <Badge className="bg-red-600 text-white text-xs font-vazirmatn">
                ناموجود
              </Badge>
            )}
            {product.quantity > 0 && product.quantity < 10 && (
              <Badge className="bg-amber-500 text-white text-xs font-vazirmatn">
                موجودی محدود
              </Badge>
            )}
          </div>
        </div>
        <div className="p-4 space-y-2">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-vazirmatn text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {product.rating && (
              <div className="flex items-center text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" />
                <span className="mr-1 text-sm font-vazirmatn">
                  {product.rating.toFixed(1)}
                </span>
              </div>
            )}
            <span
              className={cn(
                "text-sm font-vazirmatn",
                product.quantity > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {product.quantity > 0 ? "موجود" : "ناموجود"}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400 font-vazirmatn">
              {formatPrice(product.price)}
            </p>
            {showAddToCart && (
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full px-3 py-1 text-xs shadow transition-colors"
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                <ShoppingCart className="h-4 w-4 ml-1" />
                افزودن
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // ─────── DEFAULT VARIANT ───────
  return (
    <motion.div
      className={cn(
        "group relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow",
        className
      )}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image Section */}
        <div className="relative h-64 md:h-72 lg:h-80 bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <Image
            src={product.productMedia?.[0]?.url || "/placeholder.svg"}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1 z-10">
            {product.quantity === 0 && (
              <Badge className="bg-red-600 text-white text-xs font-vazirmatn">
                ناموجود
              </Badge>
            )}
            {product.quantity > 0 && product.quantity < 10 && (
              <Badge className="bg-amber-500 text-white text-xs font-vazirmatn">
                موجودی محدود
              </Badge>
            )}
            {(product.createdAt as any) > new Date() && (
              <Badge className="bg-purple-600 text-white text-xs font-vazirmatn">
                جدید
              </Badge>
            )}
          </div>

          {/* Wishlist Icon */}
          {showAddToWishlist && (
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 left-3 z-10 h-10 w-10 rounded-full bg-white/70 dark:bg-gray-900/50 backdrop-blur-md flex items-center justify-center hover:bg-white/90 dark:hover:bg-gray-900/70 transition-colors"
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  isInWishlist(product.uuid)
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600 dark:text-gray-300"
                )}
              />
            </button>
          )}
        </div>

        {/* Details Section */}
        <div className="p-4 space-y-2">
          <h3 className="font-vazirmatn text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center text-amber-400 text-sm">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={cn(
                    "h-4 w-4",
                    idx < Math.round(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300 dark:text-gray-600"
                  )}
                />
              ))}
              <span className="mr-1 font-vazirmatn text-xs text-gray-600 dark:text-gray-400">
                ({product.rating.toFixed(1)})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400 font-vazirmatn">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
