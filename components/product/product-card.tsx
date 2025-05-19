"use client";

import type React from "react";

import { useState, useEffect } from "react";
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

export interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    images?: { id: number; url: string; alt: string }[];
    rating?: number;
    reviewCount?: number;
    availability?: "in-stock" | "low-stock" | "out-of-stock";
    isNew?: boolean;
    isLimited?: boolean;
    inStock?: boolean;
  };
  variant?: "default" | "wishlist" | "compact" | "order";
  onAddToCart?: (product: any) => void;
  onAddToWishlist?: (product: any) => void;
  onRemoveFromWishlist?: (id: number) => void;
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
  const [hoveredProduct, setHoveredProduct] = useState<boolean>(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const {
    addToWishlist: addToWishlistContext,
    removeFromWishlist: removeFromWishlistContext,
    isInWishlist,
  } = useWishlist();

  // Always show buttons on mobile
  useEffect(() => {
    if (isMobile) {
      setHoveredProduct(true);
    }
  }, [isMobile]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  // Calculate discount percentage
  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  // Determine if product is in stock
  const isInStock =
    product.inStock !== undefined
      ? product.inStock
      : product.availability !== "out-of-stock";

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      toast({
        title: "به سبد خرید اضافه شد",
        description: `${product.name} به سبد خرید شما اضافه شد.`,
      });
    }
  };

  // Handle add to wishlist
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToWishlist) {
      onAddToWishlist(product);
    } else {
      addToWishlistContext(product);
    }
  };

  // Handle remove from wishlist
  const handleRemoveFromWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onRemoveFromWishlist) {
      onRemoveFromWishlist(product.id);
    } else {
      removeFromWishlistContext(product.id);
    }
  };

  // Render different variants
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center p-2 border rounded-lg", className)}>
        <div className="relative h-16 w-16 flex-shrink-0">
          <Image
            src={
              product.image || product.images?.[0]?.url || "/placeholder.svg"
            }
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
          <p className="text-sm text-gray-500 font-vazirmatn">
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

  if (variant === "order") {
    return (
      <div
        className={cn(
          "flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800",
          className
        )}
      >
        <div className="relative h-20 w-20 ml-4">
          <Image
            src={
              product.image || product.images?.[0]?.url || "/placeholder.svg"
            }
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

  if (variant === "wishlist") {
    return (
      <div className={cn("border rounded-lg overflow-hidden group", className)}>
        <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
          <Image
            src={
              product.image || product.images?.[0]?.url || "/placeholder.svg"
            }
            alt={product.name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {showRemoveFromWishlist && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 left-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemoveFromWishlist}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">حذف از علاقه‌مندی‌ها</span>
            </Button>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-vazirmatn">
              {discountPercentage}% تخفیف
            </div>
          )}
        </div>
        <div className="p-4">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-medium mb-2 line-clamp-2 hover:text-purple-600 transition-colors font-vazirmatn">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center mb-2">
            {product.rating && (
              <div className="flex items-center text-amber-500">
                <Star className="fill-current h-4 w-4" />
                <span className="ml-1 text-sm font-vazirmatn">
                  {product.rating}
                </span>
              </div>
            )}
            <div
              className={`mr-2 text-sm ${
                isInStock
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              } font-vazirmatn`}
            >
              {isInStock ? "موجود" : "ناموجود"}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-lg font-vazirmatn">
                {formatPrice(product.price)}
              </div>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <div className="text-sm text-gray-500 line-through font-vazirmatn">
                    {formatPrice(product.originalPrice)}
                  </div>
                )}
            </div>
            {showAddToCart && (
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                disabled={!isInStock}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 ml-1" />
                <span className="font-vazirmatn">افزودن</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <motion.div
      className={cn(
        "group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
      onMouseEnter={() => !isMobile && setHoveredProduct(true)}
      onMouseLeave={() => !isMobile && setHoveredProduct(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={
              product.image || product.images?.[0]?.url || "/placeholder.svg"
            }
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* نشان‌ها */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-purple-500 hover:bg-purple-600 font-vazirmatn">
                جدید
              </Badge>
            )}
            {product.isLimited && (
              <Badge className="bg-amber-500 hover:bg-amber-600 font-vazirmatn">
                نسخه محدود
              </Badge>
            )}
            {product.availability === "low-stock" && (
              <Badge className="bg-orange-500 hover:bg-orange-600 font-vazirmatn">
                موجودی محدود
              </Badge>
            )}
            {product.availability === "out-of-stock" && (
              <Badge className="bg-red-500 hover:bg-red-600 font-vazirmatn">
                ناموجود
              </Badge>
            )}
          </div>

          {/* دکمه‌های سریع */}
          <motion.div
            className="absolute bottom-4 left-0 right-0 flex justify-center gap-x-2 gap-x-reverse"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: hoveredProduct ? 1 : 0,
              y: hoveredProduct ? 0 : 20,
            }}
            transition={{ duration: 0.3 }}
          >
            {showAddToWishlist && (
              <Button
                size="sm"
                variant="outline"
                className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg rounded-full"
                onClick={
                  isInWishlist(product.id)
                    ? handleRemoveFromWishlist
                    : handleAddToWishlist
                }
              >
                <Heart
                  className={`h-4 w-4 ${
                    isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span className="sr-only">
                  {isInWishlist(product.id)
                    ? "حذف از علاقه‌مندی‌ها"
                    : "افزودن به علاقه‌مندی‌ها"}
                </span>
              </Button>
            )}
            {showAddToCart && (
              <Button
                size="sm"
                className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg rounded-full px-4 font-vazirmatn"
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                <ShoppingCart className="h-4 w-4 ml-2" />
                افزودن سریع
              </Button>
            )}
          </motion.div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors font-vazirmatn line-clamp-2">
            {product.name}
          </h3>

          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 font-vazirmatn">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through font-vazirmatn">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* ✅ Added Button below the card */}
      <div className="p-4 pt-0">
        <Link href={`/product/${product.id}`}>
          <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rtl:space-x-reverse bg-primary hover:bg-primary/90 h-10 px-4 py-2 flex-row w-full mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-vazirmatn">
            مشاهده محصول
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
