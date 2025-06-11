"use client";

import type React from "react";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/components/ui/use-toast";

interface RegisterFormProps {
  onSuccess?: () => void;
  onLogin: () => void;
}

export default function RegisterForm({
  onSuccess,
  onLogin,
}: RegisterFormProps) {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // بررسی تکمیل فیلدها
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدها را پر کنید",
        variant: "destructive",
      });
      return;
    }

    // بررسی تطابق رمز عبور
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "خطا",
        description: "رمز عبور و تکرار آن مطابقت ندارند",
        variant: "destructive",
      });
      return;
    }

    // بررسی قدرت رمز عبور
    if (formData.password.length < 8) {
      toast({
        title: "خطا",
        description: "رمز عبور باید حداقل ۸ کاراکتر باشد",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        createdAt: new Date().toISOString(),
        role: "USER",
        uuid: "",
        avatar: "",
        updatedAt: new Date().toISOString(),
      });

      if (result.success) {
        toast({
          title: "ثبت‌نام موفقیت‌آمیز",
          description: "حساب کاربری شما با موفقیت ایجاد شد",
        });

        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          title: "خطا در ثبت‌نام",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در ایجاد حساب کاربری رخ داد",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold font-vazirmatn">ایجاد حساب کاربری</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-vazirmatn">
          با ایجاد حساب کاربری، می‌توانید سفارش‌های خود را پیگیری کنید و از
          امکانات ویژه بهره‌مند شوید
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="font-vazirmatn">
              نام
            </Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="علی"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLoading}
              className="font-vazirmatn"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="font-vazirmatn">
              نام خانوادگی
            </Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="محمدی"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
              className="font-vazirmatn"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="font-vazirmatn">
            ایمیل
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            className="font-vazirmatn"
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="font-vazirmatn">
            رمز عبور
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className="font-vazirmatn"
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="font-vazirmatn">
            تکرار رمز عبور
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            className="font-vazirmatn"
            dir="ltr"
          />
        </div>

        <Button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              در حال ثبت‌نام...
            </>
          ) : (
            "ثبت‌نام"
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-purple-600 dark:text-purple-400 font-vazirmatn"
            onClick={onLogin}
            disabled={isLoading}
          >
            وارد شوید
          </Button>
        </p>
      </div>
    </div>
  );
}
