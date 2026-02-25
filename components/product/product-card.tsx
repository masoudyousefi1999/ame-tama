import Link from "next/link";
import Image from "@/components/ui/custom-image"; // می‌توانید از next/image هم استفاده کنید
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IProductType } from "@/lib/products";
import {
  formatPriceDivided,
  calculateDiscountPercentage,
} from "@/lib/format-price";
import { memo } from "react";

interface ProductCardProps {
  product: IProductType;
  showAddToCart?: boolean;
  showProductName?: boolean; // نمایش نام دسته‌بندی (برچسب در گوشه راست)
  className?: string;
  eagerLoad?: boolean; // اولویت بالای لود برای تصاویر بالای صفحه
}

export function ProductCard({
  product,
  showAddToCart = true,
  showProductName = false,
  className,
  eagerLoad = false,
}: ProductCardProps) {
  const tagSlug = product?.tags?.[0]?.slug;
  const categorySlug = product?.category?.slug;
  const productUrl = product.productMedia?.[0]?.url;

  const isInStock = product.quantity && product.quantity > 0;

  return (
    <Link
      href={`/${categorySlug}/${tagSlug}/${product.slug}`}
      prefetch={false}
      className={cn(
        "group block rounded-2xl border border-border bg-card cursor-pointer overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 contain-content",
        className,
      )}
      // contain-content برای ایزوله کردن رندر و بهبود کارایی در لیست‌های طولانی
    >
      {/* ناحیه تصویر */}
      <div className="relative aspect-[1] w-full overflow-hidden rounded-t-2xl bg-muted">
        <Image
          src={productUrl || "/placeholder.svg"}
          alt={product.name}
          fill
          quality={70}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 will-change-transform"
          loading={eagerLoad ? "eager" : "lazy"}
          priority={eagerLoad}
          fetchPriority={eagerLoad ? "high" : "auto"}
        />

        {/* برچسب‌های سمت چپ (تخفیف + وضعیت موجودی) */}
        <div className="absolute top-4 left-1 z-20 flex flex-col gap-2">
          {(product as any)?.discountPrice > 0 && (
            <Badge className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
              %
              {calculateDiscountPercentage(
                product.price,
                product.discountPrice!,
              )}
            </Badge>
          )}

          {product.quantity === 0 && (
            <Badge variant="destructive" className="text-xs shadow-md">
              ناموجود
            </Badge>
          )}

          {product.quantity > 0 && product.quantity < 3 && (
            <Badge
              variant="warning"
              className="text-xs shadow-md flex items-center gap-1"
            >
              <span>⚡</span> تنها {product.quantity} عدد
            </Badge>
          )}
        </div>

        {/* برچسب سمت راست (دسته‌بندی) - اختیاری */}
        {showProductName && (
          <div className="absolute top-3 right-3 z-20">
            <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              {product.category?.name || "بدون دسته‌بندی"}
            </Badge>
          </div>
        )}
      </div>

      {/* جزئیات محصول */}
      <div className="p-3 md:p-4 space-y-2 bg-card/70 rounded-b-2xl transition-colors duration-300">
        <h3 className="text-sm md:text-base font-semibold line-clamp-2 group-hover:text-primary/80 transition-colors duration-200">
          {product.name}
        </h3>

        {/* قیمت و دکمه افزودن */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            {product.discountPrice ? (
              <>
                <p className="text-sm line-through text-destructive decoration-destructive">
                  {formatPriceDivided(product.price)}
                </p>
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
              disabled={!isInStock}
              className="rounded-full bg-primary hover:bg-primary/85 text-primary-foreground px-3 md:px-4 py-1 md:py-1.5 text-xs shadow-md transition-all duration-200 flex-shrink-0"
            >
              افزودن
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}

// برای جلوگیری از رندرهای اضافی هنگام اسکرول یا فیلتر لیست
export default memo(ProductCard);
