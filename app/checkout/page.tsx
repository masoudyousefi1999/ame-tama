"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CreditCard, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/cart-context";
import { cn, customFetch } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/components/ui/use-toast";
import { formatPriceDivided } from "@/lib/format-price";

const paymentMethods = [
  {
    id: "online",
    name: "پرداخت آنلاین",
    description: "پرداخت آنلاین با تمامی کارت‌های بانکی عضو شتاب",
    icon: CreditCard,
    disable: false,
  },
  {
    id: "cod",
    name: "پرداخت در محل",
    description: "پرداخت وجه هنگام تحویل سفارش",
    icon: MapPin,
    disable: true,
  },
];

const shippingMethods = [
  {
    id: "standard",
    name: "ارسال استاندارد",
    description: "تحویل بین ۳ تا ۵ روز کاری",
    price: 0,
    disable: false,
  },
  {
    id: "express",
    name: "ارسال سریع",
    description: "تحویل بین ۱ تا ۲ روز کاری",
    price: 45_000,
    disable: true,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, total, clearCart } = useCart();
  const { user, isLoading: userLoading } = useAuth();

  const [address, setAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingCost =
    shippingMethods.find((m) => m.id === shippingMethod)?.price ?? 0;
  const finalTotal = total + shippingCost;

  // Fetch user address on mount
  useEffect(() => {
    async function fetchAddress() {
      try {
        const res = await customFetch("/address/default", { method: "GET" });
        const data = await res.json();
        if (data) {
          setAddress(data);
        }
      } catch (err) {}
    }
    fetchAddress();
  }, []);

  // Handle submit
  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setIsSubmitting(true);

    // Show processing toast
    toast({
      title: "در حال پردازش...",
      description: "لطفاً صبر کنید، در حال اتصال به درگاه پرداخت",
    });

    try {
      // Call payment API
      const paymentRes = await customFetch("/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressUuid: address?.uuid,
          items: items.map((item) => ({
            productUuid: item.product.uuid,
            quantity: item.quantity,
          })),
        }),
      });
      if (!paymentRes.ok) throw new Error("خطا در شروع پرداخت");
      const paymentData = await paymentRes.json();
      if (paymentData.url) {
        // Show success toast before redirect
        toast({
          title: "در حال انتقال به درگاه پرداخت...",
          description: "لطفاً صبر کنید، در حال انتقال به صفحه پرداخت",
        });

        clearCart();
        window.location.href = paymentData.url;
      } else {
        throw new Error("خطا در دریافت لینک پرداخت");
      }
    } catch (err: any) {
      toast({
        title: "خطا",
        description: err.message || "مشکلی رخ داد.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (userLoading) {
    return (
      <div className="container py-16 mt-20 flex items-center justify-center min-h-[50vh]">
        <span>در حال بارگذاری...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-16 mt-20 flex items-center justify-center min-h-[50vh]">
        <span>برای ادامه ابتدا وارد حساب کاربری شوید.</span>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="container py-8 mt-20">
      <h1 className="text-2xl font-bold mb-8">تکمیل سفارش</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: customer + shipping/payment forms */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            id="checkout-form"
            className="pb-16 lg:pb-32"
          >
            {/* personal info */}
            <section className="bg-card rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">اطلاعات شخصی</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">نام</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={user.firstName || ""}
                    readOnly
                    disabled
                    className="mt-1 bg-muted cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">نام خانوادگی</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={user.lastName || ""}
                    readOnly
                    disabled
                    className="mt-1 bg-muted cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">شماره موبایل</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={user.phone || ""}
                    readOnly
                    disabled
                    className="mt-1 bg-muted cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label htmlFor="email">ایمیل</Label>
                  <Input
                    id="email"
                    name="email"
                    value={user.email || ""}
                    readOnly
                    disabled
                    className="mt-1 bg-muted cursor-not-allowed"
                  />
                </div>
              </div>
            </section>
            {/* address (read-only) */}
            <section className="bg-card rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">آدرس ارسال</h2>
              {address ? (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-green-400 bg-white/5 shadow-sm">
                  <div className="flex-shrink-0">
                    <MapPin className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-primary">
                        {address.city}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-green-800 text-green-200">
                        آدرس پیش‌فرض
                      </span>
                    </div>
                    <div className="text-base text-foreground mb-1">
                      {address.address}
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {address.province}{" "}
                      {address.postalCode && `- ${address.postalCode}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      پلاک: {address.houseNumber} | طبقه: {address.floorNumber}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-destructive">آدرس پیش‌فرض یافت نشد.</div>
              )}
            </section>
            {/* shipping method */}
            <section className="bg-card rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">روش ارسال</h2>
              <RadioGroup
                value={shippingMethod}
                onValueChange={setShippingMethod}
                className="space-y-3"
              >
                {shippingMethods.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border transition-opacity",
                      shippingMethod === m.id
                        ? "border-purple-500 bg-purple-900/10"
                        : "border-border",
                      m.disable &&
                        "opacity-50 cursor-not-allowed pointer-events-none"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value={m.id}
                        id={`shipping-${m.id}`}
                        className="ml-2"
                        disabled={m.disable}
                      />
                      <div>
                        <Label
                          htmlFor={`shipping-${m.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {m.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {m.description}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">
                      {m.price === 0
                        ? "رایگان"
                        : `${formatPriceDivided(m.price)}`}
                    </span>
                  </div>
                ))}
              </RadioGroup>
            </section>
            {/* payment method */}
            <section className="bg-card rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">روش پرداخت</h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                {paymentMethods.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex items-center p-4 rounded-lg border transition-opacity",
                      paymentMethod === m.id
                        ? "border-purple-500 bg-purple-900/10"
                        : "border-border",
                      m.disable &&
                        "opacity-50 cursor-not-allowed pointer-events-none"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value={m.id}
                        id={`payment-${m.id}`}
                        className="ml-2"
                        disabled={m.disable}
                      />
                      <m.icon className="h-5 w-5 text-muted-foreground ml-2" />
                      <div>
                        <Label
                          htmlFor={`payment-${m.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {m.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {m.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </section>

            {/* order notes */}
            <section className="bg-card rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">
                یادداشت سفارش (اختیاری)
              </h2>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="اگر توضیحات خاصی برای سفارش خود دارید، اینجا بنویسید..."
                disabled
              />
            </section>
          </form>
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 border-t border-border shadow-lg px-4 py-3 flex justify-center block lg:hidden">
            <Button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full max-w-md rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  در حال پردازش...
                </div>
              ) : (
                "ثبت سفارش و پرداخت"
              )}
            </Button>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            form="checkout-form"
            className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 hidden lg:block mt-8"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                در حال پردازش...
              </div>
            ) : (
              "ثبت سفارش و پرداخت"
            )}
          </Button>
        </div>
        {/* Right: order summary */}
        <aside className="lg:col-span-1">
          <div className="bg-card rounded-2xl shadow-sm sticky top-24">
            {/* Mobile header */}
            <div
              className="lg:hidden p-4 border-b border-border flex justify-between items-center cursor-pointer select-none"
              onClick={() => setShowOrderSummary((o) => !o)}
            >
              <h2 className="text-lg font-semibold">خلاصه سفارش</h2>
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
                tabIndex={-1}
                type="button"
                aria-label="نمایش خلاصه سفارش"
              >
                {showOrderSummary ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </Button>
            </div>
            {/* Summary content */}
            <div className={cn("p-6", !showOrderSummary && "hidden lg:block")}>
              <h2 className="hidden lg:block text-lg font-semibold mb-4">
                خلاصه سفارش
              </h2>
              {/* product list */}
              <div className="space-y-4 mb-6">
                {items.map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={
                          item?.product?.productMedia[0]?.url ??
                          "/placeholder.svg"
                        }
                        alt={item?.product?.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      <div className="absolute top-0 right-0 bg-foreground text-background text-xs rounded-bl-md px-1">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 mr-3">
                      <h4 className="text-sm font-medium">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {formatPriceDivided(item.product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* price breakdown */}
              <div className="space-y-3 border-t border-border pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    مجموع قیمت محصولات:
                  </span>
                  <span className="font-medium">
                    {formatPriceDivided(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>تخفیف ({discount}%):</span>
                    <span className="font-medium">
                      {formatPriceDivided((subtotal * discount) / 100)}
                      تومان
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">هزینه ارسال:</span>
                  <span className="font-medium">
                    {shippingCost === 0
                      ? "رایگان"
                      : `${formatPriceDivided(shippingCost)}`}
                  </span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>مبلغ قابل پرداخت:</span>
                    <span>{formatPriceDivided(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
