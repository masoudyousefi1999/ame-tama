"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ExternalLink } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { IProductType } from "@/lib/products";

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
  const [dragX, setDragX] = useState(0);
  const controls = useAnimation();
  const [isSwiping, setIsSwiping] = useState(false);

  // Reset animation when item changes
  useEffect(() => {
    controls.start({ x: 0 });
    setDragX(0);
  }, [item, controls]);

  return (
    <div className="relative overflow-hidden touch-manipulation">
      {/* delete overlay */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center bg-destructive text-destructive-foreground"
        style={{
          width: Math.max(Math.abs(dragX), 0),
          opacity: Math.min(Math.abs(dragX) / 100, 1),
        }}
      >
        <Trash2 className="h-5 w-5" />
      </div>

      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        animate={controls}
        style={{ x: dragX }}
        onDragStart={() => setIsSwiping(true)}
        onDrag={(_, info) => {
          if (info.offset.x < 0) setDragX(info.offset.x);
        }}
        onDragEnd={(_, info) => {
          setIsSwiping(false);
          if (info.offset.x < -100) {
            controls.start({ x: "-100%", opacity: 0 }).then(() => {
              onUpdateQuantity(item.product.uuid, item.quantity, "decrease");
            });
          } else {
            controls.start({ x: 0 });
            setDragX(0);
          }
        }}
        className="bg-card border-b border-border p-4"
      >
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
              {new Intl.NumberFormat("fa-IR").format(item.product.price)} تومان
            </div>

            <Link
              href={`/product/${item.product.slug}`}
              onClick={(e) => isSwiping && e.preventDefault()}
              className="mt-1 inline-flex items-center text-xs text-primary hover:text-primary/80 transition-colors"
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
              {new Intl.NumberFormat("fa-IR").format(
                item.product.price * item.quantity
              )}{" "}
              تومان
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
