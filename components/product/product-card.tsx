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
          "flex items-center p-2 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow",
          className
        )}
      >
        <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
          <Image
            src={product.productMedia?.[0]?.url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain"
            sizes="64px"
          />
        </div>

        <div className="mr-3 flex-1 min-w-0">
          <h3 className="line-clamp-1 text-sm font-medium">{product.name}</h3>
          <p className="text-sm text-muted-foreground">
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

  // ─────────────────────────────────────────────────────────
  // ORDER  ─────────────────────────────────────────────────
  if (variant === "order") {
    return (
      <div
        className={cn(
          "flex items-center p-4 rounded-lg bg-card hover:bg-accent transition-colors",
          className
        )}
      >
        <div className="relative ml-4 h-20 w-20 overflow-hidden rounded-md bg-muted">
          <Image
            src={product.productMedia?.[0]?.url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain"
            sizes="80px"
          />
        </div>

        <div className="flex-1">
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatPrice(product.price)}
          </p>
        </div>

        <p className="text-right font-medium">{formatPrice(product.price)}</p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // WISHLIST  ───────────────────────────────────────────────
  if (variant === "wishlist") {
    return (
      <motion.div
        className={cn(
          "group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {/* image */}
        <div className="relative h-48 bg-muted">
          <Image
            src={product.productMedia?.[0]?.url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain p-4"
            sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
          />

          {/* remove btn */}
          {showRemoveFromWishlist && (
            <button
              onClick={handleWishlistToggle}
              className="absolute left-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          {/* badges */}
          <div className="absolute right-2 top-2 z-10 flex flex-col items-end gap-1">
            {product.quantity === 0 && (
              <Badge variant="destructive" className="text-2xs">
                ناموجود
              </Badge>
            )}
            {product.quantity > 0 && product.quantity < 10 && (
              <Badge variant="destructive" className="text-2xs">
                موجودی محدود
              </Badge>
            )}
          </div>
        </div>

        {/* details */}
        <div className="space-y-2 p-4">
          <Link href={`/product/${product.slug}`}>
            <h3 className="line-clamp-2 text-base font-semibold transition-colors hover:text-primary">
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
            <p className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </p>

            {showAddToCart && (
              <Button
                size="sm"
                className="rounded-full bg-primary hover:bg-primary/90 px-3 py-1 text-xs shadow"
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
        "group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-lg transition-shadow",
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
        {/* image */}
        <div className="relative h-64 overflow-hidden bg-muted md:h-72 lg:h-80">
          <Image
            src={product.productMedia?.[0]?.url || "/placeholder.svg"}
            alt={product.name}
            fill
            priority
            sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* gradient */}
          <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

          {/* badges */}
          <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1">
            {product.quantity === 0 && (
              <Badge variant="destructive" className="text-2xs">
                ناموجود
              </Badge>
            )}
            {product.quantity > 0 && product.quantity < 10 && (
              <Badge variant="destructive" className="text-2xs">
                موجودی محدود
              </Badge>
            )}
          </div>

          {/* wishlist icon */}
          {showAddToWishlist && (
            <button
              onClick={handleWishlistToggle}
              className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/70 backdrop-blur hover:bg-background/90"
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  isInWishlist(product.uuid)
                    ? "fill-destructive text-destructive"
                    : "text-muted-foreground"
                )}
              />
            </button>
          )}
        </div>

        {/* details */}
        <div className="space-y-2 p-4">
          <h3 className="line-clamp-2 text-base font-semibold transition-colors hover:text-primary">
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
                      : "text-muted-foreground"
                  )}
                />
              ))}
              <span className="mr-1 text-xs text-muted-foreground">
                ({product.rating.toFixed(1)})
              </span>
            </div>
          )}

          <p className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
