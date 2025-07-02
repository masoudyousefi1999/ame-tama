"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Address {
  id?: string;
  user: string;
  userId?: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  houseNumber: string;
  floorNumber: string;
}

interface AddressFormProps {
  address?: Address;
}

export function AddressForm({ address }: AddressFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [formData, setFormData] = useState({
    userId: address?.userId || "",
    province: address?.province || "",
    city: address?.city || "",
    address: address?.address || "",
    postalCode: address?.postalCode || "",
    houseNumber: address?.houseNumber || "",
    floorNumber: address?.floorNumber || "",
  });

  // Fetch users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_CLIENT}/users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const usersData = await response.json();
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "خطا",
          description: "دریافت کاربران با مشکل مواجه شد",
          variant: "destructive",
        });
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.userId) {
      toast({
        title: "خطا",
        description: "انتخاب کاربر الزامی است",
        variant: "destructive",
      });
      return;
    }

    if (
      !formData.province.trim() ||
      !formData.city.trim() ||
      !formData.address.trim()
    ) {
      toast({
        title: "خطا",
        description: "تمام فیلدهای الزامی را پر کنید",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        userId: formData.userId,
        province: formData.province.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        postalCode: formData.postalCode.trim(),
        houseNumber: formData.houseNumber.trim(),
        floorNumber: formData.floorNumber.trim(),
      };

      const url = address?.id
        ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_CLIENT}/addresses/${address.id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_CLIENT}/addresses`;

      const method = address?.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "عملیات با شکست مواجه شد");
      }

      toast({
        title: "موفقیت",
        description: address
          ? "آدرس با موفقیت به‌روزرسانی شد"
          : "آدرس با موفقیت ایجاد شد",
      });

      router.push("/admin/addresses");
      router.refresh();
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "خطا",
        description:
          error instanceof Error ? error.message : "عملیات با شکست مواجه شد",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl bg-white dark:bg-gray-800" dir="rtl">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          {address ? "ویرایش آدرس" : "ایجاد آدرس جدید"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="userId"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              کاربر *
            </Label>
            <Select
              value={formData.userId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, userId: value }))
              }
              disabled={loadingUsers}
            >
              <SelectTrigger className="  border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500">
                <SelectValue placeholder="کاربر را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {loadingUsers ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    <span className="text-sm">در حال بارگذاری...</span>
                  </div>
                ) : (
                  users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="province"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                استان *
              </Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, province: e.target.value }))
                }
                placeholder="نام استان را وارد کنید"
                className="  border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="city"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                شهر *
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
                placeholder="نام شهر را وارد کنید"
                className="  border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="address"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              آدرس کامل *
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="آدرس کامل را وارد کنید"
              className="  border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="postalCode"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                کد پستی
              </Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    postalCode: e.target.value,
                  }))
                }
                placeholder="کد پستی"
                className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
                maxLength={10}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="houseNumber"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                شماره واحد
              </Label>
              <Input
                id="houseNumber"
                value={formData.houseNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    houseNumber: e.target.value,
                  }))
                }
                placeholder="شماره واحد"
                className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="floorNumber"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                شماره طبقه
              </Label>
              <Input
                id="floorNumber"
                value={formData.floorNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    floorNumber: e.target.value,
                  }))
                }
                placeholder="شماره طبقه"
                className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال پردازش...
                </span>
              ) : address ? (
                "به‌روزرسانی آدرس"
              ) : (
                "ایجاد آدرس"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/addresses")}
              className="w-full sm:w-auto border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full"
            >
              لغو
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
