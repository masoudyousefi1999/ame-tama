"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { customFetch } from "@/lib/utils";

interface User {
  uuid: string;
  name: string;
  email: string;
  role: string;
  phone: string;
}

interface UserFormProps {
  user?: User;
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "user",
    phone: user?.phone || "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = `/user/update`;
      const method = "PATCH";

      const response = await customFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save user");
      }

      toast({
        title: "موفقیت",
        description: `کاربر با موفقیت ${user ? "به‌روزرسانی" : "ایجاد"} شد`,
        className: "bg-green-600 text-white font-vazirmatn",
      });

      router.push("/admin/users");
    } catch (error) {
      toast({
        title: "خطا",
        description: `${user ? "به‌روزرسانی" : "ایجاد"} کاربر با شکست مواجه شد`,
        variant: "destructive",
        className: "bg-red-600 text-white font-vazirmatn",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl">
      <Card className="max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-gray-200 dark:border-gray-700">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white font-vazirmatn">
            {user ? "ویرایش کاربر" : "ایجاد کاربر"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 font-vazirmatn"
              >
                نام
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white font-vazirmatn"
                placeholder="نام کاربر را وارد کنید"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 font-vazirmatn"
              >
                ایمیل
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="example@domain.com"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="role"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 font-vazirmatn"
              >
                نقش
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger className="border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white font-vazirmatn">
                  <SelectValue placeholder="نقش را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem
                    value="user"
                    className="dark:text-gray-300 font-vazirmatn"
                  >
                    کاربر
                  </SelectItem>
                  <SelectItem
                    value="admin"
                    className="dark:text-gray-300 font-vazirmatn"
                  >
                    مدیر
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!user && (
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 font-vazirmatn"
                >
                  رمز عبور
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="رمز عبور را وارد کنید"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed font-vazirmatn"
              >
                {isLoading
                  ? "در حال ذخیره..."
                  : user
                  ? "به‌روزرسانی کاربر"
                  : "ایجاد کاربر"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/users")}
                className="w-full sm:w-auto border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full font-vazirmatn"
              >
                لغو
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
