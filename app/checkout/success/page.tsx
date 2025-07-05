"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, ShoppingBag, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { customFetch } from "@/lib/utils";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<null | {
    success: boolean;
    data?: any;
    error?: string;
  }>(null);
  const [authority, setAuthority] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    // Get status and authority from URL
    const params = new URLSearchParams(window.location.search);
    const statusParam = params.get("Status") || params.get("status");
    const authorityParam = params.get("Authority") || params.get("authority");
    setStatus(statusParam);
    setAuthority(authorityParam);

    // If no authority, block page
    if (!authorityParam) {
      setLoading(false);
      setResult({ success: false, error: "شناسه پرداخت یافت نشد." });
      return;
    }

    // Save authority to localStorage for later use if needed
    if (authorityParam) {
      try {
        localStorage.setItem("last_payment_authority", authorityParam);
      } catch {}
    }

    // Call backend to verify payment
    async function verifyPayment() {
      setLoading(true);
      try {
        const res = await customFetch("/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: statusParam,
            authority: authorityParam,
          }),
        });
        if (!res.ok) throw new Error("خطا در تایید پرداخت");
        const data = await res.json();
        // If backend returns transactionId, consider it success
        if (data.transactionId) {
          setResult({ success: true, data });
        } else {
          setResult({ success: false, error: "پرداخت ناموفق بود." });
        }
      } catch (err: any) {
        setResult({
          success: false,
          error: err.message || "خطا در تایید پرداخت",
        });
      } finally {
        setLoading(false);
      }
    }
    verifyPayment();
  }, []);

  if (loading) {
    return (
      <div className="container py-16 mt-20 flex items-center justify-center min-h-[50vh]">
        <span>در حال بررسی وضعیت پرداخت...</span>
      </div>
    );
  }

  if (!authority) {
    return (
      <div className="container py-16 mt-20 flex items-center justify-center min-h-[50vh]">
        <div className="max-w-2xl mx-auto text-center py-16">
          <XCircle className="h-20 w-20 mx-auto text-destructive mb-6" />
          <h1 className="text-2xl font-bold mb-4">شناسه پرداخت یافت نشد</h1>
          <p className="text-muted-foreground mb-8">
            متاسفانه اطلاعات پرداخت شما ناقص است. لطفا مجددا تلاش کنید یا با
            پشتیبانی تماس بگیرید.
          </p>
          <Button
            onClick={() => {
              window.location.href = "/";
            }}
          >
            بازگشت به صفحه اصلی
          </Button>
        </div>
      </div>
    );
  }

  if (!result?.success) {
    return (
      <div className="container py-16 mt-20 flex items-center justify-center min-h-[50vh]">
        <div className="max-w-2xl mx-auto text-center py-16">
          <XCircle className="h-20 w-20 mx-auto text-destructive mb-6" />
          <h1 className="text-2xl font-bold mb-4">پرداخت ناموفق بود</h1>
          <p className="text-muted-foreground mb-8">
            {result?.error ||
              "پرداخت شما تایید نشد. لطفا مجددا تلاش کنید یا با پشتیبانی تماس بگیرید."}
          </p>
          <Button
            onClick={() => {
              window.location.href = "/";
            }}
          >
            بازگشت به صفحه اصلی
          </Button>
        </div>
      </div>
    );
  }

  // Payment success
  const { transactionId, cardPan, raw } = result.data || {};
  return (
    <div className="container py-16 mt-20">
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-900/20 text-green-400 mb-6">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold mb-4">
          سفارش شما با موفقیت ثبت و پرداخت شد
        </h1>
        <p className="text-muted-foreground mb-2">
          از خرید شما متشکریم! سفارش شما با موفقیت ثبت و پرداخت شد و در حال
          پردازش است.
        </p>
        <div className="my-6 text-center">
          <div className="mb-2">
            <span className="font-semibold">کد تراکنش:</span>{" "}
            {transactionId || raw?.ref_id}
          </div>
          {cardPan && (
            <div className="mb-2">
              <span className="font-semibold">کارت پرداخت کننده:</span>{" "}
              {cardPan}
            </div>
          )}
          {raw?.message && (
            <div className="mb-2">
              <span className="font-semibold">وضعیت:</span> {raw.message}
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            onClick={() => {
              window.location.href = "/shop";
            }}
          >
            <ShoppingBag className="ml-2 h-5 w-5" />
            ادامه خرید
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-purple-700 hover:bg-purple-900/20 text-purple-300"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <Home className="ml-2 h-5 w-5" />
            بازگشت به صفحه اصلی
          </Button>
        </div>
      </div>
    </div>
  );
}
