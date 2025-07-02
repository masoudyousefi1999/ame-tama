"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileCartItem } from "@/components/cart/mobile-cart-item";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function CartPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const {
    items,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    total,
    applyDiscount,
  } = useCart();

  const [discountCode, setDiscountCode] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /* --------------------------------------------------------------------- */
  /*  Effects                                                              */
  /* --------------------------------------------------------------------- */
  useEffect(() => {
    setIsLoading(false);
  }, [items]);

  // show summary by default on desktop
  useEffect(() => {
    if (!isMobile) setShowSummary(true);
  }, [isMobile]);

  /* --------------------------------------------------------------------- */
  /*  Handlers                                                             */
  /* --------------------------------------------------------------------- */
  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً کد تخفیف را وارد کنید.",
        variant: "destructive",
      });
      return;
    }

    setIsApplyingDiscount(true);

    // simulate latency
    setTimeout(() => {
      try {
        const success = applyDiscount(discountCode);
        toast({
          title: success ? "کد تخفیف اعمال شد" : "خطا",
          description: success
            ? `کد تخفیف ${discountCode} با موفقیت اعمال شد.`
            : "کد تخفیف نامعتبر است.",
          variant: success ? undefined : "destructive",
        });
        success && setDiscountCode("");
      } catch {
        toast({
          title: "خطا در اعمال کد تخفیف",
          description: "مشکلی در اعمال کد تخفیف رخ داد.",
          variant: "destructive",
        });
      } finally {
        setIsApplyingDiscount(false);
      }
    }, 1_000);
  };

  const handleQuantityChange = (
    productUuid: string,
    step = 1,
    type: "increase" | "decrease" = "increase"
  ) => {
    if (step < 1) return;
    setIsUpdating(true);
    try {
      updateQuantity(productUuid, step, type);
    } catch {
      toast({
        title: "خطا در به‌روزرسانی سبد خرید",
        description: "مشکلی در به‌روزرسانی تعداد محصول رخ داد.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = () => {
    try {
      clearCart();
      toast({
        title: "سبد خرید پاک شد",
        description: "تمام محصولات از سبد خرید حذف شدند.",
      });
    } catch {
      toast({
        title: "خطا در پاک کردن سبد خرید",
        description: "مشکلی در پاک کردن سبد خرید رخ داد.",
        variant: "destructive",
      });
    }
  };

  /* --------------------------------------------------------------------- */
  /*  Loading state                                                        */
  /* --------------------------------------------------------------------- */
  if (isLoading) {
    return (
      <div className="container py-16 mt-20 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  /* --------------------------------------------------------------------- */
  /*  Empty-cart state                                                     */
  /* --------------------------------------------------------------------- */
  if (items.length === 0) {
    return (
      <div className="container py-16 mt-20" dir="rtl">
        <div className="max-w-2xl mx-auto text-center py-16">
          <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground/60 mb-6" />
          <h1 className="text-2xl font-bold mb-4">سبد خرید شما خالی است</h1>
          <p className="text-muted-foreground mb-8">
            محصولی در سبد خرید شما وجود ندارد. برای مشاهده محصولات به فروشگاه
            بروید.
          </p>
          <Button
            className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            onClick={() => router.push("/shop")}
          >
            <ShoppingBag className="ml-2 h-5 w-5" />
            رفتن به فروشگاه
          </Button>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------------------- */
  /*  Main page                                                            */
  /* --------------------------------------------------------------------- */
  return (
    <div className="container py-8 mt-20 pb-24 md:pb-8" dir="rtl">
      <Breadcrumb
        className="mb-6"
        items={[{ label: "سبد خرید", href: "/cart", isCurrent: true }]}
      />
      <h1 className="text-2xl font-bold mb-8">سبد خرید</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ------------------------------------------------- */}
        {/*  Cart items (table on desktop, cards on mobile)  */}
        {/* ------------------------------------------------- */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-border">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  محصولات ({items.length})
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف همه
                </Button>
              </div>
            </div>

            {/* ---------- Desktop table ---------- */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr className="text-xs uppercase tracking-wider">
                    {["محصول", "قیمت", "تعداد", "مجموع", "عملیات"].map((th) => (
                      <th
                        key={th}
                        className="px-6 py-3 text-right font-medium text-muted-foreground"
                      >
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.tr
                        key={item.product.uuid}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-card"
                      >
                        {/* Product */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <Image
                                src={
                                  item.product?.productMedia[0]?.url ??
                                  "/placeholder.svg"
                                }
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                sizes="96px"
                              />
                            </div>
                            <div className="mr-4">
                              <div className="text-sm font-medium text-foreground">
                                {item.product.name}
                              </div>
                              <Link
                                href={`/product/${item.product.slug}`}
                                className="mt-1 inline-flex items-center text-primary hover:underline text-xs"
                              >
                                جزییات محصول
                                <ExternalLink className="h-3 w-3 mr-1" />
                              </Link>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground">
                            {new Intl.NumberFormat("fa-IR").format(
                              item.product.price
                            )}{" "}
                            تومان
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center border border-border rounded-full w-24">
                            <button
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.uuid,
                                  1,
                                  "decrease"
                                )
                              }
                              disabled={isUpdating}
                            >
                              -
                            </button>
                            <span className="flex-1 text-center text-sm">
                              {new Intl.NumberFormat("fa-IR").format(
                                item.quantity
                              )}
                            </span>
                            <button
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.uuid,
                                  1,
                                  "increase"
                                )
                              }
                              disabled={isUpdating}
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground">
                            {new Intl.NumberFormat("fa-IR").format(
                              item.product.price * item.quantity
                            )}{" "}
                            تومان
                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            aria-label="حذف محصول"
                            onClick={() =>
                              updateQuantity(
                                item.product.uuid,
                                item.quantity,
                                "decrease"
                              )
                            }
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* ---------- Mobile cards ---------- */}
            <div className="md:hidden">
              <AnimatePresence>
                {items.map((item) => (
                  <MobileCartItem
                    key={item.product.uuid}
                    item={item}
                    onUpdateQuantity={handleQuantityChange}
                    isUpdating={isUpdating}
                  />
                ))}
              </AnimatePresence>
              <p className="p-4 text-xs text-center text-muted-foreground">
                برای حذف محصول، آن را به سمت چپ بکشید
              </p>
            </div>

            {/* Continue shopping */}
            <div className="p-6 border-t border-border">
              <Link
                href="/category/figures"
                className="inline-flex items-center text-primary font-medium"
              >
                <ArrowLeft className="ml-2 h-4 w-4" />
               افزودن محصولات بیشتر
              </Link>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------- */}
        {/*  Order summary                                   */}
        {/* ------------------------------------------------- */}
        <div className="lg:hidden mt-4 mb-2">
          <Button
            variant="outline"
            onClick={() => setShowSummary(!showSummary)}
            className="w-full flex justify-between items-center rounded-lg"
          >
            <span>خلاصه سفارش</span>
            {showSummary ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        <AnimatePresence>
          {(showSummary || !isMobile) && (
            <motion.div
              initial={isMobile ? { height: 0, opacity: 0 } : false}
              animate={isMobile ? { height: "auto", opacity: 1 } : {}}
              exit={isMobile ? { height: 0, opacity: 0 } : {}}
              className="lg:col-span-1 overflow-hidden"
            >
              <div className="bg-card rounded-lg shadow-sm p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold mb-4">خلاصه سفارش</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      مجموع قیمت محصولات:
                    </span>
                    <span className="font-medium">
                      {subtotal.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>
                        تخفیف ({discount}%):
                      </span>
                      <span className="font-medium">
                        {((subtotal * discount) / 100).toLocaleString("fa-IR")}{" "}
                        تومان
                      </span>
                    </div>
                  )}

                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span>مبلغ قابل پرداخت:</span>
                      <span>
                        {total.toLocaleString("fa-IR")} تومان
                      </span>
                    </div>
                  </div>
                </div>

                {/* Discount code */}
                <div className="mb-6">
                  <label
                    htmlFor="discount-code"
                    className="block text-sm font-medium mb-2"
                  >
                    کد تخفیف:
                  </label>
                  <div className="flex gap-x-2 gap-x-reverse">
                    <Input
                      id="discount-code"
                      type="text"
                      placeholder="کد تخفیف خود را وارد کنید"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="rounded-full"
                    />
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={handleApplyDiscount}
                      disabled={isApplyingDiscount}
                    >
                      {isApplyingDiscount ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        "اعمال"
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                  onClick={() => router.push("/checkout")}
                >
                  ادامه فرآیند خرید
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ------------------------------------------------- */}
        {/*  Sticky checkout bar (mobile)                    */}
        {/* ------------------------------------------------- */}
        {isMobile && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-card shadow-lg border-t border-border p-4 z-40"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">مجموع:</span>
              <span className="font-bold">
                {total.toLocaleString("fa-IR")} تومان
              </span>
            </div>
            <Button
              className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
              onClick={() => router.push("/checkout")}
            >
              ادامه فرآیند خرید
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
