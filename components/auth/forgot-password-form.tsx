"use client";

import type React from "react";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/components/ui/use-toast";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export default function ForgotPasswordForm({
  onBack,
}: ForgotPasswordFormProps) {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "خطا",
        description: "لطفاً ایمیل خود را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: "ارسال لینک بازیابی",
          description: "لینک بازیابی رمز عبور به ایمیل شما ارسال شد",
        });
      } else {
        toast({
          title: "خطا",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در بازیابی رمز عبور رخ داد",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        {/* success icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h3 className="text-2xl font-bold font-vazirmatn">
          ایمیل بازیابی ارسال شد
        </h3>

        <p className="text-muted-foreground font-vazirmatn">
          لینک بازیابی رمز عبور به ایمیل&nbsp;
          <span className="font-semibold">{email}</span> ارسال شد. لطفاً صندوق
          ورودی خود را بررسی کنید.
        </p>

        <Button
          type="button"
          variant="outline"
          className="rounded-full font-vazirmatn"
          onClick={onBack}
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          بازگشت به صفحه ورود
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* heading */}
      <div className="text-center">
        <h3 className="text-2xl font-bold font-vazirmatn">بازیابی رمز عبور</h3>
        <p className="text-sm text-muted-foreground mt-2 font-vazirmatn">
          ایمیل خود را وارد کنید تا لینک بازیابی رمز عبور برای شما ارسال شود
        </p>
      </div>

      {/* form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-vazirmatn">
            ایمیل
          </Label>
          <Input
            id="email"
            dir="ltr"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="font-vazirmatn"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
            className="rounded-full font-vazirmatn"
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            بازگشت
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                در حال ارسال...
              </>
            ) : (
              "ارسال لینک بازیابی"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
