"use client";

import { useState, useEffect } from "react";
import { CustomImage as Image } from "@/components/ui/custom-image";
import Link from "next/link";
import { Trash2, ExternalLink } from "lucide-react";
import { IProductType } from "@/lib/products";
import { formatPriceDivided } from "@/lib/format-price";

interface MobileCartItemProps {
  item: {
    quantity: number;
    product: IProductType;
  };
  onUpdateQuantity: (
    productUuid: string,
    quantity: number,
    type: "increase" | "decrease"
  ) => void;
  isUpdating?: boolean;
}

export function MobileCartItem({
  item,
  onUpdateQuantity,
  isUpdating = false,
}: MobileCartItemProps) {
  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-start">
        {/* image */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
          <Image
            src={item.product?.productMedia[0]?.url || "/placeholder.svg"}
            alt={item.product.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>

        {/* info */}
        <div className="mr-3 flex-1">
          <h3 className="text-sm font-medium">{item.product.name}</h3>

          <div className="mt-1 text-sm text-muted-foreground">
            {formatPriceDivided(item.product.price)}
          </div>

          <Link
            href={`/product/${item.product.slug}`}
            onClick={(e) => isSwiping && e.preventDefault()}
            className="mt-1 inline-flex items-center text-xs text-primary hover:text-primary/80 transition-colors py-2 px-1 min-h-[44px]"
            prefetch={false}
          >
            جزییات محصول
            <ExternalLink className="mr-1 h-3 w-3" />
          </Link>

          {/* qty & actions */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center rounded-full border border-border">
              <button
                aria-label="کاهش تعداد"
                onClick={() =>
                  onUpdateQuantity(item.product.uuid, 1, "decrease")
                }
                disabled={isUpdating || item.quantity <= 1}
                className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
              >
                -
              </button>

              <span className="w-8 text-center text-sm">
                {new Intl.NumberFormat("fa-IR").format(item.quantity)}
              </span>

              <button
                aria-label="افزایش تعداد"
                onClick={() =>
                  onUpdateQuantity(item.product.uuid, 1, "increase")
                }
                disabled={isUpdating}
                className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
              >
                +
              </button>
            </div>

            <button
              aria-label="حذف محصول"
              onClick={() =>
                onUpdateQuantity(item.product.uuid, item.quantity, "decrease")
              }
              className="p-2 text-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-2 text-sm font-medium text-foreground">
            مجموع:&nbsp;
            {formatPriceDivided(item.product.price * item.quantity)}
          </div>
        </div>
      </div>
    </div>
  );
}
