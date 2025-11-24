"use client";

import { useState } from "react";
import {
  Star,
  Minus,
  Plus,
  Heart,
  Share2,
  ShoppingCart,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/wishlist-context";
import { IProductType } from "@/lib/products";
import { PersianDate } from "@/components/ui/persian-date";
import { useAuth } from "@/context/auth-context";
import { useLoginModal } from "@/context/login-modal-context";
import { toast } from "@/components/ui/use-toast";
import { formatPriceDivided, calculateDiscountPercentage } from "@/lib/format-price";

interface ProductInfoProps {
  product: IProductType;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
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
      addItem(product.uuid, quantity);
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

  // تعیین وضعیت موجودی
  const getStockStatus = () => {
    if (product.quantity === 0) {
      return {
        text: "ناموجود",
        color: "text-destructive",
        bgColor: "bg-destructive/10",
        borderColor: "border-destructive/30",
        icon: "❌",
      };
    } else if (product.quantity > 0 && product.quantity < 3) {
      return {
        text: `تنها ${product.quantity} عدد باقی مانده`,
        color: "text-warning",
        bgColor: "bg-warning/10",
        borderColor: "border-warning/30",
        icon: "⚡",
      };
    } else if (product.quantity >= 3 && product.quantity < 10) {
      return {
        text: "موجود در انبار",
        color: "text-success",
        bgColor: "bg-success/10",
        borderColor: "border-success/30",
        icon: "✅",
      };
    } else {
      return {
        text: "موجود در انبار",
        color: "text-success",
        bgColor: "bg-success/10",
        borderColor: "border-success/30",
        icon: "✅",
      };
    }
  };

  const stockStatus = getStockStatus();

  const handleShare = async () => {
    try {
      const shareUrl = window.location.href;
      const shareTitle = product.name;
      const shareText = `مشاهده ${product.name} در AME-TAMA`;

      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast({ variant: "success", title: "لینک با موفقیت کپی شد" });
    } catch (err) {
      // Fallback: try copy if share failed (or user cancelled share silently)
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({ variant: "success", title: "لینک با موفقیت کپی شد" });
      } catch {}
    }
  };

  return (
    <div className="space-y-6">
      {/* ────────── title ────────── */}
      <h1 className="text-3xl font-bold">{product.name}</h1>

      {/* ────────── rating ───────── */}
      <div className="flex items-center gap-x-4 rtl:gap-x-reverse">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-5 w-5",
                i < product.rating
                  ? "text-warning fill-warning"
                  : "text-muted-foreground"
              )}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">(نظر)</span>
      </div>

      {/* ────────── price ────────── */}
      {product.discountPrice ? (
        <div className="flex flex-col gap-2">
          {/* خط اول: قیمت اصلی + badge تخفیف */}
          <div className="flex items-center gap-x-3 rtl:gap-x-reverse flex-wrap">
            <span className="text-xl line-through text-destructive decoration-destructive">
              {formatPriceDivided(product.price)}
            </span>
            <span className="px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-sm font-bold">
              {calculateDiscountPercentage(product.price, product.discountPrice)}%
            </span>
          </div>
          {/* خط دوم: قیمت تخفیف خورده */}
          <div className="flex items-center gap-x-2 rtl:gap-x-reverse">
            <span className="text-3xl font-bold text-foreground">
              {formatPriceDivided(product.discountPrice)}
            </span>
            <span className="text-lg text-muted-foreground">تومان</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-x-2 rtl:gap-x-reverse">
          <span className="text-3xl font-bold text-foreground">
            {formatPriceDivided(product.price)}
          </span>
          <span className="text-lg text-muted-foreground">تومان</span>
        </div>
      )}

      {/* ─── stock + badges ─── */}
      <div className="flex items-center gap-x-2 rtl:gap-x-reverse">
        <div
          className={cn(
            "px-3 py-1.5 rounded-full border text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md",
            stockStatus.bgColor,
            stockStatus.color,
            stockStatus.borderColor
          )}
        >
          <span className="flex items-center gap-1.5">
            <span className="text-xs">{stockStatus.icon}</span>
            {stockStatus.text}
          </span>
        </div>

        <div className="mr-4 flex gap-x-2 rtl:gap-x-reverse">
          {(product.createdAt as any) > new Date() && (
            <Badge variant="default" className="text-2xs">
              جدید
            </Badge>
          )}
        </div>
      </div>

      <div className="my-6 border-t border-border" />

      {/* ───── key facts ───── */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <Fact label="سری" value={product.detail?.series} />
        <Fact label="شخصیت" value={product.detail?.character} />
        <Fact
          label="سازنده"
          value={product.detail?.specifications?.manufacturer}
        />
        <Fact
          label="تاریخ انتشار"
          value={
            (<PersianDate date={product.createdAt} format="numeric" />) as any
          }
        />
        <Fact label="مقیاس" value={product.detail?.specifications?.scale} />
        <Fact label="ارتفاع" value={product.detail?.specifications?.height} />
      </div>

      <div className="my-6 border-t border-border" />

      {/* ─── quantity picker ─── */}
      <div className="flex items-center gap-x-4 rtl:gap-x-reverse">
        <span className="text-foreground">تعداد:</span>
        <div className="flex items-center rounded-full border border-border">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            aria-label="کاهش تعداد"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <span className="w-10 text-center font-medium">
            {new Intl.NumberFormat("fa-IR").format(quantity)}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={increaseQuantity}
            aria-label="افزایش تعداد"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ─── action buttons ─── */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Button
          className={cn(
            "flex-1 rounded-full py-6 transition-colors",
            addedToCart
              ? "bg-success text-success-foreground hover:bg-success/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          onClick={handleAddToCart}
          disabled={product.quantity === 0}
        >
          {addedToCart ? (
            <>
              <Check className="ml-2 h-5 w-5" />
              به سبد خرید اضافه شد
            </>
          ) : (
            <>
              <ShoppingCart className="ml-2 h-5 w-5" />
              افزودن به سبد خرید
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={() =>
            isInWishlist(product.uuid)
              ? removeFromWishlist(product.uuid)
              : addToWishlist(product)
          }
          aria-label={
            isInWishlist(product.uuid)
              ? `حذف ${product.name} از علاقه‌مندی‌ها`
              : `افزودن ${product.name} به علاقه‌مندی‌ها`
          }
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isInWishlist(product.uuid) && "fill-destructive text-destructive"
            )}
          />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={handleShare}
          aria-label="اشتراک‌گذاری محصول"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

/* helper */
function Fact({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}:</span>{" "}
      <span className="font-medium">{value ?? "―"}</span>
    </div>
  );
}
