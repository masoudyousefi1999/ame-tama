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
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Static data                                                       */
/* ------------------------------------------------------------------ */

const paymentMethods = [
  {
    id: "online",
    name: "پرداخت آنلاین",
    description: "پرداخت آنلاین با تمامی کارت‌های بانکی عضو شتاب",
    icon: CreditCard,
  },
  {
    id: "cod",
    name: "پرداخت در محل",
    description: "پرداخت وجه هنگام تحویل سفارش",
    icon: MapPin,
  },
];

const shippingMethods = [
  {
    id: "standard",
    name: "ارسال استاندارد",
    description: "تحویل بین ۳ تا ۵ روز کاری",
    price: 25_000,
  },
  {
    id: "express",
    name: "ارسال سریع",
    description: "تحویل بین ۱ تا ۲ روز کاری",
    price: 45_000,
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, total, clearCart } = useCart();

  /* ------------------------ state ------------------------ */
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    postalCode: "",
    city: "",
    province: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* -------------------- derived values ------------------- */
  const shippingCost =
    shippingMethods.find((m) => m.id === shippingMethod)?.price ?? 0;
  const finalTotal = total + shippingCost;

  /* ------------------------ effects ---------------------- */
  useEffect(() => {
    if (items.length === 0) router.push("/cart");
  }, [items, router]);

  /* ------------------------ handlers --------------------- */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      clearCart();
      router.push("/checkout/success");
    }, 2_000);
  };

  /* guard while redirecting */
  if (items.length === 0) return null;

  /* ------------------------------------------------------------------ */
  /*  JSX                                                               */
  /* ------------------------------------------------------------------ */

  return (
    <div className="container py-8 mt-20">
      <h1 className="text-2xl font-bold mb-8 font-vazirmatn">تکمیل سفارش</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---------------------------------------------------- */}
        {/*  Left: customer + shipping/payment forms            */}
        {/* ---------------------------------------------------- */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* personal info */}
            <section className="bg-card rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 font-vazirmatn">
                اطلاعات شخصی
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "firstName", label: "نام", required: true },
                  { id: "lastName", label: "نام خانوادگی", required: true },
                  {
                    id: "phone",
                    label: "شماره موبایل",
                    required: true,
                    type: "tel",
                    placeholder: "۰۹۱۲۳۴۵۶۷۸۹",
                  },
                  {
                    id: "email",
                    label: "ایمیل",
                    type: "email",
                    placeholder: "example@gmail.com",
                  },
                ].map((field) => (
                  <div key={field.id}>
                    <Label htmlFor={field.id} className="font-vazirmatn">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-destructive">*</span>
                      )}
                    </Label>
                    <Input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={(formData as any)[field.id]}
                      onChange={handleInputChange}
                      required={field.required}
                      className="mt-1 font-vazirmatn"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* address */}
            <section className="bg-card rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 font-vazirmatn">
                آدرس ارسال
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address" className="font-vazirmatn">
                    آدرس <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="mt-1 font-vazirmatn"
                  />
                </div>

                {[
                  { id: "city", label: "شهر", required: true },
                  { id: "province", label: "استان", required: true },
                  {
                    id: "postalCode",
                    label: "کد پستی",
                    required: true,
                    placeholder: "۱۲۳۴۵۶۷۸۹۰",
                  },
                ].map((field) => (
                  <div key={field.id}>
                    <Label htmlFor={field.id} className="font-vazirmatn">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-destructive">*</span>
                      )}
                    </Label>
                    <Input
                      id={field.id}
                      name={field.id}
                      placeholder={field.placeholder}
                      value={(formData as any)[field.id]}
                      onChange={handleInputChange}
                      required={field.required}
                      className="mt-1 font-vazirmatn"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* shipping method */}
            <section className="bg-card rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 font-vazirmatn">
                روش ارسال
              </h2>

              <RadioGroup
                value={shippingMethod}
                onValueChange={setShippingMethod}
                className="space-y-3"
              >
                {shippingMethods.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border",
                      shippingMethod === m.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10"
                        : "border-border"
                    )}
                  >
                    <div className="flex items-center">
                      <RadioGroupItem
                        value={m.id}
                        id={`shipping-${m.id}`}
                        className="ml-2"
                      />
                      <div>
                        <Label
                          htmlFor={`shipping-${m.id}`}
                          className="font-medium cursor-pointer font-vazirmatn"
                        >
                          {m.name}
                        </Label>
                        <p className="text-sm text-muted-foreground font-vazirmatn">
                          {m.description}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium font-vazirmatn">
                      {m.price.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                ))}
              </RadioGroup>
            </section>

            {/* payment method */}
            <section className="bg-card rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 font-vazirmatn">
                روش پرداخت
              </h2>

              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                {paymentMethods.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex items-center p-4 rounded-lg border",
                      paymentMethod === m.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10"
                        : "border-border"
                    )}
                  >
                    <RadioGroupItem
                      value={m.id}
                      id={`payment-${m.id}`}
                      className="ml-2"
                    />
                    <m.icon className="h-5 w-5 text-muted-foreground ml-2" />
                    <div>
                      <Label
                        htmlFor={`payment-${m.id}`}
                        className="font-medium cursor-pointer font-vazirmatn"
                      >
                        {m.name}
                      </Label>
                      <p className="text-sm text-muted-foreground font-vazirmatn">
                        {m.description}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </section>

            {/* order notes */}
            <section className="bg-card rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 font-vazirmatn">
                یادداشت سفارش (اختیاری)
              </h2>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="اگر توضیحات خاصی برای سفارش خود دارید، اینجا بنویسید..."
                value={formData.notes}
                onChange={handleInputChange}
                className="font-vazirmatn"
              />
            </section>
          </form>
        </div>

        {/* ---------------------------------------------------- */}
        {/*  Right: order summary                               */}
        {/* ---------------------------------------------------- */}
        <aside className="lg:col-span-1">
          <div className="bg-card rounded-2xl shadow-sm sticky top-24">
            {/* Mobile header */}
            <div className="lg:hidden p-4 border-b border-border flex justify-between">
              <h2 className="text-lg font-semibold font-vazirmatn">
                خلاصه سفارش
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
                onClick={() => setShowOrderSummary((o) => !o)}
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
              <h2 className="hidden lg:block text-lg font-semibold mb-4 font-vazirmatn">
                خلاصه سفارش
              </h2>

              {/* product list */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.uuid} className="flex items-start">
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
                      <h4 className="text-sm font-medium font-vazirmatn">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-muted-foreground font-vazirmatn">
                        {item.product.price.toLocaleString("fa-IR")} تومان
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* price breakdown */}
              <div className="space-y-3 border-t border-border pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-vazirmatn">
                    مجموع قیمت محصولات:
                  </span>
                  <span className="font-medium font-vazirmatn">
                    {subtotal.toLocaleString("fa-IR")} تومان
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span className="font-vazirmatn">تخفیف ({discount}%):</span>
                    <span className="font-medium font-vazirmatn">
                      {((subtotal * discount) / 100).toLocaleString("fa-IR")}{" "}
                      تومان
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground font-vazirmatn">
                    هزینه ارسال:
                  </span>
                  <span className="font-medium font-vazirmatn">
                    {shippingCost.toLocaleString("fa-IR")} تومان
                  </span>
                </div>

                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span className="font-vazirmatn">مبلغ قابل پرداخت:</span>
                    <span className="font-vazirmatn">
                      {finalTotal.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                </div>
              </div>

              {/* submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
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
          </div>
        </aside>
      </div>
    </div>
  );
}
