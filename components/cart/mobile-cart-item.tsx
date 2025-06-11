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
      {/* Delete action revealed on swipe */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center bg-red-500 text-white"
        style={{
          width: Math.max(Math.abs(dragX), 0),
          opacity: Math.min(Math.abs(dragX) / 100, 1),
        }}
      >
        <Trash2 className="h-5 w-5" />
      </div>

      <motion.div
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4"
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        animate={controls}
        onDragStart={() => setIsSwiping(true)}
        onDrag={(_, info) => {
          if (info.offset.x < 0) {
            setDragX(info.offset.x);
          }
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
        style={{ x: dragX }}
      >
        <div className="flex items-start">
          <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            <Image
              src={item.product?.productMedia[0]?.url || "/placeholder.svg"}
              alt={item.product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="mr-3 flex-1">
            <h3 className="text-sm font-medium font-vazirmatn">
              {item.product.name}
            </h3>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">
              {new Intl.NumberFormat("fa-IR").format(item.product.price)} تومان
            </div>

            {/* Product Details Link */}
            <Link
              href={`/product/${item.product.slug}`}
              className="mt-1 inline-flex items-center text-xs text-purple-600 hover:text-purple-800 transition-colors"
              onClick={(e) => {
                if (isSwiping) {
                  e.preventDefault();
                }
              }}
            >
              <span className="font-vazirmatn">جزییات محصول</span>
              <ExternalLink className="h-3 w-3 mr-1" />
            </Link>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full">
                <button
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() =>
                    onUpdateQuantity(item.product.uuid, 1, "decrease")
                  }
                  disabled={isUpdating || item.quantity <= 1}
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-vazirmatn">
                  {new Intl.NumberFormat("fa-IR").format(item.quantity)}
                </span>
                <button
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() =>
                    onUpdateQuantity(item.product.uuid, 1, "increase")
                  }
                  disabled={isUpdating}
                >
                  +
                </button>
              </div>
              <button
                onClick={() =>
                  onUpdateQuantity(item.product.uuid, item.quantity, "decrease")
                }
                className="text-red-600 hover:text-red-900 dark:hover:text-red-400 p-2"
                aria-label="حذف محصول"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 text-sm font-medium text-gray-900 dark:text-white font-vazirmatn">
              مجموع:{" "}
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
