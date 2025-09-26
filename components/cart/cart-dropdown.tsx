"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { formatPriceDivided } from "@/lib/format-price";

export default function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { items, itemCount, subtotal, updateQuantity, recentlyAdded } =
    useCart();

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when navigating
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle quantity updates with error handling
  const handleQuantityUpdate = (
    productUuid: string,
    quantity: number,
    type: "increase" | "decrease"
  ) => {
    try {
      updateQuantity(productUuid, quantity, type);
    } catch (error) {
      toast({
        variant: "error",
        title: "خطا در به‌روزرسانی سبد خرید",
        description: "مشکلی در به‌روزرسانی تعداد محصول رخ داد.",
        duration: 2000,
      });
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* cart trigger */}
      <Button
        variant="ghost"
        size="icon"
        aria-label="سبد خرید"
        aria-expanded={isOpen}
        aria-controls="cart-dropdown"
        onClick={toggleDropdown}
        className="relative rounded-full overflow-visible"
      >
        <ShoppingBag className="h-5 w-5" />
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs z-10 shadow"
            >
              {itemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      {/* dropdown */}
      <div
        dir="rtl"
        id="cart-dropdown"
        className={cn(
          // Responsive RTL: open from right, wide and comfortable
          "absolute left-0 right-auto mt-2 sm:w-96 md:w-[28rem] sm:max-w-lg min-w-[20rem] rounded-2xl shadow-2xl z-50 overflow-hidden transition-all duration-300 origin-top px-2 sm:px-0",
          // Visually appealing background
          "bg-gradient-to-br from-gray-900/90 via-slate-900/80 to-indigo-900/90 backdrop-blur-xl border border-gray-700/60",
          // Add animated overlays for anime/dark theme
          "before:absolute before:inset-0 before:bg-gradient-to-tr before:from-purple-500/10 before:via-indigo-500/10 before:to-cyan-500/10 before:animate-pulse before:pointer-events-none",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "pointer-events-none opacity-0 scale-95 translate-y-2"
        )}
        style={{
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          maxWidth: "98vw",
        }}
      >
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold">سبد خرید</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">بستن</span>
          </Button>
        </div>

        {/* content */}
        <div className="max-h-80 overflow-y-auto p-4">
          {items?.length === 0 ? (
            <div className="py-8 text-center">
              <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">سبد خرید شما خالی است</p>
            </div>
          ) : (
            <ul className="space-y-4">
              <AnimatePresence initial={false}>
                {items?.map((item) => (
                  <motion.li
                    key={item.product.uuid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-x-4 p-3 rounded-lg"
                  >
                    {/* image */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={
                          item.product.productMedia[0]?.url ||
                          "/placeholder.svg"
                        }
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    {/* info */}
                    <div className="flex-1 mr-4">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="line-clamp-1 text-sm font-medium hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        {item.product.name}
                      </Link>

                      <div className="mt-1 text-sm text-muted-foreground">
                        {formatPriceDivided(item.product.price)}
                      </div>

                      {/* qty controls */}
                      <div className="mt-1 flex items-center">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            handleQuantityUpdate(
                              item.product.uuid,
                              1,
                              "decrease"
                            )
                          }
                          aria-label="کاهش تعداد"
                          className="flex h-6 w-6 items-center justify-center text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="h-3 w-3" />
                        </motion.button>

                        <motion.span
                          key={item.quantity}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="mx-2 text-sm"
                        >
                          {new Intl.NumberFormat("fa-IR").format(item.quantity)}
                        </motion.span>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            handleQuantityUpdate(
                              item.product.uuid,
                              1,
                              "increase"
                            )
                          }
                          aria-label="افزایش تعداد"
                          className="flex h-6 w-6 items-center justify-center text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="h-3 w-3" />
                        </motion.button>
                      </div>

                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {formatPriceDivided(
                            item.product.price * item.quantity
                          )}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          aria-label="حذف محصول"
                          onClick={() =>
                            handleQuantityUpdate(
                              item.product.uuid,
                              item.quantity,
                              "decrease"
                            )
                          }
                          className="p-1 text-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* footer */}
        {items?.length > 0 && (
          <div className="p-4 border-t border-border">
            <div className="mb-4 flex justify-between">
              <span>مجموع:</span>
              <motion.span
                key={subtotal}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-semibold"
              >
                {formatPriceDivided(subtotal)}
              </motion.span>
            </div>

            <div className="grid grid gap-2">
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-primary bg-background py-2 px-4 text-center text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                مشاهده سبد خرید
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
