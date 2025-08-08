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
import { useAuth } from "@/context/auth-context";
import { PreCheckoutModal } from "@/components/cart/pre-checkout-modal";

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
  const { user, isLoading: userLoading } = useAuth();
  const [showPreCheckout, setShowPreCheckout] = useState(false);
  // Removed: step, userForm, isUpdatingUser, addressList, selectedAddress, addressForm, isLoadingAddresses, isCreatingAddress, showAddressForm, userStepConfirmed, addressStepConfirmed

  const [discountCode, setDiscountCode] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fa-IR").format(price / 10) + " تومان";

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

  // Open modal on continue
  const handlePreCheckout = () => {
    setShowPreCheckout(true);
  };

  // Removed: useEffect for fetching addresses when step 2 is entered

  /* --------------------------------------------------------------------- */
  /*  Handlers                                                             */
  /* --------------------------------------------------------------------- */
  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً کد تخفیف را وارد کنید.",
        variant: "error",
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
          variant: success ? "success" : "info",
        });
        success && setDiscountCode("");
      } catch {
        toast({
          title: "خطا در اعمال کد تخفیف",
          description: "مشکلی در اعمال کد تخفیف رخ داد.",
          variant: "error",
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
        variant: "error",
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
        variant: "error",
      });
    }
  };

  // Removed: handleUserFormChange, handleUpdateUser, handleAddressFormChange, handleCreateAddress

  // Final step: go to checkout
  const handlePreCheckoutComplete = () => {
    setShowPreCheckout(false);
    router.push("/checkout");
  };

  // Removed: handleSelectAddress

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-24 mt-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 md:px-6 mt-8">
          <Breadcrumb
            className="mb-6"
            items={[{ label: "سبد خرید", href: "/cart", isCurrent: true }]}
          />
        </div>

        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Animated background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900" />

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-500/30 via-gray-500/30 to-zinc-500/30 animate-pulse" />

          {/* Floating orbs */}
          <div
            className="absolute top-20 left-20 w-32 h-32 bg-slate-400/20 rounded-full blur-xl animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          />
          <div
            className="absolute top-40 right-32 w-24 h-24 bg-gray-400/20 rounded-full blur-xl animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          />
          <div
            className="absolute bottom-20 left-1/3 w-28 h-28 bg-zinc-400/20 rounded-full blur-xl animate-bounce"
            style={{ animationDelay: "2s", animationDuration: "3.5s" }}
          />
          <div
            className="absolute bottom-32 right-20 w-20 h-20 bg-slate-400/20 rounded-full blur-xl animate-bounce"
            style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
          />

          {/* Radial gradients for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(148,163,184,0.4),transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(156,163,175,0.4),transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(161,161,170,0.3),transparent_50%)]" />

          {/* Animated mesh gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-500/10 to-transparent animate-pulse"
            style={{ animationDuration: "6s" }}
          />

          {/* Top overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-slate-200 to-gray-200 bg-clip-text text-transparent mb-6 drop-shadow-lg">
              سبد خرید شما خالی است
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-medium">
              محصولی در سبد خرید شما وجود ندارد. برای مشاهده محصولات به فروشگاه
              بروید.
            </p>
            <div className="flex items-center justify-center gap-4">
              <ShoppingBag className="h-12 w-12 text-white/80" />
              <div className="text-left">
                <h2 className="text-xl font-bold text-white">0 محصول</h2>
                <p className="text-white/80">در سبد خرید شما</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 md:px-6 mt-12">
          <div className="max-w-2xl mx-auto text-center py-16">
            <Button
              className="rounded-full bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700"
              onClick={() => router.push("/shop")}
            >
              <ShoppingBag className="ml-2 h-5 w-5" />
              رفتن به فروشگاه
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------------------- */
  /*  Main page                                                            */
  /* --------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-24 mt-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 mt-8">
        <Breadcrumb
          className="mb-6"
          items={[{ label: "سبد خرید", href: "/cart", isCurrent: true }]}
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Animated background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900" />

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-500/30 via-gray-500/30 to-zinc-500/30 animate-pulse" />

        {/* Floating orbs */}
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-slate-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-gray-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-28 h-28 bg-zinc-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        />
        <div
          className="absolute bottom-32 right-20 w-20 h-20 bg-slate-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        />

        {/* Radial gradients for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(148,163,184,0.4),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(156,163,175,0.4),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(161,161,170,0.3),transparent_50%)]" />

        {/* Animated mesh gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-500/10 to-transparent animate-pulse"
          style={{ animationDuration: "6s" }}
        />

        {/* Top overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-slate-200 to-gray-200 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            سبد خرید
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-medium">
            مدیریت محصولات انتخابی شما
          </p>
          <div className="flex items-center justify-center gap-4">
            <ShoppingBag className="h-12 w-12 text-white/80" />
            <div className="text-left">
              <h2 className="text-xl font-bold text-white">
                {items.length} محصول
              </h2>
              <p className="text-white/80">در سبد خرید شما</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div
        className="container mx-auto px-4 md:px-6 mt-12 pb-24 md:pb-8"
        dir="rtl"
      >
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

              {/* Desktop table */}
              {!isMobile && (
                <div className="hidden md:block">
                  <div className="p-4 md:p-6">
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.product.uuid}
                          className="flex items-center gap-4 p-4 border rounded-lg"
                        >
                          {/* Product image */}
                          <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={
                                item.product.productMedia[0]?.url ||
                                "/placeholder.svg"
                              }
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>

                          {/* Product info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(item.product.price)}
                            </p>
                          </div>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
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
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
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
                            </Button>
                          </div>

                          {/* Total price */}
                          <div className="text-right min-w-[100px]">
                            <p className="font-semibold">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>

                          {/* Remove button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleQuantityChange(
                                item.product.uuid,
                                item.quantity,
                                "decrease"
                              )
                            }
                            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                            disabled={isUpdating}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile cards */}
              {isMobile && (
                <div className="grid grid-cols-1 gap-4 p-2">
                  <AnimatePresence>
                    {items.map((item, index) => (
                      <motion.div
                        key={item.product.uuid}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="h-full"
                      >
                        <MobileCartItem
                          item={item}
                          onUpdateQuantity={handleQuantityChange}
                          isUpdating={isUpdating}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* ------------------------------------------------- */}
          {/*  Order summary                                  */}
          {/* ------------------------------------------------- */}
          <div className="lg:col-span-1">
            {/* Mobile summary toggle */}
            {isMobile && (
              <Button
                variant="outline"
                className="w-full mb-4"
                onClick={() => setShowSummary(!showSummary)}
              >
                {showSummary ? (
                  <>
                    <ChevronUp className="h-4 w-4 ml-2" />
                    مخفی کردن خلاصه سفارش
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 ml-2" />
                    نمایش خلاصه سفارش
                  </>
                )}
              </Button>
            )}

            {/* Summary card */}
            <AnimatePresence>
              {showSummary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-card rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="p-4 md:p-6 border-b border-border">
                    <h2 className="text-lg font-semibold">خلاصه سفارش</h2>
                  </div>

                  <div className="p-4 md:p-6 space-y-4">
                    {/* Discount code */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">کد تخفیف</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="کد تخفیف خود را وارد کنید"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleApplyDiscount}
                          disabled={isApplyingDiscount || !discountCode.trim()}
                          size="sm"
                        >
                          {isApplyingDiscount ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            "اعمال"
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Price breakdown */}
                    <div className="space-y-2 pt-4 border-t border-border">
                      <div className="flex justify-between">
                        <span>جمع کل:</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>تخفیف:</span>
                          <span>-{discount.toLocaleString("fa-IR")} تومان</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                        <span>مبلغ قابل پرداخت:</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                    </div>

                    {/* Checkout button */}
                    <Button
                      className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                      size="lg"
                      onClick={handlePreCheckout}
                    >
                      ادامه خرید
                    </Button>

                    {/* Continue shopping */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/shop")}
                    >
                      <ArrowLeft className="h-4 w-4 ml-2" />
                      رفتن به فروشگاه
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <PreCheckoutModal
        open={showPreCheckout}
        onOpenChange={setShowPreCheckout}
        user={user}
        onComplete={handlePreCheckoutComplete}
      />
    </div>
  );
}
