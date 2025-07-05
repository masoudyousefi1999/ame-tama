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
import { useToast } from "@/components/ui/use-toast";
import { X, ImageIcon, Loader2 } from "lucide-react";
import { customFetch } from "@/lib/utils";

interface Category {
  id?: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string | null;
  image?: string;
  uuid: string;
  parent: Category;
}

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUuid, setImageUuid] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>(
    category?.image || ""
  );
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loadingParents, setLoadingParents] = useState(false);

  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    // If you’re editing an existing category and it has a parentId (number or string),
    // convert it to string; otherwise default to "none".
    parentId: category?.parent?.uuid || "",
  });

  // Fetch parent categories
  useEffect(() => {
    const fetchParentCategories = async () => {
      setLoadingParents(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_CLIENT}/category`,
          {}
        );

        if (response.ok) {
          const categories = await response.json();
          // Filter out current category if editing
          const filteredCategories = category?.id
            ? categories.filter((cat: Category) => cat.id !== category.id)
            : categories;
          setParentCategories(filteredCategories);
        }
      } catch (error) {
        console.error("Error fetching parent categories:", error);
      } finally {
        setLoadingParents(false);
      }
    };

    fetchParentCategories();
  }, [category?.id]);

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !category) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF\s]/g, "")
        .replace(/\s+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name, category]);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "خطا",
        description: "لطفاً فقط فایل‌های تصویری انتخاب کنید",
        variant: "error",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطا",
        description: "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
        variant: "error",
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadResponse = await customFetch("/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error("آپلود تصویر با شکست مواجه شد");
      }

      const uploadResult = await uploadResponse.json();
      setImageUuid(uploadResult.uuid);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      toast({
        title: "موفقیت",
        description: "تصویر با موفقیت آپلود شد",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "خطا",
        description:
          error instanceof Error
            ? error.message
            : "آپلود تصویر با شکست مواجه شد",
        variant: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: "خطا",
        description: "نام دسته‌بندی الزامی است",
        variant: "error",
      });
      return;
    }

    if (!formData.slug.trim()) {
      toast({
        title: "خطا",
        description: "نامک دسته‌بندی الزامی است",
        variant: "error",
      });
      return;
    }

    // For new categories, require image
    if (!category && !imageUuid) {
      toast({
        title: "خطا",
        description: "لطفاً تصویر دسته‌بندی را انتخاب کنید",
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        parent: formData.parentId || null,
        ...(imageUuid && { image: imageUuid }),
      };

      const url = category ? `/category/${category.id}` : `/category`;

      const method = category ? "PATCH" : "POST";

      const response = await customFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "عملیات با شکست مواجه شد");
      }

      toast({
        title: "موفقیت",
        description: category
          ? "دسته‌بندی با موفقیت به‌روزرسانی شد"
          : "دسته‌بندی با موفقیت ایجاد شد",
      });

      router.push("/admin/categories");
      router.refresh();
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "خطا",
        description:
          error instanceof Error ? error.message : "عملیات با شکست مواجه شد",
        variant: "error",
        className: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setImageUuid("");
    setImagePreview("");
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  return (
    <Card className="max-w-2xl bg-white dark:bg-gray-800" dir="rtl">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          {category ? "ویرایش دسته‌بندی" : "ایجاد دسته‌بندی جدید"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              نام دسته‌بندی *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="نام دسته‌بندی را وارد کنید"
              className="  border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="slug"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              اسلاگ
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="اسلاگ"
              className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              نامک برای URL استفاده می‌شود و باید منحصر به فرد باشد
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              توضیحات
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="توضیحات دسته‌بندی را وارد کنید"
              className="  border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="parentId"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              دسته‌بندی والد
            </Label>
            <Select
              value={formData.parentId}
              onValueChange={(value: string) =>
                setFormData((prev) => ({ ...prev, parentId: value }))
              }
              disabled={loadingParents}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a parent category" />
              </SelectTrigger>

              <SelectContent>
                {/* Always include a “none” option first */}
                <SelectItem value="none">بدون والد</SelectItem>

                {loadingParents ? (
                  <div className="py-2 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  parentCategories.map((cat) => (
                    <SelectItem key={cat.uuid} value={cat.uuid}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              تصویر دسته‌بندی {!category && "*"}
            </Label>

            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="پیش‌نمایش تصویر"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -left-2 h-6 w-6 rounded-full p-0"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                  id="image-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {isUploading
                      ? "در حال آپلود..."
                      : "برای انتخاب تصویر کلیک کنید"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    حداکثر ۵ مگابایت - JPG, PNG, GIF
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading || isUploading || (!category && !imageUuid)}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال پردازش...
                </span>
              ) : category ? (
                "به‌روزرسانی دسته‌بندی"
              ) : (
                "ایجاد دسته‌بندی"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/categories")}
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
